import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

import Layout from './Layout'
import Intro from './IntroSection'
import Teaser from './TeaserSection'

export const IndexPage: Component<{
    getArticle: (id: string) => Promise<Article>
}> = async ({
    ctx,
    getArticle
}) => {
        return (
            <Layout ctx={ctx}>
                <Intro ctx={ctx} article={getArticle('intro')} />
                <Teaser ctx={ctx} article={getArticle('realsameiet')} />
                <Teaser ctx={ctx} article={getArticle('huldra-vel')} />
                <Teaser ctx={ctx} article={getArticle('naboskap')} />
                <Teaser ctx={ctx} article={getArticle('destinasjonsgruppa')} />
                <Teaser ctx={ctx} article={getArticle('gården')} />
            </Layout>
        )
    }

export default IndexPage