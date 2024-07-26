import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'
import Layout from './Layout'

export const ArticlePage: Component<{
    article: Article
}> = async ({
    ctx,
    article
}) => {
        return (
            <Layout ctx={ctx}>
                <section class={''}>
                    <h1>{article.meta.title}</h1>
                    <div>{article.body}</div>
                </section>
            </Layout>
        )
    }    

export default ArticlePage