// ======================
//       script.js
// ======================

import { setupAuthUI } from "./auth/authUI.js";

function initMenu() {
    const menu = document.getElementById("menu");
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (menu) {
        menu.addEventListener("click", () => {
            sidebar?.classList.toggle("menu-toggle");
            main?.classList.toggle("menu-toggle");
        });
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

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// INIT
document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initSlider();
    setupAuthUI();  // inicializar autenticación
});
