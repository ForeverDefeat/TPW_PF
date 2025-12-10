export function saveSession(user) {
    localStorage.setItem("loggedIn", "true");

    // Datos existentes
    localStorage.setItem("username", user.full_name);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);

    localStorage.setItem("userId", user.id);
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
