import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'


// Flow-controls

export const Show: Component<{when: any}> = ({ when, children }) => (
    <>
        {!!when ? children : null}
    </>
)