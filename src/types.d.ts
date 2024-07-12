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

export type Article = {
    id: string | number    
    title: string,
    slug: string
    content: string,
    is_published: number,
}

export type Profile = {
    email: string
}