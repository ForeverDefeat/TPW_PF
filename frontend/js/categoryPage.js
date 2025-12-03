import { apiGet } from "./api.js";
import { destinationCardTemplate } from "./templates.js";

document.addEventListener("componentsLoaded", loadCategoryPage);

async function loadCategoryPage() {

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const idParam = params.get("id");

    const titleEl = document.getElementById("categoryTitle");
    const listEl = document.getElementById("destinationsList");
    const heroEl = document.getElementById("categoryHero");

    let category = null;

    try {

        // ----------------------------------------
        //  🔵 1. Resolver categoría por SLUG o ID
        // ----------------------------------------
        if (slug) {
            const res = await apiGet(`/categories/slug/${slug}`);
            if (res.ok) category = res.category;
        }
        else if (idParam) {
            const res = await apiGet(`/categories/${idParam}`);
            if (res.ok) category = res.category;
        }

        // Si no hay categoría -> mostrar error
        if (!category) {
            titleEl.textContent = "Categoría no encontrada";
            heroEl.style.backgroundImage = "linear-gradient(#bbb, #888)";
            return;
        }

        // ----------------------------------------
        //  🔵 2. Mostrar datos de categoría
        // ----------------------------------------
        titleEl.textContent = category.name;
        heroEl.style.backgroundImage = `url(${category.image_url})`;

        // ----------------------------------------
        //  🔵 3. Cargar destinos por categoría
        // ----------------------------------------
        const resDest = await apiGet(`/destinations/category/${category.id}`);

        if (!resDest.ok || !Array.isArray(resDest.data) || resDest.data.length === 0) {
            listEl.innerHTML = "<p>No hay destinos disponibles para esta categoría.</p>";
            return;
        }

        // Renderizar destinos
        listEl.innerHTML = resDest.data
            .map(destinationCardTemplate)
            .join("");

        // Activar clic en cada destino
        document.querySelectorAll(".cat-card.hover-card").forEach(card => {
            card.addEventListener("click", () => {
                const slug = card.dataset.slug;
                if (slug) {
                    window.location.href = `destination.html?slug=${slug}`;
                } else {
                    console.error("Destino sin slug", card);
                }
            });
        });


    } catch (err) {
        console.error("Error cargando categoría:", err);
        listEl.innerHTML = "<p>Error cargando destinos.</p>";
    }
}
