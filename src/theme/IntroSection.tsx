import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

const IntroSection: Component<{
    article: Article
}> = ({
    article
}) => {
        return (
            <>
                <h1>{article.meta.title}</h1>
                <section class={'intro'}>
                    <div>{article.meta.intro}</div>
                    <div>{article.body}</div>
                </section>
            </>
        )
    }

    export default IntroSection