import { BunFile } from "bun";
import { Octokit } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";
import parseFrontMatter from 'parse-md'
import DOMPurify from "isomorphic-dompurify";
import slugify from "slugify";

import { Article, Articles } from "../types";

import parseMarkdown from './markdown-parser'
import { isDev } from "./utils";

type EnvParams = {
    repoOwner: string
    repoName: string
    authToken: string
}

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
    return slugify(filename.replace(/\.[^/.]+$/, "")).toLocaleLowerCase()
}

const parseFileContent = async (fileContent: string): Promise<Omit<Article, "id">> => {
    const { metadata, content } = parseFrontMatter(fileContent)

    const html = await parseMarkdown(content)
    const sanitizedHtml = DOMPurify.sanitize(html)

    const parsed = {
        meta: metadata,
        body: sanitizedHtml,
    }
    return parsed
}

const skipCacheUpdate = (cachedContentCount: number) => {
    const skipUpdate = isDev && process.env.NODE_ENV?.endsWith('cache-only') && cachedContentCount > 0
    return skipUpdate
}

class GithubDb {
    #octokit: Octokit
    #env: EnvParams
    #dbFile: BunFile
    #articles: Articles = []
    #etag: string = ''
    #lastModified: string = ''


    constructor() {
        this.#env = getDotEnvParams();
        this.#octokit = new Octokit({
            auth: this.#env.authToken
        })
        this.#dbFile = Bun.file("db.cache.json", { type: "application/json" })
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
            return {
                id: parseId(file.path),
                ...(await parseFileContent(response.data))
            }
        }))

        return files
    }

    async #maybeUpdateCache(): Promise<Boolean> {

        if (skipCacheUpdate(this.#articles.length)) {
            console.log('Skipping cache-update check')
            return false
        }

        const githubTree = await this.#fecthUpdatedTree()
        if (!githubTree) {
            // Noting to do
            return false
        }

        // We're here, so tree was modified with regards to the cache
        const filesList = githubTree
            // Only root-level Markdown-files
            .filter(({ type }: any) => type === 'blob')
            .filter(({ path }: any) => path.split('.').pop().toLowerCase() === 'md')
            .map(({ url, path }: any) => ({ path, url }))

        const files = await this.#fecthFiles(filesList)

        // Write the db-file
        const db = {
            lastModified: this.#lastModified,
            etag: this.#etag,
            files: files
        }
        await Bun.write(this.#dbFile, JSON.stringify(db, null, 2))
        return true
    }


    async #readCache() {
        if (!this.#dbFile.size) {
            this.#etag = ''
            this.#lastModified = ''
            return
        }

        const { etag, lastModified, files } = await this.#dbFile.json()
        this.#etag = etag
        this.#lastModified = lastModified

        this.#articles = files
        console.log('Articles read from cache')
    }

    async getArticles() {
        if (await this.#maybeUpdateCache()) {
            await this.#readCache()
        }
        return structuredClone(this.#articles)
    }

    async getArticleById(id: string) {
        const article = this.#articles.find((article: Article) => article.id === id)
        return structuredClone(article)
    }

    async setup() {
        await this.#readCache()
        if (await this.#maybeUpdateCache()) {
            // Read it again
            await this.#readCache()
        }
    }
}


export const connectDb = async () => {
    return new GithubDb()
}

export const setupDb = async (dbConn: GithubDb) => {
    await dbConn.setup()
}