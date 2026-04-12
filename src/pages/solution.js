import { html } from "lit-html";
import { loadData } from "../dataLoader.js";
import { solutionBanner } from "../components/banner.js";
import { solutionCta } from "../components/cta.js";
import { renderProduct } from "../components/product.js";
import { renderCategory } from "../components/category.js";
import { renderModal } from "../components/modal.js";

/**
 * Solution Page
 */

// Main page template
export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

    return html`
        <div class="l-solution">
            <div class="l-solution__banner">
                <div class="l-container">${data.banner ? solutionBanner(data.banner) : html``}</div>
            </div>

            <div class="l-solution__content">
                <div class="l-container is-shorter">
                    <div class="c-solution-content">
                        ${data.ctaBanner
                            ? html`<div class="c-solution-content__cta">
                                  ${solutionCta(data.ctaBanner)}
                              </div>`
                            : ""}
                        ${[...data.products, ...data.products].map((product) =>
                            renderProduct(product)
                        )}
                    </div>
                </div>
            </div>

            <div class="l-solution__categories">
                <div class="l-container">
                    <h2 class="c-categories-title">Top kategórie produktov</h2>
                    <div class="c-solution-categories">
                        ${data.categories.map((cat) => renderCategory(cat))}
                    </div>
                </div>
            </div>

            ${renderModal()}
        </div>
    `;
};

/**
 * Load data and render the solution page
 */
export const loadAndRenderSolutionPage = async () => {
    try {
        const data = await loadData();
        return renderSolutionPage(data);
    } catch (error) {
        return html`<div class="l-solution">Error loading data: ${error.message}</div>`;
    }
};
