import Html from '@kitajs/html'
import * as cheerio from 'cheerio';

import {
    Component,
    Article,
} from '../types'

import { createSheet } from './styles'

const HTAG = 'h2'

const { classes } = createSheet({
    accordion: {
        cursor: 'pointer', 
        [`& > ${HTAG}`]: {
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

const parseBody = (body: string) => {
    const $ = cheerio.load(body, {}, false);

    $('h2').each((_idx, el) => {
        const $headWrapper = $('<div>')
        const $contentWrapper = $('<div>')

        const $head = $(el)
        const $content = $head.nextUntil('h2')

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