/**
 * @file repositories/EventsFollowedRepository.js
 * @description Acceso directo a la base de datos para la tabla `events_followed`.
 * Aquí se implementan consultas SQL puras sin lógica de negocio adicional.
 */

import db from "../config/db.js";

export class EventsFollowedRepository {

    /**
     * Obtener todos los eventos seguidos por un usuario.
     *
     * @async
     * @param {number} userId - ID del usuario.
     * @returns {Promise<Array>} Lista de eventos que el usuario sigue.
     */
    static async getByUser(userId) {
        const [rows] = await db.execute(
            `SELECT ef.id, ef.event_id, e.title, e.date, e.location, e.image_url
             FROM events_followed ef
             INNER JOIN events e ON e.id = ef.event_id
             WHERE ef.user_id = ?`,
            [userId]
        );
        return rows;
    }

    /**
     * Verificar si un usuario ya sigue un evento.
     *
     * @async
     * @param {number} userId 
     * @param {number} eventId 
     * @returns {Promise<boolean>}
     */
    static async exists(userId, eventId) {
        const [rows] = await db.execute(
            `SELECT id FROM events_followed 
             WHERE user_id = ? AND event_id = ?`,
            [userId, eventId]
        );
        return rows.length > 0;
    }

    /**
     * Registrar que un usuario sigue un evento.
     *
     * @async
     * @param {number} userId 
     * @param {number} eventId 
     * @returns {Promise<number>} ID de la relación creada.
     */
    static async create(userId, eventId) {
        const [result] = await db.execute(
            `INSERT INTO events_followed (user_id, event_id)
             VALUES (?, ?)`,
            [userId, eventId]
        );
        return result.insertId;
    }

    /**
     * Eliminar la relación de "evento seguido".
     *
     * @async
     * @param {number} id - ID del registro events_followed.
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM events_followed WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
