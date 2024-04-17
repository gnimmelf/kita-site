import { Elysia, t, Context, Cookie } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import * as theme from './theme'

type Credentials = { email: string, password: string }

const getCookieCredentials = async (jwt: any, authCookie?: Cookie<Credentials>) => {
  if (!authCookie) {
    return false
  }
  const credentials = await jwt.verify(authCookie.value)
  return credentials
}

export const createAdminPlugin = (prefix: string) => {
  const app = new Elysia({
    prefix,
    cookie: {
      sign: 'auth',
      secrets: [crypto.randomUUID()],
    }
  })
    .use(jwt({
      name: 'jwt',
      sub: 'auth',
      secret: crypto.randomUUID(),
      iss: 'cmx',
      exp: '7d',
      path: prefix,
      schema: t.Object({
        email: t.String(),
        password: t.String()
      })
    }))
    .get('/login', theme.LoginPage)
    .post('/login', async (ctx) => {
      const { jwt, api, cookie: { auth }, body, set } = ctx
      const user = await api.getUserByEmail(body.email)

      if (user && user.password === body.password) {
        auth.set({
          value: await jwt.sign(body),
          httpOnly: true,
          maxAge: 7 * 86400,
        })
        return (set.redirect = prefix)
      }

      return theme.LoginPage({ ...ctx, formErrors: 'invalid credentials' })
    }, {
      body: t.Object({
        email: t.String(),
        password: t.String()
      })
    })
    .get('/logout', ({ cookie: { auth }, set }) => {
      auth.set({
        value: '',
        maxAge: 0
      })
      return (set.redirect = prefix)
    })
    .guard(
      {
        async beforeHandle({jwt, api, cookie: { auth }, set}) {
          const redirectUrl = `${prefix}/login`
          const credentials = await getCookieCredentials(jwt, auth)
          console.log({ credentials: !!credentials })
          if (!credentials) {
            return (set.redirect = redirectUrl)
          }
          const user = await api.getUserByEmail(credentials.email)
          if (!user || user.password !== credentials.password) {
            return (set.redirect = redirectUrl)
          }
        }
      },
      (app) => app
        .get('/', theme.IndexPage)
        .get('/:id', theme.ArticlePage)
      // .post('/:id', admin.SaveArticle)               
    )

  return app
}
