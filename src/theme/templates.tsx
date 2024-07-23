import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { Show } from '../lib/components'

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

// Pages

export const IndexPage: Component<{
    articles: Article[]
}> = ({
    ctx,
    articles
}) => {
        return (
            <Layout ctx={ctx}>
                <h1>Flemming</h1>
                <pre>{JSON.stringify(articles, null, 2)}</pre>
            </Layout>
        )
    }
