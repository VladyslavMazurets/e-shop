import { html } from "lit-html";
import { router } from "../router.js";
import { loadData } from "../dataLoader.js";
import { validateEmail } from "../api/emailApi.js";
import { iconArrow, iconStar, iconPlus, iconSmallArrow, iconScale, iconHeart, iconMinus, iconCart, iconClose, iconChevronDown } from "../components/icons.js";
import { showToast } from "../components/toast.js";


import heroBannerImg from '../assets/images/hero-banner.webp';
import secretOfferImg from '../assets/images/secret-offer.webp';
import dewaltImg from '../assets/images/products/dewalt-pro-700.webp';
import metaboImg from '../assets/images/products/metabo-600.webp';

/**
 * Solution Page
 */

const productImagesMap = {
    "1": dewaltImg,
    "2": metaboImg
};

// CTA button click handler
const handleCtaClick = () => {
    const modal = document.querySelector("#modal");
    if (modal) {
        modal.showModal();
        document.body.style.overflow = "hidden";
        document.addEventListener("click", handleDropdownOutsideClick);
    }
};

const handleCloseModal = () => {
    const modal = document.querySelector("#modal");
    if (modal) {
        modal.close();
        document.body.style.overflow = "";
        document.removeEventListener("click", handleDropdownOutsideClick);
        // Reset form
        const form = modal.querySelector("form");
        if (form) form.reset();
        const msg = modal.querySelector(".c-modal__message");
        if (msg) {
            msg.className = "c-modal__message";
            msg.innerText = "";
        }
        // Reset dropdown
        const dropdown = modal.querySelector(".c-modal__dropdown");
        if (dropdown) {
            dropdown.classList.remove("is-open");
            const trigger = dropdown.querySelector(".c-modal__dropdown-trigger");
            if (trigger) trigger.classList.remove("has-value");
            const hiddenInput = dropdown.querySelector("input");
            if (hiddenInput) hiddenInput.value = "";
            const triggerLabel = dropdown.querySelector(".c-modal__dropdown-trigger span");
            if (triggerLabel) triggerLabel.textContent = "Vyberte možnosť";
        }
    }
};

// Close modal when clicking outside (on backdrop)
const handleModalClick = (e) => {
    const modal = e.target;
    // If click is directly on the dialog (backdrop), close it
    if (modal.id === "modal") {
        handleCloseModal();
    }
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const discoverySource = form.querySelector('input[name="discoverySource"]').value;
    const msg = form.querySelector(".c-modal__message");
    const submitBtn = form.querySelector("button[type='submit']");

    // Simple validation
    if (!email || !name || !phone || !discoverySource) {
        msg.innerText = "Prosím vyplňte všetky povinné polia.";
        msg.className = "c-modal__message is-visible is-error";
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        msg.innerText = "Neplatný formát e-mailu.";
        msg.className = "c-modal__message is-visible is-error";
        return;
    }

    submitBtn.disabled = true;
    msg.innerText = "Overujem...";
    msg.className = "c-modal__message is-visible";

    try {
        const result = await validateEmail(email);
        if (result.success) {
            msg.innerText = "Úspech: Vaša tajná ponuka bola odoslaná!";
            msg.className = "c-modal__message is-visible is-success";
            setTimeout(() => {
                handleCloseModal();
            }, 3000);
        } else {
            msg.innerText = result.message || "Nepodarilo sa overiť e-mail.";
            msg.className = "c-modal__message is-visible is-error";
        }
    } catch (error) {
        msg.innerText = "Vyskytla sa chyba pri overovaní.";
        msg.className = "c-modal__message is-visible is-error";
    } finally {
        submitBtn.disabled = false;
    }
};

