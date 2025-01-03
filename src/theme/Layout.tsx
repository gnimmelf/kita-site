import Html from "@kitajs/html";
import { Component, PageMeta } from "../types";

import { SvgFilters } from "./Svg";

import Header from "./Header";
import Footer from "./Footer";

import { createSheet } from "./styles";

export const { classes } = createSheet({
    body: {
        backgroundColor: "var(--body-bg)",
        color: "var(--body-fg)",
        margin: "0px",
        padding: "0px",
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    main: {
        flexGrow: "1",
        margin: "1rem 0px",
        padding: "10px",
    },
});

export const Layout: Component<{
    pageMetaTags: JSX.Element,
    headTags?: string[];
    endTags?: string[];
    isIndexPage?: boolean;
}> = ({
    ctx,
    children,
    pageMetaTags,
    isIndexPage = false,
    headTags = [],
    endTags = [],
}) => {
    return (
        <>
            {"<!doctype html>"}
            <html lang="en">
                <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <meta http-equiv="Pragma" content="no-cache" />
                    <meta http-equiv="Expires" content="0" />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href="/public/globals.css"
                    />
                    <link rel="stylesheet" type="text/css" href="/styles.css" />
                    {pageMetaTags}
                    {headTags.join("\n")}
                </head>
                <body class={classes.body}>
                    <SvgFilters />
                    <Header
                        ctx={ctx}
                        isIndexPage={isIndexPage}
                    />
                    <main class={classes.main}>{children}</main>
                    <Footer ctx={ctx} />
                    {endTags.join("\n")}
                </body>
            </html>
        </>
    );
};

export default Layout;
