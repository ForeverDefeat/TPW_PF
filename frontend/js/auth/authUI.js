import { logout } from "./authSession.js";

export function setupAuthUI() {

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const role = (localStorage.getItem("userRole") || "").toLowerCase();

    const loggedOutView = document.getElementById("loggedOutView");
    const loggedInView = document.getElementById("loggedInView");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const adminPanelBtn = document.getElementById("adminPanelBtn");
    const logoutBtn = document.getElementById("logoutButton");

    if (!loggedOutView || !loggedInView) {
        console.warn("⛔ auth.html aún NO cargado...");
        return;
    }

    if (loggedIn) {
        loggedOutView.style.display = "none";
        loggedInView.style.display = "flex";

        usernameDisplay.textContent = localStorage.getItem("username");

        if (role === "admin") {
            adminPanelBtn.classList.remove("hidden");
            adminPanelBtn.onclick = () => window.location.href = "./admin/index.html";
        }

        logoutBtn.onclick = logout;

    } else {
        loggedOutView.style.display = "flex";
        loggedInView.style.display = "none";

        adminPanelBtn.classList.add("hidden");
        logoutBtn.onclick = null;
    }
}
