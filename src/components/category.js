import { html } from "lit-html";
import { iconArrow } from "./icons.js";

import catElectricImg from '../assets/images/categories/elektricke-naradie.webp';
import catGardenImg from '../assets/images/categories/zahrada-a-les.webp';
import catCleaningImg from '../assets/images/categories/cistenie.webp';
import catHandToolsImg from '../assets/images/categories/rucne-naradie.webp';
import catAccessoriesImg from '../assets/images/categories/prislusenstvo.webp';

const categoryImagesMap = {
    "elektricke-naradie": catElectricImg,
    "zahrada-a-les": catGardenImg,
    "cistenie-a-upratovanie": catCleaningImg,
    "rucne-naradie": catHandToolsImg,
    "prislusenstvo": catAccessoriesImg
};

export const renderCategory = (category) => {
    const finalImageUrl = categoryImagesMap[category.id] || category.imageUrl;

    return html`
    <div class="c-category">
        <div class="c-category__image" style="background-image: url('${finalImageUrl}')"></div>
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
`
};
