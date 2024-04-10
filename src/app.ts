import { Elysia } from "elysia";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

import { createApi } from './lib/api'
import * as theme from './theme'
import * as admin from './admin'

type AppParams = {
  port: string | number
}

const createAdminApp = () => {
  console.log(process.cwd())
  const app = new Elysia({ prefix: '/admin' })
    .get('/', admin.IndexPage)
    .get('/:id', admin.ArticlePage)
    // .post('/:id', admin.SaveArticle)

  return app
}

export const createApp = async ({ port }: AppParams) => {

  const app = new Elysia()
    // .onError(({ code, error }) => {
    //   if (code === 'NOT_FOUND') return '404 - Route not found'
    //   else {
    //     console.error({ code, error })
    //     return `Boom!! (${code})`
    //   }
    // })
    .use(html())
    .use(staticPlugin({
      prefix: '/public',
      assets: 'public'
    }))
    .use(createApi({}))
    .use(createAdminApp())
    .get('/', theme.IndexPage)
    .get('/:slug', theme.ArticlePage)

  app.listen(port)

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );

  return app
}