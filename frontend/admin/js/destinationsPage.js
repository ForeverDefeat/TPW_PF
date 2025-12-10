/**
 * @file destinationsPage.js
 * @description Módulo CRUD de Destinos en el Panel Administrativo.
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ============================================================================
                                RENDER PRINCIPAL
============================================================================ */

export async function renderDestinations() {
    const tbody = document.getElementById("destinationsTableBody");
    tbody.innerHTML = "<tr><td colspan='6'>Cargando destinos...</td></tr>";

    const categories = await apiGet("/categories");
    const destinations = await apiGet("/destinations");

    tbody.innerHTML = "";

    destinations.forEach(dest => {
        const imgSrc = dest.main_image_url
            ? (dest.main_image_url.startsWith("/uploads/")
                ? dest.main_image_url
                : `/uploads/${dest.main_image_url}`)
            : "assets/placeholder.png";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dest.id}</td>
            <td><img src="${imgSrc}" class="admin-thumb"></td>
            <td>${dest.name}</td>
            <td>${categories.find(c => c.id === dest.category_id)?.name || "-"}</td>

            <td>${dest.latitude ?? "-"} / ${dest.longitude ?? "-"}</td>

            <td>${dest.is_featured ? "⭐" : ""}</td>
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

/* ============================================================================
                        MODAL — AÑADIR DESTINO
============================================================================ */

function setupAddDestinationModal(categories) {
    document.getElementById("btnOpenAddDestination").onclick = async () => {
        const container = document.getElementById("destinationModalContainer");
        container.innerHTML = await fetch("components/modals/modalAddDestination.html").then(r => r.text());

        document.getElementById("closeAddDestination").onclick = () => (container.innerHTML = "");

        const sel = document.getElementById("addDestCategory");
        sel.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

        document.getElementById("formAddDestination").onsubmit = async e => {
            e.preventDefault();

            const fd = new FormData();
            fd.append("name", document.getElementById("addDestName").value);
            fd.append("summary", document.getElementById("addDestSummary").value);
            fd.append("description", document.getElementById("addDestDescription").value);
            fd.append("category_id", sel.value);
            fd.append("is_featured", document.getElementById("addDestIsFeatured").checked ? 1 : 0);

            fd.append("latitude", document.getElementById("addDestLatitude").value || "");
            fd.append("longitude", document.getElementById("addDestLongitude").value || "");

            if (document.getElementById("addDestImage").files[0])
                fd.append("main_image", document.getElementById("addDestImage").files[0]);

            if (document.getElementById("addDestHeroImage").files[0])
                fd.append("hero_image", document.getElementById("addDestHeroImage").files[0]);

            await apiPostFile("/destinations", fd);

            container.innerHTML = "";
            renderDestinations();
        };
    };
}

/* ============================================================================
                        MODAL — EDITAR DESTINO
============================================================================ */

function setupEditButtons(categories) {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("destinationModalContainer");

            container.innerHTML = await fetch("components/modals/modalEditDestination.html").then(r => r.text());
            await new Promise(res => setTimeout(res, 20));

            const dest = await apiGet(`/destinations/${id}`);

            document.getElementById("editDestId").value = dest.id;
            document.getElementById("editDestName").value = dest.name;

            document.getElementById("editDestLatitude").value = dest.latitude ?? "";
            document.getElementById("editDestLongitude").value = dest.longitude ?? "";

            document.getElementById("editDestSummary").value = dest.summary || "";
            document.getElementById("editDestDescription").value = dest.description || "";
            document.getElementById("editDestIsFeatured").checked = dest.is_featured == 1;

            const sel = document.getElementById("editDestCategory");
            sel.innerHTML = categories
                .map(c => `
                    <option value="${c.id}" ${c.id === dest.category_id ? "selected" : ""}>
                        ${c.name}
                    </option>
                `)
                .join("");

            document.getElementById("closeEditDestination").onclick = () => (container.innerHTML = "");

            document.getElementById("formEditDestination").onsubmit = async e => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("name", document.getElementById("editDestName").value);
                fd.append("summary", document.getElementById("editDestSummary").value);
                fd.append("description", document.getElementById("editDestDescription").value);
                fd.append("category_id", sel.value);
                fd.append("is_featured", document.getElementById("editDestIsFeatured").checked ? 1 : 0);

                fd.append("latitude", document.getElementById("editDestLatitude").value || "");
                fd.append("longitude", document.getElementById("editDestLongitude").value || "");


                if (document.getElementById("editDestImage").files[0])
                    fd.append("main_image", document.getElementById("editDestImage").files[0]);

                if (document.getElementById("editDestHeroImage").files[0])
                    fd.append("hero_image", document.getElementById("editDestHeroImage").files[0]);

                await apiPutFile(`/destinations/${id}`, fd);

                container.innerHTML = "";
                renderDestinations();
            };
        };
    });
}

/* ============================================================================
                                ELIMINAR DESTINO
============================================================================ */

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

/* ============================================================================
                                INICIALIZACIÓN
============================================================================ */

export async function initDestinationsPage() {
    await renderDestinations(); // ← la forma correcta
}
