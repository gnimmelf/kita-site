import { Database, Articles, Article } from '../types';

export const createApi = (dbConn: Database) => {
  const api = new Api(dbConn)
  return api;
}

export class Api {
  #db

  constructor(db: Database) {
    this.#db = db
  }

  async refreshDb(): Promise<void> {
    await this.#db.refresh()
  }

  async getArticles(): Promise<Articles> {
    return this.#db.getArticles()
  }
}