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
    headTags.push('<script src="/public/main.js"></script>')
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

export const SaveArticleButton = async (ctx) => {
    return (
        <pre>
            {JSON.stringify(ctx, null, 2)}
        </pre>
    )
}

export const LoginForm = async (ctx) => {
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

export const LoginPage = async (ctx) => {
    return Layout({
        ctx,
        body: Page({
            title: 'Login', content: LoginForm(ctx)
        })
    })
}

export const IndexPage = async (ctx) => {
    return Layout({
        ctx,
        body: Page({
            title: 'Admin', content: ArticleList(ctx)
        })
    })
}

export const ArticlePage = async ({ api, ...ctx }) => {
    const article = await api.getArticleById(ctx.params.id)
    return Layout({
        ctx,
        headTags: [
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
                    <button>Save</button>
                </section>
            )
        })
    })
}