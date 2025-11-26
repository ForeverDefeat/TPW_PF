/**
 * @file eventsFollowedPage.js
 * @description Controlador del módulo "Eventos Seguidos" del panel admin.
 *              Permite listar, añadir, editar y eliminar seguimientos
 *              entre usuarios y eventos.
 * @module eventsFollowedPage
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./adminApi.js";

/* ============================================================================
   1. RENDER PRINCIPAL
   ============================================================================ */

/**
 * Carga y muestra en tabla todos los registros de eventos seguidos.
 *
 * @async
 * @function renderEventsFollowed
 */
export async function renderEventsFollowed() {
    const tbody = document.getElementById("eventsFollowedTableBody");
    tbody.innerHTML = `<tr><td colspan="6">Cargando...</td></tr>`;

    try {
        const follows = (await apiGet("/events-followed")).data;
        const users = (await apiGet("/users")).data;
        const events = (await apiGet("/events")).data;

        tbody.innerHTML = "";

        follows.forEach(f => {
            const user = users.find(u => u.id === f.user_id);
            const event = events.find(e => e.id === f.event_id);

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${f.id}</td>
                <td>${user?.full_name || "-"}</td>
                <td>${user?.email || "-"}</td>
                <td>${event?.title || "-"}</td>
                <td>${event?.event_date || "-"}</td>
                <td class="actions-cell">
                    <button class="admin-btn small edit-banner-btn" data-id="${f.id}">Editar</button>
                    <button class="admin-btn small delete-banner-btn" data-id="${f.id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        setupAddEventFollowButton(users, events);
        setupEditButtons(users, events);
        setupDeleteButtons();

    } catch (err) {
        console.error("Error cargando eventos seguidos:", err);
        tbody.innerHTML = `<tr><td colspan="6">Error al cargar datos.</td></tr>`;
    }
}

/* ============================================================================
   2. AÑADIR SEGUIMIENTO
   ============================================================================ */

/**
 * Inserta opciones en un <select>.
 */
function fillSelect(selectId, items, labelExtractor) {
    const select = document.getElementById(selectId);
    select.innerHTML = items
        .map(i => `<option value="${i.id}">${labelExtractor(i)}</option>`)
        .join("");
}

/**
 * Configura el botón para añadir seguimiento.
 *
 * @param {Array} users
 * @param {Array} events
 */
function setupAddEventFollowButton(users, events) {
    const btn = document.getElementById("btnAddEventFollow");
    if (!btn) return;

    btn.onclick = async () => {
        const container = document.getElementById("eventsFollowedModalContainer");

        const html = await fetch("components/modals/modalAddEventFollow.html")
            .then(r => r.text());
        container.innerHTML = html;

        fillSelect("followUserId", users, u => `${u.full_name} (${u.email})`);
        fillSelect("followEventId", events, e => e.title);

        document.getElementById("closeAddEventFollow").onclick = () => {
            container.innerHTML = "";
        };

        document.getElementById("formAddEventFollow").onsubmit = async e => {
            e.preventDefault();

            await apiPost("/events-followed", {
                user_id: parseInt(document.getElementById("followUserId").value),
                event_id: parseInt(document.getElementById("followEventId").value)
            });

            container.innerHTML = "";
            await renderEventsFollowed();
        };
    };
}

/* ============================================================================
   3. EDITAR SEGUIMIENTO
   ============================================================================ */

function setupEditButtons(users, events) {
    document.querySelectorAll(".edit-follow-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            const follow = (await apiGet(`/events-followed/${id}`)).data;

            const container = document.getElementById("eventsFollowedModalContainer");
            const html = await fetch("components/modals/modalEditEventFollow.html")
                .then(r => r.text());
            container.innerHTML = html;

            fillSelect("editFollowUserId", users, u => `${u.full_name} (${u.email})`);
            fillSelect("editFollowEventId", events, e => e.title);

            document.getElementById("editFollowId").value = id;
            document.getElementById("editFollowUserId").value = follow.user_id;
            document.getElementById("editFollowEventId").value = follow.event_id;

            document.getElementById("closeEditEventFollow").onclick = () => {
                container.innerHTML = "";
            };

            document.getElementById("formEditEventFollow").onsubmit = async e => {
                e.preventDefault();

                await apiPut(`/events-followed/${id}`, {
                    user_id: parseInt(document.getElementById("editFollowUserId").value),
                    event_id: parseInt(document.getElementById("editFollowEventId").value)
                });

                container.innerHTML = "";
                await renderEventsFollowed();
            };
        };
    });
}

/* ============================================================================
   4. ELIMINAR SEGUIMIENTO
   ============================================================================ */

function setupDeleteButtons() {
    document.querySelectorAll(".delete-follow-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar seguimiento?")) return;

            await apiDelete(`/events-followed/${id}`);
            await renderEventsFollowed();
        };
    });
}

/* ============================================================================
   5. INICIALIZACIÓN
   ============================================================================ */

/**
 * Punto de entrada del módulo Events-Followed.
 */
export function initEventsFollowedPage() {
    renderEventsFollowed();
}
