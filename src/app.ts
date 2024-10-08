import { Elysia, NotFoundError } from "elysia";
import { html } from '@elysiajs/html'

import { Article, Context } from "./types";

import { connectDb, setupDb } from './lib/db_github'
import { createApi } from './lib/api'
import { ensureArticle, isDev } from "./lib/utils";
import { getStaticFile } from "./lib/handlers";

import IndexPage from './theme/IndexPage'
import ArticlePage from "./theme/ArticlePage";
import ShowcasePage from "./theme/ShowcasePage";

import { stylesRegistry } from "./theme/styles";


export const createApp = async () => {

  const dbConn = await connectDb()
  await setupDb(dbConn)
  const api = createApi(dbConn)

  const loadArticle = async (id: string): Promise<Article> => {
    const article = ensureArticle(id, await api.getArticleById(id))
    return article
  }

  const app = new Elysia()
    .onError(async ({ error }) => {
      console.error(error)
      return new Response(error.toString())
    })
    .use(html({
      autoDetect: true,
      isHtml: () => {
        return true
      }
    }))
    .derive(async () => ({
      site: {
        header: await loadArticle('__header'),
        footer: await loadArticle('__footer'),
      }
    }))
    .onRequest(async (ctx) => {
      if (isDev()) {
        // Do not set caching headers
        return
      }

      // Set up caching based on db etag & lastModified
      const { etag, lastModified } = await api.getCacheControl()

      // Pragma is deprecated: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma
      ctx.set.headers['pragma'] = ''
      // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#directives
      ctx.set.headers['cache-control'] = 'public, max-age=3600'

      const reqEtag = ctx.request.headers.get('If-None-Match')
      if (etag && reqEtag === etag) {
        // Use cached results
        ctx.set.status = 304
        return ''
      }
      const reqModifiedSince = ctx.request.headers.get('If-Modified-Since')
      if (lastModified && reqModifiedSince === lastModified) {
        // Use cached results
        ctx.set.status = 304
        return ''
      }

      // Set headers for a non-chached response
      ctx.set.headers['etag'] = etag
      ctx.set.headers['last-modified'] = lastModified
    })
    .get('/', async (ctx) => {
      const articles = (await api.getArticles())

      return IndexPage({
        ctx,
        articles,
      })
    })
    .get('/favicon.*', async (ctx) => {
      return Bun.file('./favicon.ico')
    })
    .get('/public/*', getStaticFile)
    .get('/styles.css', async ({ set: { headers } }) => {
      // Parse component styles from JSS-registry to a string
      headers['Content-Type'] = 'text/css';
      const cssStr = stylesRegistry.toString()
      return cssStr
    })
    .get('/blog/:id', async ({ params: { id }, ...ctx }) => {
      const article = await loadArticle(id)

      // Return index page
      return ArticlePage({
        ctx,
        article
      })
    })
    .get('/showcase/:id', async ({ params: { id }, ...ctx }) => {
      const article = await loadArticle(id)

      return ShowcasePage({
        ctx,
        article,
      })
    })

  return app
}