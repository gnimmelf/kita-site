import { Elysia, redirect } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { connectDb, setupDb } from './lib/db_github'
import { createApi } from './lib/api'
import { ensureArticle, isDev } from "./lib/utils";

import * as theme from './theme/templates'
import { Article } from "./types";

type AppParams = {
  port: string | number
}

export const createApp = async ({ port }: AppParams) => {

  const dbConn = await connectDb()
  await setupDb(dbConn)

  const app = new Elysia()
    .onError((ctx) => {
      // TODO! Fix this better, including zod errors from api
      console.error(ctx.error)
      return 'Error'
    })
    .use(staticPlugin({
      prefix: '/public',
      assets: 'public'
    }))
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
      return theme.IndexPage({
        ctx,
        articles,
        getArticle: (id: string): Article => {
          // Pass a sync version of `getArticle` to use in the templates
          const article = articles.find((article) => article.id === id)
          return ensureArticle(id, article)
        }
      })
    })
    .get('/:id', async ({ api, params: { id }, ...ctx }) => {      
      const article = ensureArticle(id, await api.getArticleById(id))

      // Return index page
      return theme.ArticlePage({
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