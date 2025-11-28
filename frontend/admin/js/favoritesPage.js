import { apiGet, apiPost, apiDelete } from "./adminApi.js";

export function initFavoritesPage() {
    initFavorites();
}

/* ============================================================================
   VARIABLES GLOBALES EN MEMORIA (Cache)
============================================================================ */
let USERS = [];
let DESTINATIONS = [];
let FAVORITES_CACHE = {}; // { userId: [favorites] }
let DEBOUNCE_TIMER = null;

/* ============================================================================
   1. INICIALIZAR PÁGINA
============================================================================ */
async function initFavorites() {
    const tbody = document.getElementById("favoritesTableBody");
    tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;

    try {
        // Cargar datos iniciales
        USERS = await apiGet("/users");
        DESTINATIONS = await apiGet("/destinations");

        fillUserFilter();
        fillDestinationFilter();
        setupSearchInput();
        setupAddFavoriteButton();

        tbody.innerHTML = ""; // limpiar tabla

    } catch (err) {
        console.error("Error inicializando favoritos:", err);
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar datos.</td></tr>`;
    }
}

/* ============================================================================
   2. LLENAR FILTRO DE USUARIOS
============================================================================ */
function fillUserFilter() {
    const select = document.getElementById("favoritesUserFilter");

    select.innerHTML = `
        <option value="">Selecciona un usuario...</option>
        ${USERS.map(u => `
            <option value="${u.id}">${u.full_name} (${u.email})</option>
        `).join("")}
    `;

    select.onchange = handleFilters;
}

/* ============================================================================
   3. LLENAR FILTRO DE DESTINOS
============================================================================ */
function fillDestinationFilter() {
    const select = document.getElementById("favoritesDestinationFilter");

    select.innerHTML = `
        <option value="">-- Filtrar por destino --</option>
        ${DESTINATIONS.map(d =>
            `<option value="${d.id}">${d.name}</option>`
        ).join("")}
    `;

    select.onchange = handleFilters;
}

/* ============================================================================
   4. CAJA DE BÚSQUEDA CON DEBOUNCE
============================================================================ */
function setupSearchInput() {
    const input = document.getElementById("favoritesSearch");

    input.onkeyup = () => {
        clearTimeout(DEBOUNCE_TIMER);
        DEBOUNCE_TIMER = setTimeout(handleFilters, 300); // evita lag
    };
}

/* ============================================================================
   5. APLICAR TODOS LOS FILTROS
============================================================================ */
async function handleFilters() {
    const userId = document.getElementById("favoritesUserFilter").value;
    const destId = document.getElementById("favoritesDestinationFilter").value;
    const search = document.getElementById("favoritesSearch").value.toLowerCase();

    const tbody = document.getElementById("favoritesTableBody");
    tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;

    let result = [];

    /* === 1. Filtro por USUARIO (rápido con cache) === */
    if (userId) {
        if (!FAVORITES_CACHE[userId]) {
            const favRes = await apiGet(`/favorites/user/${userId}`);
            FAVORITES_CACHE[userId] = Array.isArray(favRes) ? favRes : favRes.data;
        }

        result = FAVORITES_CACHE[userId].map(fav => ({
            ...fav,
            user_name: USERS.find(u => u.id == userId)?.full_name,
            user_email: USERS.find(u => u.id == userId)?.email
        }));
    }

    /* === 2. Filtro SOLO destino (recorrer usuarios y filtrar) === */
    else if (destId) {
        result = [];

        for (const user of USERS) {
            if (!FAVORITES_CACHE[user.id]) {
                const resp = await apiGet(`/favorites/user/${user.id}`);
                FAVORITES_CACHE[user.id] = Array.isArray(resp) ? resp : resp.data;
            }

            FAVORITES_CACHE[user.id].forEach(f => {
                if (f.destination_id == destId) {
                    result.push({
                        ...f,
                        user_name: user.full_name,
                        user_email: user.email
                    });
                }
            });
        }
    }

    /* === 3. Filtro conjunto: usuario + destino === */
    if (userId && destId) {
        result = result.filter(f => f.destination_id == destId);
    }

    /* === 4. BÚSQUEDA POR TEXTO === */
    if (search) {
        const s = search.toLowerCase();
        result = result.filter(f =>
            f.name.toLowerCase().includes(s) ||
            (f.location || "").toLowerCase().includes(s) ||
            (f.user_name || "").toLowerCase().includes(s) ||
            (f.user_email || "").toLowerCase().includes(s)
        );
    }

    renderFavorites(result);
}

/* ============================================================================
   6. RENDER TABLA DE RESULTADOS
============================================================================ */
function renderFavorites(list) {
    const tbody = document.getElementById("favoritesTableBody");
    tbody.innerHTML = "";

    if (!list || list.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="5" style="text-align:center; padding:1rem;">
                No se encontraron favoritos.
            </td></tr>
        `;
        return;
    }

    list.forEach(f => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${f.id}</td>
            <td>${f.name}</td>
            <td>${f.location || "-"}</td>
            <td><img src="/uploads/${f.main_image_url}" class="admin-thumb"/></td>
            <td class="actions-cell">
                <button class="admin-btn small delete-btn" data-id="${f.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    setupDeleteButtons();
}

/* ============================================================================
   7. BOTÓN: AÑADIR FAVORITO
============================================================================ */
function setupAddFavoriteButton() {
    const btn = document.getElementById("btnAddFavorite");
    const modalContainer = document.getElementById("favoriteModalContainer");

    btn.onclick = async () => {
        const userId = document.getElementById("favoritesUserFilter").value;

        if (!userId) return alert("Selecciona un usuario primero.");

        const html = await fetch("components/modals/modalAddFavorite.html").then(r => r.text());
        modalContainer.innerHTML = html;

        const user = USERS.find(u => u.id == userId);
        document.getElementById("favoriteUserLabel").innerText =
            `${user.full_name} (${user.email})`;

        document.getElementById("favoriteDestinationId").innerHTML =
            DESTINATIONS.map(d => `<option value="${d.id}">${d.name}</option>`).join("");

        document.getElementById("closeAddFavorite").onclick = () => {
            modalContainer.innerHTML = "";
        };

        document.getElementById("formAddFavorite").onsubmit = async e => {
            e.preventDefault();

            await apiPost("/favorites", {
                user_id: parseInt(userId),
                destination_id: parseInt(document.getElementById("favoriteDestinationId").value)
            });

            modalContainer.innerHTML = "";
            FAVORITES_CACHE = {}; // limpiar cache
            handleFilters();
        };
    };
}

/* ============================================================================
   8. ELIMINAR FAVORITO
============================================================================ */
function setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            if (!confirm("¿Eliminar este favorito?")) return;

            const id = btn.dataset.id;
            await apiDelete(`/favorites/${id}`);

            FAVORITES_CACHE = {}; // reset cache
            handleFilters();
        };
    });
}
