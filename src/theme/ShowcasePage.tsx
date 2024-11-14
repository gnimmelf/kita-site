import Html from "@kitajs/html";
import { ArticleMeta, Component } from "../types";

import Layout from "./Layout";

import { createSheet } from "./styles";
import { BackLink } from "./BackLink";
import { MetaTags } from "./MetaTags";

const { classes } = createSheet({
    article: {
        "& > *": {
            margin: "0px",
            textAlign: "center",
        },
        "& > h2": {
            color: "var(--light-3)",
            fontSize: "1.5rem",
            margin: "1rem 0",
        },
        "& > h1": {
            fontSize: "1.7rem",
            margin: "1rem 0",
            textTransform: "capitalize",
        },
        maxWidth: "var(--content-width)",
        margin: "0 auto",
    },
    body: {
        textAlign: "unset",
        "& > *": {},
    },
});

export const ShowcasePage: Component<{
    article: ArticleMeta;
}> = async ({
    ctx,
    article,
}) => {
    const pageMetaTags = (
        <MetaTags
            ctx={ctx}
            title={article.meta.title}
            description={article.meta.intro}
        />
    );
    return (
        <Layout ctx={ctx} pageMetaTags={pageMetaTags}>
            <section class={classes.article}>
                <h2>~ Showcase ~</h2>
                <h1>{article.meta.title}</h1>

                <div class={classes.body}>
                    {article.body}
                </div>
                <BackLink noBorder />
            </section>
        </Layout>
    );
};

export default ShowcasePage;
