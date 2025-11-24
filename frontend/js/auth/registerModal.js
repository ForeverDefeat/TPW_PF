// frontend/js/auth/registerModal.js

import { registerUser } from "../auth/authService.js";

export function setupRegisterModal() {
    const modal = document.getElementById("registerModal");
    const openBtn = document.getElementById("openRegister");
    const closeBtn = document.getElementById("closeRegister");

    openBtn?.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));

    const form = document.getElementById("registerFormModal");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const full_name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPass").value;

        const res = await registerUser(full_name, email, password);

        if (!res.ok) {
            alert(res.message || "Error al registrar");
            return;
        }

        alert("Registro exitoso. Ahora inicia sesión.");
        modal.classList.add("hidden");
    });
}
