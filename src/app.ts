import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { connectDb, setupDb } from './lib/db'
import { createApi } from './lib/api'
import { createAdminPlugin } from './plugin-admin'

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
        console.log("!")
        return true
      }
    }))
    .use(createApi(dbConn))
    .use(createAdminPlugin('/admin'))
    .get('/', theme.IndexPage)
    .get('/:slug', theme.ArticlePage)

  app.listen(port)

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );

  return app
}