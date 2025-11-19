import { registerUser } from "../api.js";

export function setupRegisterModal() {

    const modal = document.getElementById("registerModal");
    const openBtn = document.getElementById("openRegister");
    const closeBtn = document.getElementById("closeRegister");

    // Abrir modal
    openBtn?.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // Cerrar modal
    closeBtn?.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // FORMULARIO
    const form = document.getElementById("registerFormModal");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newUser = {
            fullName: document.getElementById("registerName").value,
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPass").value
        };

        const res = await registerUser(newUser);

        if (!res.ok) {
            alert(res.message || "Error al registrar");
            return;
        }

        alert("Cuenta creada. Ya puedes iniciar sesión.");

        modal.classList.add("hidden");
    });
}
