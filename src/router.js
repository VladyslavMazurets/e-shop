/**
 * Simple vanilla JS router
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }

    /**
     * Register a route
     * @param {string} path - Route path
     * @param {Function} handler - Function to execute when route is active
     */
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    /**
     * Navigate to a route
     * @param {string} fullPath - Route path to navigate to
     */
    navigate(fullPath) {
        const basePath = fullPath.split('?')[0];

        if (this.routes[basePath]) {
            this.currentRoute = basePath;
            window.history.pushState({}, "", fullPath);
            this.routes[basePath]();
        } else {
            console.warn(`Route not found: ${basePath}`);
        }
    }

    /**
     * Initialize router and handle browser back/forward buttons
     */
    init() {
        // Handle browser back/forward buttons
        window.addEventListener("popstate", () => {
            const path = window.location.pathname;
            if (this.routes[path]) {
                this.currentRoute = path;
                this.routes[path]();
            }
        });

        // Handle initial route
        const initialPath = window.location.pathname;
        if (this.routes[initialPath]) {
            this.currentRoute = initialPath;
            this.routes[initialPath]();
        } else {
            // Default to first route if current path doesn't exist
            const firstRoute = Object.keys(this.routes)[0];
            if (firstRoute) {
                this.navigate(firstRoute);
            }
        }
    }

    /**
     * Get current active route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
}

export const router = new Router();
