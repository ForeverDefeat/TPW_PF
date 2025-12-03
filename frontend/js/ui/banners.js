import { apiGet } from "../api.js";

document.addEventListener("componentsLoaded", loadBanners);

async function loadBanners() {
    const container = document.getElementById("bannerSlider");
    if (!container) return;

    try {
        const res = await apiGet("/banners");
        const banners = res.banners ?? res;

        container.innerHTML =
            banners.map(b => `
                <div class="fade-slide">
                    <img src="${b.image_url}" alt="${b.title}">
                </div>
            `).join("") +
            `
            <button class="fade-prev">❮</button>
            <button class="fade-next">❯</button>
            `;

        console.log("✔ Banners cargados:", banners);

        // 🚀 INICIALIZAR SLIDER
        import("../script.js").then(mod => mod.initFadeSlider());


    } catch (err) {
        console.error("❌ Error cargando banners:", err);
    }
}
