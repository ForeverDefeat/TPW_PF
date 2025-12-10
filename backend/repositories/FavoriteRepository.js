/**
 * @file repositories/FavoriteRepository.js
 * @description Acceso a la base de datos para la gestión de favoritos.
 */

import db from "../config/db.js";

export class FavoriteRepository {

    static async getByUser(userId) {
        const [rows] = await db.execute(`
        SELECT 
            f.id,
            d.id AS destination_id,
            d.name,
            d.summary,
            d.main_image_url,
            d.slug
        FROM favorites f
        JOIN destinations d ON d.id = f.destination_id
        WHERE f.user_id = ?
        AND d.slug IS NOT NULL
        AND d.slug <> ''
        ORDER BY f.id DESC
    `, [userId]);

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

        // Verificar destino existente
        const [[dest]] = await db.execute(
            `SELECT slug FROM destinations WHERE id = ?`,
            [destinationId]
        );

        if (!dest) {
            throw new Error("El destino no existe.");
        }

        if (!dest.slug) {
            throw new Error("Este destino no tiene slug, no puede agregarse a favoritos.");
        }

        // Verificar duplicado
        const [[exists]] = await db.execute(
            `SELECT id FROM favorites WHERE user_id = ? AND destination_id = ?`,
            [userId, destinationId]
        );
        if (exists) throw new Error("Ya está en tus favoritos.");

        const [result] = await db.execute(
            `INSERT INTO favorites (user_id, destination_id) VALUES (?, ?)`,
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
