import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { MdiExternalLink } from './Icons'

import { createSheet } from './styles'

const { classes } = createSheet({
    vAlign: {
        display: 'flex',
        alignItems: 'center',        
    }
})

const TeaserMetaLink: Component<{
    article: Article
}> = ({ article }) => {
    const isExternal = !!article.meta.link

    if (isExternal) {
        return (<a 
            target="_blank" 
            href={article.meta.link}><span class={classes.vAlign}><span>Open</span><MdiExternalLink /></span></a>)
    }
    else {
        return (<a href={`/${article.id}`}>Read more</a>)
    }
}

export default TeaserMetaLink