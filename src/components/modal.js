import { html } from "lit-html";
import { validateEmail } from "../api/emailApi.js";
import { iconClose, iconChevronDown, iconSmallArrow } from "./icons.js";

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

export const handleDropdownOutsideClick = (e) => {
    if (!e.target.closest(".c-modal__dropdown")) {
        document.querySelectorAll(".c-modal__dropdown.is-open").forEach((el) => el.classList.remove("is-open"));
    }
};

export const handleCtaClick = () => {
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
        const form = modal.querySelector("form");
        if (form) form.reset();
        const msg = modal.querySelector(".c-modal__message");
        if (msg) {
            msg.className = "c-modal__message";
            msg.innerText = "";
        }
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

const handleModalClick = (e) => {
    const modal = e.target;
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

    if (!email || !name || !phone || !discoverySource) {
        msg.innerText = "Prosím vyplňte všetky povinné polia.";
        msg.className = "c-modal__message is-visible is-error";
        return;
    }

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

export const renderModal = () => html`
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
                    <button type="submit" class="c-modal__submit" aria-label="Získať tajnú ponuku">
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
