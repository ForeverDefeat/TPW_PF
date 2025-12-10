// frontend/js/templates.js

function fixImagePath(path) {
    if (!path) return "/assets/placeholder.jpg";

    // Si ya viene con /uploads/... devolver tal cual
    if (path.startsWith("/uploads/")) return path;

    // Si NO tiene uploads, lo agregamos
    return `/uploads/${path}`;
}


/* ============================================================
   TARJETA DE DESTINO EN CARRUSEL
   ============================================================ */
export function destinationCarouselItemTemplate(d) {
    return `
        <div class="carousel-item" data-slug="${d.slug}">
            <img src="${fixImagePath(d.main_image_url || d.image_url)}" alt="${d.name}">
            <h4>${d.name}</h4>
            <p>${(d.summary || d.description || "").substring(0, 80)}...</p>
        </div>
    `;
}



/* ============================================================
   TARJETA DE DESTINO (GRID)
   ============================================================ */
export function destinationCardTemplate(d) {
    const img = fixImagePath(d.main_image_url || d.image_url);

    return `
        <div class="cat-card hover-card" data-slug="${d.slug}">
            <img src="${img}" alt="${d.name}">
            <h4>${d.name}</h4>
            <p>${d.summary ?? d.description.substring(0, 80)}...</p>
        </div>
    `;
}



/* ============================================================
   IMÁGENES DE GALERÍA
   ============================================================ */
export function galleryImageTemplate(url) {
    return `<img class="gallery-img" src="${fixImagePath(url)}" alt="">`;
}



/* ============================================================
   TARJETA DE SERVICIOS
   ============================================================ */
export function serviceCardTemplate(s) {
    return `
        <div class="pro-card">
            <h4>${s.name}</h4>
            <p>${s.description}</p>
        </div>
    `;
}


/* ============================================================
   TARJETA DE EVENTO (EN DESTINO)
   ============================================================ */
export function eventCardTemplate(e) {
    const img = fixImagePath(e.image_url);

    return `
        <div class="pro-card">
            <img src="${img}" class="event-img" alt="${e.title}">
            <h4>${e.title}</h4>
            <p><b>Fecha:</b> ${e.event_date ? new Date(e.event_date).toLocaleDateString() : "-"}</p>
            <p>${e.description || ""}</p>

            <button class="btn-secondary" onclick="followEvent(${e.id})">
                👁‍🗨 Seguir evento
            </button>
        </div>
    `;
}
