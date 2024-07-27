import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import Link from './ArticleMetaLink'

import { createSheet } from './styles'

const { classes } = createSheet({
    teaser: {
        backgroundColor: 'var(--card-bg)',
        color: 'var(--card-fg)',
        border: '1px solid',
        borderColor: 'var(--card-accent)',
        borderRadius: '10px',
        padding: '0px 10px 10px',        
        display: 'flex',
        flexDirection: 'column',
        '& a': {
            color: 'var(--card-accent)',
            textDecoration: 'none',
        },     
    },
    intro: {
        // Push link down to bottom of teaser card
        flexGrow: '1'
    },
    link: {
        display: 'inline-flex',
        justifyContent: 'end',
        paddingTop: '5px'
    }
})

const Teaser: Component<{
    article: Article
}> = ({
    article
}) => {
        
        return (
            <section class={classes.teaser} data-id={article.id} data-weight={article.meta.weight}>
                <h2>{article.meta.title}</h2>
                <div class={classes.intro}>{article.meta.intro}</div> 
                <div class={classes.link}>
                    <Link article={article} />                
                </div>
            </section>
        )
    }

export default Teaser