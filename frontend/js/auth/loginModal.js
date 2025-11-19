import { loginUser } from "../api.js";

export function setupLoginModal() {
    const modal = document.getElementById("loginModal");
    const openBtn = document.getElementById("openLogin");
    const closeBtn = document.getElementById("closeLogin");

    if (!modal || !openBtn) return;

    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));

    const form = document.getElementById("loginFormModal");

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const res = await loginUser(email, password);

        if (!res.ok) {
            alert(res.message);
            return;
        }

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", res.user.fullName);
        localStorage.setItem("userRole", res.user.role);

        modal.classList.add("hidden");
        window.location.reload();
    });
}
