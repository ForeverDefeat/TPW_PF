export function beachTemplate(d) {
    return `
        <div class="cat-card searchable-card">
            <img src="${d.image}" alt="${d.title}">
            <h4>${d.name}</h4>
            <p>${d.description}</p>
        </div>
    `;
}

export function mountainTemplate(d) {
    return `
        <div class="cat-card searchable-card">
            <img src="${d.image}" alt="${d.title}">
            <div class="destino-info">
                <h4>${d.name}</h4>
                <p>${d.description}</p>
            </div>
        </div>
    `;
}

export function cultureTemplate(d) {
    return `
        <div class="cat-card searchable-card">
            <img src="${d.image}" alt="${d.title}">
            <h4>${d.name}</h4>
            <p>${d.description}</p>
        </div>
    `;
}
