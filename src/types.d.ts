import { Context as ElysiaContext } from 'elysia'

import {
    type Children,
} from '@kitajs/html'

// Tech types

type Context = {
    siteTitle: string
} & ElysiaContext


type KitaProps<T = {}> = {
    children?: Children
    ctx: Context
} & Omit<T, Parameters, query>;

export type Component<T = {}> = (this: void, props: KitaProps<T>) => JSX.Element;


export type CacheControl = {
    etag: string,
    lastModified: string
}

// Record types

export type ArticleMeta =  Record<{
    title?: string,
    intro?: string
    link?: string,
    weight?: string
}>

export type Article = {
    id: string
    body: string,
    meta: ArticleMeta
}

export type Articles = Article[]

// Interfaces

export interface Database {
    getCacheControl: () => Promise<CacheControl>
    getArticles: () => Promise<Articles>
    getArticleById: (id: string) => Promise<Article | undefined>
}
