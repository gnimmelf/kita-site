import Html from '@kitajs/html'
import {
    Component,
    Article,
    Articles,
} from '../types'

import Layout from './Layout'
import Teaser from './Teaser'

import { createSheet } from './styles'

const { classes } = createSheet({
    grid: {
            maxWidth: 'var(--content-width)',
            margin: '0 auto',
            display: 'grid',
            gap: '3rem',
            gridTemplateColumns: '1fr',
            '@media (min-width: 860px)' : {                
                gridTemplateColumns: '1fr 1fr',
                justifyContent: 'space-around',
            },            
            '& > *': {
                boxSizing: 'border-box',                                
            }
    }    
})

export const IndexPage: Component<{
    articles: Articles
}> = async ({
    ctx,
    articles
}) => {
    articles.sort((a: Article, b: Article) => a.meta.weight > b.meta.weight)
    const headTags = [
        '<script src="//unpkg.com/@alpinejs/collapse"></script>',
        '<script src="//unpkg.com/alpinejs" defer></script>'
    ]
        return (
            <Layout ctx={ctx} isIndexPage={true} headTags={headTags}>                
                <div class={classes.grid}>
                    {articles.map((article: Article) => (<Teaser ctx={ctx} article={article} />))}                                     
                </div>                
            </Layout>
        )
    }

export default IndexPage