/**
 * Copy data from:
 *      https://app.quadim.ai/api/profile/public/json/2d4ab391-2a4c-4d5c-ab18-6fbc4227a0dd/
 * To:
 *      https://github.com/gnimmelf/intergate-io-cms/edit/main/quadim-profile.json
 */
import Html from '@kitajs/html'
import {
    Component,
    Article,
    Datafile,
} from '../types'

import ArticlePage from './ArticlePage'

type Education = {
    fieldOfStudy: string
    degree: string
    description: string
    school: string,
    frommonth: number
    tomonth: number
    fromyear: number
    toyear: number
    // Added later
    from?: string
    to?:string
}

type Expertises = {

}

const SectionEducations: Component<{
    title: string
    data: Education[]
}> = async ({
    title,
    data
}) => {
        data.forEach((e: Education) => {
            e.from = `${e.fromyear}.${e.frommonth.toString().padStart(2, '0')}`
            e.to = `${e.toyear}.${e.tomonth.toString().padStart(2, '0')}`
        })
        data.sort((e1: Education, e2: Education) => e2.fromyear+e2.frommonth > e1.toyear+e1.tomonth)
        return (
            <section>
                <h3>{title}</h3>
                {data.map((e: Education) => {
                    return (
                        <>
                            <h4>{e.from} - {e.to} - {e.school}</h4>
                            <div>{e.fieldOfStudy}</div>
                            <div>{e.degree}</div>
                            <p>{e.description}</p>
                        </>
                    )
                })}
            </section>
        )
    }

    const SectionExperiences: Component<{
        title: string
        data: Education[]
    }> = async ({
        title,
        data
    }) => {
            data.forEach((e: Education) => {
                e.from = `${e.fromyear}.${e.frommonth.toString().padStart(2, '0')}`
                e.to = `${e.toyear}.${e.tomonth.toString().padStart(2, '0')}`
            })
            data.sort((e1: Education, e2: Education) => e2.fromyear+e2.frommonth > e1.toyear+e1.tomonth)
            return (
                <section>
                    <h3>{title}</h3>
                    {data.map((e: Education) => {
                        return (
                            <>
                                <h4>{e.from} - {e.to} - {e.school}</h4>
                                <div>{e.fieldOfStudy}</div>
                                <div>{e.degree}</div>
                                <p>{e.description}</p>
                            </>
                        )
                    })}
                </section>
            )
        }

const AboutMePage: Component<{
    article: Article,
    cvData: Datafile | {
        educations: Education[]
        experiences: Experience[]
    }
}> = async ({
    ctx,
    article,
    cvData
}) => {
        const { data } = cvData       
        return (
            <ArticlePage ctx={ctx} article={article}>
                <h2>CV - {data.name}</h2>
                <SectionExperiences title={'Education'} data={data.experiences} /> 
                <SectionEducations title={'Education'} data={data.educations} />
                <pre>
                    {JSON.stringify(cvData, null, 2)}
                </pre>
            </ArticlePage>
        )
    }

export default AboutMePage