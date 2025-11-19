const API_URL = "http://localhost:4000/api";

// LOGIN
export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

// REGISTER
export async function registerUser(data) {
    const res = await fetch(`${API_URL}/register`, {
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

// AÑADIR DESTINO
export async function addDestination(data) {
    const res = await fetch(`${API_URL}/destinations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
