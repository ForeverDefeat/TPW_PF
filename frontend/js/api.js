// frontend/js/api.js

export const API_URL = "http://localhost:4000/api";

/* ============================================================
   MÉTODO BASE PARA TODAS LAS PETICIONES
============================================================ */
async function request(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: {}
    };

    // JSON body
    if (body && !(body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    // FormData (multipart)
    if (body instanceof FormData) {
        options.body = body; // NO poner headers
    }

    const res = await fetch(API_URL + endpoint, options);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error en API");
    }

    return res.json();
}

export async function apiExists(url) {
    try {
        const res = await fetch(`${API_BASE}${url}`, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}


/* ============================================================
   EXPORTS GENERALES
============================================================ */
export const apiGet = (url) => request(url, "GET");
export const apiPost = (url, body) => request(url, "POST", body);
export const apiPut = (url, body) => request(url, "PUT", body);
export const apiDelete = (url) => request(url, "DELETE");

/* ============================================================
   AUTENTICACIÓN
============================================================ */
export function loginUser(email, password) {
    return apiPost("/auth/login", { email, password });
}

export function registerUser(full_name, email, password) {
    return apiPost("/auth/register", { full_name, email, password });
}

/* ============================================================
   FRONTEND PÚBLICO
============================================================ */
export function searchDestinations(q) {
    return apiGet(`/destinations/search?q=${encodeURIComponent(q)}`);
}

export function getDestinations() {
    return apiGet("/destinations");
}

export function getCategoryCounts() {
    return apiGet("/destinations/counts");
}

export function getCategories() {
    return apiGet("/categories");
}

export function getCategoryBySlug(slug) {
    return apiGet(`/categories/slug/${slug}`);
}

export function getDestinationsByCategory(id) {
    return apiGet(`/destinations/category/${id}`);
}

export function getDestinationBySlug(slug) {
    return apiGet(`/destinations/slug/${slug}`);
}

export function getServicesByDestination(id) {
    return apiGet(`/services/destination/${id}`);
}

export function getEventsByDestination(id) {
    return apiGet(`/events/destination/${id}`);
}

export function getDashboardStats() {
    return apiGet("/dashboard/stats").then(r => r);
}
