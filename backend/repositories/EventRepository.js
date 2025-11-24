/**
 * @file repositories/EventRepository.js
 * @description Módulo responsable del acceso a la base de datos para la tabla `events`.
 * Aquí se implementan las consultas SQL directas utilizando el pool `db`,
 * sin lógica de negocio (esa corresponde al EventService).
 */

import db from "../config/db.js";

export class EventRepository {

    /**
     * Obtener todos los eventos con filtros opcionales.
     *
     * @async
     * @param {Object} filters - Filtros opcionales para búsqueda.
     * @param {number} [filters.destination_id] - Filtrar eventos por destino.
     * @param {string} [filters.q] - Texto para buscar en título o descripción.
     * @returns {Promise<Array>} Lista de eventos encontrados.
     */
    static async getAll(filters = {}) {
        let sql = `SELECT * FROM events WHERE 1 = 1`;
        const params = [];

        if (filters.destination_id) {
            sql += ` AND destination_id = ?`;
            params.push(filters.destination_id);
        }

        if (filters.q) {
            sql += ` AND (title LIKE ? OR description LIKE ?)`;
            params.push(`%${filters.q}%`, `%${filters.q}%`);
        }

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    /**
     * Obtener un evento específico por su ID.
     *
     * @async
     * @param {number} id - ID del evento a buscar.
     * @returns {Promise<Object|null>} Evento encontrado o null si no existe.
     */
    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM events WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    }

    /**
     * Registrar un nuevo evento en la base de datos.
     *
     * @async
     * @param {Object} data - Datos para crear un evento.
     * @param {number} data.destination_id - ID del destino al que pertenece el evento.
     * @param {string} data.title - Título del evento.
     * @param {string} [data.description] - Descripción del evento.
     * @param {string} data.date - Fecha del evento (YYYY-MM-DD).
     * @param {string} [data.location] - Ubicación del evento.
     * @param {string} [data.image_url] - URL de la imagen del evento.
     * @returns {Promise<number>} ID insertado del nuevo evento.
     */
    static async create(data) {
        const { destination_id, title, description, date, location, image_url } = data;

        const [result] = await db.execute(
            `INSERT INTO events (destination_id, title, description, date, location, image_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [destination_id, title, description, date, location, image_url]
        );

        return result.insertId;
    }

    /**
     * Actualizar un evento existente.
     *
     * @async
     * @param {number} id - ID del evento a actualizar.
     * @param {Object} data - Datos actualizados del evento.
     * @returns {Promise<boolean>} true si se actualizó, false si no existe.
     */
    static async update(id, data) {
        const { title, description, date, location, image_url } = data;

        const [result] = await db.execute(
            `UPDATE events SET 
                title = ?, 
                description = ?, 
                date = ?, 
                location = ?, 
                image_url = ?
             WHERE id = ?`,
            [title, description, date, location, image_url, id]
        );

        return result.affectedRows > 0;
    }

    /**
     * Eliminar un evento por su ID.
     *
     * @async
     * @param {number} id - ID del evento a eliminar.
     * @returns {Promise<boolean>} true si se eliminó, false si no existe.
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM events WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }
}
