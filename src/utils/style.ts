import { css } from "styled-components";

export function flexSpacing(spacing: number, direction: "row" | "column") {
    return css`
        & > * {
            ${direction === "row" ? `margin-left: ${spacing}px` : `margin-top: ${spacing}px`};
            ${direction === "row" ? `margin-right: ${spacing}px` : `margin-bottom: ${spacing}px`};
        }

        & > *:first-child {
            ${direction === "row" ? "margin-left" : "margin-top"}: 0px;
        }

        & > *:last-child {
            ${direction === "row" ? "margin-right" : "margin-bottom"}: 0px;
        }
    `;
}
