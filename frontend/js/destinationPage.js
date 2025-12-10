import { apiGet, apiPost } from "./api.js";
import { galleryImageTemplate, serviceCardTemplate } from "./templates.js";

document.addEventListener("componentsLoaded", loadDestination);

async function loadDestination() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) return;

    try {
        // 1. Cargar datos del destino
        const res = await apiGet(`/destinations/slug/${slug}`);
        const d = res.data;

        let heroImg = d.hero_image_url;

        // Si NO empieza con "/uploads", lo agregamos
        if (heroImg && !heroImg.startsWith("/uploads/")) {
            heroImg = `/uploads/${heroImg}`;
        }

        // Si es null → placeholder
        if (!heroImg) {
            heroImg = "/assets/placeholder-hero.jpg";
        }

        document.getElementById("destinationHero").style.backgroundImage = `url('${heroImg}')`;


        document.getElementById("destinationName").textContent = d.name;
        document.getElementById("destinationSummary").textContent = d.summary;
        document.getElementById("destinationDescription").textContent = d.description;

        // --------------------------
        // ⭐ BOTÓN: AGREGAR A FAVORITOS
        // --------------------------
        const favBtn = document.createElement("button");
        favBtn.textContent = "⭐ Agregar a Favoritos";
        favBtn.classList.add("btn-primary");
        favBtn.style.margin = "10px 0";

        favBtn.onclick = () => addToFavorites(d.id);

        document.querySelector(".destination-info").prepend(favBtn);

        async function addToFavorites(destinationId) {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("Debes iniciar sesión para agregar favoritos.");
                return;
            }

            const res = await apiPost("/favorites", {
                user_id: userId,
                destination_id: destinationId
            });

            if (res.ok) {
                alert("Destino agregado a favoritos ⭐");
            } else {
                alert(res.message || "No se pudo guardar el favorito.");
            }
        }

        // --------------------------
        // 2. Galería real
        // --------------------------
        if (d.gallery?.length > 0) {
            document.getElementById("galleryImages").innerHTML =
                d.gallery.map(img => galleryImageTemplate(img.image_url)).join("");
        } else {
            document.getElementById("galleryImages").innerHTML =
                "<p>No hay imágenes en la galería.</p>";
        }


        // --------------------------
        // 3. Servicios cercanos
        // --------------------------
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

        // --------------------------
        // 4. EVENTOS + botón SEGUIR
        // --------------------------
        const eventsList = document.getElementById("eventsList");

        if (d.events?.length > 0) {

            eventsList.innerHTML = ""; // limpiar

            d.events.forEach(ev => {
                const card = document.createElement("div");
                card.classList.add("pro-card");

                card.innerHTML = `
                    <img src="/uploads/${ev.image_url}" class="event-img">
                    <h4>${ev.title}</h4>
                    <p><b>Fecha:</b> ${new Date(ev.event_date).toLocaleDateString()}</p>
                    <p>${ev.description.substring(0, 120)}...</p>
                    <button class="follow-btn" data-id="${ev.id}">
                        ⭐ Seguir Evento
                    </button>
                `;

                eventsList.appendChild(card);
            });

            // Activar botones seguir
            document.querySelectorAll(".follow-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const eventId = btn.dataset.id;
                    followEvent(eventId, btn);
                });
            });

        } else {
            eventsList.innerHTML = "<p>No hay eventos registrados.</p>";
        }

        async function followEvent(eventId, btn) {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("Debes iniciar sesión para seguir eventos.");
                return;
            }

            const res = await apiPost("/events-followed", {
                user_id: userId,
                event_id: eventId
            });

            if (res.ok) {
                btn.textContent = "✓ Siguiendo";
                btn.disabled = true;
            } else {
                alert(res.message || "No se pudo seguir el evento.");
            }
        }

        // --------------------------
        // 5. MAPA DEL DESTINO
        // --------------------------
        if (d.latitude && d.longitude) {
            const map = L.map("map").setView(
                [parseFloat(d.latitude), parseFloat(d.longitude)],
                13
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors"
            }).addTo(map);

            L.marker([parseFloat(d.latitude), parseFloat(d.longitude)])
                .addTo(map)
                .bindPopup(`<b>${d.name}</b>`);
        }

    } catch (err) {
        console.error("Error cargando destino:", err);
    }
}
