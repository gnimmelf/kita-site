import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { connectDb, setupDb } from './lib/db'
import { createApi } from './lib/api'
import { createAdminPlugin } from './plugin-admin'
import { isDev } from "./lib/utils";

import * as theme from './theme'

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
    .get('/', theme.IndexPage)
    .get('/:slug', theme.ArticlePage)

  app.listen(port)

  console.log(
    `🦊 Elysia (${isDev ? 'dev' : 'prod'}) is running at ${app.server?.hostname}:${app.server?.port}`
  );
  console.log('With features', process.features)

  return app
}