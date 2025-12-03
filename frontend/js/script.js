import { setupAuthUI } from "./auth/authUI.js";
import { setupLoginModal } from "./auth/loginModal.js";
import { setupRegisterModal } from "./auth/registerModal.js";
import { searchDestinations } from "./api.js";

// NAV + SIDEBAR
function initApp() {
    const menu = document.getElementById("menu");
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    const footer = document.querySelector(".app-footer");

    if (!menu || !sidebar) return;

    menu.addEventListener("click", () => {
        sidebar.classList.toggle("menu-toggle");
        main?.classList.toggle("menu-toggle");
        footer?.classList.toggle("menu-toggle");
    });
}

// SLIDER
export function initFadeSlider() {
    const slides = [...document.querySelectorAll(".fade-slide")];
    const btnPrev = document.querySelector(".fade-prev");
    const btnNext = document.querySelector(".fade-next");

    if (!slides.length || !btnPrev || !btnNext) return;

    let index = 0;
    let autoplay = setInterval(next, 5000);

    function show(i) {
        slides.forEach(s => s.classList.remove("active"));
        slides[i].classList.add("active");
    }
    function next() {
        index = (index + 1) % slides.length;
        show(index);
    }
    function prev() {
        index = (index - 1 + slides.length) % slides.length;
        show(index);
    }

    btnNext.onclick = () => { next(); reset(); };
    btnPrev.onclick = () => { prev(); reset(); };

    function reset() {
        clearInterval(autoplay);
        autoplay = setInterval(next, 5000);
    }

    show(index);
}

// FADE-IN ANIMATIONS
export function initFadeInObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

// SEARCHBAR
function setupSearchBar() {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");
    const resultsBox = document.getElementById("searchResults");

    if (!input || !btn || !resultsBox) return;

    const executeSearch = async () => {
        const text = input.value.trim();
        if (!text) return;

        const res = await searchDestinations(text);
        if (!res.ok) return;

        render(res.results);
    };

    const render = (list) => {
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
                <small>${item.category_name}</small>
            `;

            div.onclick = () => {
                window.location.href = `destination.html?slug=${item.slug}`;
            };

            resultsBox.appendChild(div);
        });
    };

    btn.onclick = executeSearch;
    input.oninput = executeSearch;

    document.addEventListener("click", e => {
        if (!resultsBox.contains(e.target) && !input.contains(e.target)) {
            resultsBox.classList.add("hidden");
        }
    });
}

// DARK MODE
export function setupDarkMode() {
    const btn = document.getElementById("toggleDarkMode");
    if (!btn) return;

    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.documentElement.classList.add("dark-mode");
        btn.textContent = "☀️";
    }

    btn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark-mode");
        btn.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// INICIALIZACIÓN
document.addEventListener("componentsLoaded", () => {
    const header = document.querySelector("header");
    const main = document.querySelector("main");

    if (header && main) {
        const h = header.offsetHeight;
        main.style.marginTop = (h + 20) + "px";
        console.log("✔ Ajuste dinámico del main:", h);
    }
    
    initApp();
    initFadeSlider();
    initFadeInObserver();

    setupLoginModal();
    setupRegisterModal();
    setupAuthUI();

    setupSearchBar();
});
