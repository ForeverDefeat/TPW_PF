import { getCategories } from "../api.js";

document.addEventListener("componentsLoaded", async () => {

    const container = document.getElementById("categoriesContainer");
    if (!container) return;

    try {
        const res = await getCategories();

        const categories = res.categories ?? res;

        if (!Array.isArray(categories)) throw new Error("categories no es un array");

        container.innerHTML = categories.map(cat => `
            <div class="cat-card">
                <img src="${cat.image_url}" alt="${cat.name}">
                <h4>${cat.name}</h4>
                <p>${cat.description}</p>
            </div>
        `).join("");

        console.log("✔ Categorías cargadas:", categories);

    } catch (err) {
        console.error("❌ Error cargando categorías:", err);
    }
});
