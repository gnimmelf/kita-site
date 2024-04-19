// Snippets

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
                        {a.title} <a href={articlePath + '/' + a.id}>Edit</a>
                    </div>
                ))}
            </section>
        </>
    )
}

const Layout = ({ ctx, body, headTags = [], endTags = [] }) => {
    endTags.push('<script src="/public/main.js"></script>')
    endTags.push('<script src="https://unpkg.com/htmx.org@1.9.11"></script>')
    return (
        <html>
            <head>
                <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta http-equiv="Pragma" content="no-cache" />
                <meta http-equiv="Expires" content="0" />
                {headTags.join('\n')}
            </head>
            <body>
                <section>
                    <a href="/">Home</a>
                    |
                    <a href="/admin">Admin</a>
                </section>
                {body}
                <hr />
                <a href="/admin/logout">Logout</a>
                {endTags.join('\n')}
            </body>
        </html>

    )
}

// Partials

export const ArticleControls = (ctx) => {
    return (
        <div id="article-controls">
            <button onclick="getArticleData()">Save me</button>
        </div>
    )
}

export const LoginForm = (ctx) => {
    const { formErrors } = ctx
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

export const LoginPage = (ctx) => {
    return Layout({
        ctx,
        body: Page({
            title: 'Login', content: LoginForm(ctx)
        })
    })
}

export const IndexPage = (ctx) => {
    return Layout({
        ctx,
        body: Page({
            title: 'Admin', content: ArticleList(ctx)
        })
    })
}

export const ArticlePage = ({ article, ...ctx }) => {
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
                        content={article.content}
                    ></editor-app>
                    {ArticleControls(ctx)}
                </section>
            )
        })
    })
}