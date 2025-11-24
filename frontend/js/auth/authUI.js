// frontend/js/auth/authUI.js
export function setupAuthUI() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const role = (localStorage.getItem("userRole") || "").toLowerCase();

    const loggedOutView = document.getElementById("loggedOutView");
    const loggedInView = document.getElementById("loggedInView");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const adminPanelBtn = document.getElementById("adminPanelBtn");

    if (loggedIn) {
        loggedOutView.style.display = "none";
        loggedInView.style.display = "flex";

        usernameDisplay.textContent = localStorage.getItem("username");

        // Mostrar botón Panel Admin si el usuario es admin
        if (role === "admin") {
            adminPanelBtn.classList.remove("hidden");
            adminPanelBtn.onclick = () => {
                window.location.href = "./admin/index.html";
            };
        }
    } else {
        loggedOutView.style.display = "flex";
        loggedInView.style.display = "none";

        adminPanelBtn.classList.add("hidden");
    }
}
