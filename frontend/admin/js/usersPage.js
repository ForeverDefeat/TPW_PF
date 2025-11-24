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

/**
 * Carga y muestra todos los usuarios en la tabla.
 *
 * @async
 * @function renderUsers
 */
export async function renderUsers() {
    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = `<tr><td colspan="5">Cargando usuarios...</td></tr>`;

    try {
        const res = await apiGet("/users");

        if (!res.ok) throw new Error("Error backend");

        const users = res.data;

        tbody.innerHTML = "";

        users.forEach(u => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.full_name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>
                    <button class="admin-btn small edit-user-btn" data-id="${u.id}">
                        Editar
                    </button>
                    <button class="admin-btn small danger delete-user-btn" data-id="${u.id}">
                        Eliminar
                    </button>
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
                fullName: document.getElementById("addUserName").value,
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
            const user = (await apiGet(`/users/${id}`)).data;

            const container = document.getElementById("userModalContainer");
            const html = await fetch("components/modals/modalEditUser.html").then(r => r.text());
            container.innerHTML = html;

            // Rellenar campos
            document.getElementById("editUserId").value = user.id;
            document.getElementById("editUserName").value = user.full_name;
            document.getElementById("editUserEmail").value = user.email;
            document.getElementById("editUserRole").value = user.role;

            // Cerrar
            document.getElementById("closeEditUser").onclick = () => {
                container.innerHTML = "";
            };

            // Submit edición
            document.getElementById("formEditUser").onsubmit = async e => {
                e.preventDefault();

                await apiPut(`/users/${id}`, {
                    fullName: document.getElementById("editUserName").value,
                    email: document.getElementById("editUserEmail").value,
                    role: document.getElementById("editUserRole").value
                });

                container.innerHTML = "";
                await renderUsers();
            };
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

/**
 * Punto de entrada del módulo Users.
 */
export function initUsersPage() {
    renderUsers();
}
