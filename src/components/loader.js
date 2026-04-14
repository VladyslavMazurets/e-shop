import { html } from "lit-html";
import { iconSpinner } from "./icons.js";

/**
 * Render loading component
 * @returns {TemplateResult} Loader template
 */
export const renderLoader = () => html`
    <div class="c-loader">
        <div class="c-loader__spinner">
            ${iconSpinner({ class: "c-loader__icon" })}
        </div>
        <span class="c-loader__text">Loading...</span>
    </div>
`;
