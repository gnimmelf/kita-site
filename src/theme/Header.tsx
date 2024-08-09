import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import { createSheet } from './styles'
import { Show, Svg } from '../lib/components'
import { MdiGithub, MdiLinkedin } from './Icons'

const { classes } = createSheet({
    header: {
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-fg)',
        borderBottom: '2px solid var(--card-border)',
        textAlign: 'center',
        // Keep h1 top-margin from creating space above parent
        overflow: 'auto',
    },
    content: {
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: '0 auto 1rem'
    },
    title: {
        '& > h1, h2': {
            margin: '1rem',
        },
    },
    introWrapper: {
        margin: '1rem 10px'
    },
    intro: {
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
        color: 'var(--primary-400)',
        '&:hover': {
            color: 'var(--primary-300)',
        },
        '& > *': {
            height: '100px',
            width: 'auto'
        }
    }
})

const Intro: Component<{
    article: Article
    isIndexPage: boolean
}> = ({
    article,
    isIndexPage
}) => {
        return (
            <section class={classes.introWrapper}>
                <div class={classes.content}>
                    <div class={classes.intro}>
                        <Show when={isIndexPage}>
                            {/* When `isIndexPage` intro, the page-titles are `h2` */}
                            <h1>{article.meta.title}</h1>
                        </Show>
                        <Show when={!isIndexPage}>
                            {/* When not `isIndexPage`, the page-title is the `h1` */}
                            <h2>{article.meta.title}</h2>
                        </Show>
                        <div class={classes.body}>{article.meta.intro}</div>
                        <div class={classes.body}>{article.body}</div>

                    </div>
                </div>
            </section>
        )
    }




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
                    <Intro article={header} isIndexPage={isIndexPage} />
                </Show>
            </>
        )
    }

export default Header