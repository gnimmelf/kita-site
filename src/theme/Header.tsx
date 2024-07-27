import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { createSheet } from './styles'
import { Show } from '../lib/components'

const { classes } = createSheet({
    header: {
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-fg)',
        textAlign: 'center',
        marginBottom: '1rem',
        // Keep h1 top-margin from creating space above parent
        overflow: 'auto',
    },
    content: {
        maxWidth: 'var(--content-width)',
        margin: '0 auto'
    },
    title: {                             
        '& a': {
            color: 'var(--header-fg)',
        },
        '& > h1': {
            margin: '1rem'
        }
    }
})

const IntroSection: Component<{
    article: Article
}> = ({
    article
}) => {
        return (
            <section class={classes.intro}>
                <div class={classes.content}>
                    <div class={classes.body}>{article.body}</div>
                </div>
            </section>

        )
    }

const Header: Component<{
    isIndexPage: Boolean
}> = ({
    isIndexPage,
    ctx,
}) => {
        const header: Article = ctx.header
        return (
            <>
                <section class={classes.header}>
                    <div class={classes.content}>
                        <div class={classes.title}>
                            <Show when={isIndexPage}>
                                {/* When `isIndexPage` intro, the page-titles are `h2` */}
                                <h1><a href="/">{header.meta.title}</a></h1>
                            </Show>
                            <Show when={!isIndexPage}>
                                {/* When not `isIndexPage`, the page-title is the `h1` */}
                                <h2><a href="/">{header.meta.title}</a></h2>
                            </Show>
                            <div class={classes.intro}>{header.meta.intro}</div>
                        </div>
                    </div>
                    {isIndexPage ? <IntroSection article={header} /> : null}
                </section>
            </>
        )
    }

export default Header