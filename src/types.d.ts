import { Context as ElysiaContext } from 'elysia'

import {
    type Children,
} from '@kitajs/html'

type Context = {
    siteTitle: string
    profile?: Profile
    articleGroupPath?: string
} & ElysiaContext


export type ExtendedProps<T = {}> = {
    children?: Children
    ctx: Context
} & T;

export type Component<T = {}> = (this: void, props: ExtendedProps<T>) => JSX.Element;

export type FormErrors = string | Record<string, unknown>

export type TemplateProps<P = {}> = P & {
    ctx: {
        profile?: Profile
        articleGroupPath?: string
    } & Context
}

// Data types



export type Article = {
    id: string | number    
    body: string,
    meta: Record<{
        title?: string,
        intro?: string
    }>
}

export type Articles = Article[]

export type Profile = {
    email: string
}

// Interfaces

export interface Database {
    refresh: () => Promise<void>
    getArticles: () => Articles
    getArticleById: (id: string) => Article | undefined    
}
