import { apiGet } from "./api.js";

export async function loadBanners() {
    const container = document.getElementById("bannerSlider");

    const banners = await apiGet("/banners");

    if (!banners.length) {
        container.innerHTML = "<p>No hay banners disponibles</p>";
        return;
    }

    // Crear slides dinámicos
    container.innerHTML = banners.map((b, i) => `
        <div class="fade-slide ${i === 0 ? "active" : ""}">
            <img src="${b.image_url}">
            ${b.text ? `<div class="banner-text">${b.text}</div>` : ""}
        </div>
    `).join("") + `
        <button class="fade-prev">&#10094;</button>
        <button class="fade-next">&#10095;</button>
    `;

    setupFadeSlider();
}
