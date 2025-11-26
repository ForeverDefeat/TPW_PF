/**
 * @file favoritesPage.js
 * @description Controlador del módulo "Favoritos" en el panel admin.
 *              Permite listar y gestionar los destinos favoritos
 *              de cada usuario (relación users ↔ destinations).
 * @module favoritesPage
 */

import { apiGet, apiPost, apiDelete } from "./adminApi.js";

/**
 * Cache local de usuarios y destinos para reutilizar
 * en selects y para mostrar nombres.
 *
 * @type {Array}
 */
let usersCache = [];

/**
 * Cache local de destinos.
 *
 * @type {Array}
 */
let destinationsCache = [];

/**
 * ID del usuario actualmente seleccionado en el filtro.
 *
 * @type {number|null}
 */
let currentUserId = null;

/* ============================================================================
   1. RENDER PRINCIPAL
   ============================================================================ */

/**
 * Punto de entrada del módulo Favorites.
 * Carga usuarios y destinos, configura el filtro y
 * muestra la tabla de favoritos cuando haya un usuario seleccionado.
 *
 * @async
 * @function initFavoritesPage
 */
export async function initFavoritesPage() {
    try {
        const usersRes = await apiGet("/users");
        const destsRes = await apiGet("/destinations");

        usersCache = usersRes.data || [];
        destinationsCache = destsRes.data || [];

        setupUserFilter();
        setupAddFavoriteButton();

    } catch (err) {
        console.error("Error inicializando Favorites:", err);
        const tbody = document.getElementById("favoritesTableBody");
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5">Error al cargar datos iniciales.</td></tr>`;
        }
    }
}

/* ============================================================================
   2. FILTRO DE USUARIO
   ============================================================================ */

/**
 * Rellena el <select> de usuarios y configura el evento change
 * para cargar los favoritos del usuario elegido.
 *
 * @function setupUserFilter
 */
function setupUserFilter() {
    const select = document.getElementById("favoritesUserFilter");
    if (!select) return;

    // Rellenar opciones de usuarios
    usersCache.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = `${u.full_name} (${u.email})`;
        select.appendChild(opt);
    });

    // Cambio de usuario seleccionado
    select.addEventListener("change", async (e) => {
        const value = e.target.value;

        const btnAdd = document.getElementById("btnAddFavorite");
        if (btnAdd) {
            btnAdd.disabled = !value;
        }

        if (!value) {
            currentUserId = null;
            clearFavoritesTable();
            return;
        }

        currentUserId = parseInt(value, 10);
        await loadFavoritesForUser(currentUserId);
    });
}

/**
 * Limpia el cuerpo de la tabla de favoritos.
 *
 * @function clearFavoritesTable
 */
function clearFavoritesTable() {
    const tbody = document.getElementById("favoritesTableBody");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5">Selecciona un usuario para ver sus favoritos.</td></tr>`;
}

/* ============================================================================
   3. CARGAR FAVORITOS DE UN USUARIO
   ============================================================================ */

/**
 * Obtiene y muestra en la tabla los favoritos de un usuario específico.
 *
 * @async
 * @param {number} userId - ID del usuario.
 * @function loadFavoritesForUser
 */
async function loadFavoritesForUser(userId) {
    const tbody = document.getElementById("favoritesTableBody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="5">Cargando favoritos...</td></tr>`;

    try {
        // GET /favorites?user_id=...
        const res = await apiGet(`/favorites?user_id=${userId}`);

        const favorites = res.data || [];

        if (!favorites.length) {
            tbody.innerHTML = `<tr><td colspan="5">Este usuario no tiene destinos favoritos.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";

        favorites.forEach(fav => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${fav.id}</td>
                <td>${fav.name}</td>
                <td>${fav.location || "-"}</td>
                <td>
                    <img
                        src="${fav.image_url || "../assets/placeholder.png"}"
                        alt="${fav.name}"
                        class="admin-thumb"
                    />
                </td>
                <td class="actions-cell">
                    <button class="admin-btn small delete-banner-btn" data-id="${fav.id}">
                        Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        setupDeleteButtons();

    } catch (err) {
        console.error("Error cargando favoritos:", err);
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar favoritos.</td></tr>`;
    }
}

/* ============================================================================
   4. AÑADIR FAVORITO
   ============================================================================ */

/**
 * Configura el botón "Añadir Favorito" para abrir el modal
 * y gestionar el formulario de creación.
 *
 * @function setupAddFavoriteButton
 */
function setupAddFavoriteButton() {
    const btn = document.getElementById("btnAddFavorite");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        if (!currentUserId) return;

        const container = document.getElementById("favoriteModalContainer");
        if (!container) return;

        const html = await fetch("components/modals/modalAddFavorite.html")
            .then(r => r.text());

        container.innerHTML = html;

        // Mostrar nombre del usuario
        const user = usersCache.find(u => u.id === currentUserId);
        const labelUser = document.getElementById("favoriteUserLabel");
        if (user && labelUser) {
            labelUser.textContent = `${user.full_name} (${user.email})`;
        }

        // Rellenar destinos
        const selectDest = document.getElementById("favoriteDestinationId");
        if (selectDest) {
            selectDest.innerHTML = destinationsCache
                .map(d => `<option value="${d.id}">${d.name}</option>`)
                .join("");
        }

        // Cerrar modal
        const closeBtn = document.getElementById("closeAddFavorite");
        if (closeBtn) {
            closeBtn.onclick = () => {
                container.innerHTML = "";
            };
        }

        // Submit formulario
        const form = document.getElementById("formAddFavorite");
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();

                const destId = parseInt(
                    document.getElementById("favoriteDestinationId").value,
                    10
                );

                await apiPost("/favorites", {
                    user_id: currentUserId,
                    destination_id: destId
                });

                container.innerHTML = "";
                await loadFavoritesForUser(currentUserId);
            };
        }
    });
}

/* ============================================================================
   5. ELIMINAR FAVORITO
   ============================================================================ */

/**
 * Configura los botones "Eliminar" de cada fila de la tabla
 * para borrar un favorito.
 *
 * @function setupDeleteButtons
 */
function setupDeleteButtons() {
    const buttons = document.querySelectorAll(".delete-favorite-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            if (!id) return;

            const confirmDelete = confirm("¿Quitar este destino de favoritos?");
            if (!confirmDelete) return;

            await apiDelete(`/favorites/${id}`);

            if (currentUserId) {
                await loadFavoritesForUser(currentUserId);
            }
        });
    });
}
