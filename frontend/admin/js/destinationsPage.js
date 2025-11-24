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
            <td><img src="${dest.main_image_url}" class="admin-thumb"></td>
            <td>${dest.name}</td>
            <td>${categories.find(c => c.id === dest.category_id)?.name || "-"}</td>
            <td>${dest.is_featured ? "⭐" : ""}</td>
            <td>
                <button class="admin-btn-small edit-btn" data-id="${dest.id}">Editar</button>
                <button class="admin-btn-small delete-btn" data-id="${dest.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // 3. Activar modales y botones
    setupAddDestinationModal(categories);
    setupEditButtons(categories);
    setupDeleteButtons();
}

/* ========================================================================
   2. MODAL: AÑADIR DESTINO
   ======================================================================== */

/**
 * Configura el botón “Añadir Destino” y carga el modal
 * junto con la funcionalidad de guardado.
 *
 * @param {Array} categories - Lista de categorías para llenar el <select>
 */
function setupAddDestinationModal(categories) {
    const btn = document.getElementById("btnOpenAddDestination");

    btn.onclick = async () => {
        const container = document.getElementById("destinationModalContainer");

        // Cargar modal externo
        container.innerHTML = await fetch("components/modals/modalAddDestination.html")
            .then(r => r.text());

        // Llenar las categorías
        const sel = document.getElementById("destCategory");
        sel.innerHTML = categories
            .map(c => `<option value="${c.id}">${c.name}</option>`)
            .join("");

        // Botón cerrar modal
        document.getElementById("closeAddDestination").onclick = () => {
            container.innerHTML = "";
        };

        // Evento submit
        document.getElementById("formAddDestination").onsubmit = async (e) => {
            e.preventDefault();

            const fd = new FormData();

            // Campos base
            fd.append("name", document.getElementById("destName").value);
            fd.append("category_id", document.getElementById("destCategory").value);
            fd.append("summary", document.getElementById("destSummary").value);
            fd.append("description", document.getElementById("destDescription").value);
            fd.append("is_featured", document.getElementById("destIsFeatured").checked ? 1 : 0);

            // Archivos
            fd.append("main_image", document.getElementById("destImage").files[0]);

            const heroImg = document.getElementById("destHeroImage").files[0];
            if (heroImg) fd.append("hero_image", heroImg);

            // Enviar al backend
            await apiPostFile("/destinations", fd);

            // Cerrar modal
            container.innerHTML = "";
            renderDestinations();
        };
    };
}

/* ========================================================================
   3. MODAL: EDITAR DESTINO
   ======================================================================== */

/**
 * Activa los botones “Editar” para cada destino en la tabla.
 *
 * @param {Array} categories - Lista de categorías
 */
function setupEditButtons(categories) {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("destinationModalContainer");

            // Cargar modal
            container.innerHTML = await fetch("components/modals/modalEditDestination.html")
                .then(r => r.text());

            // Obtener datos actuales
            const data = await apiGet(`/destinations/${id}`);

            // Rellenar campos base
            document.getElementById("editDestId").value = data.id;
            document.getElementById("editDestName").value = data.name;
            document.getElementById("editDestSummary").value = data.summary || "";
            document.getElementById("editDestDescription").value = data.description || "";
            document.getElementById("editDestIsFeatured").checked = data.is_featured === 1;

            // Llenar categorías
            const sel = document.getElementById("editDestCategory");
            sel.innerHTML = categories
                .map(c => `
                    <option value="${c.id}" ${c.id === data.category_id ? "selected" : ""}>
                        ${c.name}
                    </option>
                `)
                .join("");

            // Botón cerrar
            document.getElementById("closeEditDestination").onclick = () => {
                container.innerHTML = "";
            };

            // Guardar cambios
            document.getElementById("formEditDestination").onsubmit = async (e) => {
                e.preventDefault();

                const fd = new FormData();

                // Datos principales
                fd.append("name", document.getElementById("editDestName").value);
                fd.append("category_id", document.getElementById("editDestCategory").value);
                fd.append("summary", document.getElementById("editDestSummary").value);
                fd.append("description", document.getElementById("editDestDescription").value);
                fd.append("is_featured", document.getElementById("editDestIsFeatured").checked ? 1 : 0);

                // Imágenes nuevas (opcionales)
                const newMainImg = document.getElementById("editDestImage").files[0];
                if (newMainImg) fd.append("main_image", newMainImg);

                const newHeroImg = document.getElementById("editDestHeroImage").files[0];
                if (newHeroImg) fd.append("hero_image", newHeroImg);

                // Enviar actualización
                await apiPutFile(`/destinations/${id}`, fd);

                container.innerHTML = "";
                renderDestinations();
            };
        };
    });
}

/* ========================================================================
   4. ELIMINAR DESTINO
   ======================================================================== */

/**
 * Habilita los botones para eliminar un destino.
 *
 * @function setupDeleteButtons
 */
function setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Realmente deseas eliminar este destino?")) return;

            await apiDelete(`/destinations/${id}`);

            renderDestinations();
        };
    });
}

/**
 * Inicializa la página de destinos
 */
export function initDestinationsPage() {
    renderDestinations();
}
