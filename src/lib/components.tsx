import Html from '@kitajs/html'
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
export const Svg: Component<{ path: string, class?: string }> = async ({ path }) => {
    const file = Bun.file(path)
    const svgCode = await file.text()
    return svgCode
}
