import { Elysia, NotFoundError, redirect, t } from "elysia";
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
  const api = createApi(dbConn)

  const loadArticle = async (id: string): Promise<Article> => {
    const article = ensureArticle(id, await api.getArticleById(id))
    return article
  }

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
      header: await loadArticle('__header'),
      footer: await loadArticle('__footer'),
    })
    .get('/', async (ctx) => {
      const articles = (await api.getArticles())
        .filter(({ id }) => !(id as String).startsWith('__'))

      return IndexPage({
        ctx,
        articles,
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
    .get('/favicon.*', async (ctx) => {
      throw new NotFoundError()
    })
    .get('/:id', async ({ params: { id }, ...ctx }) => {
      const article = await loadArticle(id)

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