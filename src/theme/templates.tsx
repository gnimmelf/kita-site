import {
    Component,
    Article,
} from '../types'

import { Show } from '../lib/components'

// Snippets

const ArticleList: Component<{
    articles: Article[]
}> = ({
    ctx,
    articles
}) => {
        return (
            <>
                <h2>Articlelist</h2>
                <section>
                    {articles.filter(a => !!a.is_published).map((a) => {
                        const articleUrl = `/${a.slug}`
                        return (
                            <div>
                                <a href={articleUrl}>{a.title}</a>
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
                    <a href="/">Home</a>
                    <hr />
                    <main>
                        {children}
                    </main>
                    <hr />
                    <a href="/admin">Admin</a>
                    {endTags.join('\n')}
                </body>
            </html>

        )
    }

// Page partials



// Pages

export const IndexPage: Component<{
    articles: Article[]
}> = ({
    ctx,
    articles
}) => {
        return (
            <Layout ctx={ctx} pageTitle="Home">
                <Page ctx={ctx} title={ctx.siteTitle}>
                    <ArticleList
                        ctx={ctx}
                        articles={articles}
                    />
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
            >
                <Page ctx={ctx} title={article.title}>
                    <>
                        {article.content}
                    </>
                </Page>
            </Layout>
        )
    }