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
            padding: '0px 15px',
        },
        maxWidth: 'var(--content-width)',
        margin: '0 auto',
    },
    title: {
        padding: '20px 0px',
        margin: '0px',
        textAlign: 'center',
        textTransform: 'capitalize',
        fontSize: '1.7rem',

    }
})

export const ShowcasePage: Component<{
    meta: ArticleMeta
}> = async ({
    ctx,
    meta
}) => {
        return (
            <Layout ctx={ctx} pageTitle={meta.title}>
                <section class={classes.article}>
                    <h1 class={classes.title}>{meta.title}</h1>
                </section>
            </Layout>
        )
    }

export default ShowcasePage