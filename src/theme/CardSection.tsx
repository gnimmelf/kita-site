import Html from '@kitajs/html'
import {
    Component,
} from '../types'

import { createSheet } from './styles'

const { classes } = createSheet({
    section: {
        backgroundColor: 'var(--card-bg)',
        color: 'var(--card-fg)',
        border: 'var(--border-style)',
        borderRadius: 'var(--border-radius)',
        filter: 'var(--drop-shadow-filter)',
    }
})

const CardSection:Component = ({ children, ...props }) => {
    return (
        <section class={[classes.section].concat(props.class).join(' ')}>{children}</section>
    )
}

export default CardSection