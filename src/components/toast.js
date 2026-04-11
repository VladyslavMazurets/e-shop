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
        if (typeof document === 'undefined') return;
        
        this.container = document.createElement('div');
        this.container.className = 'c-toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 4000) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `c-toast c-toast--${type}`;
        
        const icon = type === 'success' ? 
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` :
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        toast.innerHTML = `
            <div class="c-toast__icon">${icon}</div>
            <div class="c-toast__content">
                <p class="c-toast__message">${message}</p>
            </div>
            <button class="c-toast__close" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="c-toast__progress">
                <div class="c-toast__progress-bar" style="animation-duration: ${duration}ms"></div>
            </div>
        `;

        this.container.appendChild(toast);

        // Auto-remove
        const timer = setTimeout(() => {
            this.remove(toast);
        }, duration);

        // Manual close
        toast.querySelector('.c-toast__close').onclick = () => {
            clearTimeout(timer);
            this.remove(toast);
        };
    }

    remove(toast) {
        toast.classList.add('is-leaving');
        toast.addEventListener('animationend', () => {
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
