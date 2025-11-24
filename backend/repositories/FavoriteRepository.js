/**
 * @file repositories/FavoriteRepository.js
 * @description Acceso a la base de datos para la gestión de favoritos.
 */

import db from "../config/db.js";

export class FavoriteRepository {

    /**
     * Obtener favoritos de un usuario.
     * @async
     * @param {number} userId - ID del usuario.
     * @returns {Promise<Array>} Lista de destinos favoritos.
     */
    static async getByUser(userId) {
        const [rows] = await db.execute(
            `SELECT f.id, f.destination_id, d.name, d.image_url, d.location
             FROM favorites f
             INNER JOIN destinations d ON d.id = f.destination_id
             WHERE f.user_id = ?`,
            [userId]
        );
        return rows;
    }

    /**
     * Verificar si un favorito ya existe.
     * @async
     * @param {number} userId 
     * @param {number} destinationId 
     * @returns {Promise<boolean>}
     */
    static async exists(userId, destinationId) {
        const [rows] = await db.execute(
            `SELECT id FROM favorites 
             WHERE user_id = ? AND destination_id = ?`,
            [userId, destinationId]
        );
        return rows.length > 0;
    }

    /**
     * Crear un nuevo favorito.
     * @async
     * @param {number} userId 
     * @param {number} destinationId 
     * @returns {Promise<number>} ID del favorito creado.
     */
    static async create(userId, destinationId) {
        const [result] = await db.execute(
            `INSERT INTO favorites (user_id, destination_id)
             VALUES (?, ?)`,
            [userId, destinationId]
        );
        return result.insertId;
    }

    /**
     * Eliminar un favorito.
     * @async
     * @param {number} id - ID del registro en favorites.
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM favorites WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
