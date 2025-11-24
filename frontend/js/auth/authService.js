// frontend/js/auth/authService.js

const API_URL = "/api/auth";

/**
 * Envía credenciales al backend para iniciar sesión.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    return res.json();
}

/**
 * Registra un nuevo usuario.
 */
export async function registerUser(full_name, email, password) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password })
    });

    return res.json();
}
