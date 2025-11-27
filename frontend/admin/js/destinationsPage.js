/**
 * @file destinationsPage.js
 * @description Lógica CRUD del módulo de Destinos dentro del Panel Administrativo.
 *              Incluye carga de tabla, modales, subida de imágenes y edición.
 * @module destinationsPage
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ========================================================================
   1. RENDER PRINCIPAL DE LA PÁGINA
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

    // Mostrar estado inicial mientras carga
    tbody.innerHTML = "<tr><td colspan='6'>Cargando destinos...</td></tr>";

    // 1. Obtener datos desde el backend
    const destinations = await apiGet("/destinations");
    const categories = await apiGet("/categories");

    // Limpiar tabla
    tbody.innerHTML = "";

    // 2. Pintar cada fila de la tabla
    destinations.forEach(dest => {
        const row = document.createElement("tr");

        row.innerHTML = `
    <td>${dest.id}</td>
    <td><img src="${dest.mainImageUrl}" class="admin-thumb"></td>
    <td>${dest.name}</td>
    <td>${categories.find(c => c.id === dest.categoryId)?.name || "-"}</td>
    <td>${dest.isFeatured ? "⭐" : ""}</td>
    <td class="actions-cell">
        <button class="admin-btn small edit-btn" data-id="${dest.id}">Editar</button>
        <button class="admin-btn small delete-btn" data-id="${dest.id}">Eliminar</button>
    </td>
`;


        tbody.appendChild(row);
    });

    // 3. Activar modales y botones
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

            // Obtener datos del destino
            const res = await apiGet(`/destinations/${id}`);
            const dest = res.data;

            /* --- Rellenar campos del modal --- */
            document.getElementById("editDestId").value = dest.id;
            document.getElementById("editDestName").value = dest.name;
            document.getElementById("editDestSummary").value = dest.summary || "";
            document.getElementById("editDestDescription").value = dest.description || "";
            document.getElementById("editDestIsFeatured").checked = dest.isFeatured ? true : false;

            // Categorías
            const sel = document.getElementById("editDestCategory");
            sel.innerHTML = categories
                .map(c => `
                    <option value="${c.id}" ${c.id === dest.categoryId ? "selected" : ""}>
                        ${c.name}
                    </option>
                `)
                .join("");

            // Cerrar modal
            document.getElementById("closeEditDestination").onclick = () => {
                container.innerHTML = "";
            };

            /* --- Submit actualización --- */
            document.getElementById("formEditDestination").onsubmit = async e => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("name", document.getElementById("editDestName").value);
                fd.append("summary", document.getElementById("editDestSummary").value);
                fd.append("description", document.getElementById("editDestDescription").value);
                fd.append("category_id", document.getElementById("editDestCategory").value);
                fd.append("is_featured", document.getElementById("editDestIsFeatured").checked ? 1 : 0);

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