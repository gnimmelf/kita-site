import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { connectDb, setupDb } from './lib/db'
import { createApi } from './lib/api'
import { createAdminPlugin } from './admin/app'
import { isDev } from "./lib/utils";

import * as theme from './theme/templates'

type AppParams = {
  port: string | number
  dbfile: string
  recreateDb: boolean
}

export const createApp = async ({ port, dbfile, recreateDb }: AppParams) => {

  const dbConn = await connectDb({
    filename: dbfile
  })

  setupDb(dbConn, recreateDb)

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
    .use(createApi(dbConn))
    .use(createAdminPlugin('/admin'))
    .decorate({
      siteTitle: 'My Blog'
    })
    .get('/', async ({ api, ...ctx }) => {
      const articles = await api.getArticles();
      // Return index page
      return theme.IndexPage({
        ctx,
        articles,
      })
    })
    .get('/:slug', async ({ api, params: { slug }, ...ctx }) => {
      const article = await api.getArticleBySlug(slug)
      // Return article editor
      return theme.ArticlePage({
          ctx,
          article,
      })
  })

  app.listen(port)

  console.log(
    `🦊 Elysia (${isDev ? 'dev' : 'prod'}) is running at ${app.server?.hostname}:${app.server?.port}`
  );
  console.log('With features', process.features)

  return app
}