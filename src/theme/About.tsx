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
        [`& > ${HTAG}`]: {
            /* Format head tag*/
            fontSize: '105%',
            padding: '5px',
            margin: '5px 0px',
            borderTop: '2px solid var(--card-border)',
        }
    },
    content: {
        padding: '2px 10px',        
    }
})

/**
 * Restructures body markup to incorporate AlpineJs accordion
 * @param body string
 * @returns string
 */
const parseBody = (body: string) => {
    const $ = cheerio.load(body, {}, false);

    $(HTAG).each((_idx, el) => {
        const $headWrapper = $('<div>')
        const $contentWrapper = $('<div>')

        const $head = $(el)
        const $content = $head.nextUntil(HTAG)

        $head.wrap($headWrapper)
        $head.after($contentWrapper)
        $contentWrapper.append($content)

        $headWrapper
            .attr('x-data', '{ expanded: false }')
            .addClass(classes.accordion)
        $head
            .attr('@click', 'expanded = ! expanded')
        $contentWrapper
            .attr('x-show', 'expanded')
            .addClass(classes.content)
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