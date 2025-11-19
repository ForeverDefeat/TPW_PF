const API_URL = "http://localhost:4000/api";

export async function login(data) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function register(data) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function getDestinations() {
    const res = await fetch(`${API_URL}/destinations`);
    return res.json();
}

export async function addDestination(data) {
    const res = await fetch(`${API_URL}/destinations`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    return res.json();
}
