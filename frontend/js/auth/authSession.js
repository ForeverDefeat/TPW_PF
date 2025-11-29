export function saveSession(user) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", user.full_name);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);
}

export function clearSession() {
    localStorage.clear();
}

export function logout() {
    clearSession();
    window.location.reload();
}

export function getSession() {
    return {
        loggedIn: localStorage.getItem("loggedIn") === "true",
        username: localStorage.getItem("username"),
        email: localStorage.getItem("userEmail"),
        role: localStorage.getItem("userRole")
    };
}
