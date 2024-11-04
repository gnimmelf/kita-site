import Html from '@kitajs/html'
import {
    Component,
    Article,
    Context,
} from '../types'

import { MdiCog, MdiExternalLink } from './Icons'

import { createSheet } from './styles'

const { classes } = createSheet({
    vAlign: {
        display: 'flex',
        alignItems: 'center',
    }
})

const TeaserMetaLink: Component<{
    article: Article
    ctx: Context
}> = ({ article, ctx }) => {
    if (!!article.meta.link) {
        const baseUrl = new URL(ctx.url)
        const linkUrl = new URL(article.meta.link, baseUrl)
        const isExternal = linkUrl.hostname != baseUrl.hostname

        let linkName = linkUrl.hostname

        if (linkUrl.pathname.startsWith('/showcase')) {
            // Append the article id as path-segment get the correct path to the showcase
            linkUrl.pathname += `/${article.id}`
            linkName = 'Showcase'
        }

        const LinkIcon = isExternal ? <MdiExternalLink /> : <MdiCog />

        return (<a
            target={isExternal ? '_blank' : ''}
            href={linkUrl.toString()}><span class={classes.vAlign}><span>{linkName}</span>{LinkIcon}</span></a>)
    }
    else {
        return (<a href={`/blog/${article.id}`}>Read more</a>)
    }
}

export default TeaserMetaLink