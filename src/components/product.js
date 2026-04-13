import { html } from "lit-html";
import { router } from "../router.js";
import { showToast } from "./toast.js";
import { iconStar, iconScale, iconHeart, iconMinus, iconPlus, iconCart } from "./icons.js";
import dewaltImg from "../assets/images/products/dewalt-pro-700.webp";
import metaboImg from "../assets/images/products/metabo-600.webp";

const productImagesMap = {
    1: dewaltImg,
    2: metaboImg,
};

const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(iconStar({ filled: i < rating }));
    }
    return stars;
};

const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const container = e.target.closest(".c-product__actions");
    const qtyEl = container.querySelector(".c-quantity");
    const qtyValueDisplay = qtyEl.querySelector(".c-quantity__value");
    const qty = parseInt(qtyEl.dataset.qty, 10);

    if (qty > 10) {
        showToast("Upozornenie: Pridali ste viac ako maximálne množstvo 10 ks.", "warning");
    } else {
        showToast(`Úspech: ${qty} x ${product.name} bolo pridaných do košíka.`, "success");

        // Reset quantity after success
        qtyEl.dataset.qty = "1";
        if (qtyValueDisplay) {
            qtyValueDisplay.textContent = "1";
        }
    }
};

const handleQtyChange = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const qtyEl = e.target.closest(".c-quantity");
    let val = parseInt(qtyEl.dataset.qty, 10) + delta;
    
    if (val < 1) val = 1;
    
    // Block at 10 and show warning
    if (val > 10) {
        showToast("Upozornenie: Pridali ste viac ako maximálne množstvo 10 ks.", "warning");
        val = 10;
    }
    
    qtyEl.dataset.qty = val;
    qtyEl.querySelector(".c-quantity__value").textContent = val;
};

const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest("button").classList.toggle("is-active");
};

export const renderProduct = (product) => {
    const finalImageUrl = productImagesMap[product.id] || product.imageUrl;

    return html`
        <a href="${product.link}" class="c-product">
            <div class="c-product__header">
                <div class="c-product-badges">
                    ${product.badges
                        ? product.badges.map(
                              (badge) =>
                                  html`<span
                                      class="c-product-badges__badge c-product-badges__badge--${badge.type}"
                                  >
                                      ${badge.label}</span
                                  >`
                          )
                        : ""}
                </div>
                <div class="c-product__compare">
                    <button title="Porovnať" @click=${handleActionClick} aria-label="Porovnať">
                        ${iconScale()}
                    </button>
                    <button title="Obľúbené" @click=${handleActionClick} aria-label="Obľúbené">
                        ${iconHeart()}
                    </button>
                </div>
            </div>

            <div class="c-product__image-wrap">
                <img src="${finalImageUrl}" alt="${product.name}" />
            </div>

            <div class="c-product__body">
                <div class="c-product__rating">
                    <div class="c-stars">${renderStars(product.rating)}</div>
                    <span class="c-review-count">(${product.reviewCount})</span>
                </div>
                <h3 class="c-product__title">${product.name}</h3>
                <p class="c-product__sku">${product.sku}</p>

                <div class="c-product__price">
                    <div class="c-product__price__original">
                        ${product.originalPrice
                            ? product.originalPrice.toFixed(2) + " " + product.currency
                            : ""}
                    </div>
                    <div class="c-product__price__sale">
                        ${product.salePrice.toFixed(2).replace(".", ",")} ${product.currency}
                    </div>
                    <div class="c-product__price__novat">
                        ${product.priceWithoutVAT.toFixed(2).replace(".", ",")} ${product.currency}
                        bez DPH
                    </div>
                </div>

                <div class="c-product__stock">${product.stock}</div>

                <div class="c-product__actions">
                    <div class="c-quantity" data-qty="1">
                        <button
                            @click=${(e) => handleQtyChange(e, -1)}
                            aria-label="Znížiť množstvo"
                        >
                            ${iconMinus()}
                        </button>
                        <span class="c-quantity__value">1</span>
                        <button @click=${(e) => handleQtyChange(e, 1)} aria-label="Zvýšiť množstvo">
                            ${iconPlus()}
                        </button>
                    </div>
                    <button
                        class="c-add-cart"
                        @click=${(e) => handleAddToCart(e, product)}
                        aria-label="Pridať do košíka"
                    >
                        ${iconCart()} Do košíka
                    </button>
                </div>
            </div>
        </a>
    `;
};
