import Html from '@kitajs/html'
import {
    Article,
    Component,
} from '../types'

import { createSheet } from './styles'

const { classes } = createSheet({
    footer: {
        backgroundColor: 'var(--footer-bg)',
        color: 'var(--footer-fg)',
        overflow: 'auto',
        '& a': {
            color: 'var(--footer-accent)',
        }
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
    }
})

const Footer: Component<{}> = ({
    ctx
}) => {
    const article: Article = ctx.footer
    return (
        <section class={classes.footer}>
            <div class={classes.content}>
                <div>{article.meta.title}</div>
                <div>{article.meta.intro}</div>
                <div>{article.body}</div>
            </div>
        </section>
    )
}

export default Footer