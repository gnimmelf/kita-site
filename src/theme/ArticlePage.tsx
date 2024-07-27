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
                    <h1>{article.meta.title}</h1>
                    <div>{article.body}</div>
                </section>
            </Layout>
        )
    }

export default ArticlePage