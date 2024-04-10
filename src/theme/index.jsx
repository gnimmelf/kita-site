// Partials

const Page = ({ content, title }) => (
    <section>
        <h1>{title}</h1>
        <div class="content">
            {content}
        </div>
    </section>
)

const ArticleList = (articles) => {
    return (
        <>
            <h2>Articlelist</h2>
            <section>
                {articles.map((a) => (
                    <div>
                        <a href={a.slug}>{a.title}</a>
                    </div>
                ))}
            </section>
        </>
    )
}

const Layout = ({ ctx, body }) => {
    return (
        <html>
            <head></head>
            <body>
                <section>
                    <a href="/">Home</a>
                    |
                    <a href="/admin">Admin</a>
                </section>
                {body}                
            </body>
        </html>

    )
}

// Pages

export const IndexPage = async ({ api, ...ctx }) => {
    const articles = await api.getArticles();
    return Layout({ ctx, body: Page({ title: 'Theme', content: ArticleList(articles) }) })
}

export const ArticlePage = async ({ api, ...ctx }) => {
    const article = await api.getArticleBySlug(ctx.params.slug);        
    return Layout({ ctx, body: Page({ title: article.title, content: article.content }) })
}
