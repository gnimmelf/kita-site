import { t, Elysia, redirect } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { connectDb } from './lib/db_gist'
import { createApi } from './lib/api'
import { isDev } from "./lib/utils";

import * as theme from './theme/templates'

type AppParams = {
  port: string | number
}

export const createApp = async ({ port }: AppParams) => {

  const dbConn = await connectDb()

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
      if (ctx.query.refresh) {
        await api.refreshDb();
        return redirect('/')
      }

      const articles = await api.getArticles();

      console.log({ articles })

      // Return index page
      return theme.IndexPage({
        ctx,
        articles,
      })
    })


  app.listen(port)

  console.log(
    `🦊 Elysia (${isDev ? 'dev' : 'prod'}) is running at ${app.server?.hostname}:${app.server?.port}`
  );
  console.log('With features', process.features)

  return app
}