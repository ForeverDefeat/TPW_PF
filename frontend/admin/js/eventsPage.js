/**
 * @file eventsPage.js
 * @description Lógica CRUD de Eventos para el Panel Administrativo.
 *              Maneja tabla, modales, creación, edición y eliminación.
 * @module eventsPage
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ===========================================================================
   1. RENDER PRINCIPAL
   =========================================================================== */

/**
 * Renderiza la tabla de eventos.
 * Obtiene destinos y servicios para rellenar selects.
 *
 * @async
 * @function renderEvents
 */
export async function renderEvents() {
    const tbody = document.getElementById("eventsTableBody");
    tbody.innerHTML = `<tr><td colspan="6">Cargando eventos...</td></tr>`;

    try {
        // Obtener datos
        const eventsRes = await apiGet("/events");
        const destinationsRes = await apiGet("/destinations");
        const servicesRes = await apiGet("/services");

        const events = eventsRes.data || [];
        const destinations = destinationsRes.data || [];
        const services = servicesRes.data || [];

        tbody.innerHTML = "";

        events.forEach(evt => {
            const destName = destinations.find(d => d.id === evt.destination_id)?.name || "-";
            const svcName = services.find(s => s.id === evt.service_id)?.name || "-";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${evt.id}</td>
                <td><img src="${evt.image_url}" class="admin-thumb"></td>
                <td>${evt.title}</td>
                <td>${destName}</td>
                <td>${svcName}</td>
                <td>
                    <button class="admin-btn-small edit-event-btn" data-id="${evt.id}">
                        Editar
                    </button>
                    <button class="admin-btn-small delete-event-btn" data-id="${evt.id}">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        setupAddEventModal(destinations, services);
        setupEditButtons(destinations, services);
        setupDeleteButtons();

    } catch (err) {
        console.error("Error cargando eventos:", err);
        tbody.innerHTML = `<tr><td colspan="6">Error al cargar eventos.</td></tr>`;
    }
}

/* ===========================================================================
   2. MODAL: AÑADIR EVENTO
   =========================================================================== */

function setupAddEventModal(destinations) {
    const btn = document.getElementById("btnOpenAddEvent");
    if (!btn) return;

    btn.onclick = async () => {
        const container = document.getElementById("eventModalContainer");

        container.innerHTML = await fetch("components/modals/modalAddEvent.html")
            .then(r => r.text());

        // Llenar SELECT destino
        document.getElementById("eventDestinationId").innerHTML =
            destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join("");

        // Cerrar modal
        document.getElementById("closeAddEvent").onclick = () => {
            container.innerHTML = "";
        };

        // SUBMIT
        document.getElementById("formAddEvent").onsubmit = async (e) => {
            e.preventDefault();

            const fd = new FormData();

            fd.append("title", document.getElementById("eventTitle").value);
            fd.append("description", document.getElementById("eventDescription").value);
            fd.append("destination_id", document.getElementById("eventDestinationId").value);
            fd.append("date", document.getElementById("eventDate").value);
            fd.append("location", document.getElementById("eventLocation").value);

            const img = document.getElementById("eventImage").files[0];
            if (img) fd.append("image", img);

            await apiPostFile("/events", fd);

            container.innerHTML = "";
            renderEvents();
        };
    };
}


/* ===========================================================================
   3. MODAL EDITAR EVENTO
   =========================================================================== */

function setupEditButtons(destinations, services) {
    document.querySelectorAll(".edit-event-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const container = document.getElementById("eventModalContainer");

            container.innerHTML = await fetch("components/modals/modalEditEvent.html")
                .then(r => r.text());

            // Obtener datos actuales
            const evtRes = await apiGet(`/events/${id}`);
            const evt = evtRes.data;

            // Llenar campos
            document.getElementById("editEventId").value = evt.id;
            document.getElementById("editEventTitle").value = evt.title;
            document.getElementById("editEventDescription").value = evt.description;

            document.getElementById("currentEventImage").src = evt.image_url;

            // Select Destino
            document.getElementById("editEventDestination").innerHTML =
                destinations.map(d => `
                    <option value="${d.id}" ${d.id === evt.destination_id ? "selected" : ""}>
                        ${d.name}
                    </option>
                `).join("");

            // Select Servicio
            document.getElementById("editEventService").innerHTML =
                services.map(s => `
                    <option value="${s.id}" ${s.id === evt.service_id ? "selected" : ""}>
                        ${s.name}
                    </option>
                `).join("");

            // Cerrar modal
            document.getElementById("closeEditEvent").onclick = () => {
                container.innerHTML = "";
            };

            // Guardar cambios
            document.getElementById("formEditEvent").onsubmit = async (e) => {
                e.preventDefault();

                const fd = new FormData();

                fd.append("title", document.getElementById("editEventTitle").value);
                fd.append("description", document.getElementById("editEventDescription").value);
                fd.append("destination_id", document.getElementById("editEventDestination").value);
                fd.append("service_id", document.getElementById("editEventService").value);

                const newImg = document.getElementById("editEventImage").files[0];
                if (newImg) fd.append("image", newImg);

                await apiPutFile(`/events/${id}`, fd);

                container.innerHTML = "";
                renderEvents();
            };
        };
    });
}

/* ===========================================================================
   4. ELIMINAR EVENTO
   =========================================================================== */

function setupDeleteButtons() {
    document.querySelectorAll(".delete-event-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar este evento?")) return;

            await apiDelete(`/events/${id}`);
            renderEvents();
        };
    });
}

/* ===========================================================================
   5. INIT
   =========================================================================== */

export function initEventsPage() {
    renderEvents();
}
