import Html from '@kitajs/html'
import {
    Component,
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
                    </head>
                    <body>
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