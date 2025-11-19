// ======================
//       script.js
// ======================

import { setupAuthUI } from "./auth/authUI.js";

function initApp() {
    // -------------------------
    // MENÚ DESPLEGABLE SIDEBAR
    // -------------------------
    const menu = document.getElementById("menu");
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (menu && sidebar) {
        menu.addEventListener("click", () => {
            sidebar.classList.toggle("menu-toggle");
            if (main) main.classList.toggle("menu-toggle");
        });
    }

    // -------------------------
    // AUTENTICACIÓN DEL HEADER
    // -------------------------
    const loggedOutView = document.getElementById("loggedOutView");
    const loggedInView = document.getElementById("loggedInView");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const adminAddButton = document.getElementById("adminAddButton");
    const logoutButton = document.getElementById("logoutButton");

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    // -------------------------
    // MOSTRAR / OCULTAR VISTAS
    // -------------------------
    if (loggedIn) {
        if (loggedOutView) loggedOutView.classList.add("hidden");
        if (loggedInView) loggedInView.classList.remove("hidden");

        if (usernameDisplay) {
            usernameDisplay.textContent = username || "Usuario";
        }

        if (adminAddButton) {
            if (role === "admin") {
                adminAddButton.classList.remove("hidden");
            } else {
                adminAddButton.classList.add("hidden");
            }
        }

        if (logoutButton) {
            logoutButton.addEventListener("click", () => {
                localStorage.clear();
                window.location.reload();
            });
        }

    } else {
        if (loggedOutView) loggedOutView.classList.remove("hidden");
        if (loggedInView) loggedInView.classList.add("hidden");

        if (adminAddButton) adminAddButton.classList.add("hidden");
    }
}

function initSlider() {
    const slidesContainer = document.querySelector(".banner .slides");
    if (!slidesContainer) return;

    const slides = slidesContainer.querySelectorAll("img");
    const prev = document.querySelector(".banner .prev");
    const next = document.querySelector(".banner .next");

    let index = 0;

    function updatePos() {
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    prev?.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        updatePos();
    });

    next?.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        updatePos();
    });

}

// Animaciones de fade-in
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
    });
});

const username = localStorage.getItem("username");
const role = localStorage.getItem("userRole");

if (username) {
    document.getElementById("loggedOutView").style.display = "none";
    document.getElementById("loggedInView").style.display = "flex";

    document.getElementById("usernameDisplay").textContent = username;

    if (role === "admin") {
        document.getElementById("adminAddButton").style.display = "inline-block";
    }
}


document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// INIT
document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initSlider();
    setupAuthUI();  // inicializar autenticación
});
