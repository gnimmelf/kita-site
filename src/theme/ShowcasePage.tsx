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
            padding: '10px 0px',
            margin: '0px',
            textAlign: 'center',
            textTransform: 'capitalize',
        },
        '& > h2': {
            color: 'var(--light-3)',
            fontSize: '1.5rem'
        },
        '& > h1': {
            fontSize: '1.7rem'
        },
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
    },
})

export const ShowcasePage: Component<{
    meta: ArticleMeta
}> = async ({
    ctx,
    meta,
}) => {
    // TODO! Figure out to load the individual showcases, they will be almost exclusively browser-code
        return (
            <Layout ctx={ctx} pageTitle={meta.title}>
                <section class={classes.article}>
                    <h2>~ Showcase ~</h2>
                    <h1>{meta.title}</h1>

                </section>
            </Layout>
        )
    }

export default ShowcasePage