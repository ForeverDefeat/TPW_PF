// frontend/js/destinationPage.js
import { apiGet } from "./api.js";
import { serviceCardTemplate, eventCardTemplate } from "./templates.js";

document.addEventListener("componentsLoaded", loadDestination);

async function loadDestination() {
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) return;

    const hero = document.getElementById("destinationHero");
    const nameEl = document.getElementById("destinationName");
    const descEl = document.getElementById("destinationDescription");

    try {
        const res = await apiGet(`/destinations/slug/${slug}`);
        const d = res.data ?? res;

        hero.style.backgroundImage = `url('/uploads/${d.hero_image_url}')`;
        nameEl.textContent = d.name;
        descEl.textContent = d.description;

        const resServices = await apiGet(`/services/destination/${d.id}`);
        const services = resServices.data ?? resServices;

        document.getElementById("servicesList").innerHTML =
            services.map(serviceCardTemplate).join("");

        const resEvents = await apiGet(`/events/destination/${d.id}`);
        const events = resEvents.data ?? resEvents;

        document.getElementById("eventsList").innerHTML =
            events.map(eventCardTemplate).join("");

    } catch (err) {
        console.error("Error cargando destino:", err);
    }
}
