import { apiGet } from "../api.js";

export async function getAllDestinations() {
    return await apiGet("/destinations");
}

export async function getDestinationsByCategory(categoryId) {
    return await apiGet(`/destinations?category=${categoryId}`);
}
