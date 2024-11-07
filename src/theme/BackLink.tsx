import Html from '@kitajs/html'
import {
    Component,
    Article,
    Context,
} from '../types'

import { createSheet } from './styles'

const { classes } = createSheet({
    backLink: {
        padding: '20px 0px',
        textAlign: 'center'
    },
    borderTop: {
        borderTop: 'var(--border-style)',
    }
})

export const BackLink: Component<{
    noBorder?: boolean
}> = async ({
    noBorder,
}) => {
    const styleClasses = [
        classes.backLink,
        !noBorder && classes.borderTop
    ].join(' ')
        return (
            <div class={styleClasses}>
                <div>~ ~ ~</div>
                <a href="/">Back</a>
            </div>
        )
    }

export default BackLink