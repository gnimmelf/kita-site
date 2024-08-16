import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import Layout from './Layout'

import { createSheet } from './styles'
import CardSection from './CardSection'

const { classes } = createSheet({
    article: {
        '& > *': {
            padding: '0px 15px',
        },
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
    },
    title: {
        padding: '20px 0px',
        margin: '0px',
        borderBottom: 'var(--border-style)',
        textAlign: 'center',
        textTransform: 'capitalize',
        fontSize: '1.7rem',

    },
    body: {
        '& > h3': {
            borderBottom: '1px solid'
        },
        '& > p': {
            fontSize: '1rem'
        },
        '& > pre': {
            padding: '5px',
            overflowX: 'auto',
        }
    },
    backLink: {
        padding: '20px 0px',
        borderTop: 'var(--border-style)',
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
                <CardSection class={classes.article}>
                    <h1 class={classes.title}>{article.meta.title}</h1>
                    <div class={classes.body}>{article.body}</div>
                    <div class={classes.backLink}>
                        <div>~ ~ ~</div>
                        <a href="/">Back</a>
                    </div>
                </CardSection>
            </Layout>
        )
    }

export default ArticlePage