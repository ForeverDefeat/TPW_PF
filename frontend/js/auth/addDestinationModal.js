import { addDestination } from "../api.js";

export function setupAddDestinationModal() {

    const modal = document.getElementById("destinationModal");
    const openBtn = document.getElementById("adminAddButton");
    const closeBtn = document.getElementById("closeAddDestination");

    // ABRIR
    openBtn?.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // CERRAR
    closeBtn?.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // ENVIAR FORMULARIO
    const form = document.getElementById("addDestinationForm");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newDest = {
            name: document.getElementById("destName").value,
            description: document.getElementById("destDesc").value,
            category: document.getElementById("destType").value,
            imageUrl: document.getElementById("destImg").value
        };

        const res = await addDestination(newDest);

        if (!res.ok) {
            alert("Error al guardar destino");
            return;
        }

        alert("Destino añadido correctamente");
        modal.classList.add("hidden");
        form.reset();

        window.location.reload();
    });
}
