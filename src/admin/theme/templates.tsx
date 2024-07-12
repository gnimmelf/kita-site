import {
    Component,
    FormErrors,
    Article,
} from '../../types'
import { datetimeStr } from '../../lib/utils'
import { Show } from '../../lib/components'

declare global {
    namespace JSX {
        interface IntrinsicElements extends HTMLElement {
            'editor-app': unknown
        }
    }
}

// Snippets

export const PublishButton: Component<{
    article: Article
}> = ({
    ctx,
    article
}) => {
        return (
            <button
                hx-put={`${ctx.articleGroupPath}/${article.id}/togglepublished`}
                hx-trigger="click once"
                hx-swap="outerHTML"
            >{!article.is_published ? 'Publish' : 'Unpublish'}</button>
        )
    }

const ArticleList: Component<{
    articles: Article[],
}> = ({
    ctx,
    articles
}) => {
        return (
            <>
                <h2>Articlelist</h2>
                <section>
                    {articles.map((a) => {
                        const articleUrl = `${ctx.articleGroupPath}/${a.id}`
                        return (
                            <div>
                                {a.title}
                                <a href={articleUrl}>Edit</a>
                                |
                                <PublishButton
                                    ctx={ctx}
                                    article={a}
                                />
                                |
                                <button
                                    hx-delete={articleUrl}
                                    hx-confirm={`Confirm delete: '${a.title}'!`}
                                >Delete</button>
                            </div>
                        )
                    })}
                </section>
            </>
        )
    }

// Layouts

const Page: Component<{
    title: string
}> = ({
    title,
    children
}) => {
        return (
            <section>
                <h1>{title}</h1>
                <div class="content">
                    {children}
                </div>
            </section>
        )
    }

const Layout: Component<{
    pageTitle: string
    headTags?: string[]
    endTags?: string[]
}> = ({
    ctx,
    children,
    pageTitle,
    headTags = [],
    endTags = []
}) => {
        headTags.push('<script src="https://unpkg.com/htmx.org@1.9.11"></script>')
        headTags.push('<script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>')
        endTags.push('<script src="/public/client.js"></script>')
        return (
            <html>
                <head>
                    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                    <meta http-equiv="Pragma" content="no-cache" />
                    <meta http-equiv="Expires" content="0" />
                    {headTags.join('\n')}
                    <title>{ctx.siteTitle} {pageTitle ? `- ${pageTitle}` : ''}</title>
                </head>
                <body>
                    <main>
                        {children}
                    </main>
                    <hr />
                    <AccountControls ctx={ctx} />
                    {endTags.join('\n')}
                </body>
            </html>

        )
    }

// Page partials

const AccountControls: Component<{

}> = ({
    ctx
}) => {
        const { profile } = ctx
        return (
            <section>
                <a href="/">Site</a>
                <Show when={profile}>
                    <>
                        |
                        {profile?.email}: <a href="/admin/logout">Logout</a>
                    </>
                </Show>
            </section >
        )
    }

export const ArticleControls: Component<{
    article: Article,
    updated_at?: Date
}> = ({
    ctx,
    article,
    updated_at
}) => {
        const datetime = updated_at ? datetimeStr(updated_at) : ''
        return (
            <div id="article-controls">
                <div>
                    <label for="slug">Slug</label>
                    <input name="slug" value={article.slug}></input>
                </div>
                <button
                    hx-put={`${ctx.articleGroupPath}/${article.id}`}
                    hx-ext="saveArticle"
                    hx-swap="outerHTML"
                    hx-target="#article-controls"
                    hx-trigger="click once"
                >Save</button>
                <Show when={!!datetime}>
                    <div>Last updated: <time datetime={datetime}></time>{datetime}</div>
                </Show>
            </div>
        )
    }

export const LoginForm: Component<{
    formErrors: FormErrors
}> = ({
    formErrors
}) => {
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

export const LoginPage: Component<{
    formErrors: FormErrors
}> = ({
    ctx,
    formErrors
}) => {
        const title = "Login"
        return (
            <Layout ctx={ctx} title={title}>
                <Page ctx={ctx} title={title}>
                    <LoginForm ctx={ctx} formErrors={formErrors} />
                </Page>
            </Layout>
        )
    }

export const IndexPage: Component<{
    formErrors: FormErrors
    articles: Article[]
}> = ({
    ctx,
    articles
}) => {
        const pageTitle = "Articles"
        return (
            <Layout
                ctx={ctx}
                pageTitle={pageTitle}
            >
                <Page ctx={ctx} title={pageTitle}>
                    <>
                        <button
                            hx-post={ctx.articleGroupPath}
                            hx-vals='{"title": "New article", "content": "The story begins..."}'
                            hx-ext="redirectToResponseUrl"
                            hx-trigger="click"
                        >Create article</button>
                        <ArticleList
                            ctx={ctx}
                            articles={articles}
                        />
                    </>
                </Page>
            </Layout>
        )
    }

export const ArticlePage: Component<{
    article: Article
}> = ({
    ctx,
    article,
}) => {
        return (
            <Layout
                ctx={ctx}
                pageTitle={article.title}
                endTags={[
                    '<script src="/public/admin/editor.js" type="module"></script>',
                ]}
            >
                <Page ctx={ctx} title='Edit article'>
                    <>
                        <hr />
                        <a href="../">Back</a>
                        <hr />
                        <PublishButton
                            ctx={ctx}
                            article={article}
                        />
                        <editor-app id="editor-app"
                            title={article.title}
                            content={article.content}
                        ></editor-app>
                        <hr />
                        <ArticleControls
                            ctx={ctx}
                            article={article}
                        />
                    </>
                </Page>
            </Layout>
        )
    }