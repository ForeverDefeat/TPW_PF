// frontend/js/auth/authUI.js

import { getSession, clearSession } from "./authSession.js";

export function setupAuthUI() {
    const { loggedIn, username } = getSession();

    const loggedOutView = document.getElementById("loggedOutView");
    const loggedInView = document.getElementById("loggedInView");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logoutBtn = document.getElementById("logoutButton");

    if (loggedIn) {
        loggedOutView.style.display = "none";
        loggedInView.style.display = "flex";
        usernameDisplay.textContent = username || "Usuario";
    } else {
        loggedOutView.style.display = "flex";
        loggedInView.style.display = "none";
    }

    logoutBtn?.addEventListener("click", () => {
        clearSession();
        window.location.reload();
    });
}
