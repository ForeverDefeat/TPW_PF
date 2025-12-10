import { apiGet, apiPostFile, apiDelete } from "./adminApi.js";

export function initGalleryPage() {

    // IDs correctos según adminGallery.html
    const select = document.getElementById("destinationSelect");
    const filesInput = document.getElementById("galleryInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const galleryList = document.getElementById("galleryList");

    /* ================================
       1. CARGAR LISTA DE DESTINOS
    ================================= */
    async function loadDestinations() {
        const destinations = await apiGet("/destinations");

        select.innerHTML = `
            <option value="">Seleccione un destino...</option>
            ${destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}
        `;
    }

    /* ================================
       2. CARGAR GALERÍA DEL DESTINO
    ================================= */
    async function loadGallery() {
        const id = select.value;
        if (!id) {
            galleryList.innerHTML = `<p>Seleccione un destino.</p>`;
            return;
        }

        galleryList.innerHTML = `Cargando...`;

        const res = await apiGet(`/gallery/destination/${id}`);
        const images = res.images || [];


        if (!images.length) {
            galleryList.innerHTML = `<p>No hay imágenes registradas.</p>`;
            return;
        }

        galleryList.innerHTML = images
            .map(img => {
                const url = img.image_url?.startsWith("/uploads/")
                    ? img.image_url
                    : `/uploads/${img.image_url}`;

                return `
            <div class="admin-gallery-item">
                <img src="${url}" alt="Imagen galería">
                <button class="admin-gallery-delete" data-id="${img.id}">✕</button>
            </div>
        `;
            })
            .join("");

    }

    /* ================================
       3. SUBIR IMÁGENES
    ================================= */
    filesInput.addEventListener("change", () => {
        uploadBtn.disabled = filesInput.files.length === 0;
    });

    uploadBtn.addEventListener("click", async () => {
        const id = select.value;
        if (!id) return alert("Seleccione un destino primero.");

        const fd = new FormData();

        for (const file of filesInput.files) {
            fd.append("images", file); // nombre correcto para Multer
        }

        await apiPostFile(`/gallery/destination/${id}`, fd);

        filesInput.value = "";
        uploadBtn.disabled = true;

        loadGallery();
    });


    /* ================================
       4. ELIMINAR IMAGEN
    ================================= */
    galleryList.addEventListener("click", async e => {
        if (!e.target.classList.contains("admin-gallery-delete")) return;

        const id = e.target.dataset.id;

        if (!confirm("¿Eliminar esta imagen?")) return;

        await apiDelete(`/gallery/${id}`);
        loadGallery();
    });

    /* ================================
       5. CAMBIO DE DESTINO = RECARGAR GALERÍA
    ================================= */
    select.addEventListener("change", loadGallery);

    /* Inicializar */
    loadDestinations();
}
