import Html from '@kitajs/html'
import {
    Component,
    Article,
    Datafile,
} from '../types'

import ArticlePage from './ArticlePage'


export const AboutMePage: Component<{
    article: Article,
    cvData: Datafile
}> = async ({
    ctx,
    article,
    cvData
}) => {

    // TODO! render and merge cvData with the article

    return (
        <ArticlePage ctx={ctx} article={article}>
            <h3>CVPAGE</h3>
            <pre>
                {JSON.stringify(cvData, null, 2)}            
            </pre>
        </ArticlePage>
    )
}