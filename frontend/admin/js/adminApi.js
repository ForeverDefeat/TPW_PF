/**
 * @file adminApi.js
 * @description Cliente HTTP centralizado para el Panel Admin.
 *              Maneja GET, POST, PUT, DELETE y uploads de imágenes.
 * @module adminApi
 */

const API_URL = window.location.origin + "/api";

/* ============================================================================
   VALIDACIÓN ESTÁNDAR
============================================================================ */

/**
 * Valida respuesta de backend (requiere ok:true)
 * @param {Response} res
 */
async function handleResponse(res) {
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.ok === false) {
        const msg = json.message || "Error en API";
        console.error("API ERROR:", msg);
        throw new Error(msg);
    }

    return json;
}

/* ============================================================================
   MÉTODO GET
============================================================================ */

/**
 * GET genérico que devuelve json completo o propiedades normalizadas.
 * Compatible con:
 *   - listados del admin
 *   - dashboard/stats
 *   - registros individuales
 *
 * @param {string} endpoint
 */
export async function apiGet(endpoint) {
    const res = await fetch(API_URL + endpoint);
    const json = await handleResponse(res);

    // 🧠 Si el backend envía estadísticas completas → devolver tal cual
    if (
        json.categories !== undefined &&
        json.destinations !== undefined &&
        json.services !== undefined &&
        json.events !== undefined &&
        json.users !== undefined &&
        json.destinationsPerCategory !== undefined &&
        json.recentActivity !== undefined
    ) {
        return json; // <-- Dashboard Stats
    }

    // 🧩 Normalización para listados o respuestas estándar
    return (
        json.data ||
        json.categories ||
        json.destinations ||
        json.services ||
        json.events ||
        json.users ||
        json.favorites ||
        json.eventsFollowed ||
        json
    );
}

/* ============================================================================
   POST JSON
============================================================================ */

export async function apiPost(endpoint, data) {
    const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return handleResponse(res);
}

/* ============================================================================
   PUT JSON
============================================================================ */

export async function apiPut(endpoint, data) {
    const res = await fetch(API_URL + endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return handleResponse(res);
}

/* ============================================================================
   DELETE
============================================================================ */

export async function apiDelete(endpoint) {
    const res = await fetch(API_URL + endpoint, { method: "DELETE" });
    return handleResponse(res);
}

/* ============================================================================
   UPLOADS — FORM DATA
============================================================================ */

/**
 * POST con FormData — cualquier tipo de archivo
 * @param {string} endpoint
 * @param {FormData} fd
 */
export async function apiPostFile(endpoint, fd) {
    const res = await fetch(API_URL + endpoint, {
        method: "POST",
        body: fd
    });
    return handleResponse(res);
}

/**
 * PUT con FormData — actualización con archivos opcionales
 * @param {string} endpoint
 * @param {FormData} fd
 */
export async function apiPutFile(endpoint, fd) {
    const res = await fetch(API_URL + endpoint, {
        method: "PUT",
        body: fd
    });

    return handleResponse(res);
}

/* ============================================================================
   UPLOAD DE IMÁGENES
============================================================================ */

/**
 * Sube una imagen a `/api/upload/image`
 * y devuelve directamente la URL final pública.
 *
 * @param {File} file
 * @returns {Promise<string>} URL final
 */
export async function apiUploadImage(file) {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(API_URL + "/upload/image", {
        method: "POST",
        body: fd
    });

    const json = await handleResponse(res);

    return json.url; // <-- importante: solo retornamos la URL
}
