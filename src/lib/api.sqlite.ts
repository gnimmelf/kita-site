import { Elysia, NotFoundError } from 'elysia';
import { z } from 'zod'

import { connectDb, DbConf } from './db-conn';

const Article = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
})


export const createApi = (dbConf: DbConf) => {
  return async (app: Elysia) => {
      const db = await connectDb(dbConf)
      const api = new Api(db)
      app.decorate('api', api)
      return app;
  }
}

const Articles = z.array(Article)

class Api {
  #db

  constructor(db: Database) {
    this.#db = db
  }

  get db() {
    return this.#db
  }

  async getArticleById(id: string) {
    const data = this.#db.query(`SELECT * FROM article WHERE id = $1 `).get([ id ]);

    if (!(Article.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async getArticleBySlug(slug: string) {
    const data = this.#db.query(`SELECT * FROM article WHERE slug = $1 `).get([ slug ]);
    
    if (!(Article.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async getArticles() {
    const data = this.#db.query(`SELECT * FROM article;`).all();

    console.log(data)

    if (!(Articles.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

}
