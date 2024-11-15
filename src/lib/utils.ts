import { Context } from "elysia";
import { Article, FileExtensions, TeaserLinkTypes } from "../types.d";


const defaultDatetimeOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
}

export const datetimeStr = (date: Date, options = {}): string => {
  options = Object.assign({}, defaultDatetimeOptions, options);

  return new Intl.DateTimeFormat('no', options).format(date)
}

export const isDev = (substring?: string) => {
  const env = process.env.NODE_ENV
  let isDev = !!(env || '').startsWith('dev')

  if (isDev && substring) {
    // Check if we need to match on substring
    isDev = !!env?.includes(substring)
  }

  return isDev
}

export const makeSecretPhrase = () => isDev() ? 'Simple and same as always' : crypto.randomUUID()

export const ensureArticle = (id: string, data: Article | undefined): Article => {
  const template = {
    id: '<404>',
    ext: FileExtensions.Markdown,
    meta: {
      intro: `<span>[404 - ${id}]</span>`
    },
    body: `<span>[404 - ${id}]</span>`
  }
  return {
    ...template,
    ...data
  } as Article
}

export const parseArticleMetaLink = (article: Article, ctx: Context) => {
  const baseUrl = new URL(ctx.url);
  let linkUrl = new URL(`/blog/${article.id}`, baseUrl)

  const linkData = {
    name: 'Read article',
    url: linkUrl,
    isExternal: false,
    type: TeaserLinkTypes.ReadMore
  }

  if (article.meta.link) {
    linkData.url = new URL(article.meta.link, baseUrl);
    linkData.isExternal = linkUrl.hostname != baseUrl.hostname

    if (linkData.url.pathname.startsWith("/showcase")) {
      linkData.name = "Showcase";
      linkData.type = TeaserLinkTypes.Showcase
      // Append the article id as path-segment to get the correct path to the showcase
      linkData.url.pathname += `/${article.id}`;
    }
    else {
      linkData.name = linkData.url.hostname
      linkData.type = TeaserLinkTypes.External
    }
  }

  return linkData
}