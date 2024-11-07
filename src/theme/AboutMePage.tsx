/**
 * Copy data from:
 *      https://app.quadim.ai/api/profile/public/json/2d4ab391-2a4c-4d5c-ab18-6fbc4227a0dd/
 * To:
 *      https://github.com/gnimmelf/intergate-io-cms/edit/main/quadim-profile.json
 */
import Html from '@kitajs/html'

import jsonpath from 'jsonpath'
import { format } from 'date-fns';

import {
    Component,
    Article,
    Datafile,
} from '../types'

import ArticlePage from './ArticlePage'

interface DateRange {
    frommonth: number;
    tomonth: number;
    fromyear: number;
    toyear: number;
}

interface Experience extends DateRange {
    description: string;
    title: string;
    id: string;
    company: string;
}

interface Skill {
    name: string;
    skillLevel: number;
    readOnlyCompactExperienceList: Experience[];
    skillExperienceMonths: number;
}

interface Education extends DateRange {
    fieldOfStudy: string;
    degree: string;
    description: string;
    school: string;
}

interface Expertise {
    title: string;
    skills: Skill[];
}

interface CVData {
    name: string;
    description: string;
    birthdate: string;
    address: string;
    city: string;
    mail: string;
    image: string;
    phone: string;
    educations: Education[];
    expertises: Expertise[];
    experiences: Experience[];
    employers: Experience[];
    skills: Skill[];
}

// Component Props Types
interface TitleProps {
    title: string;
}

interface EducationProps extends TitleProps {
    educations: Education[];
}

interface ExpertiseProps extends TitleProps {
    expertises: Expertise[]
    experiences: Experience[]
    skills: Skill[]

}

interface ExperienceProps extends TitleProps {
    expertises: Expertise[]
    experiences: Experience[]
    skills: Skill[]
}

interface SkillsUsageProps extends TitleProps {
    usageId: string
    skills: Skill[];
}

interface PersonalInfoProps {
    data: Pick<CVData, 'name' | 'description' | 'birthdate' | 'address' | 'city' | 'mail' | 'image' | 'phone'>;
}

interface CVPageProps {
    data: CVData;
}

// Sorting function for date fields
const sortByDate = (a: DateRange, b: DateRange): number => {
    if (a.fromyear !== b.fromyear) {
        return b.fromyear - a.fromyear;
    }
    return b.frommonth - a.frommonth;
};


const PersonalInfo: Component<PersonalInfoProps> = ({ data }) => (
    <section>
        <div>
            {/* <img
                src={data.image}
                alt={data.name}
            /> */}
        </div>
        <div>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <div>
                <p>Address: {data.address}, {data.city}</p>
                <p>Email: {data.mail}</p>
                <p>Phone: {data.phone}</p>
                <p>Birth Date: {format(new Date(data.birthdate), 'MMMM do, yyyy')}</p>
            </div>
        </div>
    </section>
);

const Education: Component<EducationProps> = ({ title, educations }) => (
    <section>
        <h2>{title}</h2>
        <div>
            {[...educations].sort(sortByDate).map((edu, index) => (
                <div>
                    <h3>{edu.school}</h3>
                    <p>
                        {format(new Date(edu.fromyear, edu.frommonth - 1), 'MMM yyyy')}
                        {' - '}
                        {format(new Date(edu.toyear, edu.tomonth - 1), 'MMM yyyy')}
                    </p>
                    <p>{edu.description}</p>
                    <p>{edu.degree ? `${edu.degree}` : 'Degree'} in {edu.fieldOfStudy}</p>
                </div>
            ))}
        </div>
    </section>
)

const Experience: Component<ExperienceProps> = ({ title, experiences }) => (
    <section>
        <h2>{title}</h2>
        <div>
            {[...experiences].sort(sortByDate).map((exp) => (
                <div>
                    <h3>{exp.title}</h3>
                    <p>{exp.company}</p>
                    <p>
                        {format(new Date(exp.fromyear, exp.frommonth - 1), 'MMM yyyy')} -
                        {format(new Date(exp.toyear, exp.tomonth - 1), 'MMM yyyy')}
                    </p>
                    <p>{exp.description}</p>
                    <p>{exp.id}</p>
                </div>
            ))}
        </div>
    </section>
);

const Expertise: Component<ExpertiseProps> = ({ title, expertises, experiences, skills }) => (
    <section>
        <h2>{title}</h2>
        {expertises.map((expertise) => (
            <div>
                <h3>{expertise.title}</h3>
                <div>
                    <Skills
                        title="Skills & Technologies"
                        skills={expertise.skills}
                    />
                </div>
            </div>
        ))}
    </section>
);

const SkillsUsage: Component<SkillsUsageProps> = ({ id, title, skills }) => {
    const sortedSkills = [...skills].sort((a, b) => b.skillExperienceMonths - a.skillExperienceMonths)


    return (
        <section>
            <h2>{title}</h2>
            <div>
                {sortedSkills.map((skill, index) => (
                    <div>
                        <div>
                            <h3>{skill.name}</h3>
                            <div>Level: {skill.skillLevel}/100</div>
                        </div>
                        <div>
                            Experience: {Math.floor(skill.skillExperienceMonths / 12)} years,
                            {skill.skillExperienceMonths % 12} months
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


function resolveParents(data, paths) {
    return paths.map(path => {
        // Remove the last element in the path to get the parent path
        const parentPath = path.slice(1, -1);
        console.log({ path, parentPath })

        // Traverse the data structure, handling both objects and arrays
        let lastNonArrayParent = data;

        const result = parentPath.reduce((acc, key) => {
            if (acc && typeof acc === 'object') {
                const nextAcc = acc[isNaN(key) ? key : Number(key)];
                
                // Update lastNonArrayParent only if nextAcc is not an array
                if (!Array.isArray(nextAcc)) {
                    lastNonArrayParent = nextAcc;
                }
                
                return nextAcc;
            }
            return undefined;
        }, data);

        return Array.isArray(result) ? lastNonArrayParent : result;
    })
}

const AboutMePage: Component<{
    article: Article,
    cvData: Datafile & {
        data: CVData
    }
}> = async ({
    ctx,
    article,
    cvData
}) => {
        const { data } = cvData

        const id = 'de934608-4bf8-4ad4-b483-d294157370e3'
        const paths = jsonpath.paths(data, `$..expertises..[?(@.id=="${id}")]`)

        const res = resolveParents(data, paths, 3)

        return (
            <pre>
                {JSON.stringify(res, null, 2)}
            </pre>
        )

        return (
            <>
                {/* <ArticlePage ctx={ctx} article={article}> */}
                <h2>CV - {data.name}</h2>

                <PersonalInfo data={data} />

                <Experience
                    title="Professional Experience"
                    experiences={data.experiences}
                    skills={data.skills}
                />

                {/* <Expertise
                        title="Areas of Expertise"
                        expertises={data.expertises}                        
                    /> */}

                {/* <Education
                        title="Education"
                        educations={data.educations}
                    /> */}

                {/* </ArticlePage> */}
            </>
        )
    }

export default AboutMePage