import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import Layout from './Layout'

import { createSheet } from './styles'

const { classes } = createSheet({
    article: {
        padding: '10px 15px',
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
        backgroundColor: 'var(--card-bg)',
        color: 'var(--card-fg)',
        border: '2px solid',
        borderColor: 'var(--card-border)',
        borderRadius: 'var(--border-radius)',
        '& a': {
            color: 'var(--card-accent)',
        }
    },
    title: {
        textTransform: 'capitalize',
        fontSize: '1.7rem'
    },
    body: {
        '& > p': {
            fontSize: '1rem'            
        },
        '& > pre': {
            padding: '5px',
            overflowX: 'auto',
        }
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
                    <div class={classes.body}>{article.body}</div>
                    <div class={classes.backLink}>
                        <div>~ ~ ~</div>
                        <a href="/">Back</a>
                    </div>
                </section>
            </Layout>
        )
    }

export default ArticlePage