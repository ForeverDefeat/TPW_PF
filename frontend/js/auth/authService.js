import { apiPost } from "../api.js";

export async function loginUser(email, password) {
    return await apiPost("/auth/login", { email, password });
}

export async function registerUser(full_name, email, password) {
    return await apiPost("/auth/register", { full_name, email, password });
}
