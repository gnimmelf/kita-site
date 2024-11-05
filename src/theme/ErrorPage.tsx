import Html from '@kitajs/html'
import {
    Component,
} from '../types'

import Layout from './Layout'
import BackLink from './BackLink'
import { createSheet } from './styles'

const { classes } = createSheet({
    center: {
        textAlign: 'center'
    }
})

const ErrorPage: Component<{
    error: Error
}> = async ({
    ctx,
    error
}) => {
        console.dir(ctx)
        const pageTitle = `Error - ${ctx.set.status}`
        return (
            <Layout ctx={ctx} pageTitle={pageTitle}>
                <div class={classes.center}>
                    <p>
                        {error.name}
                    </p>
                    <p>                        
                        {error.message}
                    </p>

                    <BackLink />
                </div>
            </Layout>
        )
    }

export default ErrorPage