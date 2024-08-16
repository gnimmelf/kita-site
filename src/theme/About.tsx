import Html from '@kitajs/html'
import * as cheerio from 'cheerio';

import {
    Component,
    Article,
} from '../types'

import { createSheet } from './styles'

// Head Tag for accordion
const HTAG = 'h2'

const { classes } = createSheet({
    accordion: {
        cursor: 'pointer',
        borderTop: 'var(--border-style)',
        [`& > ${HTAG}`]: {
            /* Format head tag*/
            fontSize: '105%',
            padding: '10px',
            margin: '0px 0px'
        },
        '& .state-icon': {
            transformOrigin: '0px 8px',
            '&.expanded': {
                transform: 'rotateX(180deg)'
            },
        },
        '& .content': {
            padding: '2px 10px',
        },
    },


})

/**
 * Restructure body markup to incorporate AlpineJs accordion
 * @param body string
 * @returns string
 */
const parseBody = (body: string) => {
    const $ = cheerio.load(body, {}, false);

    $(HTAG).each((_idx, el) => {
        const $accoridion = $(`<div class="${classes.accordion}">`)
        const $stateIcon = $('<div class="state-icon">﹀</div>')
        const $contentWrapper = $('<div class="content">')

        const $head = $(el)
        const $content = $head.nextUntil(HTAG)

        $head.wrap($accoridion)
        $head.after($contentWrapper)
        $head.after($stateIcon)
        $contentWrapper.append($content)

        $accoridion
            .attr('x-data', '{ expanded: false }')

        $head
            .attr('@click', 'expanded = ! expanded')

        $stateIcon
            .attr('@click', 'expanded = ! expanded')
            .attr(':class', "expanded ? 'expanded' : 'collapsed'")
            
        $contentWrapper
            .attr('x-show', 'expanded')
            .attr('x-collapse.duration.200ms', '')
    })

    return $.html()
}

const About: Component<{
    article: Article
}> = ({
    article,
}) => {
        return (
            <>{parseBody(article.body)}</>
        )
    }

export default About