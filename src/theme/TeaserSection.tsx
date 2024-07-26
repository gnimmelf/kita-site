import Html from '@kitajs/html'
import {
    Component,
    Article,
} from '../types'

const TeaserSection: Component<{
    article: Article
}> = ({
    article
}) => {
        return (
            <section class={'section'}>
                <h2>{article.meta.title}</h2>
                <div>{article.meta.intro}</div>
                <div><a href={`/${article.id}`}>Les mer</a></div>
            </section>
        )
    }

export default TeaserSection
