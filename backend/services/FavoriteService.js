/**
 * @file services/FavoriteService.js
 * @description Capa de lógica de negocio para la gestión de favoritos de usuario.
 * Aquí se validan reglas como evitar duplicados y asegurar la integridad lógica
 * antes de llamar al FavoriteRepository.
 */

import { FavoriteRepository } from "../repositories/FavoriteRepository.js";

export class FavoriteService {

    /**
     * Obtener todos los destinos favoritos de un usuario.
     *
     * @async
     * @param {number} userId - ID del usuario.
     * @returns {Promise<Array>} Lista de destinos favoritos.
     */
    static async getByUser(userId) {
        return await FavoriteRepository.getByUser(userId);
    }

    /**
     * Crear un favorito nuevo para un usuario.
     * Aplica la regla de: "un destino no puede ser favorito dos veces".
     *
     * @async
     * @param {number} userId - ID del usuario.
     * @param {number} destinationId - ID del destino.
     * @returns {Promise<number>} ID del favorito creado.
     * @throws {Error} Si el favorito ya existe.
     */
    static async create(userId, destinationId) {

        // Verificar duplicado
        const exists = await FavoriteRepository.exists(userId, destinationId);
        if (exists) {
            throw new Error("El destino ya está en la lista de favoritos del usuario.");
        }

        return await FavoriteRepository.create(userId, destinationId);
    }

    /**
     * Eliminar un favorito por su ID.
     *
     * @async
     * @param {number} favoriteId - ID del registro en favorites.
     * @returns {Promise<boolean>} true si se eliminó correctamente.
     * @throws {Error} Si el favorito no existe.
     */
    static async delete(favoriteId) {
        const deleted = await FavoriteRepository.delete(favoriteId);

        if (!deleted) {
            throw new Error("No se encontró el registro de favorito a eliminar.");
        }

        return true;
    }
}
