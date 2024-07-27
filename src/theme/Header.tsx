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
        // Keep h1 top-margin from creating space above parent
        overflow: 'auto',
    },
    content: {
        maxWidth: 'var(--content-width)',
        margin: '0 auto'
    },
    title: {
        'fontFamily': '"Arsenal Sans", sans-serif',
        'fontPpticalSizing': 'auto',
        'fontWeight': '700',
        'fontStyle': 'normal',  
        '& a': {
            color: 'var(--header-fg)',
        }
    }
})

export const Header: Component<{
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
                        <h1 class={classes.title}><a href="/">{article.meta.title}</a></h1>
                        <div class={classes.intro}>{article.meta.intro}</div>
                    </div>
                </section>
                {showIntro ? <IntroSection article={article}/> : null}
            </>
        )
    }


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

export default Header