/**
 * @file destinationsPage.js
 * @description Lógica CRUD del módulo de Destinos dentro del Panel Administrativo.
 *              Incluye carga de tabla, modales, subida de imágenes y edición.
 * @module destinationsPage
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ========================================================================
                    RENDER PRINCIPAL DE LA PÁGINA
   ======================================================================== */

/**
 * Renderiza la tabla de destinos y configura todos los eventos
 * asociados (añadir, editar, eliminar).
 *
 * @async
 * @function renderDestinations
 */
export async function renderDestinations() {
    const tbody = document.getElementById("destinationsTableBody");
    tbody.innerHTML = "<tr><td colspan='6'>Cargando destinos...</td></tr>";

    // Backend devuelve { ok:true, data:[...] } → apiGet te devuelve directamente el array
    const destinations = await apiGet("/destinations");
    const categories = await apiGet("/categories");

    tbody.innerHTML = "";

    destinations.forEach(dest => {
        const row = document.createElement("tr");

        // mainImageUrl viene del backend en camelCase
        const imgSrc = dest.mainImageUrl
            ? `/uploads/${dest.mainImageUrl}`
            : "assets/placeholder.png";

        row.innerHTML = `
            <td>${dest.id}</td>
            <td><img src="${imgSrc}" class="admin-thumb"></td>
            <td>${dest.name}</td>
            <td>${categories.find(c => c.id === dest.categoryId)?.name || "-"}</td>
            <td>${dest.isFeatured ? "⭐" : ""}</td>
            <td class="actions-cell">
                <button class="admin-btn-small edit-btn" data-id="${dest.id}">Editar</button>
                <button class="admin-btn-small delete-btn" data-id="${dest.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    setupAddDestinationModal(categories);
    setupEditButtons(categories);
    setupDeleteButtons();
}


/* ============================================================  
                MODAL — AÑADIR DESTINO 
 ============================================================ */
function setupAddDestinationModal(categories) {
    document.getElementById("btnOpenAddDestination").onclick = async () => {
        const container = document.getElementById("destinationModalContainer");
        container.innerHTML = await fetch("components/modals/modalAddDestination.html").then(r => r.text());

        // Cerrar
        document.getElementById("closeAddDestination").onclick = () => container.innerHTML = "";

        // Llenar categorías
        const sel = document.getElementById("addDestCategory");
        sel.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

        // Submit
        document.getElementById("formAddDestination").onsubmit = async e => {
            e.preventDefault();

            const fd = new FormData();
            fd.append("name", document.getElementById("addDestName").value);
            fd.append("summary", document.getElementById("addDestSummary").value);
            fd.append("description", document.getElementById("addDestDescription").value);
            fd.append("category_id", document.getElementById("addDestCategory").value);
            fd.append("is_featured", document.getElementById("addDestIsFeatured").checked ? 1 : 0);

            const imgMain = document.getElementById("addDestImage").files[0];
            if (imgMain) fd.append("main_image", imgMain);

            const imgHero = document.getElementById("addDestHeroImage").files[0];
            if (imgHero) fd.append("hero_image", imgHero);

            await apiPostFile("/destinations", fd);

            container.innerHTML = "";
            renderDestinations();
        };
    };
}

/* ============================================================
                    MODAL — EDITAR DESTINO
============================================================ */
function setupEditButtons(categories) {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("destinationModalContainer");

            // Cargar HTML del modal
            container.innerHTML = await fetch("components/modals/modalEditDestination.html")
                .then(r => r.text());

            // Pequeña espera para asegurar que el DOM del modal se inserta
            await new Promise(resolve => setTimeout(resolve, 20));

            // 🚨 Muy importante: apiGet ya devuelve el objeto data directo
            const dest = await apiGet(`/destinations/${id}`);

            // --- Rellenar campos base ---
            document.getElementById("editDestId").value = dest.id;
            document.getElementById("editDestName").value = dest.name || "";
            document.getElementById("editDestSummary").value = dest.summary || "";
            document.getElementById("editDestDescription").value = dest.description || "";
            document.getElementById("editDestIsFeatured").checked =
                dest.isFeatured === 1 || dest.isFeatured === true;

            // --- Llenar categorías ---
            const sel = document.getElementById("editDestCategory");
            sel.innerHTML = categories
                .map(c => `
                    <option value="${c.id}" ${c.id === dest.categoryId ? "selected" : ""}>
                        ${c.name}
                    </option>
                `)
                .join("");

            // --- Botón cerrar ---
            document.getElementById("closeEditDestination").onclick = () => {
                container.innerHTML = "";
            };

            // --- Submit actualización ---
            document.getElementById("formEditDestination").onsubmit = async e => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("name", document.getElementById("editDestName").value);
                fd.append("summary", document.getElementById("editDestSummary").value);
                fd.append("description", document.getElementById("editDestDescription").value);
                fd.append("category_id", document.getElementById("editDestCategory").value);
                fd.append(
                    "is_featured",
                    document.getElementById("editDestIsFeatured").checked ? 1 : 0
                );

                const imgMain = document.getElementById("editDestImage").files[0];
                if (imgMain) fd.append("main_image", imgMain);

                const imgHero = document.getElementById("editDestHeroImage").files[0];
                if (imgHero) fd.append("hero_image", imgHero);

                await apiPutFile(`/destinations/${id}`, fd);

                container.innerHTML = "";
                renderDestinations();
            };
        };
    });
}


/* ============================================================
                        ELIMINAR DESTINO
============================================================ */
function setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar este destino?")) return;

            await apiDelete(`/destinations/${id}`);
            renderDestinations();
        };
    });
}

/* ============================================================
                        INICIALIZAR PÁGINA
============================================================ */
export async function initDestinationsPage() {
    const resCategories = await apiGet("/categories");
    const categories = resCategories.data;

    const resDestinations = await apiGet("/destinations");
    const destinations = resDestinations.data;

    renderDestinations(destinations, categories);
}