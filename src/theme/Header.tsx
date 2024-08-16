import Html from '@kitajs/html'

import {
    Component,
} from '../types'

import { createSheet } from './styles'
import { Show } from '../lib/components'
import { SvgFile } from './Svg'
import { MdiGithub, MdiLinkedin } from './Icons'

import AccordionBody from './AccordionBody'
import CardSection from './CardSection'

const { classes } = createSheet({
    header: {
        backgroundColor: 'var(--header-bg)',
        // Keep h1 top-margin from creating space above parent
        overflow: 'auto',
    },
    content: {
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: '0 auto 1rem',
    },
    intro: {
        margin: '1rem 10px',
        '& a': {
            color: 'var(--header-fg)',
            '&:hover': {
                color: 'var(--header-accent)',
            }
        },
        '& .text': {
            marginBottom: '1rem'
        },
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '2rem',
        '& > h1, h2': {
            margin: '1rem',
        },
    },
    wrapperBox: {
        textAlign: 'center',
        '& h1': {
            margin: '1rem',
        },
    },
    logo: {
        color: 'var(--logo)',
        willChange: 'filter',
        animation: 'drop-shadow-pulse 20s infinite',
        filter: 'var(--drop-shadow-filter)',
        '& > a': {
            color: 'var(--logo)',
        },
        '& > a:hover': {
            color: 'var(--logo-accent)',
        },
        '& svg': {
            height: '100px',
            width: 'auto',
        }
    },
    social: {
        filter: 'var(--drop-shadow-filter)',
        fontSize: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
                            <div class={[classes.logo, classes.dropShadow].join(' ')}><a href="/">
                                <SvgFile file="./public/logo.svg" />
                            </a></div>
                            <div class={[classes.social, classes.dropShadow].join(' ')}>
                                <a target="_blank" href={header.meta.social.github}><MdiGithub /></a>
                                <a target="_blank" href={header.meta.social.linkedin}><MdiLinkedin /></a>
                            </div>
                        </div>
                    </div>
                </section>

                <Show when={isIndexPage}>
                    <section class={classes.intro}>
                        <div class={classes.content}>
                            <CardSection class={classes.wrapperBox}>
                                <Show when={isIndexPage}>
                                    {/* When `isIndexPage` intro, the page-titles are `h2` */}
                                    <h1>{header.meta.title}</h1>
                                </Show>
                                <Show when={!isIndexPage}>
                                    {/* When not `isIndexPage`, the page-title is the `h1` */}
                                    <h2>{header.meta.title}</h2>
                                </Show>
                                <div class="text">{header.meta.intro}</div>
                                <AccordionBody article={header} />
                            </CardSection>
                        </div>
                    </section>
                </Show>
            </>
        )
    }

export default Header