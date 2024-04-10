// Snippets

const Page = ({ content, title }) => (
    <section>
        <h1>{title}</h1>
        <div class="content">
            {content}
        </div>
    </section>
)

const ArticleList = async ({ api, ...ctx }) => {
    const articles = await api.getArticles();
    return (
        <>
            <h2>Articlelist</h2>
            <section>
                {articles.map((a) => (
                    <div>
                        {a.title} <a href={ctx.path + '/' + a.id}>Edit</a>
                    </div>
                ))}
            </section>
        </>
    )
}

const Layout = ({ ctx, body, headTags = [], endTags = [] }) => {
    return (
        <html>
            <head>
                {headTags.join('\n')}
            </head>
            <body>
                <section>
                    <a href="/">Home</a>
                    |
                    <a href="/admin">Admin</a>
                </section>
                {body}
                {endTags.join('\n')}
            </body>
        </html>

    )
}

// Partials

export const SaveArticle = async (ctx) => {
    return (
        <pre>
            {JSON.stringify(ctx, null, 2)}
        </pre>
    )
}

// Pages

export const IndexPage = async (ctx) => {
    return Layout({ ctx, body: Page({ title: 'Admin', content: ArticleList(ctx) }) })
}

export const ArticlePage = async ({ api, ...ctx }) => {
    const article = await api.getArticleById(ctx.params.id)
    return Layout({
        ctx,
        headTags: [
            // <link href="/public/admin/${filename}" rel="stylesheet" />
            '<script src="https://unpkg.com/htmx.org@1.9.11"></script>',
        ],
        endTags: [
            '<script src="/public/admin/editor.js" type="module"></script>',
        ],
        body: Page({
            title: 'Edit article', content: (
                <section>
                    <editor-app 
                        title={article.title} 
                        content={article.content}
                        endpoint={`/api/save/${ctx.params.id}`}></editor-app>                                                        
                </section>
            )
        })
    })
}