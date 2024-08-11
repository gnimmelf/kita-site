import Html from '@kitajs/html'

import {
    Component,
} from '../types'

import { createSheet } from './styles'
import { Show, Svg } from '../lib/components'
import { MdiGithub, MdiLinkedin } from './Icons'

import About from './About'

const { classes } = createSheet({
    header: {
        backgroundColor: 'var(--header-bg)',
        borderBottom: '2px solid var(--card-border)',
        textAlign: 'center',
        // Keep h1 top-margin from creating space above parent
        overflow: 'auto',
        '& a': {
            color: 'var(--footer-fg)',
            '&:hover': {
                color: 'var(--header-accent)',
            }
        },
    },
    content: {
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: '0 auto 1rem'
    },
    section: {
        margin: '1rem 10px'
    },
    title: {
        '& > h1, h2': {
            margin: '1rem',
        },
    },
    intro: {
        marginBottom: '1rem'
    },
    box: {
        color: 'var(--card-fg)',
        backgroundColor: 'var(--card-bg)',
        border: '2px solid',
        borderColor: 'var(--card-border)',
        borderRadius: 'var(--border-radius)',
        textAlign: 'center',
        '& h1': {
            margin: '1rem',
        },
    },
    svg: {
        '& > *': {
            height: '100px',
            width: 'auto'
        }
    }
})

const Header: Component<{
    isIndexPage: boolean
}> = ({
    isIndexPage,
    ctx,
}) => {
        const { header } = ctx.site
        return (
            <>
                <section class={classes.header}>
                    <div class={classes.content}>
                        <div class={classes.title}>
                            <a class={classes.svg} href="/"><Svg path="./public/logo.svg" /></a>
                            <a target="_blank" href={header.meta.social.linkedin}><MdiLinkedin /></a>
                            <a target="_blank" href={header.meta.social.github}><MdiGithub /></a>
                        </div>
                    </div>
                </section>

                <Show when={isIndexPage}>
                    <section class={classes.section}>
                        <div class={classes.content}>
                            <div class={classes.box}>
                                <Show when={isIndexPage}>
                                    {/* When `isIndexPage` intro, the page-titles are `h2` */}
                                    <h1>{header.meta.title}</h1>
                                </Show>
                                <Show when={!isIndexPage}>
                                    {/* When not `isIndexPage`, the page-title is the `h1` */}
                                    <h2>{header.meta.title}</h2>
                                </Show>
                                <div class={classes.intro}>{header.meta.intro}</div>
                                <About article={header} />
                            </div>
                        </div>
                    </section>
                </Show>
            </>
        )
    }

export default Header