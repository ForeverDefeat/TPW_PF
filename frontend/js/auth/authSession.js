export const authSession = {
    isLogged() {
        return localStorage.getItem("loggedIn") === "true";
    },

    getUsername() {
        return localStorage.getItem("username") || "";
    },

    getRole() {
        return localStorage.getItem("userRole") || "user";
    },

    saveSession(username, role = "user") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", role);
    },

    clear() {
        localStorage.clear();
    }
};
