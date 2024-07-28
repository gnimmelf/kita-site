import { CacheControl, Database, Articles, Article } from '../types';

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


  async getArticles(): Promise<Articles> {
    return this.#db.getArticles()
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.#db.getArticleById(id)
  }  
}