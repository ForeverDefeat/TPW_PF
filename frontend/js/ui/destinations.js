import { getDestinations } from "../api.js";

document.addEventListener("componentsLoaded", async () => {

    const container = document.getElementById("destinationsContainer");
    if (!container) return;

    try {
        const res = await getDestinations();

        const destinations = res.data ?? res;

        if (!Array.isArray(destinations)) throw new Error("destinations no es un array");

        container.innerHTML = destinations.slice(0, 3).map(d => `
            <div class="cat-card">
                <img src="/uploads/${d.main_image_url}" alt="${d.name}">
                <h4>${d.name}</h4>
                <p>${d.description.substring(0, 100)}...</p>
            </div>
        `).join("");

        console.log("✔ Destinos cargados:", destinations);

    } catch (err) {
        console.error("❌ Error cargando destinos:", err);
    }
});
