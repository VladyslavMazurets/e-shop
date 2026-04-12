import { html } from "lit-html";
import { iconArrow } from "./icons.js";
import { handleCtaClick } from "./modal.js";
import secretOfferImg from "../assets/images/secret-offer.webp";

export const solutionCta = (ctaBanner) => html`
    <div class="c-solution-cta">
        <div
            class="c-solution-cta__image"
            style="background-image: url('${secretOfferImg || ctaBanner.imageUrl}')"
        ></div>

        <div class="c-solution-cta__overlay"></div>

        <div class="c-solution-cta__content">
            <h2 class="c-solution-cta__content__title">${ctaBanner.title}</h2>

            <div class="c-solution-cta__content__description">${ctaBanner.description}</div>

            <button
                class="c-solution-cta__content__button"
                @click=${() => handleCtaClick()}
                aria-label="${ctaBanner.ctaText}"
            >
                <span class="sc-text">${ctaBanner.ctaText}</span>
                ${iconArrow({ class: "sc-icon" })}
            </button>
        </div>
    </div>
`;
