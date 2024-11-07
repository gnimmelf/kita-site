import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import Layout from './Layout'

import { createSheet } from './styles'
import CardSection from './CardSection'
import { BackLink } from './BackLink'
import { Show } from '../lib/components'

export const { classes } = createSheet({
    article: {
        '& > *': {
            padding: '0px 1rem',
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
            paddingBottom: '0.5rem',
            borderBottom: '1px solid'
        },
        '& > p': {
            fontSize: '1rem'
        },
        '& > pre': {
            padding: '5px',
            overflowX: 'auto',
        }
    }
})


export const ArticlePage: Component<{
    article: Article
    headTags?: string[]
}> = async ({
    ctx,
    article,
    children,
    headTags = []
}) => {
        return (
            <Layout ctx={ctx} pageTitle={article.meta.title} headTags={headTags}>
                <CardSection class={classes.article}>
                    <h1 class={classes.title}>{article.meta.title}</h1>
                    <div class={classes.body}>{article.body}</div>
                    <Show when={children}>{children}</Show>
                    <BackLink />
                </CardSection>
            </Layout>
        )
    }

export default ArticlePage