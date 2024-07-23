import { BunFile } from "bun";
import { Octokit } from "@octokit/rest";
import { parse } from "marked";
import DOMPurify from "isomorphic-dompurify";
import slugify from "slugify";
import { Database, Article, Articles } from "../types";

type EnvParams = {
    repoOwner: string
    gistId: string
    authToken: string
}

const getDotEnvParams = (): EnvParams => {
    const env = {
        repoOwner: process.env.DB_USER,
        gistId: process.env.DB_NAME,
        authToken: process.env.DB_PASS,
    }
    return env as unknown as EnvParams
}

const parseId = (filename: string): string => {
    // Slugify
    return slugify(filename.replace(/\.[^/.]+$/, "")).toLocaleLowerCase()
}

const parseContent = async (content: string): Promise<{
    title: string
    html: string
}> => {
    // Extract metadata from markdown structure?
    const meta = {
        title: 'TBD'
    }

    let html = await parse(content)
    html = DOMPurify.sanitize(html)
    return {
        ...meta,
        html,
    }
}

const getDbFile = (): BunFile => {
    const file = Bun.file("db.cache.json", { type: "application/json" });
    return file
}

const createDb = async (dbFile: BunFile) => {
    const env = getDotEnvParams();
    const db = {}

    const octokit = new Octokit({
        auth: env.authToken
    })

    const response = await octokit.request('GET /gists/{gist_id}', {
        gist_id: env.gistId,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        }
    })

    // @ts-ignore
    const dbFiles = Object.values(response.data.files)
        .filter(({ language }: any) => language === 'Markdown')
        .map((file) => {
            // @ts-ignore
            return {
                // @ts-ignore
                id: parseId(file.filename),
                // @ts-ignore
                content: file.content
            }
        })
   
    // Write the db-file
    await Bun.write(dbFile, JSON.stringify({
        files: dbFiles
    }, null, 2))    
}

export const connectDb = async (): Promise<Database> => {    
    const dbFile = getDbFile()

    if (!dbFile.size) {
        await createDb(dbFile)     
        console.log("DB-content fetched from github")   
    }
    else {
        console.log("DB-content loaded from file")
    }
    const db = await dbFile.json()

    db.files.forEach(async (file: any) => {
        file.parsed = await parseContent(file.content)
    });

    return {
        refresh: () => createDb(getDbFile()),
        getArticles: () => db.files,
        getArticle: (id: string) => {
            return db.articles.find((article: Article) => article.id === id)
        }
    }
}