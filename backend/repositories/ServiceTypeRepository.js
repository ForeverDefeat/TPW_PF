/**
 * @file repositories/ServiceTypeRepository.js
 * @description Acceso a la base de datos para service_types.
 */

import { db } from "../config/db.js";

export class ServiceTypeRepository {

    /**
     * Obtiene todos los tipos de servicio.
     * @returns {Promise<Array>}
     */
    static async findAll() {
        const [rows] = await db.query(`SELECT * FROM service_types ORDER BY id DESC`);
        return rows;
    }

    /**
     * Obtiene un tipo de servicio por ID.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    static async findById(id) {
        const [rows] = await db.query(`SELECT * FROM service_types WHERE id = ?`, [id]);
        return rows[0] || null;
    }

    /**
     * Inserta un tipo de servicio nuevo.
     * @param {{name:string, icon_url?:string}} data
     * @returns {Promise<number>}
     */
    static async create(data) {
        const { name, icon_url = null } = data;

        const [result] = await db.query(
            `INSERT INTO service_types (name, icon_url)
             VALUES (?, ?)`,
            [name, icon_url]
        );
        return result.insertId;
    }

    /**
     * Actualiza un tipo de servicio.
     * @param {number} id
     * @param {{name?:string, icon_url?:string}} data
     * @returns {Promise<boolean>}
     */
    static async update(id, data) {
        const { name, icon_url } = data;

        const [result] = await db.query(
            `UPDATE service_types
             SET name = ?, icon_url = ?
             WHERE id = ?`,
            [name, icon_url, id]
        );

        return result.affectedRows > 0;
    }

    /**
     * Elimina un tipo de servicio por ID.
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        const [result] = await db.query(
            `DELETE FROM service_types WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
