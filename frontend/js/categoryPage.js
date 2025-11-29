import { apiGet } from "./api.js";
import { destinationCardTemplate } from "./templates.js";

document.addEventListener("componentsLoaded", loadCategoryPage);

async function loadCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("categoryTitle").textContent = "Categoría no encontrada";
        return;
    }

    try {
        const category = await apiGet(`/categories/${id}`);
        const destinations = await apiGet(`/destinations/category/${id}`);

        document.getElementById("categoryTitle").textContent = category.name;

        document.getElementById("destinationsList").innerHTML =
            destinations.map(destinationCardTemplate).join("");

    } catch (err) {
        console.error("Error cargando categoría:", err);
    }
}
