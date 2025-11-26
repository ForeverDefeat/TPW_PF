/**
 * @file usersPage.js
 * @description Controlador del módulo USERS del panel admin.
 *              Maneja listado, creación, edición y eliminación.
 * @module usersPage
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./adminApi.js";

/* ============================================================================
   1. RENDER DE USUARIOS
   ============================================================================ */

export async function renderUsers() {
    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = `<tr><td colspan="5">Cargando usuarios...</td></tr>`;

    try {
        const users = await apiGet("/users"); // ← FIX
        tbody.innerHTML = "";

        users.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.full_name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td class="actions-cell">
                    <button class="admin-btn small edit-user-btn" data-id="${u.id}">Editar</button>
                    <button class="admin-btn small delete-user-btn" data-id="${u.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        setupAddUserButton();
        setupEditButtons();
        setupDeleteButtons();
    } catch (err) {
        console.error("Error renderUsers:", err);
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar usuarios.</td></tr>`;
    }
}

/* ============================================================================
   2. CREAR USUARIO
   ============================================================================ */

function setupAddUserButton() {
    const btn = document.getElementById("btnAddUser");
    if (!btn) return;

    btn.onclick = async () => {
        const container = document.getElementById("userModalContainer");

        const html = await fetch("components/modals/modalAddUser.html").then(r => r.text());
        container.innerHTML = html;

        document.getElementById("closeAddUser").onclick = () => {
            container.innerHTML = "";
        };

        document.getElementById("formAddUser").onsubmit = async e => {
            e.preventDefault();

            await apiPost("/users", {
                full_name: document.getElementById("addUserName").value,
                email: document.getElementById("addUserEmail").value,
                password: document.getElementById("addUserPassword").value,
                role: document.getElementById("addUserRole").value
            });

            container.innerHTML = "";
            await renderUsers();
        };
    };
}

/* ============================================================================
   3. EDITAR USUARIO
   ============================================================================ */

function setupEditButtons() {
    document.querySelectorAll(".edit-user-btn").forEach(btn => {
        btn.onclick = async () => {

            const id = btn.dataset.id;

            // FIX IMPORTANTE: apiGet devuelve directamente el usuario
            const user = await apiGet(`/users/${id}`);

            const container = document.getElementById("userModalContainer");
            const html = await fetch("components/modals/modalEditUser.html").then(r => r.text());
            container.innerHTML = html;

            // Esperar que el DOM esté listo
            requestAnimationFrame(() => {

                // === Rellenar campos ===
                document.getElementById("editUserName").value = user.full_name;
                document.getElementById("editUserEmail").value = user.email;
                document.getElementById("editUserRole").value = user.role;

                // === Botón cerrar ===
                document.getElementById("closeEditUser").onclick = () => {
                    container.innerHTML = "";
                };

                // === Guardar ===
                document.getElementById("formEditUser").onsubmit = async e => {
                    e.preventDefault();

                    await apiPut(`/users/${id}`, {
                        full_name: document.getElementById("editUserName").value,
                        email: document.getElementById("editUserEmail").value,
                        role: document.getElementById("editUserRole").value
                    });

                    container.innerHTML = "";
                    await renderUsers();
                };
            });
        };
    });
}

/* ============================================================================
   4. ELIMINAR USUARIO
   ============================================================================ */

function setupDeleteButtons() {
    document.querySelectorAll(".delete-user-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;

            if (!confirm("¿Eliminar este usuario?")) return;

            await apiDelete(`/users/${id}`);
            await renderUsers();
        };
    });
}

/* ============================================================================
   5. INICIALIZACIÓN
   ============================================================================ */

export function initUsersPage() {
    renderUsers();
}
