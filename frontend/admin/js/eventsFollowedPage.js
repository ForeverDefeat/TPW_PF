/*** @file eventsFollowedPage.js
 *  @description Controlador del módulo "Eventos Seguidos"
 *  con filtrado por usuario, por evento y vista general.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./adminApi.js";

function formatDate(dateString) {
    if (!dateString) return "-";
    return dateString.split("T")[0];    // "2025-08-12"
}

/* ============================================================================
   1. RENDER PRINCIPAL
============================================================================ */

export async function renderEventsFollowed(filter = { type: "all", id: null }) {
    const tbody = document.getElementById("eventsFollowedTableBody");
    if (!tbody) return; // seguridad extra
    tbody.innerHTML = `<tr><td colspan="6">Cargando...</td></tr>`;

    try {
        // ====== Obtener usuarios ======
        const usersRes = await apiGet("/users");
        const users = Array.isArray(usersRes)
            ? usersRes
            : Array.isArray(usersRes.data)
                ? usersRes.data
                : [];

        // ====== Obtener eventos ======
        const eventsRes = await apiGet("/events");
        const events = Array.isArray(eventsRes)
            ? eventsRes
            : Array.isArray(eventsRes.data)
                ? eventsRes.data
                : [];

        // ====== Cargar SELECTS ======
        fillSelect("filterFollowUser", users, u => `${u.full_name} (${u.email})`, true);
        fillSelect("filterFollowEvent", events, e => e.title, true);

        // ====== Obtener eventos seguidos según filtro ======
        let followsRes;

        if (filter.type === "user") {
            followsRes = await apiGet(`/events-followed/user/${filter.id}`);
        } else if (filter.type === "event") {
            followsRes = await apiGet(`/events-followed/event/${filter.id}`);
        } else {
            followsRes = await apiGet("/events-followed");
        }

        // Normalización:
        const follows = Array.isArray(followsRes)
            ? followsRes
            : Array.isArray(followsRes.data)
                ? followsRes.data
                : [];

        // ====== Render de la tabla ======
        tbody.innerHTML = "";

        if (follows.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="6" style="padding: 1rem; text-align:center; color: var(--color-text-muted);">
                    No hay registros.
                </td></tr>
            `;
        } else {
            follows.forEach(f => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${f.id}</td>
                    <td>${f.full_name || "-"}</td>
                    <td>${f.email || "-"}</td>
                    <td>${f.title || "-"}</td>
                    <td>${formatDate(f.event_date)}</td>
                    <td class="actions-cell">
                        <button class="admin-btn small edit-btn" data-id="${f.id}">Editar</button>
                        <button class="admin-btn small delete-btn" data-id="${f.id}">Eliminar</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        }

        // Reasignar eventos
        setupFilters();
        setupAddEventFollowButton(users, events);
        setupEditButtons(users, events);
        setupDeleteButtons();

    } catch (err) {
        console.error("Error cargando eventos seguidos:", err);
        tbody.innerHTML = `<tr><td colspan="6">Error al cargar datos.</td></tr>`;
    }
}


/* ============================================================================
   2. FILTROS (usuario y evento)
============================================================================ */

function setupFilters() {

    // FILTRO POR USUARIO
    document.getElementById("filterFollowUser").onchange = e => {
        const id = parseInt(e.target.value);
        if (!id) return renderEventsFollowed(); // reset
        renderEventsFollowed({ type: "user", id });
    };

    // FILTRO POR EVENTO
    document.getElementById("filterFollowEvent").onchange = e => {
        const id = parseInt(e.target.value);
        if (!id) return renderEventsFollowed(); // reset
        renderEventsFollowed({ type: "event", id });
    };
}

/* ============================================================================
   3. UTILITY: Rellenar selects
============================================================================ */

function fillSelect(selectId, items, labelExtractor, includeDefault = false) {
    const select = document.getElementById(selectId);
    if (!select) return;

    let html = "";

    if (includeDefault) html += `<option value="">-- Todos --</option>`;

    html += items
        .map(i => `<option value="${i.id}">${labelExtractor(i)}</option>`)
        .join("");

    select.innerHTML = html;
}

/* ============================================================================
   4. AÑADIR REGISTRO
============================================================================ */

function setupAddEventFollowButton(users, events) {
    const btn = document.getElementById("btnAddEventFollow");
    if (!btn) return;

    btn.onclick = async () => {
        const container = document.getElementById("eventsFollowedModalContainer");
        const html = await fetch("components/modals/modalAddEventFollow.html").then(r => r.text());
        container.innerHTML = html;

        fillSelect("followUserId", users, u => `${u.full_name} (${u.email})`);
        fillSelect("followEventId", events, e => e.title);

        document.getElementById("closeAddEventFollow").onclick = () => { container.innerHTML = ""; };

        document.getElementById("formAddEventFollow").onsubmit = async e => {
            e.preventDefault();

            await apiPost("/events-followed", {
                user_id: parseInt(document.getElementById("followUserId").value),
                event_id: parseInt(document.getElementById("followEventId").value)
            });

            container.innerHTML = "";
            renderEventsFollowed();
        };
    };
}

/* ============================================================================
   5. EDITAR REGISTRO
============================================================================ */

function setupEditButtons(users, events) {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = async () => {

            const id = btn.dataset.id;
            const follow = (await apiGet(`/events-followed/${id}`)).data;

            const container = document.getElementById("eventsFollowedModalContainer");
            const html = await fetch("components/modals/modalEditEventFollow.html").then(r => r.text());
            container.innerHTML = html;

            fillSelect("editFollowUserId", users, u => `${u.full_name} (${u.email})`);
            fillSelect("editFollowEventId", events, e => e.title);

            document.getElementById("editFollowId").value = id;
            document.getElementById("editFollowUserId").value = follow.user_id;
            document.getElementById("editFollowEventId").value = follow.event_id;

            document.getElementById("closeEditEventFollow").onclick = () => { container.innerHTML = ""; };

            document.getElementById("formEditEventFollow").onsubmit = async e => {
                e.preventDefault();

                await apiPut(`/events-followed/${id}`, {
                    user_id: parseInt(document.getElementById("editFollowUserId").value),
                    event_id: parseInt(document.getElementById("editFollowEventId").value)
                });

                container.innerHTML = "";
                renderEventsFollowed();
            };
        };
    });
}

/* ============================================================================
   6. ELIMINAR REGISTRO
============================================================================ */

function setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar seguimiento?")) return;

            await apiDelete(`/events-followed/${id}`);
            renderEventsFollowed();
        };
    });
}

/* ============================================================================
   7. INICIALIZACIÓN
============================================================================ */

export function initEventsFollowedPage() {
    renderEventsFollowed(); // vista general por defecto
}
