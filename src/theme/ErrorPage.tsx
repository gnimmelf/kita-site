import Html from "@kitajs/html";
import { Component } from "../types";

import Layout from "./Layout";
import BackLink from "./BackLink";
import { createSheet } from "./styles";
import MetaTags from "./MetaTags";

const { classes } = createSheet({
    center: {
        textAlign: "center",
    },
});

export const ErrorPage: Component<{
    error: Error;
}> = async ({
    ctx,
    error,
}) => {
    const pageMetaTags = (
        <MetaTags
            ctx={ctx}
            title={`Error - ${ctx?.set.status}`}
            description={`Ops! An error occured`}
        />
    );
    return (
        <Layout ctx={ctx} pageMetaTags={pageMetaTags}>
            <div class={classes.center}>
                <p>
                    {error.name}
                </p>
                <p>
                    {error.message}
                </p>

                <BackLink />
            </div>
        </Layout>
    );
};

export default ErrorPage;
