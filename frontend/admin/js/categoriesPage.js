/**
 * @file categoriesPage.js
 * @description Lógica CRUD del módulo de Categorías con subida de imagen.
 * @module categoriesPage
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ========================================================================
   1. RENDER PRINCIPAL DE LA TABLA
   ======================================================================== */

/**
 * Renderiza la tabla de categorías y activa los botones CRUD.
 * @async
 */
export async function renderCategories() {
    const tbody = document.getElementById("categoriesTableBody");
    tbody.innerHTML = "<tr><td colspan='4'>Cargando categorías...</td></tr>";

    const categories = await apiGet("/categories");
    tbody.innerHTML = "";

    categories.forEach(cat => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cat.id}</td>
            <td><img src="${cat.image_url}" class="admin-thumb"></td>
            <td>${cat.name}</td>
            <td>
                <button class="admin-btn-small edit-btn" data-id="${cat.id}">Editar</button>
                <button class="admin-btn-small delete-btn" data-id="${cat.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    setupAddCategoryModal();
    setupEditButtons();
    setupDeleteButtons();
}

/* ========================================================================
   2. MODAL: AÑADIR CATEGORÍA
   ======================================================================== */

/**
 * Abre modal “Añadir Categoría” y maneja el submit con subida de imagen.
 */
function setupAddCategoryModal() {
    document.getElementById("btnOpenAddCategory").onclick = async () => {
        const container = document.getElementById("categoryModalContainer");

        container.innerHTML = await fetch("components/modals/modalAddCategory.html")
            .then(r => r.text());

        document.getElementById("closeAddCategory").onclick = () => {
            container.innerHTML = "";
        };

        document.getElementById("formAddCategory").onsubmit = async (e) => {
            e.preventDefault();

            const fd = new FormData();
            fd.append("name", document.getElementById("addCatName").value);
            fd.append("description", document.getElementById("addCatDesc").value);

            const img = document.getElementById("addCatImage").files[0];
            if (img) fd.append("image", img);

            await apiPostFile("/categories", fd);

            container.innerHTML = "";
            renderCategories();
        };
    };
}


/* ========================================================================
   3. MODAL: EDITAR CATEGORÍA
   ======================================================================== */

function setupEditButtons() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("categoryModalContainer");

            container.innerHTML = await fetch("components/modals/modalEditCategory.html")
                .then(r => r.text());

            const data = await apiGet(`/categories/${id}`);

            document.getElementById("editCatId").value = data.id;
            document.getElementById("editCatName").value = data.name;
            document.getElementById("editCatDesc").value = data.description;

            document.getElementById("closeEditCategory").onclick = () => {
                container.innerHTML = "";
            };

            // Submit
            document.getElementById("formEditCategory").onsubmit = async (e) => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("name", document.getElementById("editCatName").value);
                fd.append("description", document.getElementById("editCatDescription").value);

                const newImg = document.getElementById("editCatImage").files[0];
                if (newImg) fd.append("image", newImg); // opcional

                await apiPutFile(`/categories/${id}`, fd);

                container.innerHTML = "";
                renderCategories();
            };
        };
    });
}

/* ========================================================================
   4. ELIMINAR CATEGORÍA
   ======================================================================== */

function setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar esta categoría?")) return;

            await apiDelete(`/categories/${id}`);

            renderCategories();
        };
    });
}

/**
 * Inicializa la página de categorías
 */
export function initCategoriesPage() {
    renderCategories();
}

