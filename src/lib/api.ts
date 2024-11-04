import { CacheControl, Database, Articles, Article, Datafile } from '../types.d';

export const createApi = (dbConn: Database) => {
  const api = new Api(dbConn)
  return api;
}

export class Api {
  #db

  constructor(db: Database) {
    this.#db = db
  }

  async getCacheControl(): Promise<CacheControl> {
    return this.#db.getCacheControl()
  }

  async getDatafileById(id: string): Promise<Datafile | undefined> {
    return this.#db.getDatafileById(id)
  } 

  async getArticles(): Promise<Articles> {
    return this.#db.getArticles()
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.#db.getArticleById(id)
  }  
}