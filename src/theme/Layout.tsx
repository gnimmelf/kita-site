import Html from '@kitajs/html'
import {
    Component,
} from '../types'

import Header from './Header'
import Footer from './Footer'

import { createSheet } from './styles'

const { classes } = createSheet({
    '@global': {
        a: {
            color: 'var(--body-accent)',
            textDecoration: 'none'
        },
    },
    body: {
        backgroundColor: 'var(--body-bg)',
        color: 'var(--body-fg)',
        margin: '0px',
        padding: '0px',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    main: {
        flexGrow: '1',
        margin: '1rem 0px',
        padding: '10px'
    }
})

const Layout: Component<{
    pageTitle?: string
    headTags?: string[]
    endTags?: string[]
    isIndexPage: Boolean
}> = ({
    ctx,
    children,
    pageTitle,
    isIndexPage = false,
    headTags = [],
    endTags = []
}) => {
        const siteTitle = ctx.site.header.meta.title || 'Kita-site'
        return (
            <>
                {'<!doctype html>'}
                <html lang="en">
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="Pragma" content="no-cache" />
                        <meta http-equiv="Expires" content="0" />
                        {headTags.join('\n')}
                        <title>{pageTitle ? `${pageTitle} - ` : ''}{siteTitle}</title>
                        <link rel="stylesheet" type="text/css" href="/public/globals.css" />
                        <link rel="stylesheet" type="text/css" href="/styles.css" />
                    </head>
                    <body class={classes.body}>
                        <Header
                            ctx={ctx}
                            isIndexPage={isIndexPage}
                        />
                        <main class={classes.main}>{children}</main>
                        <Footer ctx={ctx} />
                        {endTags.join('\n')}
                    </body>
                </html>
            </>
        )
    }

export default Layout