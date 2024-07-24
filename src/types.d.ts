import { Context as ElysiaContext } from 'elysia'

import {
    type Children,
} from '@kitajs/html'

type Context = {
    siteTitle: string
    profile?: Profile
    articleGroupPath?: string
} & ElysiaContext


export type KitaProps<T = {}> = {
    children?: Children
    ctx: Context
} & Omit<T, Parameters, query>;

export type Component<T = {}> = (this: void, props: KitaProps<T>) => JSX.Element;

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
    getArticles: () => Promise<Articles>
    getArticleById: (id: string) => Promise<Article | undefined>
}
