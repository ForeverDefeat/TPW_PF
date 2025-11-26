/**
 * @file servicesPage.js
 * @description Controlador del módulo "Servicios turísticos" en el panel admin.
 *              Maneja el renderizado de la tabla, apertura de modales y
 *              operaciones CRUD contra la API.
 * @module servicesPage
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ===========================================================================
   1. RENDER PRINCIPAL
   =========================================================================== */

/**
 * Renderiza la lista de servicios en la tabla principal.
 * Carga además los tipos de servicio para uso en los formularios.
 *
 * @async
 * @function renderServices
 */
export async function renderServices() {
    const tbody = document.getElementById("servicesTableBody");
    tbody.innerHTML = `<tr><td colspan="7">Cargando servicios...</td></tr>`;

    try {
        // 1. Obtener servicios y tipos de servicio desde el backend
        const servicesRes = await apiGet("/services");
        const typesRes = await apiGet("/service-types");

        const services = servicesRes.data || [];
        const serviceTypes = typesRes.data || [];

        // 2. Limpiar tabla
        tbody.innerHTML = "";

        // 3. Renderizar filas
        services.forEach(svc => {
            const tr = document.createElement("tr");

            const typeName =
                serviceTypes.find(t => t.id === svc.service_type_id)?.name || "-";

            tr.innerHTML = `
                <td>${svc.id}</td>
                <td>
                    <img
                        src="${svc.image_url || "../assets/placeholder.png"}"
                        alt="${svc.name}"
                        class="admin-thumb"
                    />
                </td>
                <td>${svc.name}</td>
                <td>${typeName}</td>
                <td>${svc.location || "-"}</td>
                <td>${svc.price_range || "-"}</td>
                <td class="actions-cell">
                    <button class="admin-btn small edit-banner-btn" data-id="${svc.id}">Editar</button>
                    <button class="admin-btn small delete-btn" data-id="${svc.id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // 4. Configurar eventos CRUD
        setupAddServiceButton(serviceTypes);
        setupEditButtons(serviceTypes);
        setupDeleteButtons();

    } catch (err) {
        console.error("Error al cargar servicios:", err);
        tbody.innerHTML = `<tr><td colspan="7">Error al cargar servicios.</td></tr>`;
    }
}

/* ===========================================================================
   2. AÑADIR SERVICIO
   =========================================================================== */

/**
 * Configura el botón "Añadir Servicio" para abrir el modal y manejar
 * el formulario de creación.
 *
 * @param {Array} serviceTypes - Lista de tipos de servicio.
 */
function setupAddServiceButton(serviceTypes) {
    const btn = document.getElementById("btnAddService");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        const container = document.getElementById("serviceModalContainer");
        if (!container) return;

        // Cargar HTML del modal
        const html = await fetch("components/modals/modalAddService.html")
            .then(res => res.text());

        container.innerHTML = html;

        // Rellenar <select> con tipos de servicio
        const selectType = document.getElementById("serviceTypeId");
        selectType.innerHTML = serviceTypes
            .map(t => `<option value="${t.id}">${t.name}</option>`)
            .join("");

        // Botón cerrar
        document.getElementById("closeAddService").onclick = () => {
            container.innerHTML = "";
        };

        // SUBMIT modal Añadir
        document.getElementById("formAddService").onsubmit = async (e) => {
            e.preventDefault();

            const fd = new FormData();

            fd.append("service_type_id", document.getElementById("serviceTypeId").value);
            fd.append("name", document.getElementById("serviceName").value);
            fd.append("location", document.getElementById("serviceLocation").value);
            fd.append("description", document.getElementById("serviceDescription").value);
            fd.append("price_range", document.getElementById("servicePriceRange").value);

            const img = document.getElementById("serviceImage").files[0];
            if (img) fd.append("image", img);

            await apiPostFile("/services", fd);

            container.innerHTML = "";
            await renderServices();
        };
    });
}

/* ===========================================================================
   3. EDITAR SERVICIO
   =========================================================================== */

/**
 * Activa los botones "Editar" de cada servicio.
 *
 * @param {Array} serviceTypes
 */
function setupEditButtons(serviceTypes) {
    const buttons = document.querySelectorAll(".edit-service-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("serviceModalContainer");
            if (!container) return;

            // Cargar modal
            const html = await fetch("components/modals/modalEditService.html")
                .then(res => res.text());
            container.innerHTML = html;

            // Obtener datos actuales
            const svcRes = await apiGet(`/services/${id}`);
            const svc = svcRes.data;

            // Rellenar campos
            document.getElementById("editServiceId").value = svc.id;
            document.getElementById("editServiceName").value = svc.name;
            document.getElementById("editServiceLocation").value = svc.location || "";
            document.getElementById("editServiceDescription").value = svc.description || "";
            document.getElementById("editServicePriceRange").value = svc.price_range || "";

            // Rellenar tipos
            const selectType = document.getElementById("editServiceTypeId");
            selectType.innerHTML = serviceTypes
                .map(t => `
                    <option value="${t.id}" ${t.id === svc.service_type_id ? "selected" : ""}>
                        ${t.name}
                    </option>
                `)
                .join("");

            // Botón cerrar
            document.getElementById("closeEditService").onclick = () => {
                container.innerHTML = "";
            };

            // Submit actualizar
            document.getElementById("formEditService").onsubmit = async (e) => {
                e.preventDefault();

                const fd = new FormData();

                fd.append("service_type_id", document.getElementById("editServiceTypeId").value);
                fd.append("name", document.getElementById("editServiceName").value);
                fd.append("location", document.getElementById("editServiceLocation").value);
                fd.append("description", document.getElementById("editServiceDescription").value);
                fd.append("price_range", document.getElementById("editServicePriceRange").value);

                const img = document.getElementById("editServiceImage").files[0];
                if (img) fd.append("image", img);

                await apiPutFile(`/services/${id}`, fd);

                container.innerHTML = "";
                await renderServices();
            };
        });
    });
}

/* ===========================================================================
   4. ELIMINAR SERVICIO
   =========================================================================== */

function setupDeleteButtons() {
    const buttons = document.querySelectorAll(".delete-service-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Seguro que deseas eliminar este servicio?")) return;

            await apiDelete(`/services/${id}`);
            await renderServices();
        });
    });
}

/* ===========================================================================
   5. INICIALIZADOR
   =========================================================================== */

export function initServicesPage() {
    renderServices();
}
