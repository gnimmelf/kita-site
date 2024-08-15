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
 * Create an Svg component based on file-path
 * @param param0 
 * @returns 
 */
export const SvgFile: Component<{ file: string, filter?: string }> = async ({ file, filter, children }) => {
    const bunFile = Bun.file(file)    
    const xml = await bunFile.text()
    const $ = cheerio.load(xml, {}, false);
    
    const viewBox = $('svg').attr('viewBox')
    
    const $svg = $(`<svg viewbox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`)

    const defs = children?.toString()

    // Add
    $svg.append(`<defs>${defs || ''}</defs>`)

    $svg.append($('g').attr('filter', filter ?? ''))

    return $svg.toString()
}
