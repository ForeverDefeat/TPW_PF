// frontend/js/auth/loginModal.js

import { loginUser } from "../auth/authService.js";
import { saveSession } from "../auth/authSession.js";

export function setupLoginModal() {
    const modal = document.getElementById("loginModal");
    const openBtn = document.getElementById("openLogin");
    const closeBtn = document.getElementById("closeLogin");

    openBtn?.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));

    const form = document.getElementById("loginFormModal");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const res = await loginUser(email, password);

        if (!res.ok) {
            alert(res.message || "Credenciales incorrectas");
            return;
        }

        saveSession(res.user);

        modal.classList.add("hidden");
        window.location.reload();
    });
}
