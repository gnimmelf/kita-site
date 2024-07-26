import Html from '@kitajs/html'
import {
    Component,
} from '../types'

import { createSheet } from './styles'

const { classes } = createSheet({
    '@global': {
        body: {
            backgroundColor: 'rgba(var(--background))',
            color: 'rgba(var(--foreground))'
        },
        a: {
            color: 'rgba(var(--foreground))',
            textDecoration: 'none'
        }
    }
})


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
        return (
            <>
                {'<!doctype html>'}
                <html lang="en">
                    <head>
                        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                        <meta http-equiv="Pragma" content="no-cache" />
                        <meta http-equiv="Expires" content="0" />
                        {headTags.join('\n')}
                        <title>{ctx.siteTitle} {pageTitle ? `- ${pageTitle}` : ''}</title>
                        <link rel="stylesheet" type="text/css" href="/public/vars.css" />
                        <link rel="stylesheet" type="text/css" href="/styles.css" />
                    </head>
                    <body class={classes.body}>
                        <main>
                            {children}
                        </main>
                        {endTags.join('\n')}
                    </body>
                </html>
            </>
        )
    }

export default Layout