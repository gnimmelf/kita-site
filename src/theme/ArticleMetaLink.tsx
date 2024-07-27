import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { IconExternalLink } from './Icons'

import { createSheet } from './styles'

const { classes } = createSheet({
    vAlign: {
        display: 'flex',
        alignItems: 'base-line',        
    }
})

const ArticleMetaLink: Component<{
    article: Article
}> = ({ article }) => {
    const isExternal = !!article.meta.link

    if (isExternal) {
        return (<a target="_blank" href={article.meta.link}><span class={classes.vAlign}><span>Les mer</span><span><IconExternalLink /></span></span></a>)
    }
    else {
        return (<a href={`/${article.id}`}>Les mer</a>)
    }
}

export default ArticleMetaLink