const renderModal = () => html`
    <dialog id="modal" class="c-modal" @click=${handleModalClick}>
        <div class="c-modal__content">
            <button class="c-modal__close" @click=${handleCloseModal} aria-label="Zatvoriť">
                ${iconClose()}
            </button>
            <div class="c-modal__header">
                <h2 class="c-modal__title">Tajná ponuka produktov Dewalt len pre vás</h2>
                <span class="c-modal__required">* povinné polia</span>
            </div>
            <form class="c-modal__form" @submit=${handleFormSubmit}>
                <div class="c-modal__body">
                    <div class="c-modal__message"></div>
                    
                    <div class="c-modal__grid">
                        <div class="c-modal__grid-item is-full">
                            <label class="c-modal__label">
                                E-mail <span class="required">*</span>
                                <input type="email" name="email" placeholder="vas@email.sk" required>
                            </label>
                        </div>
                        
                        <div class="c-modal__grid-item is-half">
                            <label class="c-modal__label">
                                Meno a priezvisko <span class="required">*</span>
                                <input type="text" name="name" placeholder="Meno Priezvisko" required>
                            </label>
                        </div>
                        
                        <div class="c-modal__grid-item is-half">
                            <label class="c-modal__label">
                                Telefónne číslo (mobil) <span class="required">*</span>
                                <input type="tel" name="phone" placeholder="+421 _ _ _  _ _ _  _ _ _" required>
                            </label>
                        </div>
                        
                        <div class="c-modal__grid-item is-full">
                            <label class="c-modal__label">
                                Odkiaľ ste sa o tejto ponuke dozvedeli? <span class="required">*</span>
                                <div class="c-modal__dropdown">
                                    <input type="hidden" name="discoverySource" value="">
                                    <div class="c-modal__dropdown-trigger" @click=${handleDropdownToggle}>
                                        <span>Vyberte možnosť</span>
                                        ${iconChevronDown({ class: "c-modal__dropdown-icon" })}
                                    </div>
                                    <div class="c-modal__dropdown-menu">
                                        ${dropdownOptions.map(
                                            (opt) =>
                                                html`<div class="c-modal__dropdown-option" data-value="${opt.value}" @click=${(e) => handleDropdownSelect(e, opt.value)}>${opt.label}</div>`
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="c-modal__footer">
                    <button type="submit" class="c-modal__submit">
                        Získať tajnú ponuku
                        ${iconSmallArrow({ class: "c-modal__submit-icon" })}
                    </button>
                    
                    <p class="c-modal__privacy">
                        Odoslaním formuláru súhlasíte <br>
                        so <a href="/privacy" target="_blank">spracovaním osobných údajov</a>
                    </p>
                </div>
            </form>
        </div>
    </dialog>
`;

const dropdownOptions = [
    { value: "", label: "Vyberte možnosť" },
    { value: "web", label: "Priamo z vášho webu" },
    { value: "social", label: "Sociálne siete" },
    { value: "email", label: "E-mail" },
    { value: "friend", label: "Od známeho" },
    { value: "other", label: "Iné" },
];

const handleDropdownToggle = (e) => {
    const wrapper = e.target.closest(".c-modal__dropdown");
    const isOpen = wrapper.classList.contains("is-open");
    // Close all other dropdowns first
    document.querySelectorAll(".c-modal__dropdown.is-open").forEach((el) => el.classList.remove("is-open"));
    if (!isOpen) {
        wrapper.classList.add("is-open");
    }
};

const handleDropdownSelect = (e, value) => {
    const wrapper = e.target.closest(".c-modal__dropdown");
    const input = wrapper.querySelector("input");
    const trigger = wrapper.querySelector(".c-modal__dropdown-trigger");
    input.value = value;
    trigger.querySelector("span").textContent = dropdownOptions.find((o) => o.value === value)?.label || "";
    wrapper.classList.remove("is-open");
    trigger.classList.toggle("has-value", value !== "");
};

const handleDropdownOutsideClick = (e) => {
    if (!e.target.closest(".c-modal__dropdown")) {
        document.querySelectorAll(".c-modal__dropdown.is-open").forEach((el) => el.classList.remove("is-open"));
    }
};
const handleBannerClick = (link) => {
    if (!link) return;

    const newLink = link.replace('/products', '/solution');
    router.navigate(newLink);
};

