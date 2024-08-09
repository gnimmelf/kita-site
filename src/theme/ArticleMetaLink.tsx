import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { MdiExternalLink } from './Icons'

import { createSheet } from './styles'

const { classes } = createSheet({
    link: {
        color: 'var(--light)',
        '&:hover': {
            color: 'white'
        }
    },
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
            class={classes.link}
            target="_blank" 
            href={article.meta.link}><span class={classes.vAlign}><span>Open</span><MdiExternalLink /></span></a>)
    }
    else {
        return (<a class={classes.link} href={`/${article.id}`}>Read more</a>)
    }
}

export default ArticleMetaLink