import Html from '@kitajs/html'
import * as cheerio from 'cheerio';
import {
    Component,
} from '../types'

/**
 * Return children when `when` is true, otherwise return null
 * @param when: boolean, when to show 
 * @returns 
 */
export const Show: Component<{ when: any }> = ({ when, children }) => (
    <>
        {!!when ? children : null}
    </>
)

/**
 * Create an Svg component based on an svg-file-path. 
 * For `filterId`, see: 
 *  - https://benfrain.com/applying-multiple-svg-filter-effects-defined-in-css-or-html/
 *  - https://w3cplus.medium.com/in-depth-exploration-of-svg-techniques-and-advanced-techniques-f2d183a44b2b
 * @param file string filepath relative to `package.json`
 * @param filterId string reference to a svg-filter tag
 * @returns 
 */
export const SvgFile: Component<{ file: string, filterId?: string }> = async ({ file, filter, children }) => {
    const bunFile = Bun.file(file)    
    const xml = await bunFile.text()
    const $ = cheerio.load(xml, {}, false);
    
    const viewBox = $('svg').attr('viewBox')
    
    const $svg = $(`<svg viewbox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`)

    const defs = children?.toString()

    // Add
    $svg.append(`<defs>${defs || ''}</defs>`)

    $svg.append($('g').attr('filter', filter ? 'url(#filterId)' : ''))

    return $svg.toString()
}
