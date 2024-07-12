import { Database } from "bun:sqlite";
import { t, Elysia, NotFoundError } from 'elysia';
import slugify from 'slugify';
import { z } from 'zod' // TODO! Use Elysia { t } instead of zod ?
import { sqlQueryFieldsString, sqlQueryParams } from './utils'

const Article = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
})


export const createApi = (dbConn: Database) => {
  return async (app: Elysia) => {
    const api = new Api(dbConn)
    app.decorate('api', api)
    return app;
  }
}

const Articles = z.array(Article)

export class Api {
  #db

  constructor(db: Database) {
    this.#db = db
  }

  get db() {
    return this.#db
  }

  async getUserByEmail(email: string) {
    const data = this.#db.query(`SELECT * FROM user WHERE email = $1 `).get(email);

    return data;
  }

  async getArticleById(id: string) {
    const data = this.#db.query(`SELECT * FROM article WHERE id = $1 `).get(id);

    if (!(Article.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async getArticleBySlug(slug: string) {
    const data = this.#db.query(`SELECT * FROM article WHERE slug = $1 `).get(slug);

    if (!(Article.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async getArticles() {
    const data = this.#db.query(`SELECT * FROM article;`).all();

    if (!(Articles.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async createArticle({ title, content }: { title: string, content: string}) {
    let slug = slugify(title).toLocaleLowerCase()
    
    // Make sure we have unique fields
    let { count } = this.#db.query(`
      SELECT count(*) as count FROM article;
    `).get(sqlQueryParams({ slug })) as { count: number }

    title = `${title} ${count + 1}`
    slug = `${slug}-${count + 1}`

    const { id } = this.#db.query(`
        INSERT INTO article (
          slug, title, content
        ) VALUES  (
          $slug, $title, $content
        )
        RETURNING id; 
      `).get(sqlQueryParams({ title, slug, content })) as { id: string }

    return { id }
  }

  async saveArticle(id: string, body: { 
    title?: string, 
    content?: string,
    slug?: string, 
    is_published?: boolean,
  }) {
    console.log('saveArticle', { id, body })
    this.#db.query(`
      UPDATE 
        article 
      SET 
        ${sqlQueryFieldsString(body)}
      WHERE 
        id = $id;
    `).run(sqlQueryParams({ id, ...body }))
  }

  async deleteArticle(id: string) {
    console.log('deleteArticle', { id })
    this.#db.query(`
    DELETE FROM 
      article     
    WHERE 
      id = $id;
  `).run(sqlQueryParams({ id }))
  }
}
