import { html } from "lit-html";
import { iconArrow } from "./icons.js";

export const renderCategory = (category) => html`
    <div class="c-category">
        <div class="c-category__image" style="background-image: url('${category.imageUrl}')"></div>
        <div class="c-category__overlay"></div>
        <div class="c-category__content">
            <div class="c-category__content__header">
                <h3>${category.name}</h3>
                <span class="c-category__count">${category.productCount}</span>
            </div>
            <ul>
                ${(category.subcategories || []).map(sub => html`<li><a href="${sub.link}" class="c-category__sub-link">${sub.name}</a></li>`)}
            </ul>
            <a href="${category.link}" class="c-category__link">
                ${category.ctaText}
                ${iconArrow()}
            </a>
        </div>
    </div>
`;
