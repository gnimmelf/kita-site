import Html from "@kitajs/html";
import { Article, Articles, Component } from "../types";

import Layout from "./Layout";
import Teaser from "./Teaser";

import { createSheet } from "./styles";
import MetaTags from "./MetaTags";

const { classes } = createSheet({
    flex: {
        maxWidth: "var(--content-width)",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        gap: "3rem",
        justifyContent: "center",
        "& > *": {
            boxSizing: "border-box",
            width: "100%",
        },
        "@media (min-width: 860px)": {
            "& > *": {
                width: "calc((100% / 2) - 1.5rem)",
            },
        },
    },
});

export const IndexPage: Component<{
    articles: Articles;
}> = async ({
    ctx,
    articles,
}) => {
    articles.sort((a: Article, b: Article) => a.meta.weight > b.meta.weight);

    const pageMetaTags = <MetaTags ctx={ctx} />;

    const headTags = [
        '<script src="//unpkg.com/@alpinejs/collapse"></script>',
        '<script src="//unpkg.com/alpinejs" defer></script>',
        "",
    ];
    return (
        <Layout
            ctx={ctx}
            isIndexPage={true}
            headTags={headTags}
            pageMetaTags={pageMetaTags}
        >
            <div class={classes.flex}>
                {articles.map((article: Article) => (
                    <Teaser ctx={ctx} article={article} />
                ))}
            </div>
        </Layout>
    );
};

export default IndexPage;
