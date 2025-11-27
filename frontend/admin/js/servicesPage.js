/**
 * @file servicesPage.js
 * @description Panel Admin — Gestión de Servicios Turísticos
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ===========================================================================
   1. RENDER PRINCIPAL
   =========================================================================== */

export async function renderServices() {
    const tbody = document.getElementById("servicesTableBody");
    tbody.innerHTML = `<tr><td colspan="8">Cargando servicios...</td></tr>`;

    try {
        // Obtenemos arrays estándar
        const servicesRes = await apiGet("/services");
        const typesRes = await apiGet("/service-types");

        const services = servicesRes.data || servicesRes || [];
        const serviceTypes = typesRes.data || typesRes || [];

        tbody.innerHTML = "";

        services.forEach(svc => {
            const typeName =
                serviceTypes.find(t => t.id === svc.service_type_id)?.name || "-";

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${svc.id}</td>

                <td>
                     <img 
                    src="${svc.image_url ? "/uploads/" + svc.image_url : "../assets/placeholder.png"}"
                    alt="${svc.name}" 
                    class="admin-thumb"
        >
                </td>

                <td>${svc.name}</td>
                <td>${typeName}</td>
                <td>${svc.location || "-"}</td>
                <td>${svc.price_min && svc.price_max ? `S/ ${svc.price_min} - S/ ${svc.price_max}` : "-"}</td>

                <td class="actions-cell">
                    <button class="admin-btn-small edit-btn" data-id="${svc.id}">
                        Editar
                    </button>

                    <button class="admin-btn-small delete-btn" data-id="${svc.id}">
                        Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        /* Activar modales */
        setupAddServiceButton(serviceTypes);
        setupEditButtons(serviceTypes);
        setupDeleteButtons();

    } catch (err) {
        console.error("Error al cargar servicios:", err);
        tbody.innerHTML = `<tr><td colspan="8">Error al cargar servicios.</td></tr>`;
    }
}

/* ===========================================================================
   2. AÑADIR SERVICIO
   =========================================================================== */

function setupAddServiceButton(serviceTypes) {
    const btn = document.getElementById("btnAddService");
    if (!btn) return;

    btn.onclick = async () => {
        const container = document.getElementById("serviceModalContainer");
        if (!container) return;

        const html = await fetch("components/modals/modalAddService.html").then(r => r.text());
        container.innerHTML = html;

        await new Promise(r => setTimeout(r, 20));

        // Rellenar tipos
        const selectType = document.getElementById("serviceTypeId");
        selectType.innerHTML = serviceTypes
            .map(t => `<option value="${t.id}">${t.name}</option>`)
            .join("");

        // Cerrar modal
        document.getElementById("closeAddService").onclick = () => {
            container.innerHTML = "";
        };

        // Guardar
        document.getElementById("formAddService").onsubmit = async e => {
            e.preventDefault();

            const fd = new FormData();
            fd.append("service_type_id", document.getElementById("serviceTypeId").value);
            fd.append("name", document.getElementById("serviceName").value);
            fd.append("location", document.getElementById("serviceLocation").value);
            fd.append("description", document.getElementById("serviceDescription").value);
            fd.append("price_min", document.getElementById("servicePriceMin").value);
            fd.append("price_max", document.getElementById("servicePriceMax").value);

            const img = document.getElementById("serviceImage").files[0];
            if (img) fd.append("image", img);

            await apiPostFile("/services", fd);

            container.innerHTML = "";
            renderServices();
        };
    };
}

/* ===========================================================================
   3. EDITAR SERVICIO
   =========================================================================== */

function setupEditButtons(serviceTypes) {
    const buttons = document.querySelectorAll(".edit-btn");

    buttons.forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("serviceModalContainer");

            const html = await fetch("components/modals/modalEditService.html").then(r => r.text());
            container.innerHTML = html;

            await new Promise(r => setTimeout(r, 20));

            /* Obtener servicio */
            const svcRes = await apiGet(`/services/${id}`);
            const svc = svcRes.data || svcRes;

            /* Rellenar formulario */
            document.getElementById("editServiceId").value = svc.id;
            document.getElementById("editServiceName").value = svc.name;
            document.getElementById("editServiceLocation").value = svc.location || "";
            document.getElementById("editServiceDescription").value = svc.description || "";
            document.getElementById("editServicePriceMin").value = svc.price_min ?? "";
            document.getElementById("editServicePriceMax").value = svc.price_max ?? "";

            /* Select de tipos */
            const selectType = document.getElementById("editServiceTypeId");

            selectType.innerHTML = serviceTypes
                .map(t =>
                    `<option value="${t.id}" ${t.id === svc.service_type_id ? "selected" : ""}>
                        ${t.name}
                    </option>`
                )
                .join("");

            /* Cerrar modal */
            document.getElementById("closeEditService").onclick = () => {
                container.innerHTML = "";
            };

            /* Submit actualización */
            document.getElementById("formEditService").onsubmit = async e => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("service_type_id", document.getElementById("editServiceTypeId").value);
                fd.append("name", document.getElementById("editServiceName").value);
                fd.append("location", document.getElementById("editServiceLocation").value);
                fd.append("description", document.getElementById("editServiceDescription").value);
                fd.append("price_min", document.getElementById("editServicePriceMin").value);
                fd.append("price_max", document.getElementById("editServicePriceMax").value);

                const img = document.getElementById("editServiceImage").files[0];
                if (img) fd.append("image", img);

                await apiPutFile(`/services/${id}`, fd);

                container.innerHTML = "";
                renderServices();
            };
        };
    });
}

/* ===========================================================================
   4. ELIMINAR SERVICIO
   =========================================================================== */

function setupDeleteButtons() {
    const buttons = document.querySelectorAll(".delete-btn");

    buttons.forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Seguro que deseas eliminar este servicio?")) return;

            await apiDelete(`/services/${id}`);
            renderServices();
        };
    });
}

/* ===========================================================================
   5. INICIALIZADOR
   =========================================================================== */

export function initServicesPage() {
    renderServices();
}
