import Html from "@kitajs/html";
import { Article, Component } from "../types";

import { createSheet } from "./styles";
import { Show } from "../lib/components";

const { classes } = createSheet({
    footer: {
        fontSize: "medium",
        textAlign: "center",
        backgroundColor: "var(--footer-bg)",
        color: "var(--footer-fg)",
        overflow: "auto",
        marginTop: "1rem",
        padding: "1rem",
        "& a": {
            color: "var(--footer-accent)",
        },
        "& h3": {
            color: "var(--footer-fg)",
        },
    },
    content: {
        maxWidth: "var(--content-width)",
        margin: "0 auto",
    },
    title: {},
});

export const Footer: Component<{}> = ({
    ctx,
}) => {
    //@ts-ignore
    const { footer } = ctx.site;
    const year = new Date().getFullYear();
    return (
        <section class={classes.footer}>
            <div class={classes.content}>
                <Show when={footer.meta.titleLink}>
                    <h3>
                        <a href={footer.meta.titleLink}>{footer.meta.title}</a>
                    </h3>
                </Show>
                <Show when={!footer.meta.titleLink}>
                    <h3>{footer.meta.title}</h3>
                </Show>

                <div>{footer.meta.intro}</div>
                <div>{footer.body}</div>
                <small>© {year} {footer.meta.copyright}</small>
            </div>
        </section>
    );
};

export default Footer;
