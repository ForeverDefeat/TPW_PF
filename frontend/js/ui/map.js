document.addEventListener("componentsLoaded", () => {
    initMap();
});

function initMap() {
    const mapDiv = document.getElementById("mapContainer");
    if (!mapDiv) return;

    // Inicializa el mapa (coordenadas de Perú, puedes cambiarlo)
    const map = L.map("mapContainer").setView([-12.046374, -77.042793], 6);

    // Capa base (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // MARCADOR (Reemplazar por Local Fisico de la Empresa)
    L.marker([-12.046374, -77.042793])
        .addTo(map)
        .bindPopup("<b>Perú</b><br>Lima - Plaza Mayor")
        .openPopup();
}
