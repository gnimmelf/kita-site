import { datetimeStr } from '../lib/utils'

// Snippets

const Show = ({ when, children }) => (
    <>
        {when ? children : null}
    </>
)


const Page = ({ content, title }) => (
    <section>
        <h1>{title}</h1>
        <div class="content">
            {content}
        </div>
    </section>
)

const ArticleList = ({ articles, articlePath }) => {
    return (
        <>
            <h2>Articlelist</h2>
            <section>
                {articles.map((a) => (
                    <div>
                        {a.title}
                        <a href={`${articlePath}/${a.id}/`}>Edit</a>
                        |
                        <button
                            hx-delete={`${articlePath}/${a.id}/`}
                            hx-confirm={`Confirm delete: '${a.title}'!`}
                        >Delete</button>
                    </div>
                ))}
            </section>
        </>
    )
}

// Layout

const Layout = ({ ctx, body, headTags = [], endTags = [] }) => {
    headTags.push('<script src="https://unpkg.com/htmx.org@1.9.11"></script>')
    headTags.push('<script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>')
    endTags.push('<script src="/public/main.js"></script>')

    console.log('IndexPage', { ctx })

    return (
        <html>
            <head>
                <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta http-equiv="Pragma" content="no-cache" />
                <meta http-equiv="Expires" content="0" />
                {headTags.join('\n')}
            </head>
            <body>
                <AccountControls ctx={ctx} />
                {body}
                {endTags.join('\n')}
            </body>
        </html>

    )
}

// Partials

const AccountControls = ({ ctx }) => {
    const { session } = ctx
    return (
        <section>
            <a href="/">Home</a>
            |
            <a href="/admin">Admin</a>
            <Show when={session}>
                |
                <a href="/admin/logout">Logout</a>
            </Show>
        </section >
    )
}

export const ArticleControls = ({ ctx, updated_at, formErrors }) => {
    const datetime = updated_at ? datetimeStr(updated_at) : ''
    return (
        <div id="article-controls">
            <Show when={datetime}>
                <div>
                    <span>Last updated: <time datetime={datetime}></time>{datetime}</span>
                </div>
            </Show>
            <button
                hx-put={ctx.path}
                hx-ext="saveArticle"
                hx-swap="outerHTML"
                hx-target="#article-controls"
                hx-trigger="click once"
            >Save</button>
        </div>
    )
}

export const LoginForm = ({ ctx, formErrors }) => {
    return (
        <form method="post">
            <div>
                <label for="email">email</label>
                <input name="email" type="email" autocomplete="username" value="gnimmelf@gmail.com"></input>
            </div>
            <div>
                <label for="password">password</label>
                <input name="password" type="password" autocomplete="password" value="flemming"></input>
            </div>
            {formErrors ? (<div>{formErrors}</div>) : null}
            <button type="submit">Login</button>
        </form>
    )
}


// Pages

export const LoginPage = ({ ctx, formErrors }) => {
    return Layout({
        ctx,
        body: Page({
            title: 'Login', content: (
                <LoginForm ctx={ctx} formErrors={formErrors} />
            )
        })
    })
}

export const IndexPage = ({ ctx, articles, articlePath }) => {
    return Layout({
        ctx,
        body: Page({
            title: 'Admin', content: (
                <ArticleList
                    articles={articles}
                    articlePath={articlePath}
                />
            )
        })
    })
}

export const ArticlePage = ({ article, ctx }) => {
    return Layout({
        ctx,
        headTags: [],
        endTags: [
            '<script src="/public/admin/editor.js" type="module"></script>',
        ],
        body: Page({
            title: 'Edit article', content: (
                <section>
                    <editor-app
                        title={article.title}
                        slug={article.slug}
                        content={article.content}
                    ></editor-app>
                    <ArticleControls ctx={ctx} />
                </section>
            )
        })
    })
}