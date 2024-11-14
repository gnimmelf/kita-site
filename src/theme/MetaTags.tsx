import Html from "@kitajs/html";
import { ArticleMeta, Component } from "../types";

export const MetaTags: Component<{
    title?: string;
    description?: string;
    image?: string;
}> = async({
    ctx,
    title,
    description,
    image
}) => {
    const siteMeta = ctx?.site?.header?.meta;

    const pageTitle = `${title ? `${title} - ` : ""}${
        siteMeta?.title || "Kita-site"
    }`;
    const pageDescription = description || siteMeta?.opengraph?.description || siteMeta?.intro || ""
    const pageImage = image || siteMeta?.opengraph?.image || '/public/logo.svg'
    return (
        <>
            {/* Meta */}
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            {/* Opengraph */}
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            <meta property="og:site_name" content={siteMeta?.opengraph?.site_name || ''} />
            <meta property="og:author" content={siteMeta?.opengraph?.author || ''} />
        </>
    );
};

export default MetaTags
