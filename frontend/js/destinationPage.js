import { apiGet, apiExists } from "./api.js";
import { galleryImageTemplate, serviceCardTemplate, eventCardTemplate } from "./templates.js";

document.addEventListener("componentsLoaded", loadDestination);

async function loadDestination() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) return;

    try {
        // 1. Cargar datos del destino
        const res = await apiGet(`/destinations/slug/${slug}`);
        const d = res.data;

        // HERO
        document.getElementById("destinationHero").style.backgroundImage =
            `url('/uploads/${d.hero_image_url}')`;

        document.getElementById("destinationName").textContent = d.name;
        document.getElementById("destinationSummary").textContent = d.summary;
        document.getElementById("destinationDescription").textContent = d.description;

        // 2. Galería
        const gallery = [];
        if (d.main_image_url) gallery.push(d.main_image_url);
        if (d.hero_image_url) gallery.push(d.hero_image_url);

        document.getElementById("galleryImages").innerHTML =
            gallery.map(galleryImageTemplate).join("");

        // 3. Servicios cercanos
        try {
            const serv = await apiGet(`/services/destination/${d.id}`);
            document.getElementById("servicesList").innerHTML =
                serv.services?.length
                    ? serv.services.map(serviceCardTemplate).join("")
                    : "<p>No hay servicios cercanos.</p>";
        } catch {
            document.getElementById("servicesList").innerHTML =
                "<p>No hay servicios cercanos.</p>";
        }

        // 4. Eventos (solo si el endpoint existe)
        const hasEvents = await apiExists(`/events/destination/${d.id}`);

        if (hasEvents) {
            const evt = await apiGet(`/events/destination/${d.id}`);
            document.getElementById("eventsList").innerHTML =
                evt.events?.length
                    ? evt.events.map(eventCardTemplate).join("")
                    : "<p>No hay eventos registrados.</p>";
        } else {
            document.getElementById("eventsList").innerHTML =
                "<p>No hay eventos registrados.</p>";
        }

    } catch (err) {
        console.error("Error cargando destino:", err);
    }
}
