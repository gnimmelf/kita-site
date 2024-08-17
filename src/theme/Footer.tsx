import Html from '@kitajs/html'
import {
    Article,
    Component,
} from '../types'

import { createSheet } from './styles'

const { classes } = createSheet({
    footer: {
        fontSize: 'medium',
        textAlign: 'center',
        backgroundColor: 'var(--footer-bg)',
        color: 'var(--footer-fg)',
        overflow: 'auto',
        marginTop: '1rem',
        padding: '1rem',
        '& a': {
            color: 'var(--footer-accent)',
        },
        '& h3': {
            color: 'var(--footer-fg)',
        }
    },
    content: {
        maxWidth: 'var(--content-width)',
        margin: '0 auto'
    },
    title: {

    }
})

const Footer: Component<{}> = ({
    ctx
}) => {
    const { footer, header } = ctx.site
    const year = new Date().getFullYear()
    return (
        <section class={classes.footer}>
            <div class={classes.content}>
                <h3>{footer.meta.title}</h3>
                <div>{footer.meta.intro}</div>
                <div>{footer.body}</div>
                <small>© {year} {footer.meta.copyright}</small>
            </div>
        </section>
    )
}

export default Footer