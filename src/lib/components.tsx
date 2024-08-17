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