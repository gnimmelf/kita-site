import { Context, NotFoundError } from "elysia";

export const getStaticFile = async (ctx: Context) => {
    // Bun also has a nice Glob-api...
    const { params } = ctx
    const rawPath = params['*']
    const path = rawPath // TODO! Sanitize?
  
    const file = Bun.file(`./public/${path}`)
    if (!(await file.exists())) {
      throw new NotFoundError()
    }
    return file
  }