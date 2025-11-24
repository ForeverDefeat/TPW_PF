import { apiGet } from "./api.js";

/**
 * Carga destinos desde backend y los inserta en el HTML.
 */
export async function loadDestinations() {
    const container = document.getElementById("destinationsList");
    if (!container) return;

    try {
        const destinos = await apiGet("/destinations");

        container.innerHTML = destinos.map(d => `
            <div class="destination-card">
                <img src="${d.image_url}" alt="${d.name}">
                <h3>${d.name}</h3>
                <p>${d.description}</p>
                <span class="badge">${d.category_name}</span>
            </div>
        `).join("");

    } catch (err) {
        console.error("Error cargando destinos:", err);
        container.innerHTML = `<p>Error cargando destinos 🥲</p>`;
    }
}
