import { apiGet } from "./api.js";

document.addEventListener("componentsLoaded", loadCategories);

async function loadCategories() {
    const container = document.getElementById("categoriesList");
    if (!container) return;

    try {
        const res = await apiGet("/categories");
        const categories = res.categories;

        container.innerHTML = categories.map(cat => `
            <div class="cat-card hover-card" data-id="${cat.id}">
                <img src="${cat.image_url}" alt="${cat.name}">
                <h4>${cat.name}</h4>
                <p>${cat.description.substring(0, 100)}...</p>
            </div>
        `).join("");

        // Click → navegar por ID porque tu backend NO usa slugs en categorías
        [...container.querySelectorAll(".cat-card")].forEach(card => {
            card.addEventListener("click", () => {
                const id = card.dataset.id;
                window.location.href = `category.html?id=${id}`;
            });
        });

    } catch (err) {
        console.error("Error cargando categorías:", err);
        container.innerHTML = "<p>No se pudieron cargar las categorías.</p>";
    }
}
