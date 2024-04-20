import { Elysia, t, Context, Cookie } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import { makeSecretPhrase } from '../lib/utils'
import * as theme from './theme'

type Credentials = { email: string, password: string }

const getCookieCredentials = async (jwt: any, authCookie?: Cookie<Credentials>) => {
    if (!authCookie) {
        return false
    }
    let credentials
    try {
        credentials = await jwt.verify(authCookie.value)
    } catch (err) {
        console.error(err)
        return false
    }
    return credentials
}

const credentialsSchema = {
    body: t.Object({
        email: t.String(),
        password: t.String()
    })
}

const articleSchema = {
    body: t.Object({
        title: t.String(),
        content: t.String()
    })
}

export const createAdminPlugin = (prefix: string) => {
    const articleGroupPrefix = '/article'
    const articleGroupPath = prefix + articleGroupPrefix

    const app = new Elysia({
        prefix,
        cookie: {
            sign: ['auth', 'session'],
            secrets: [makeSecretPhrase()],
        }
    })
        .use(jwt({
            name: 'jwt',
            sub: 'auth',
            secret: makeSecretPhrase(),
            iss: 'cmx',
            exp: '7d',
            path: prefix,
            schema: t.Object({
                email: t.String(),
                password: t.String()
            })
        }))
        .get('/login', (ctx) => theme.LoginPage({ ctx }))
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

            return theme.LoginPage({ ctx, formErrors: 'invalid credentials' })
        }, credentialsSchema)
        .get('/logout', ({ cookie: { auth }, set }) => {
            auth.set({
                value: '',
                maxAge: 0
            })
            auth.remove()
            console.log('Logout!')
            return (set.redirect = prefix)
        })
        .guard(
            {
                async beforeHandle({ jwt, api, cookie: { auth, session }, set }) {

                    // return // Uncomment to skip auth

                    const redirectUrl = `${prefix}/login`
                    const credentials = await getCookieCredentials(jwt, auth)

                    console.log({ credentials: !!credentials })

                    if (!credentials) {
                        console.log('redirecting #1', { redirectUrl })
                        return (set.redirect = redirectUrl)
                    }
                    const user = await api.getUserByEmail(credentials.email)

                    if (!user || user.password !== credentials.password) {
                        console.log('redirecting #2', { redirectUrl })
                        return (set.redirect = redirectUrl)
                    }

                    // Flag that user is logged in
                    session.value = {
                        email: credentials.email
                    }
                },
            },
            (app) => app
                .derive(({ cookie: { session } }) => {
                    return {
                        articleGroupPath,
                        session: session.value
                    }
                })
                .get('/', async ({ api, ...ctx }) => {
                    const articles = await api.getArticles();
                    // Return index page
                    return theme.IndexPage({
                        ctx,
                        articles,
                    })
                })
                .group(articleGroupPrefix,
                    (app) => app
                        .post('/', async ({ articleGroupPath, api, body: { title, content }, set }) => {
                            const { id } = await api.createArticle({title, content})
                            // Redirect to edit newly created article
                            return (set.redirect = `${articleGroupPath}/${id}`)
                        }, articleSchema)
                        .guard(
                            {
                                params: t.Object({
                                    id: t.String()
                                })
                            },
                            (app) => app
                                .get('/:id', async ({ api, params: { id }, ...ctx }) => {
                                    const article = await api.getArticleById(id)
                                    // Return article editor
                                    return theme.ArticlePage({
                                        ctx,
                                        article,
                                    })
                                })
                                .put('/:id', ({ api, body, params: { id }, ...ctx }) => {
                                    const { updated_at, formErrors } = api.saveArticle(id, body)
                                    // TODO! This requires htmx -> replace articlebutton
                                    return theme.ArticleControls({
                                        ctx,
                                        formErrors,
                                        updated_at: new Date(),
                                    })
                                }, articleSchema)
                                .delete('/:id', ({ api, params: { id }, set }) => {
                                    api.deleteArticle(id)
                                    // Redirect to index page
                                    return (set.redirect = prefix)
                                })
                        ))
        )

    return app
}