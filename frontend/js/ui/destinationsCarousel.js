import { apiGet } from "../api.js";
import { destinationCarouselItemTemplate } from "../templates.js";

document.addEventListener("componentsLoaded", loadDestinationsCarousel);

async function loadDestinationsCarousel() {
    const track = document.getElementById("destinationsCarousel");
    const dotsContainer = document.getElementById("carouselDots");
    if (!track) return;

    const res = await apiGet("/destinations");
    const destinos = res.destinations ?? res;

    track.innerHTML = destinos.map((d, i) => `
        <div class="carousel-item" data-index="${i}">
            <img src="/uploads/${d.main_image_url}" alt="${d.name}">
            <h4>${d.name}</h4>
            <p>${d.description?.substring(0, 80)}...</p>
        </div>
    `).join("");

    /* DOTS */
    dotsContainer.innerHTML = destinos.map((_, i) =>
        `<div class="carousel-dot ${i === 0 ? "active" : ""}" data-index="${i}"></div>`
    ).join("");

    initCarouselPro(destinos.length);
}

/* =============== CARRUSEL PRO ================= */
function initCarouselPro(totalItems) {
    const track = document.querySelector(".carousel");
    const prev = document.querySelector(".carousel-nav.prev");
    const next = document.querySelector(".carousel-nav.next");
    const dots = [...document.querySelectorAll(".carousel-dot")];

    let index = 0;

    const updateCarousel = () => {
        const cardWidth = track.querySelector(".carousel-item").offsetWidth + 16;
        track.style.transform = `translateX(${-index * cardWidth}px)`;

        dots.forEach(d => d.classList.remove("active"));
        dots[index]?.classList.add("active");
    };

    next.onclick = () => {
        index = (index + 1) % totalItems; // infinito
        updateCarousel();
    };

    prev.onclick = () => {
        index = (index - 1 + totalItems) % totalItems; // infinito hacia atrás
        updateCarousel();
    };

    dots.forEach(dot => {
        dot.onclick = () => {
            index = Number(dot.dataset.index);
            updateCarousel();
        };
    });

    /* AUTO SCROLL */
    setInterval(() => {
        index = (index + 1) % totalItems;
        updateCarousel();
    }, 4000);

    /* SWIPE para móvil */
    let startX = 0;

    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 60) next.click();
        if (endX - startX > 60) prev.click();
    });

    /* track.innerHTML = destinos
        .map(d => destinationCarouselItemTemplate(d))
        .join(""); */
}