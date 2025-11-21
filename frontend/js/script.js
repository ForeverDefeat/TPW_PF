import { setupAuthUI } from "./auth/authUI.js";
import { setupLoginModal } from "./auth/loginModal.js";
import { setupRegisterModal } from "./auth/registerModal.js";
import { setupAddDestinationModal } from "./auth/addDestinationModal.js";
import { searchDestinations } from "./api.js";

/*                APP GENERAL                */

function initApp() {
    const menu = document.getElementById("menu");
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (!menu || !sidebar) return;

    menu.addEventListener("click", () => {
        sidebar.classList.toggle("menu-toggle");
        main?.classList.toggle("menu-toggle");
    });
}

/*             SLIDER FADE PREMIUM           */

function initFadeSlider() {
    const slides = [...document.querySelectorAll(".fade-slide")];
    const btnPrev = document.querySelector(".fade-prev");
    const btnNext = document.querySelector(".fade-next");

    if (!slides.length || !btnPrev || !btnNext) return;

    let index = 0;
    let autoplayTimer = null;

    const showSlide = (i) => {
        slides.forEach(s => s.classList.remove("active"));
        slides[i].classList.add("active");
    };

    const nextSlide = () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    };

    const prevSlide = () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    };

    const startAutoplay = () => {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(nextSlide, 5000);
    };

    btnNext.addEventListener("click", () => {
        nextSlide();
        startAutoplay();
    });

    btnPrev.addEventListener("click", () => {
        prevSlide();
        startAutoplay();
    });

    showSlide(index);
    startAutoplay();
}

/*         ANIMACIÓN FADE IN SECTIONS        */

function initFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

/*         CONFIGURAR SEARCHBAR              */

function setupSearchBar() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsBox = document.getElementById("searchResults");

    if (!searchInput || !searchBtn || !resultsBox) {
        console.warn("Searchbar aún no está disponible");
        return;
    }

    console.log("Searchbar listo.");

    // Buscar al presionar botón
    searchBtn.addEventListener("click", async () => {
        const text = searchInput.value.trim();
        if (!text) return;
        runSearch(text);
    });

    // Buscar mientras escribe
    searchInput.addEventListener("input", () => {
        const text = searchInput.value.trim();
        if (!text) {
            resultsBox.classList.add("hidden");
            return;
        }
        runSearch(text);
    });

    // Cerrar resultados si clic fuera
    document.addEventListener("click", (e) => {
        if (!resultsBox.contains(e.target) && !searchInput.contains(e.target)) {
            resultsBox.classList.add("hidden");
        }
    });

    // Ejecutar búsqueda
    async function runSearch(text) {
        const res = await searchDestinations(text);

        if (!res.ok) return;
        renderResults(res.results);
    }

    // Renderizar tarjetas
    function renderResults(list) {
        resultsBox.innerHTML = "";
        resultsBox.classList.remove("hidden");

        if (!list.length) {
            resultsBox.innerHTML = "<p>No se encontraron resultados.</p>";
            return;
        }

        list.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("result-card");

            div.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <small>Categoría: ${item.category}</small>
            `;

            div.addEventListener("click", () => {
                resultsBox.classList.add("hidden");

                if (item.category === "playa") {
                    window.location.href = "beach.html";
                }
                else if (item.category === "montana") {
                    window.location.href = "mountain.html";
                }
                else if (item.category === "cultura") {
                    window.location.href = "culture.html";
                }
            });

            resultsBox.appendChild(div);
        });
    }
}

function setupDarkMode() {
    const btn = document.getElementById("toggleDarkMode");
    if (!btn) return;

    // Cargar modo desde localStorage
    const savedMode = localStorage.getItem("theme");

    if (savedMode === "dark") {
        document.documentElement.classList.add("dark-mode");
        btn.textContent = "☀️";
    } else {
        btn.textContent = "🌙";
    }

    btn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark-mode");

        btn.textContent = isDark ? "☀️" : "🌙";

        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

/*    SCROLL AUTOMÁTICO AL BANNER  */
window.addEventListener("load", () => {
    const banner = document.querySelector(".banner");
    banner?.scrollIntoView({ behavior: "smooth" });
});

/*     INICIALIZAR TODO DESPUÉS DE CARGAR    */

document.addEventListener("componentsLoaded", () => {
    console.log("⚡ Componentes cargados — iniciando UI");

    initApp();
    initFadeSlider();
    initFadeInObserver();

    setupLoginModal();
    setupRegisterModal();
    setupAddDestinationModal();
    setupAuthUI();

    setupSearchBar();
    setupDarkMode();
});