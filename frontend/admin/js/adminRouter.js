/**
 * @file adminRouter.js
 * @description Router SPA del Panel de Administración.
 *              Maneja la navegación entre páginas internas sin recargar la vista.
 * @module adminRouter
 */

import { loadAdminPage } from "./adminComponents.js";

// Importar controladores de cada módulo
import { renderDashboard } from "./dashboardPage.js";
import { initCategoriesPage } from "./categoriesPage.js";
import { initDestinationsPage } from "./destinationsPage.js";
import { initServicesPage } from "./servicesPage.js";
import { initEventsPage } from "./eventsPage.js";
import { initUsersPage } from "./usersPage.js";
import { initFavoritesPage } from "./favoritesPage.js";
import { initEventsFollowedPage } from "./eventsFollowedPage.js";

/**
 * Lista de rutas válidas.
 * Si creas un nuevo módulo, solo agréguelo aquí y su controlador en el switch.
 */
const validRoutes = [
    "dashboard",
    "categories",
    "destinations",
    "services",
    "events",
    "users",
    "favorites",
    "events-followed",
    "settings"
];

/**
 * Obtiene la ruta actual desde el hash.
 * Ejemplo: "#/favorites" → "favorites"
 *
 * @returns {string}
 */
function getCurrentRoute() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith("#/")) return "dashboard";
    return hash.replace("#/", "");
}

/**
 * Resalta en el sidebar la opción activa.
 *
 * @param {string} route
 */
function highlightActiveSidebar(route) {
    const links = document.querySelectorAll(".admin-link");
    links.forEach(link => {
        link.classList.toggle("active", link.dataset.route === route);
    });
}

/**
 * Router principal SPA.
 * Carga la página visual (HTML) y ejecuta la función JS asociada.
 *
 * @async
 * @function handleRoute
 */
export async function handleRoute() {
    let route = getCurrentRoute();

    // Si la ruta no es válida → redirigir a dashboard
    if (!validRoutes.includes(route)) {
        route = "dashboard";
        window.location.hash = "#/dashboard";
    }

    // Cargar HTML de la página
    await loadAdminPage(route);

    // Ejecutar el JS correspondiente a la página cargada
    switch (route) {
        case "dashboard":
            renderDashboard();
            break;

        case "categories":
            initCategoriesPage();
            break;

        case "destinations":
            initDestinationsPage();
            break;

        case "services":
            initServicesPage();
            break;

        case "events":
            initEventsPage();
            break;

        case "users":
            initUsersPage();
            break;

        case "favorites":
            initFavoritesPage();
            break;

        case "events-followed":
            initEventsFollowedPage();
            break;

        case "settings":
            console.log("⚙ Settings page (por implementar)");
            break;
    }

    // Actualizar sidebar
    highlightActiveSidebar(route);
}

/**
 * Inicializa el sistema de rutas.
 * Escucha cambios en el hash y carga la vista inicial.
 *
 * @function initRouter
 */
export function initRouter() {
    window.addEventListener("hashchange", handleRoute);
    handleRoute(); // cargar la primera vista
}
