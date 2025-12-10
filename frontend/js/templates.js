// frontend/js/templates.js
export function destinationCarouselItemTemplate(d) {
    return `
        <div class="carousel-item" data-slug="${d.slug}">
            <img src="${d.image_url || d.main_image_url || '/uploads/default.jpg'}" alt="${d.name}">
            <h4>${d.name}</h4>
            <p>${(d.summary || d.description || "").substring(0, 80)}...</p>
        </div>
    `;
}


export function destinationCardTemplate(d) {
    const img = d.image_url || d.main_image_url;

    const fixedImg = img?.startsWith("/uploads/")
        ? img
        : `/uploads/${img}`;

    return `
        <div class="cat-card hover-card" data-slug="${d.slug}">
            <img src="${fixedImg}" alt="${d.name}">
            <h4>${d.name}</h4>
            <p>${d.summary ?? d.description.substring(0, 80)}...</p>
        </div>
    `;
}


/* export function galleryImageTemplate(img) {
    return `<img src="/uploads/${img}" alt="Foto del destino">`;
} */
export function galleryImageTemplate(url) {
    const fixedImg = url.startsWith("/uploads/")
        ? url
        : `/uploads/${url}`;

    return `
        <img class="gallery-img" src="${fixedImg}" alt="">
    `;
}

export function serviceCardTemplate(s) {
    return `
        <div class="pro-card">
            <h4>${s.name}</h4>
            <p>${s.description}</p>
        </div>
    `;
}

export function eventCardTemplate(e) {
    return `
        <div class="pro-card">
            <h4>${e.name}</h4>
            <p><b>Fecha:</b> ${new Date(e.event_date).toLocaleDateString()}</p>
            <p>${e.description}</p>
        </div>
    `;
}

