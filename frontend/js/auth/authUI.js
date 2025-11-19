export function setupAuthUI() {
    const loggedOutView = document.getElementById("loggedOutView");
    /* const loggedInView = document.getElementById("loggedInView"); */
    const loggedInView = document.getElementById("loggedInView");
    if (loggedInView) loggedInView.style.display = "none";
    const usernameDisplay = document.getElementById("usernameDisplay");
    const adminAddButton = document.getElementById("adminAddButton");
    const logoutButton = document.getElementById("logoutButton");

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    if (loggedIn) {
        loggedOutView.style.display = "none";
        loggedInView.style.display = "flex";

        usernameDisplay.textContent = username;

        if (role === "admin") {
            adminAddButton.style.display = "inline-block";
        }
    } else {
        loggedOutView.style.display = "flex";
        loggedInView.style.display = "none";
    }

    logoutButton?.addEventListener("click", () => {
        localStorage.clear();
        window.location.reload();
    });
}
