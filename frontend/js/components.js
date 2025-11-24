/* import { setupAuthUI } from "./auth/authUI.js";
import { setupLoginModal } from "./auth/loginModal.js";
import { setupRegisterModal } from "./auth/registerModal.js";


async function loadComponent(containerId, filePath) {
    const container = document.querySelector(containerId);
    if (!container) return;

    const res = await fetch(filePath);
    const html = await res.text();
    container.innerHTML += html;
}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("#header-container", "components/header.html");
    await loadComponent("#sidebar-container", "components/sidebar.html");
    await loadComponent("#authArea", "components/auth.html");

    // Modales dentro del body
    await loadComponent("body", "components/loginModal.html");
    await loadComponent("body", "components/registerModal.html");

    await loadComponent("#footer-container", "components/footer.html");

    // Avisar al sistema que YA SE CARGARON los componentes dinámicos
    document.dispatchEvent(new Event("componentsLoaded"));
});
 */

import { setupAuthUI } from "./auth/authUI.js";
import { setupLoginModal } from "./auth/loginModal.js";
import { setupRegisterModal } from "./auth/registerModal.js";

/**
 * Carga un componente HTML en un contenedor por su selector.
 * @param {string} containerId 
 * @param {string} filePath 
 */
async function loadComponent(containerId, filePath) {
    const container = document.querySelector(containerId);
    if (!container) return;

    const res = await fetch(filePath);
    const html = await res.text();
    container.innerHTML += html;
}

document.addEventListener("DOMContentLoaded", async () => {


    await loadComponent("#header-container", "components/header.html");
    await loadComponent("#authArea", "components/auth.html");
    await loadComponent("#sidebar-container", "components/sidebar.html");
    await loadComponent("#footer-container", "components/footer.html");

    // 4. Cargar modales (directo al body)
    await loadComponent("body", "components/loginModal.html");
    await loadComponent("body", "components/registerModal.html");

    // 5. Ejecutar autenticación (después de cargar componentes)
    setupAuthUI();
    setupLoginModal();
    setupRegisterModal();

    // 6. Avisar que todo fue cargado
    document.dispatchEvent(new Event("componentsLoaded"));
});
