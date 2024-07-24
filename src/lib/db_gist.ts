import { BunFile } from "bun";
import { Octokit } from "@octokit/rest";
import { parse } from "marked";
import parseMD from 'parse-md'
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

const parseFileContent = async (fileContent: string): Promise<Omit<Article, "id">> => {
    const { metadata, content } = parseMD(fileContent)

    const html = await parse(content)
    const parsed = {
        meta: metadata,
        body: DOMPurify.sanitize(html),
    }
    return parsed
}

const getDbFile = (): BunFile => {
    const file = Bun.file("db.cache.json", { type: "application/json" });
    return file
}

const createDb = async (dbFile: BunFile) => {
    const env = getDotEnvParams();

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
    const db = {
        files: dbFiles
    }
    await Bun.write(dbFile, JSON.stringify(db, null, 2))    
    
    console.log("DB-content fetched from github")  
}

const parseDb = async () => {
    const dbFile = getDbFile()

    const db = await dbFile.json()

    const parsed = await Promise.all(db.files.map(async (file: any) => {
        const parsedContent = await parseFileContent(file.content)
        return {
            id: file.id,
            ...parsedContent
        }
    }));

    console.dir({ parsed}, { depth: null})

    return parsed
}

export const connectDb = async (): Promise<Database> => {        
    const dbFile = getDbFile()
    let articles: Articles

    if (!dbFile.size) {
        await createDb(dbFile)              
    }
    else {
        console.log("DB-content loaded from file")
    }
    articles = await parseDb()    

    return {
        refresh: async () => {
            createDb(getDbFile())
            articles = await parseDb()
        },
        getArticles: () => articles,
        getArticleById: (id: string) => {
            return articles.find((article: Article) => article.id === id)
        }
    }
}