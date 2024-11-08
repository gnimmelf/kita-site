import Html from "@kitajs/html";
import * as cheerio from "cheerio";
import { Component } from "../types";

/**
 * See:
 *  - https://css-tricks.com/svg-properties-and-css/
 */

/**
 * Static Svg-filters defintions.
 * NOTE! Do not create filters here that:
 *      - Are more easily implemented in css
 *      - Relies on css-custom-properties (this is a pickle not yet solved adequatly)
 * For these, use css-filter-function-equivalent instead
 *
 * @returns Component
 */
export const SvgFilters: Component = () => {
    return (
        <svg
            style={{
                position: "absolute",
                height: "0px",
            }}
        >
            <defs>
                <filter id="noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="1"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                </filter>

                <filter id="distort">
                    <feTurbulence
                        baseFrequency="0.01 0.01"
                        numOctaves="1"
                        result="RES_A"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="RES_A"
                        scale="10"
                        xChannelSelector="R"
                        yChannelSelector="R"
                    />
                </filter>
            </defs>
        </svg>
    );
};

export const SvgRect: Component<{ filterId?: string }> = ({ filterId }) => {
    return (
        <rect
            width="100%"
            height="100%"
            filter={filterId ? `url(#${filterId})` : ""}
        />
    );
};

/**
 * Create an Svg component based on an svg-file-path.
 * For `filterId`, see:
 *  - https://benfrain.com/applying-multiple-svg-filter-effects-defined-in-css-or-html/
 *  - https://w3cplus.medium.com/in-depth-exploration-of-svg-techniques-and-advanced-techniques-f2d183a44b2b
 * @param file string filepath relative to `package.json`
 * @param filterId string reference to a svg-filter tag
 * @returns
 */
export const SvgFile: Component<{ file: string; filterId?: string }> = async (
    { file, filterId, children },
) => {
    const bunFile = Bun.file(file);
    const xml = await bunFile.text();
    const $ = cheerio.load(xml, {}, false);

    const viewBox = $("svg").attr("viewBox");

    const $svg = $(
        `<svg viewbox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`,
    );

    const defs = children?.toString();

    // Add
    $svg.append(`<defs>${defs || ""}</defs>`);

    $svg.append($("g").attr("filter", filterId ? `url(#${filterId})` : ""));

    return $svg.toString();
};
