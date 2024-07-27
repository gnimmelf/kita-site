import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { createSheet } from './styles'

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
    showIntro: Boolean
}> = ({
    showIntro,
    ctx,
}) => {
        const article: Article = ctx.header
        return (
            <>
                <section class={classes.header}>
                    <div class={classes.content}>
                        <div class={classes.title}>
                            <h1><a href="/">{article.meta.title}</a></h1>
                            <div class={classes.intro}>{article.meta.intro}</div>
                        </div>
                    </div>
                    {showIntro ? <IntroSection article={article} /> : null}
                </section>
            </>
        )
    }

export default Header