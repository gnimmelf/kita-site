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
        alignItems: 'center',        
    }
})

const ArticleMetaLink: Component<{
    article: Article
}> = ({ article }) => {
    const isExternal = !!article.meta.link

    if (isExternal) {
        return (<a 
            target="_blank" 
            href={article.meta.link}><span class={classes.vAlign}><span>Gå til</span><IconExternalLink /></span></a>)
    }
    else {
        return (<a href={`/${article.id}`}>Les mer</a>)
    }
}

export default ArticleMetaLink