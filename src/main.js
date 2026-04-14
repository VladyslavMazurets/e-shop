import "./assets/styles/import.scss";
import { html, render } from "lit-html";
import { router } from "./router.js";
import { logDataMode } from "./dataLoader.js";
import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderLoader } from "./components/loader.js";
import { renderAssignmentPage } from "./pages/assignment.js";
import { loadAndRenderSolutionPage } from "./pages/solution.js";

// Log current data mode
logDataMode();

/**
 * Render the entire application layout
 */
const renderLayout = (content) => {
    const app = document.querySelector("#app");

    const template = html`
        ${renderHeader()}
        <main class="l-page__main">${content}</main>
        ${renderFooter()}
    `;

    render(template, app);
};

/**
 * Route handlers
 */
const showAssignmentPage = () => {
    const pageContent = renderAssignmentPage();
    renderLayout(pageContent);
};

const showSolutionPage = async () => {
    // Show loading state
    renderLayout(renderLoader());

    // Load data and render page
    const pageContent = await loadAndRenderSolutionPage();
    renderLayout(pageContent);
};

/**
 * Initialize application
 */
const init = () => {
    // Register routes
    router.addRoute("/", showAssignmentPage);
    router.addRoute("/solution", showSolutionPage);

    // Initialize router
    router.init();
};

// Start the application
init();
