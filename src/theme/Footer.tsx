import Html from '@kitajs/html'
import {
    Article,
    Component,
} from '../types'

import { createSheet } from './styles'

const { classes } = createSheet({
    footer: {
        textAlign: 'center',
        backgroundColor: 'var(--footer-bg)',
        color: 'var(--footer-fg)',
        overflow: 'auto',
        marginTop: '1rem',
        paddingTop: '1rem',
        '& a': {
            color: 'var(--footer-accent)',
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
    const { footer } = ctx.site
    return (
        <section class={classes.footer}>
            <div class={classes.content}>
                <h3>{footer.meta.title}</h3>
                <div>{footer.meta.intro}</div>
                <div>{footer.body}</div>
            </div>
        </section>
    )
}

export default Footer