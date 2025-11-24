/**
 * @file adminApp.js
 * @description Punto de entrada principal del Panel Administrativo (SPA).
 *              Se encarga de:
 *              - Validar la sesión del administrador.
 *              - Cargar el header y sidebar (componentes estructurales).
 *              - Inicializar el router de navegación interna.
 *              - Configurar modo oscuro persistente.
 *              - Configurar logout y menú móvil.
 *
 * @module adminApp
 */

import { loadAdminHeader, loadAdminSidebar } from "./adminComponents.js";
import { initRouter } from "./adminRouter.js";

/* ===========================================================================
   VALIDACIÓN DE SESIÓN DE ADMINISTRADOR
   =========================================================================== */

/**
 * Verifica si existe una sesión válida almacenada en localStorage
 * y si el usuario tiene rol "admin".
 *
 * Si no está autenticado o no es administrador,
 * el usuario será redirigido al sitio público.
 *
 * @function validateAdminSession
 *
 * @example
 * validateAdminSession();
 */
function validateAdminSession() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const role = (localStorage.getItem("userRole") || "").toLowerCase();

    if (!loggedIn || role !== "admin") {
        alert("Acceso denegado. Solo administradores pueden ingresar.");
        window.location.href = "../index.html";
    }
}

/* ===========================================================================
   CONFIGURACIÓN DE EVENTOS GLOBALES (LOGOUT, MODO OSCURO, MENÚ)
   =========================================================================== */

/**
 * Activa eventos globales para:
 *  - Logout del administrador.
 *  - Activar/desactivar modo oscuro con persistencia en localStorage.
 *  - Menú lateral en modo móvil.
 *
 * @function setupGlobalEvents
 *
 * @example
 * setupGlobalEvents();
 */
function setupGlobalEvents() {

    /* LOGOUT */
    const logoutBtn = document.getElementById("adminLogoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("session");
            window.location.href = "../index.html";
        });
    }

    /* MODO OSCURO  */
    const darkBtn = document.getElementById("adminToggleDarkMode");

    if (darkBtn) {
        darkBtn.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark-mode");

            // Guardar preferencia en localStorage
            localStorage.setItem(
                "dark-mode",
                document.documentElement.classList.contains("dark-mode")
            );
        });
    }

    // Aplicar modo oscuro si estaba guardado de antes
    const savedDarkMode = localStorage.getItem("dark-mode") === "true";
    if (savedDarkMode) {
        document.documentElement.classList.add("dark-mode");
    }

    /* MENÚ MÓVIL */
    const menuBtn = document.getElementById("adminMenuBtn");
    const sidebar = document.getElementById("adminSidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    sidebar.addEventListener("click", (e) => {
        if (window.innerWidth <= 700 && e.target.closest("a")) {
            sidebar.classList.remove("open");
        }
    });
}

/* INICIALIZACIÓN PRINCIPAL DEL PANEL ADMIN */

/**
 * Inicializa la aplicación administrativa en el siguiente orden:
 *
 * 1.   Validar que haya un administrador activo.  
 * 2.   Cargar dinámicamente el header y sidebar.  
 * 3.   Iniciar el router SPA.  
 * 4.   Activar eventos globales (modo oscuro, logout, menú).  
 *
 * @async
 * @function initAdminApp
 *
 * @example
 * document.addEventListener("DOMContentLoaded", initAdminApp);
 */
async function initAdminApp() {

    // 1️⃣ Validación de sesión
    validateAdminSession();

    // 2️⃣ Cargar estructura visual
    await loadAdminHeader();
    await loadAdminSidebar();

    // 3️⃣ Activar enrutamiento SPA
    initRouter();

    // 4️⃣ Activar eventos globales
    setupGlobalEvents();

    console.log(
        "%cPanel Admin cargado correctamente",
        "color: #16a34a; font-weight: bold;"
    );
}

/* ===========================================================================
   EJECUCIÓN AL CARGAR LA PÁGINA
   =========================================================================== */


   
document.addEventListener("DOMContentLoaded", initAdminApp);
