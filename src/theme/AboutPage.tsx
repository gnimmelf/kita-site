/**
 * Copy data from:
 *      https://app.quadim.ai/api/profile/public/json/2d4ab391-2a4c-4d5c-ab18-6fbc4227a0dd/
 * To:
 *      https://github.com/gnimmelf/intergate-io-cms/edit/main/quadim-profile.json
 */
import Html from "@kitajs/html";

import { format, parse } from "date-fns";

import { Article, Component, Datafile } from "../types";

import CardSection from "./CardSection";
import Layout from "./Layout";
import { classes as articlePageClasses } from "./ArticlePage";
import AccordionArticleBody, {
    classes as accordionClasses,
} from "./AccordionArticleBody";
import BackLink from "./BackLink";
import { createSheet } from "./styles";
import MetaTags from "./MetaTags";

const { classes } = createSheet({
    content: {
        textAlign: "center",
        padding: "0px",
        "& h3": {
            display: "inline-block",
            borderBottom: "1px dashed",
            borderBottomWidth: "1px",
            borderBottomColor: "currentColor",
            paddingBottom: "3px",
            borderImage: `repeating-linear-gradient(
                to right,
                currentColor 0,
                currentColor 8px,
                transparent 8px,
                transparent 12px
            ) 1`,
        },
    },
    accordionContent: {
        padding: "0 15px",
    },
});

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

interface Employment extends DateRange {
    company: string;
    title: string;
    description: string;
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

interface EmploymentProps extends TitleProps {
    employments: Employment[];
}

interface ExpertiseProps extends TitleProps {
    expertises: Expertise[];
}

interface ExperienceProps extends TitleProps {
    experiences: Experience[];
    skills: Skill[];
}

interface SkillPillProps {
    skill: Skill;
}

interface PersonalInfoProps {
    data: Pick<
        CVData,
        | "name"
        | "description"
        | "birthdate"
        | "address"
        | "city"
        | "mail"
        | "image"
        | "phone"
    >;
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

const filterExperienceSkills = (experienceId: string, skills: Skill[]) => {
    const filtered = skills
        .filter((skill: Skill) => {
            return skill.readOnlyCompactExperienceList
                .some((exp: Experience) => exp.id === experienceId);
        })
        .sort((a, b) => b.skillLevel - a.skillLevel);
    return filtered;
};

const formatYearMonth = (year: number, month: number) => {
    return year ? format(new Date(year, month - 1), "MMM yyyy") : "Ongoing";
};

/**
 * Components
 */

const PersonalInfo: Component<PersonalInfoProps> = ({ data }) => (
    <section style={{ padding: "10px" }}>
        <div>
            {
                /* <img
                src={data.image}
                alt={data.name}
            /> */
            }
        </div>
        <div>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <div>
                <p>Email: {data.mail}</p>
                <p>
                    Birth Date:{" "}
                    {format(
                        parse(data.birthdate, "dd/MM/yyyy", new Date()),
                        "MMMM do, yyyy",
                    )}
                </p>
            </div>
        </div>
    </section>
);

const Educations: Component<EducationProps> = ({ title, educations }) => (
    <CollapsSection title={title}>
        {[...educations].sort(sortByDate).map((edu) => (
            <div>
                <h3>{edu.school}</h3>
                <p>
                    {formatYearMonth(edu.fromyear, edu.frommonth)}
                    {" - "}
                    {formatYearMonth(edu.toyear, edu.tomonth)}
                </p>
                <p>{edu.description}</p>
                <p>
                    {edu.degree ? `${edu.degree}` : "Degree"} in{" "}
                    {edu.fieldOfStudy}
                </p>
            </div>
        ))}
    </CollapsSection>
);

const Employments: Component<EmploymentProps> = ({ title, employments }) => (
    <CollapsSection title={title}>
        {[...employments].sort(sortByDate).map((emp) => (
            <div>
                <h3>{emp.company}</h3>
                <p>
                    {emp.title}
                    {", "}
                    {formatYearMonth(emp.fromyear, emp.frommonth)}
                    {" - "}
                    {formatYearMonth(emp.toyear, emp.tomonth)}
                </p>
                <p>{emp.description}</p>
            </div>
        ))}
    </CollapsSection>
);

const SkillPill: Component<SkillPillProps> = ({ skill }) => (
    <span
        style={{
            textTransform: "capitalize",
            fontStyle: "italic",
        }}
    >
        {skill.name}
    </span>
);

const Experiences: Component<ExperienceProps> = (
    { title, experiences, skills },
) => (
    <CollapsSection title={title}>
        {[...experiences].sort(sortByDate).map((exp) => (
            <div>
                <h3>{exp.title}</h3>
                <p>
                    {exp.company}
                    {", "}
                    {formatYearMonth(exp.fromyear, exp.frommonth)}
                    {" - "}
                    {formatYearMonth(exp.toyear, exp.tomonth)}
                </p>
                <p>{exp.description}</p>
                <p>
                    {filterExperienceSkills(exp.id, skills).map((skill) => (
                        <SkillPill skill={skill} />
                    )).join(" / ")}
                </p>
            </div>
        ))}
    </CollapsSection>
);

const CollapsSection: Component<{ title: string }> = ({ title, children }) => (
    <section x-data="{ expanded: false }" class={accordionClasses.accordion}>
        <h2 x-on:click="expanded = ! expanded">{title}</h2>
        <div
            x-on:click="expanded = ! expanded"
            x-bind:class="expanded ? 'expanded' : 'collapsed'"
            class="state-icon"
        >
            ﹀
        </div>
        <div x-show="expanded" x-collapse class={classes.accordionContent}>
            {children}
        </div>
    </section>
);

export const AboutPage: Component<{
    article: Article;
    cvData: Datafile & {
        data: CVData;
    };
}> = async ({
    ctx,
    article,
    cvData,
}) => {
    const headTags = [
        '<script src="//unpkg.com/@alpinejs/collapse"></script>',
        '<script src="//unpkg.com/alpinejs" defer></script>',
    ];
    const pageMetaTags = (
        <MetaTags
            ctx={ctx}
            title={article.meta.title}
            description={article.meta.intro}
        />
    );
    const { data } = cvData;
    return (
        <Layout ctx={ctx} pageMetaTags={pageMetaTags} headTags={headTags}>
            <CardSection class={articlePageClasses.article}>
                <h1 class={articlePageClasses.title}>{article.meta.title}</h1>

                <div class={classes.content}>
                    <h2>CV - {data.name}</h2>

                    <PersonalInfo data={data} />

                    <AccordionArticleBody article={article} />

                    <Experiences
                        title="Highlighted Experiences"
                        experiences={data.experiences}
                        skills={data.skills}
                    />

                    <Employments
                        title="Employments"
                        employments={data.employers}
                    />

                    <Educations
                        title="Education"
                        educations={data.educations}
                    />

                    <BackLink />
                </div>
            </CardSection>
        </Layout>
    );
};

export default AboutPage;