// Solution main banner
const solutionBanner = (banner) => {
    // If no banner data is provided, don't render anything
    if (!banner) return html``;

    // Destructure with fallbacks for safety
    const {
        title = "",
        description = "",
        ctaText = "Zistiť viac",
        link = "",
        imageUrl =  "https://placehold.co/1920x600"
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
            <div class="c-solution-banner__image" style="background-image: url('${heroBannerImg || imageUrl}')"></div>
            <div class="c-solution-banner__overlay"></div>
            <div class="c-solution-banner__content">
                ${title ? html`<h1 class="c-solution-banner__content__title">${title}</h1>` : ""}
                ${description ? html`<div class="c-solution-banner__content__description">${description}</div>` : ""}
                ${ctaText ? html`
                    <button 
                        class="c-solution-banner__content__button ${!link ? 'is-disabled' : ''}" 
                        @click=${handleLinkClick}
                        ?disabled=${!link}
                    >
                        <span class="sb-text">${ctaText}</span>
                        ${iconArrow({ class: "sb-icon" })}
                    </button>
                ` : ""}
            </div>
        </div>
    `;
};

// Solution CTA section
const solutionCta = (ctaBanner) => html`
    <div class="c-solution-cta">
        <div class="c-solution-cta__image" style="background-image: url('${ secretOfferImg || ctaBanner.imageUrl}')"></div>

        <div class="c-solution-cta__overlay"></div>

        <div class="c-solution-cta__content">
            <h2 class="c-solution-cta__content__title">${ctaBanner.title}</h2>

            <div class="c-solution-cta__content__description">${ctaBanner.description}</div>

            <button class="c-solution-cta__content__button" @click=${() => handleCtaClick()}>
                <span class="sc-text">${ctaBanner.ctaText}</span>
                ${iconArrow({ class: "sc-icon" })}
            </button>
        </div>
    </div>
`;

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
    const container = e.target.closest('.c-product__actions');
    const qtyEl = container.querySelector('.c-quantity');
    const qtyValueDisplay = qtyEl.querySelector('.c-quantity__value');
    const qty = parseInt(qtyEl.dataset.qty, 10);
    
    if (qty > 10) {
        showToast('Upozornenie: Pridali ste viac ako maximálne množstvo 10 ks.', 'warning');
    } else {
        showToast(`Úspech: ${qty} x ${product.name} bolo pridaných do košíka.`, 'success');
        
        // Reset quantity after success
        qtyEl.dataset.qty = '1';
        if (qtyValueDisplay) {
            qtyValueDisplay.textContent = '1';
        }
    }
};

const handleQtyChange = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const qtyEl = e.target.closest('.c-quantity');
    let val = parseInt(qtyEl.dataset.qty, 10) + delta;
    if (val < 1) val = 1;
    if (val > 99) val = 99;
    qtyEl.dataset.qty = val;
    qtyEl.querySelector('.c-quantity__value').textContent = val;
};const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest('button').classList.toggle('is-active');
};

const handleProductClick = (e, link) => {
    // If user clicked on a button or quantity input, don't navigate
    if (e.target.closest('button, input')) {
        return;
    }
    
    e.preventDefault();
    router.navigate(link);
};

const renderProduct = (product) => {
    const finalImageUrl = productImagesMap[product.id] || product.imageUrl;

    return html`
    <a href="${product.link}" class="c-product" @click=${(e) => handleProductClick(e, product.link)}>
        <div class="c-product__header">
            <div class="c-product-badges">
                ${product.badges ? product.badges.map(badge => html`<span class="c-product-badges__badge c-product-badges__badge--${badge.type}">
                    ${badge.label}</span>`) : ''}
            </div>
            <div class="c-product__compare">
                <button title="Porovnať" @click=${handleActionClick}>
                    ${iconScale()}
                </button>
                <button title="Obľúbené" @click=${handleActionClick}>
                    ${iconHeart()}
                </button>
            </div>
        </div>

        <div class="c-product__image-wrap">
            <img src="${finalImageUrl}" alt="${product.name}">
        </div>

        <div class="c-product__body">
            <div class="c-product__rating">
                <div class="c-stars">${renderStars(product.rating)}</div>
                <span class="c-review-count">(${product.reviewCount})</span>
            </div>
            <h3 class="c-product__title">
                ${product.name}
            </h3>
            <p class="c-product__sku">${product.sku}</p>
            
            <div class="c-product__price">
                <div class="c-product__price__original">${product.originalPrice ? product.originalPrice.toFixed(2) + ' ' + product.currency : ''}</div>
                <div class="c-product__price__sale">${product.salePrice.toFixed(2).replace('.', ',')} ${product.currency}</div>
                <div class="c-product__price__novat">${product.priceWithoutVAT.toFixed(2).replace('.', ',')} ${product.currency} bez DPH</div>
            </div>
            
            <div class="c-product__stock">${product.stock}</div>
            
            <div class="c-product__actions">
                <div class="c-quantity" data-qty="1">
                    <button @click=${(e) => handleQtyChange(e, -1)}>${iconMinus()}</button>
                    <span class="c-quantity__value">1</span>
                    <button @click=${(e) => handleQtyChange(e, 1)}>${iconPlus()}</button>
                </div>
                <button class="c-add-cart" @click=${(e) => handleAddToCart(e, product)}>
                    ${iconCart()}
                    Do košíka
                </button>
            </div>
        </div>
    </a>
`
};

const renderCategory = (category) => html`
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
                            ${data.ctaBanner ? html`<div class="c-solution-content__cta">${solutionCta(data.ctaBanner)}</div>` : ""}
                            ${[...data.products, ...data.products].map(product => renderProduct(product))}
                        </div>
                </div>
            </div>

            <div class="l-solution__categories">
                <div class="l-container">
                    <h2 class="c-categories-title">Top kategórie produktov</h2>
                    <div class="c-solution-categories">
                        ${data.categories.map(cat => renderCategory(cat))}
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
