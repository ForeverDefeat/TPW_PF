import { getDestinations } from "./api.js";

export async function loadDestinations(filterCategory = null) {

    const container = document.getElementById("destinationList");
    if (!container) return;

    const res = await getDestinations();
    if (!res.ok) return;

    let list = res.data;

    // filtrar por categoría si corresponde
    if (filterCategory) {
        list = list.filter(d => d.category === filterCategory);
    }

    // render
    container.innerHTML = list.map(dest => `
        <div class="dest-card">
            <img src="${dest.imageUrl}">
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
        </div>
    `).join("");
}
