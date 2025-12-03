// frontend/js/categoriesPage.js
import { apiGet } from "./api.js";

document.addEventListener("componentsLoaded", loadCategories);

async function loadCategories() {
    const container = document.getElementById("categoriesList");
    if (!container) return;

    try {
        // Llamar API
        const res = await apiGet("/categories");
        const categories = res.categories ?? res;

        // Render cards
        container.innerHTML = categories
            .map(cat => `
                <div class="category-masonry-card" data-id="${cat.id}">
                    <img src="${cat.image_url}" alt="${cat.name}">
                    <div class="info">
                        <h4>${cat.name}</h4>
                        <p>${cat.description.substring(0, 80)}...</p>
                    </div>
                </div>
            `)
            .join("");


        // Eventos del click (navegación por ID)
        [...container.querySelectorAll(".category-masonry-card")].forEach(card => {
            card.addEventListener("click", () => {
                const id = card.dataset.id; // ← usamos ID
                window.location.href = `category.html?id=${id}`;
            });

        });

    } catch (err) {
        console.error("Error cargando categorías:", err);
        container.innerHTML = "<p>No se pudieron cargar las categorías.</p>";
    }
}
