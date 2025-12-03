import { apiGet } from "../api.js";

document.addEventListener("componentsLoaded", loadCategories);

async function loadCategories() {
    const container = document.getElementById("categoriesContainer");
    if (!container) return;

    try {
        const res = await apiGet("/categories");

        const categories = res.categories ?? [];
        if (!Array.isArray(categories)) throw new Error("Formato inválido");

        container.innerHTML = categories
            .map(cat => `
                <div class="cat-card" data-slug="${cat.slug}">
                    <img src="${cat.image_url}" alt="${cat.name}">
                    <h4>${cat.name}</h4>
                    <p>${cat.description}</p>
                </div>
            `)
            .join("");

    } catch (err) {
        console.error("❌ Error cargando categorías:", err);
        container.innerHTML = "<p>Error cargando categorías.</p>";
    }
}
