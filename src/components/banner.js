import { html } from "lit-html";
import { router } from "../router.js";
import { iconArrow } from "./icons.js";
import heroBannerImg from "../assets/images/hero-banner.webp";

const handleBannerClick = (link) => {
    if (!link) return;

    const newLink = link.replace("/products", "/solution");
    router.navigate(newLink);

    setTimeout(() => {
        const productsSection = document.querySelector('.c-solution-content');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
};

export const solutionBanner = (banner) => {
    if (!banner) return html``;

    const {
        title = "",
        description = "",
        ctaText = "Zistiť viac",
        link = "",
        imageUrl = "https://placehold.co/1920x600",
    } = banner;

    const handleLinkClick = (e) => {
        if (!link) {
            e.preventDefault();
            return;
        }
        handleBannerClick(link);
    };

    return html`
        <div class="c-solution-banner">
            <div
                class="c-solution-banner__image"
                style="background-image: url('${heroBannerImg || imageUrl}')"
            ></div>
            <div class="c-solution-banner__overlay"></div>
            <div class="c-solution-banner__content">
                ${title ? html`<h1 class="c-solution-banner__content__title">${title}</h1>` : ""}
                ${description
                    ? html`<div class="c-solution-banner__content__description">
                          ${description}
                      </div>`
                    : ""}
                ${ctaText
                    ? html`
                          <button
                              class="c-solution-banner__content__button ${!link
                                  ? "is-disabled"
                                  : ""}"
                              @click=${handleLinkClick}
                              ?disabled=${!link}
                              aria-label="${ctaText}"
                          >
                              <span class="sb-text">${ctaText}</span>
                              ${iconArrow({ class: "sb-icon" })}
                          </button>
                      `
                    : ""}
            </div>
        </div>
    `;
};
