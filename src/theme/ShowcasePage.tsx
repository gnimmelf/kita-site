import Html from '@kitajs/html'
import {
    Component,
    ArticleMeta,
} from '../types'

import Layout from './Layout'

import { createSheet } from './styles'

const { classes } = createSheet({
    article: {
        '& > *': {
            margin: '0px',
            textAlign: 'center',
            textTransform: 'capitalize',
        },
        '& > h2': {
            color: 'var(--light-3)',
            fontSize: '1.5rem',
            margin: '1rem 0'
        },
        '& > h1': {
            fontSize: '1.7rem',
            margin: '1rem 0'
        },
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
    },
    body: {
        '& > *': {

        }
    }
})

export const ShowcasePage: Component<{
    article: ArticleMeta
}> = async ({
    ctx,
    article,
}) => {
        // TODO! Figure out to load the individual showcases, they will be almost exclusively browser-code
        return (
            <Layout ctx={ctx} pageTitle={article.meta.title}>
                <section class={classes.article}>
                    <h2>~ Showcase ~</h2>
                    <h1>{article.meta.title}</h1>

                    <div class={classes.body}>
                        {article.body}
                    </div>
                </section>
            </Layout>
        )
    }

export default ShowcasePage