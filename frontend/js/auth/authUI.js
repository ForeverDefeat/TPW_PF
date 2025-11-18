import { authSession } from "./authSession.js";
import { authService } from "./authService.js";

export function setupAuthUI() {

    const loggedOut = document.getElementById("loggedOutView");
    const loggedIn = document.getElementById("loggedInView");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const adminAddButton = document.getElementById("adminAddButton");
    const logoutButton = document.getElementById("logoutButton");

    if (!loggedOut || !loggedIn) return; // aún no cargó el header

    if (authSession.isLogged()) {

        loggedOut.style.display = "none";
        loggedIn.style.display = "flex";

        usernameDisplay.textContent = authSession.getUsername();

        if (authSession.getRole() === "admin") {
            adminAddButton.style.display = "inline-block";
        }

        logoutButton.addEventListener("click", () => authService.logout());

    } else {

        loggedOut.style.display = "flex";
        loggedIn.style.display = "none";
    }
}
