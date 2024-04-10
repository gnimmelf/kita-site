import { Elysia, NotFoundError } from 'elysia';
import Surreal from 'surrealdb.js'
import { z } from 'zod'

const Article = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
})

type DbConf = {
  endpoint?: string
  namespace?: string,
  database?: string,
  username?: string,
  password?: string,
  keepalive?: number
}

const Articles = z.array(Article)

const dbConfDefault = {
  host: 'http://0.0.0.0:8055/',
  namespace: 'intergate',
  database: 'cmx_myblog',
  username: 'admin',
  password: 'X5y^W7Y6an3QHV',
  keepalive: 6000*6
}

const unWrapQueryData = (queryResult: any[]) => {
  let tmp = queryResult;
  while (tmp.length === 1) tmp = tmp[0];
  return tmp;
};

const connectDb = async (dbConf: DbConf) => {
  const conf = {
    ...dbConfDefault,
    ...dbConf
  }

  console.log({ conf })

  const {
    host,
    namespace,
    database,
    username,
    password,
    keepalive,
  } = conf

  const db = new Surreal();
  await db.connect(`${host}rpc`, {
    // Set the namespace and database for the connection
    namespace,
    database,
    // Set the authentication details for the connection
    auth: { namespace, database, username, password, },
  });
  if (!isNaN(keepalive)) {
    setInterval(async () => {
      const res = await fetch(`${host}status`)
      console.log('Keepalive:', res.status, res.statusText)
    }, keepalive)
  }
  return db
}

export const createApi = (dbConf: DbConf) => {
  return async (app: Elysia) => {
    const db = await connectDb(dbConf)
    const api = new Api(db)
    app.decorate('api', api)
    return app;
  }
}

class Api {
  #db;

  constructor(db: Surreal) {
    this.#db = db
  }

  get db() {
    return this.#db
  }

  async getArticleById(id: string) {
    const res = await this.#db.query('SELECT * FROM article  WHERE id IS $id;',
      {
        id
      })
    const data = unWrapQueryData(res)

    if (!(Article.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async getArticleBySlug(slug: string) {
    const res = await this.#db.query('SELECT * FROM article  WHERE slug IS $slug;',
      {
        slug
      })
    const data = unWrapQueryData(res)

    if (!(Article.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

  async getArticles() {
    const res = await this.#db.select('article');
    const data = unWrapQueryData(res)
    if (!(Articles.safeParse(data).success)) {
      throw new NotFoundError()
    }
    return data
  }

}
