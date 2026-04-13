import { html, render } from "lit-html";
import { iconSuccess, iconWarning, iconToastClose } from "./icons.js";

/**
 * Toast Notification System
 * A global utility for showing premium notifications.
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        if (typeof document === "undefined") return;

        this.container = document.createElement("div");
        this.container.className = "c-toast-container";
        document.body.appendChild(this.container);
    }

    show(message, type = "success", duration = 4000) {
        if (!this.container) this.init();

        const toast = document.createElement("div");
        toast.className = `c-toast c-toast--${type}`;

        const template = html`
            <div class="c-toast__icon">${type === "success" ? iconSuccess() : iconWarning()}</div>
            <div class="c-toast__content">
                <p class="c-toast__message">${message}</p>
            </div>
            <button class="c-toast__close" aria-label="Zavrieť">
                ${iconToastClose()}
            </button>
            <div class="c-toast__progress">
                <div class="c-toast__progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        render(template, toast);

        this.container.appendChild(toast);

        // Auto-remove
        const timer = setTimeout(() => {
            this.remove(toast);
        }, duration);

        // Manual close
        toast.querySelector(".c-toast__close").onclick = () => {
            clearTimeout(timer);
            this.remove(toast);
        };
    }

    remove(toast) {
        toast.classList.add("is-leaving");
        toast.addEventListener("animationend", () => {
            if (toast.parentNode === this.container) {
                this.container.removeChild(toast);
            }
        });
    }
}

const manager = new ToastManager();

export const showToast = (message, type, duration) => {
    manager.show(message, type, duration);
};
