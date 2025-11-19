import { getDestinations } from "./api.js";

export async function loadDestinations(options) {
    const { containerId, category, template } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const destinos = await getDestinations();

    // Filtrar categoría
    const filtered = destinos.filter(d => d.category === category);

    container.innerHTML = ""; // limpiar

    filtered.forEach(d => {
        container.insertAdjacentHTML("beforeend", template(d));
    });
}
