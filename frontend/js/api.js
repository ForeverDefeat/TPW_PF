export const API_URL = "http://localhost:4000/api";

// LOGIN
export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

// REGISTER
export async function registerUser(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

// OBTENER DESTINOS
export async function getDestinations() {
    const res = await fetch(`${API_URL}/destinations`);
    return res.json();
}

// OBTENER CONTEOS DE CATEGORÍAS
export async function getCategoryCounts() {
    const res = await fetch(`${API_URL}/destinations/counts`);
    return res.json();
}

// BUSCAR DESTINOS
export async function searchDestinations(query) {
    const res = await fetch(`${API_URL}/destinations/search?q=${encodeURIComponent(query)}`);
    return res.json();
}
