import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

const Layout: Component<{
    pageTitle?: string
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
                    <main>
                        {children}
                    </main>
                    {endTags.join('\n')}
                </body>
            </html>

        )
    }

// Snippets

const PreTag: Component<{
    data: object
}> = ({
    data = {}
}) => {
        return (<pre>{Bun.escapeHTML(JSON.stringify(data, null, 2))}</pre>)
    }

const Intro: Component<{
    article: Article
}> = ({
    article
}) => {
        return (
            <>
                <h1>{article.meta.title}</h1>
                <section>
                    {article.body}
                </section>
            </>
        )
    }


const Section: Component<{
    article: Article
}> = ({
    article
}) => {
        return (
            <section class={''}>
                <h2>{article.meta.title}</h2>
                <div>{article.meta.intro}</div>
            </section>
        )
    }

// Pages

export const IndexPage: Component<{
    getArticle: (id: string) => Promise<Article>
}> = async ({
    ctx,
    getArticle
}) => {
        return (
            <Layout ctx={ctx}>
                <Intro ctx={ctx} article={getArticle('intro')} />
                <Section ctx={ctx} article={getArticle('realsameiet')} />
                <Section ctx={ctx} article={getArticle('huldra-vel')} />
                <Section ctx={ctx} article={getArticle('naboskap')} />
                <Section ctx={ctx} article={getArticle('destinasjonsgruppa')} />
                <Section ctx={ctx} article={getArticle('gården')} />
            </Layout>
        )
    }

export const ArticlePage: Component<{
    article: Article
}> = async ({
    ctx,
    article
}) => {
        return (
            <Layout ctx={ctx}>
                <section class={''}>
                    <h1>{article.meta.title}</h1>
                    <div>{article.body}</div>
                </section>
            </Layout>
        )
    }    
