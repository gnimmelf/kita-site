import Html from "@kitajs/html";
import { Article, Component, Context, TeaserLinkTypes } from "../types.d";

import CardSection from "./CardSection";

import { createSheet } from "./styles";
import { parseArticleMetaLink } from "../lib/utils";
import { MdiCog, MdiExternalLink } from "./Icons";

const { classes } = createSheet({
    card: {
        '&:hover': {
            filter: "var(--drop-shadow-filter-accent)",
        }
    },
    teaser: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 10px 10px",
        height: '100%',
        color: "var(--card-fg)",
        '&:hover': {
            color: "var(--card-fg)"
        }
    },
    title: {
        textTransform: "capitalize",
    },
    intro: {
        // Push link down to bottom of teaser card
        flexGrow: "1",
    },
    link: {
        display: "inline-flex",
        justifyContent: "end",
        paddingTop: "1rem",
        color: "var(--accent-2)",
        '&:hover': {
            color: "var(--accent-1)"
        }

    },
    vAlign: {
        display: "flex",
        alignItems: "center",
    }
});

export const Teaser: Component<{
    article: Article;
    ctx: Context;
}> = ({
    article,
    ctx,
}) => {
    const linkData = parseArticleMetaLink(article, ctx);
    const LinkIcon = ({
        [TeaserLinkTypes.External]: <MdiExternalLink />,
        [TeaserLinkTypes.Showcase]: <MdiCog />,
        [TeaserLinkTypes.ReadMore]: "",
    })[linkData.type];
    const target = linkData.isExternal ? "_blank" : "";
    const href = linkData.url.href;

    return (
        <CardSection
            data-id={article.id}
            data-weight={article.meta.weight}
            class={classes.card}
        >
            <a href={href} target={target} class={classes.teaser}>
                <h2 class={classes.title}>{article.meta.title}</h2>
                <div class={classes.intro}>{article.meta.intro}</div>
                <div class={classes.link}>
                    <span class={classes.vAlign}>
                        <span>{linkData.name}</span>
                        {LinkIcon}
                    </span>
                </div>
            </a>
        </CardSection>
    );
};

export default Teaser;
