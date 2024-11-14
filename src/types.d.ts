import { Context as ElysiaContext } from 'elysia'

import {
    type Children,
} from '@kitajs/html'

// Tech types

type Context = {
    siteTitle: string
    site: {
        header: Article
        footer: Article
    }
} & ElysiaContext


type KitaProps<T = Record<string, any>> = {
    children?: Children;
    ctx?: Context;
} & Omit<T, 'Parameters' | 'query'>;

export type Component<T = Record<string, any>> = (this: void, props: KitaProps<T>) => JSX.Element;

export type CacheControl = {
    etag: string,
    lastModified: string
}

export enum FileExtensions {
    Markdown = 'md',
    JSON = 'json'
}

export enum TeaserLinkTypes {
    ReadMore = 'readmore',
    Showcase = 'showcase',
    External = 'external'
}

// Record types

export type ArticleMeta = {
    title?: string,
    intro?: string
    link?: string,
    weight?: string
    opengraph?: {
        description?: string
        site_name?: string
        author?: string
        image?: string
    }
    social?: Record<string, string>
}

export type Article = {
    id: string
    ext: FileExtensions.Markdown
    body: string,
    meta: ArticleMeta
}

export type Articles = Article[]

export type Datafile = {
    id: string
    ext: FileExtensions.JSON
    data: Record<string, any>
}

type Datafiles = Datafile[]

// Interfaces

export interface Database {
    getCacheControl: () => Promise<CacheControl>
    getArticles: () => Promise<Articles>
    getArticleById: (id: string) => Promise<Article | undefined>
    getDatafileById: (id: string) => Promise<Datafile | undefined>
}
