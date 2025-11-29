import { apiGet } from "../api.js";

document.addEventListener("componentsLoaded", loadBanners);

async function loadBanners() {
    const container = document.getElementById("bannerSlider");
    if (!container) return;

    try {
        const res = await apiGet("/banners");

        const banners = res.banners ?? res;

        if (!Array.isArray(banners)) throw new Error("banners no es un array");

        container.innerHTML = banners.map(b => `
            <div class="fade-slide">
                <img src="${b.image_url}" alt="${b.title}">
            </div>
        `).join("");

        console.log("✔ Banners cargados:", banners);

    } catch (err) {
        console.error("❌ Error cargando banners:", err);
    }
}
