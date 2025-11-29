// frontend/js/components.js

import { setupAuthUI } from "./auth/authUI.js";
import { setupLoginModal } from "./auth/loginModal.js";
import { setupRegisterModal } from "./auth/registerModal.js";

/* ============================================================
   CARGA DE COMPONENTES
============================================================ */
async function loadComponent(selector, filePath) {
    const container = document.querySelector(selector);
    if (!container) return;

    const html = await (await fetch(filePath)).text();
    container.insertAdjacentHTML("beforeend", html);

    console.log(`✔ Componente cargado: ${filePath}`);
}

/* ============================================================
   INICIALIZACIÓN
============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Iniciando carga de componentes...");

    await loadComponent("#header-container", "components/header.html");
    await loadComponent("#authArea", "components/auth.html");
    await loadComponent("#sidebar-container", "components/sidebar.html");
    await loadComponent("#footer-container", "components/footer.html");

    await loadComponent("body", "components/loginModal.html");
    await loadComponent("body", "components/registerModal.html");

    // Inicializar autenticación
    setupAuthUI();
    setupLoginModal();
    setupRegisterModal();

    console.log("✔ Componentes listos. Emitiendo componentsLoaded...");
    document.dispatchEvent(new Event("componentsLoaded"));
});
