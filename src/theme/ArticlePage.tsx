import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import Layout from './Layout'

import { createSheet } from './styles'

const { classes } = createSheet({
    article: {
        padding: '10px',
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
        backgroundColor: 'var(--card-bg)',
        color: 'var(--card-fg)',
        border: '2px solid',
        borderColor: 'var(--card-accent)',
        borderRadius: 'var(--border-radius)',    
        '& a': {
            color: 'var(--card-accent)',
        },
    },
    title: {
        textTransform: 'capitalize'
    },
    backLink: {
        textAlign: 'center'
    }
})


export const ArticlePage: Component<{
    article: Article
}> = async ({
    ctx,
    article
}) => {
        return (
            <Layout ctx={ctx} pageTitle={article.meta.title}>
                <section class={classes.article}>
                    <h1 class={classes.title}>{article.meta.title}</h1>
                    <div>{article.body}</div>
                    <div class={classes.backLink}>
                        <a href="/">Back</a>
                    </div>
                </section>
            </Layout>
        )
    }

export default ArticlePage