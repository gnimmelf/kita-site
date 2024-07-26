import { Elysia, redirect, t } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { Article } from "./types";

import { connectDb, setupDb } from './lib/db_github'
import { createApi } from './lib/api'
import { ensureArticle, isDev } from "./lib/utils";

import IndexPage from './theme/IndexPage'
import ArticlePage from "./theme/ArticlePage";

import { stylesRegistry } from "./theme/styles";

type AppParams = {
  port: string | number
}

export const createApp = async ({ port }: AppParams) => {

  const dbConn = await connectDb()
  await setupDb(dbConn)

  const app = new Elysia()
    .onError((ctx) => {
      // TODO! Fix this better, including zod errors from api
      // console.dir(ctx, { depth: null })
      // console.error(ctx.error)
      return 'Error'
    })
    .use(html({
      autoDetect: true,
      isHtml: () => {
        return true
      }
    }))
    .decorate({
      siteTitle: 'Hurdalecovillage.org',
      api: createApi(dbConn)
    })
    .get('/', async ({ api, ...ctx }) => {
      const articles = await api.getArticles()
      return IndexPage({
        ctx,
        articles,
        getArticle: (id: string): Article => {
          // A sync version of `getArticle` to use in the templates
          const article = articles.find((article) => article.id === id)
          return ensureArticle(id, article)
        }
      })
    })
    .get('/public/*', ({ set, params }) => {
      // NOTE! Bug workaround
      const file = Bun.file(`${import.meta.dir}/../public/${params['*']}`)
      set.headers['Content-Type'] = file.type
      return file.text()
    })
    .get('/styles.css', async ({ set: { headers } }) => {
      headers['Content-Type'] = 'text/css';

      const cssStr = stylesRegistry.toString()
      return cssStr
    })
    .get('/:id', async ({ api, params: { id }, ...ctx }) => {
      const article = ensureArticle(id, await api.getArticleById(id))

      // Return index page
      return ArticlePage({
        ctx,
        article
      })
    })


  app.listen(port)

  console.log(
    `🦊 Elysia (${isDev ? 'dev' : 'prod'}) is running at ${app.server?.hostname}:${app.server?.port}`
  );
  console.log('With features', process.features)

  return app
}