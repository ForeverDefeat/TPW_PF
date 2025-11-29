// frontend/js/templates.js

export function destinationCardTemplate(d) {
    return `
        <div class="cat-card hover-card" onclick="location.href='destination.html?slug=${d.slug}'">
            <img src="/uploads/${d.main_image_url}" alt="${d.name}">
            <h4>${d.name}</h4>
            <p>${d.summary ?? d.description.substring(0, 80)}...</p>
        </div>
    `;
}

export function serviceCardTemplate(s) {
    return `
        <div class="cat-card">
            <h4>${s.name}</h4>
            <p>${s.description}</p>
        </div>
    `;
}

export function eventCardTemplate(e) {
    return `
        <div class="cat-card">
            <h4>${e.name}</h4>
            <p>Fecha: ${new Date(e.event_date).toLocaleDateString()}</p>
            <p>${e.description.substring(0, 100)}...</p>
        </div>
    `;
}
