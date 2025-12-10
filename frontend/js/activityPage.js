import { apiGet, apiDelete } from "./api.js";

document.addEventListener("componentsLoaded", loadActivityPage);

async function loadActivityPage() {

    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.warn("No hay usuario logueado.");
        return;
    }

    loadFavorites(userId);
    loadEventsFollowed(userId);
    loadRecommendations(userId);
}



// FAVORITOS
async function loadFavorites(userId) {
    const container = document.getElementById("favoritesList");
    container.innerHTML = "<p>Cargando favoritos...</p>";

    const res = await apiGet(`/favorites/user/${userId}`);
    const list = res.data;

    container.innerHTML = list.length
        ? list.map(favTemplate).join("")
        : "<p>No tienes destinos favoritos.</p>";
}


function favTemplate(d) {
    const slug = d.slug || "";

    if (!d.slug) {
        return `
            <div class="activity-card">
                <p class="error">Este destino ya no está disponible.</p>
            </div>
        `;
    }

    return `
        <div class="activity-card">
            <img src="/uploads/${d.main_image_url}">
            <div class="activity-card-content">
                <h4>${d.name}</h4>
                <p>${d.summary ?? d.description.substring(0, 90)}...</p>

                ${slug
            ? `<a href="destination.html?slug=${slug}">Ver destino</a>`
            : `<span style="color:#999">Destino sin slug</span>`}
            </div>
        </div>
    `;
}



// EVENTOS SEGUIDOS
async function loadEventsFollowed(userId) {
    const container = document.getElementById("eventsFollowedList");
    container.innerHTML = "<p>Cargando...</p>";

    const res = await apiGet(`/events/followed/${userId}`);

    // Acepta cualquier formato que devuelva el backend
    const events = res.data || res.events || [];

    if (!events.length) {
        container.innerHTML = "<p>No sigues ningún evento.</p>";
        return;
    }

    container.innerHTML = events.map(eventTemplate).join("");
}


function eventTemplate(e) {
    const slug = e.destination_slug || "";

    return `
        <div class="activity-card">
            <img src="/uploads/${e.image_url}">
            <div class="activity-card-content">
                <h4>${e.title}</h4>
                <p><b>Fecha:</b> ${new Date(e.event_date).toLocaleDateString()}</p>
                <p>${e.description.substring(0, 80)}</p>

                ${slug
            ? `<a href="destination.html?slug=${slug}">Ver destino</a>`
            : `<span style="color:#999">Destino no disponible</span>`}
            </div>
        </div>
    `;
}

