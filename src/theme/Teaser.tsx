import Html from '@kitajs/html'
import {
    Component,
    Article,
    Context,
} from '../types'

import CardSection from './CardSection'
import Link from './TeaserMetaLink'

import { createSheet } from './styles'

const { classes } = createSheet({
    teaser: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 10px 10px',
    },
    title: {
        textTransform: 'capitalize'
    },
    intro: {
        // Push link down to bottom of teaser card
        flexGrow: '1'
    },
    link: {
        display: 'inline-flex',
        justifyContent: 'end',
        paddingTop: '1rem'
    }
})

const Teaser: Component<{
    article: Article,
    ctx: Context
}> = ({
    article,
    ctx
}) => {
        return (
            <CardSection class={classes.teaser} data-id={article.id} data-weight={article.meta.weight}>
                <h2 class={classes.title}>{article.meta.title}</h2>
                <div class={classes.intro}>{article.meta.intro}</div>
                <div class={classes.link}>
                    <Link ctx={ctx} article={article} />
                </div>
            </CardSection>
        )
    }

export default Teaser
