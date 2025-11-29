/**
 * @file repositories/CategoryRepository.js
 * @description Capa de persistencia para la entidad Category.
 *              Todas las consultas SQL están adaptadas a la BD real (image_url).
 * @module repositories/CategoryRepository
 */

import { db } from "../config/db.js";

export class CategoryRepository {

    /**
     * Obtiene todas las categorías.
     * @returns {Promise<Array>}
     */
    static async findAll() {
        const [rows] = await db.query(`
            SELECT * FROM categories ORDER BY id DESC
        `);
        return rows;
    }

    /**
     * Obtiene una categoría por su ID.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    static async findById(id) {
        const [rows] = await db.query(`
            SELECT * FROM categories WHERE id = ?
        `, [id]);
        return rows[0] || null;
    }

    /**
     * Insertar una nueva categoría.
     *
     * @param {Object} data
     * @param {string} data.name
     * @param {string|null} data.description
     * @param {string|null} data.image_url
     * @returns {Promise<number>} ID insertado
     */
    static async create(data) {

        const { name, description, image_url } = data;

        const [result] = await db.query(`
            INSERT INTO categories (name, description, image_url)
            VALUES (?, ?, ?)
        `, [name, description, image_url]);

        return result.insertId;
    }

    /**
     * Actualizar una categoría.
     * Solo actualiza los campos enviados.
     *
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<boolean>}
     */
    static async update(id, data) {

        const fields = [];
        const values = [];

        if (data.name !== undefined) {
            fields.push("name = ?");
            values.push(data.name);
        }

        if (data.description !== undefined) {
            fields.push("description = ?");
            values.push(data.description);
        }

        if (data.image_url !== undefined) {
            fields.push("image_url = ?");
            values.push(data.image_url);
        }

        // Si no hay campos a actualizar
        if (fields.length === 0) return false;

        const sql = `
            UPDATE categories
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

        values.push(id);

        const [result] = await db.query(sql, values);

        return result.affectedRows > 0;
    }

    /**
     * Elimina una categoría por ID.
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        const [result] = await db.query(`
            DELETE FROM categories WHERE id = ?
        `, [id]);

        return result.affectedRows > 0;
    }

    static async getBySlug(slug) {
        const [rows] = await db.query(
            "SELECT * FROM categories WHERE slug = ? LIMIT 1",
            [slug]
        );
        return rows[0];
    }

}
