import { BunFile } from "bun";
import { Octokit } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";
import parseFrontMatter from 'parse-md'
import slugify from "slugify";

import { Article, Articles, Datafile, Datafiles, FileExtensions } from "../types.d";

import parseMarkdown from './markdown-parser'
import { isDev } from "./utils";

type EnvParams = {
    repoOwner: string
    repoName: string
    authToken: string
}

const DB_FILE_NAME = 'db.cache.json'

const getDotEnvParams = (): EnvParams => {
    const env = {
        repoOwner: process.env.DB_USER,
        repoName: process.env.DB_NAME,
        authToken: process.env.DB_PASS,
    }
    // console.log({ env })
    return env as unknown as EnvParams
}

const getHeaders = (extra: Record<string, string> = {}) => {
    const headers: any = {
        'X-GitHub-Api-Version': '2022-11-28',
        'accept': 'application/vnd.github+json',
    }
    for (const key in extra) {
        if (extra[key]) {
            headers[key] = extra[key]
        }
    }
    return headers
}

const parseId = (filename: string): string => {
    const id = slugify(filename.replace(/\.[^/.]+$/, "")).toLocaleLowerCase()
    return filename.startsWith('--')
        // If filename starts with two dashes, keep the dashes, it means "not published"
        ? `--${id}`
        : id
}

const parseMdContent = async (fileContent: string): Promise<Omit<Article, "id" | "ext">> => {

    const { metadata, content } = parseFrontMatter(fileContent)

    const html = await parseMarkdown(content)

    const parsed = {
        meta: {
            weight: Number.MAX_SAFE_INTEGER,
            ...metadata as object
        },
        body: html,
    }
    return parsed
}

class GithubDb {
    #octokit!: Octokit
    #env: EnvParams
    #dbFile: BunFile
    #articles: Articles = []
    #datafiles: Datafiles = []
    #etag: string = ''
    #lastModified: string = ''


    constructor() {
        this.#env = getDotEnvParams();
        this.#dbFile = Bun.file(DB_FILE_NAME, { type: "application/json" })
    }

    async #fecthUpdatedTree() {
        let response: OctokitResponse<any, number>

        const headers = getHeaders({
            'If-Modified-Since': this.#lastModified,
            'If-None-Match': this.#etag
        })

        try {
            response = await this.#octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
                owner: this.#env.repoOwner,
                repo: this.#env.repoName,
                tree_sha: 'main',
                headers
            })

        } catch (error: any) {
            if (error.status === 304) {
                console.log('Cache is up-to-date')
                return
            }
            else if (error.status === 401) {
                console.log('Access denied - Check github PAT expiery')
                return
            }
            throw error
        }

        // console.dir({ headers, response }, { depth: null })

        this.#etag = response.headers['etag'] as string
        this.#lastModified = response.headers['last-modified'] as string

        return response!.data.tree
    }

    async #fecthFiles(filesList: [{ url: string, path: string }]) {
        const headers = getHeaders({
            // Request raw content instead of base64 encoded
            'accept': 'application/vnd.github.v3.raw'
        })

        const files = await Promise.all(filesList.map(async (file: any) => {
            const response = await this.#octokit.request('GET {url}', {
                url: file.url,
                headers
            })

            const fileExtension: FileExtensions = file.path.split('.').pop().toLowerCase()

            let content;
            switch (fileExtension) {
                case FileExtensions.JSON:
                    content = {
                        data: JSON.parse(response.data)
                    }
                    break;
                case FileExtensions.Markdown:
                default:
                    content = await parseMdContent(response.data)                
            }
            
            return {
                id: parseId(file.path),
                ext: fileExtension,
                ...content
            }
        }))

        return files
    }

    async #maybeUpdateCache(): Promise<Boolean> {

        if (!this.#octokit) {
            this.#octokit = new Octokit({
                auth: this.#env.authToken
            })
        }

        console.log('Checking for updates...')

        const githubTree = await this.#fecthUpdatedTree()
        if (!githubTree) {
            console.log('No updates!')
            return false
        }

        console.log('Updating cache...')

        // We're here, so tree was modified with regards to the cache
        const filesList = githubTree
            // Only root-level Markdown-files
            .filter(({ type }: any) => type === 'blob')
            .filter(({ path }: any) => Object.values(FileExtensions).includes(path.split('.').pop().toLowerCase()))
            .map(({ url, path }: any) => ({ path, url }))

        const files = await this.#fecthFiles(filesList)

        // Write the db-file
        const db = {
            lastModified: this.#lastModified,
            etag: this.#etag,
            files: files
        }

        await Bun.write(this.#dbFile, JSON.stringify(db, null, 2))

        console.log('Cache updated!')

        return true
    }

    async #readCache() {
        let result: any

        try {
            result = await this.#dbFile.json()
        } catch (error) {
            this.#etag = ''
            this.#lastModified = ''
            return false
        }

        const { etag, lastModified, files } = result

        this.#etag = etag
        this.#lastModified = lastModified
        this.#articles = files.filter((file: Article) => file.ext === FileExtensions.Markdown)
        this.#datafiles = files.filter((file: Datafile) => file.ext === FileExtensions.JSON)

        console.log('Articles read from cache')

        return true
    }

    async #parseDbFiles() {
        let isCached = await this.#readCache()

        if (isDev('css') && isCached) {
            // Cache is read succesfully, and we're not gonna update it
            return
        }

        if (await this.#maybeUpdateCache()) {
            // Cache is was updated, and we have to re-read it
            await this.#readCache()
        }
    }

    async getCacheControl() {
        return {
            lastModified: this.#lastModified,
            etag: this.#etag
        }
    }

    async getDatafileById(id: string) {
        this.#parseDbFiles()
        const datafile = this.#datafiles.find((datafile: Datafile) => datafile.id === id)
        return structuredClone(datafile)
    }

    async getArticles() {
        this.#parseDbFiles()
        return structuredClone(this.#articles.filter(({ id }) => !(id.startsWith('__') || id.startsWith('--'))))
    }

    async getArticleById(id: string) {
        this.#parseDbFiles()
        const article = this.#articles.find((article: Article) => article.id === id)
        return structuredClone(article)
    }

    async setup() {
        this.#parseDbFiles()
    }
}


export const connectDb = async () => {
    return new GithubDb()
}

export const setupDb = async (dbConn: GithubDb) => {
    await dbConn.setup()
}