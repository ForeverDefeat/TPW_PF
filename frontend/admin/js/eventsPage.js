/**
 * @file eventsPage.js
 * @description Lógica CRUD de Eventos para el Panel Administrativo.
 *              Maneja tabla, modales, creación, edición y eliminación.
 * @module eventsPage
 */

import { apiGet, apiPostFile, apiPutFile, apiDelete } from "./adminApi.js";

/* ===========================================================================
   Helper: Formato de fecha bonito (12 Ago 2025)
   =========================================================================== */
function formatEventDate(dateStr) {
    if (!dateStr) return "-";

    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr; // por si viene raro

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const dia = d.getDate();
    const mes = meses[d.getMonth()];
    const anio = d.getFullYear();

    return `${dia} ${mes} ${anio}`;
}

/* ===========================================================================
   1. RENDER PRINCIPAL
   =========================================================================== */
export async function renderEvents() {
    const tbody = document.getElementById("eventsTableBody");
    tbody.innerHTML = `<tr><td colspan="7">Cargando eventos...</td></tr>`;

    try {
        const events = await apiGet("/events");          // ← YA ES ARRAY
        const destinations = await apiGet("/destinations");

        console.log("EVENTS:", events);
        console.log("DESTINATIONS:", destinations);

        tbody.innerHTML = "";

        events.forEach(evt => {
            const destName = destinations.find(d => d.id === evt.destination_id)?.name || "-";


            const imgSrc = evt.image_url
                ? `/uploads/${evt.image_url}`
                : "assets/placeholder.png";

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${evt.id}</td>
                <td>${evt.title}</td>
                <td>${destName}</td>
                <td>${evt.event_date ? evt.event_date.substring(0,10) : "-"}</td>
                <td>${evt.location || "-"}</td>
                <td>
                    ${evt.image_url 
                        ? `<img src="/uploads/${evt.image_url}" class="admin-thumb">`
                        : `<img src="/assets/placeholder.png" class="admin-thumb">`}
                </td>

                <td class="actions-cell">
                    <button class="admin-btn small edit-btn" data-id="${evt.id}">
                        Editar
                    </button>
                    <button class="admin-btn small delete-btn" data-id="${evt.id}">
                        Eliminar
                    </button>
                </td>
            `;


            tbody.appendChild(tr);
        });


        setupAddEventModal(destinations);
        setupEditButtons(destinations);
        setupDeleteButtons();

    } catch (err) {
        console.error("Error cargando eventos:", err);
        tbody.innerHTML = `<tr><td colspan="7">Error al cargar eventos.</td></tr>`;
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
        if (!container) return;

        // Cargar HTML del modal
        const html = await fetch("components/modals/modalAddEvent.html")
            .then(r => r.text());
        container.innerHTML = html;

        // Rellenar SELECT destino
        const selDest = document.getElementById("eventDestinationId");
        selDest.innerHTML = destinations
            .map(d => `<option value="${d.id}">${d.name}</option>`)
            .join("");

        // Cerrar
        document.getElementById("closeAddEvent").onclick = () => {
            container.innerHTML = "";
        };

        // Submit
        document.getElementById("formAddEvent").onsubmit = async (e) => {
            e.preventDefault();

            const fd = new FormData();
            fd.append("destination_id", document.getElementById("eventDestinationId").value);
            fd.append("title", document.getElementById("eventTitle").value);
            fd.append("description", document.getElementById("eventDescription").value);
            fd.append("event_date", document.getElementById("eventDate").value);
            fd.append("location", document.getElementById("eventLocation").value);

            const img = document.getElementById("eventImage").files[0];
            if (img) fd.append("image", img);

            await apiPostFile("/events", fd);

            container.innerHTML = "";
            await renderEvents();
        };
    };
}

/* ===========================================================================
   3. MODAL: EDITAR EVENTO (VERSIÓN CORREGIDA)
   =========================================================================== */

function setupEditButtons(destinations) {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {

            const id = btn.dataset.id;
            const container = document.getElementById("eventModalContainer");

            container.innerHTML = await fetch("components/modals/modalEditEvent.html")
                .then(r => r.text());

            await new Promise(res => setTimeout(res, 20));

            // OBTENER EVENTO
            const evt = await apiGet(`/events/${id}`);
            console.log("EVT EN EDIT:", evt);

            // RELLENAR CAMPOS
            document.getElementById("editEventId").value = evt.id;
            document.getElementById("editEventTitle").value = evt.title;
            document.getElementById("editEventDescription").value = evt.description || "";
            document.getElementById("editEventLocation").value = evt.location || "";

            if (evt.event_date) {
                document.getElementById("editEventDate").value =
                    evt.event_date.substring(0, 10);
            }

            // SELECT DESTINO
            document.getElementById("editEventDestinationId").innerHTML =
                destinations.map(d => `
                    <option value="${d.id}" ${d.id === evt.destination_id ? "selected" : ""}>
                        ${d.name}
                    </option>
                `).join("");

            // MOSTRAR IMAGEN ACTUAL
            document.getElementById("currentEventImage").src =
                evt.image_url
                    ? `/uploads/${evt.image_url}`
                    : "/assets/placeholder.png";   // Ruta correcta según tu estructura


            // PREVIEW NUEVA IMAGEN
            const newImgInput = document.getElementById("editEventImage");
            const preview = document.getElementById("previewNewEventImage");

            newImgInput.addEventListener("change", () => {
                const file = newImgInput.files[0];
                if (!file) {
                    preview.style.display = "none";
                    return;
                }
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
            });

            // CERRAR MODAL
            document.getElementById("closeEditEvent").onclick = () => {
                container.innerHTML = "";
            };

            // SUBMIT EDITAR
            document.getElementById("formEditEvent").onsubmit = async (e) => {
                e.preventDefault();

                const fd = new FormData();
                fd.append("title", document.getElementById("editEventTitle").value);
                fd.append("description", document.getElementById("editEventDescription").value);
                fd.append("destination_id", document.getElementById("editEventDestinationId").value);

                // 🔥 CORRECCIÓN IMPORTANTE:
                fd.append("event_date", document.getElementById("editEventDate").value);

                fd.append("location", document.getElementById("editEventLocation").value);

                const newImg = newImgInput.files[0];
                if (newImg) fd.append("image", newImg);

                console.log("IMAGEN ENVIADA:", newImg);


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
    const buttons = document.querySelectorAll(".delete-btn");

    buttons.forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            if (!confirm("¿Eliminar este evento?")) return;

            await apiDelete(`/events/${id}`);
            await renderEvents();
        };
    });
}

/* ===========================================================================
   5. INIT
   =========================================================================== */

export function initEventsPage() {
    renderEvents();
}
