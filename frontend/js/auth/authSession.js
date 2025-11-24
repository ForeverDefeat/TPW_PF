// frontend/js/auth/authSession.js

/**
 * Guarda los datos del usuario logueado.
 * @param {object} user
 */
export function saveSession(user) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", user.full_name);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userEmail", user.email);
}

/** Limpia la sesión */
export function clearSession() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
}

/** Devuelve los datos almacenados */
export function getSession() {
    return {
        loggedIn: localStorage.getItem("loggedIn") === "true",
        username: localStorage.getItem("username"),
        email: localStorage.getItem("userEmail"),
        role: localStorage.getItem("userRole")
    };
}
