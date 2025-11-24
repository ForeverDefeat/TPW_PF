/**
 * @file adminComponents.js
 * @description Sistema de carga dinámica de componentes HTML para el Panel Administrativo.
 *              Este módulo se encarga de:
 *              - Insertar header y sidebar.
 *              - Cargar páginas internas dentro del <main>.
 *              - Manejar errores de carga de componentes.
 *
 *              Es utilizado por adminApp.js y adminRouter.js.
 *
 * @module adminComponents
 */

/* ===========================================================================
   UTILIDAD PRINCIPAL: CARGA DE ARCHIVOS HTML EXTERNOS
   =========================================================================== */

/**
 * Carga un archivo HTML desde una ruta y devuelve su contenido como texto.
 * 
 * @async
 * @function loadHTML
 * @param {string} path - Ruta del archivo HTML a cargar (relativa al panel admin).
 * @returns {Promise<string>} Contenido HTML en formato string.
 *
 * @example
 * const html = await loadHTML("components/adminHeader.html");
 */
export async function loadHTML(path) {
    try {
        const res = await fetch(path);

        if (!res.ok) {
            throw new Error(`Error al cargar archivo HTML: ${path}`);
        }

        return await res.text();
    } catch (err) {
        console.error("loadHTML error:", err);

        // Inserta tarjeta de error renderizable en el panel admin
        return `
            <div class="admin-card">
                <h3>Error</h3>
                <p>No se pudo cargar el archivo <strong>${path}</strong>.</p>
            </div>
        `;
    }
}

/* ===========================================================================
   CARGA DE HEADER
   =========================================================================== */

/**
 * Inserta el Header administrativo dentro del contenedor:
 * 
 * `<div id="admin-header-container"></div>`
 *
 * @async
 * @function loadAdminHeader
 *
 * @example
 * await loadAdminHeader();
 */
export async function loadAdminHeader() {
    const container = document.getElementById("admin-header-container");
    if (!container) return;

    const html = await loadHTML("components/adminHeader.html");
    container.innerHTML = html;
}

/* ===========================================================================
   CARGA DE SIDEBAR
   =========================================================================== */

/**
 * Inserta el Sidebar administrativo dentro del contenedor:
 * 
 * `<div id="admin-sidebar-container"></div>`
 *
 * @async
 * @function loadAdminSidebar
 *
 * @example
 * await loadAdminSidebar();
 */
export async function loadAdminSidebar() {
    const container = document.getElementById("admin-sidebar-container");
    if (!container) return;

    const html = await loadHTML("components/adminSidebar.html");
    container.innerHTML = html;
}

/* ===========================================================================
   CARGA DE PÁGINAS INTERNAS DEL PANEL
   =========================================================================== */

/**
 * Carga una página interna de administración dentro del `<main id="adminMain">`.
 * 
 * La ruta se genera automáticamente siguiendo este patrón:
 *
 *   pageName = "dashboard"
 *   archivo = "components/adminDashboard.html"
 *
 * @async
 * @function loadAdminPage
 * @param {string} pageName - Nombre base de la página (sin "admin" ni extensión).
 *
 * @example
 * await loadAdminPage("categories"); 
 * // Carga components/adminCategories.html
 */
export async function loadAdminPage(pageName) {
    const main = document.getElementById("adminMain");
    if (!main) return;

    const pagePath = `components/admin${capitalize(pageName)}.html`;

    const html = await loadHTML(pagePath);
    main.innerHTML = html;
}

/* ===========================================================================
   UTILIDAD AUXILIAR
   =========================================================================== */

/**
 * Capitaliza la primera letra de un texto.
 * 
 * @function capitalize
 * @param {string} text - Texto a capitalizar.
 * @returns {string}
 *
 * @example
 * capitalize("events"); // → "Events"
 */
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
