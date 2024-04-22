import {
    type Component,
} from '@kitajs/html'

// Flow-controls

export const Show: Component<{when: any}> = ({ when, children }) => (
    <>
        {when ? children : null}
    </>
)