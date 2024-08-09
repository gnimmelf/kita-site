import { Context as ElysiaContext } from 'elysia'

import {
    type Children,
} from '@kitajs/html'

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

// Data types

export type Article = {
    id: string
    body: string,
    meta: Record<{
        title?: string,
        intro?: string        
        link?: string,
        weight?: string
    }>
}

export type Articles = Article[]

// Interfaces

export interface Database {
    getCacheControl: () => Promise<>
    getArticles: () => Promise<Articles>
    getArticleById: (id: string) => Promise<Article | undefined>
}
