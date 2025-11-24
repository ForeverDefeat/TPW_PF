/**
 * @file models/Category.js
 * @description Modelo de datos para las categorías del portal de turismo.
 * @module models/Category
 */

import { db } from "../config/db.js";

/**
 * Representa una categoría dentro del sistema.
 *
 * @typedef {Object} Category
 * @property {number} id - ID de la categoría.
 * @property {string} name - Nombre de la categoría (ej: "Playas").
 * @property {string} description - Breve descripción que se mostrará en la interfaz.
 * @property {string} imageUrl - Imagen mostrada en el home.
 */
export class CategoryModel {
    /**
     * Obtiene todas las categorías de la base de datos.
     * @returns {Promise<Category[]>} Lista de categorías.
     */
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM categories");
        return rows;
    }

    /**
     * Obtiene una categoría por ID.
     * @param {number} id - ID de la categoría.
     * @returns {Promise<Category|null>}
     */
    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
        return rows[0] || null;
    }

    /**
     * Crea una nueva categoría.
     * @param {Object} data
     * @param {string} data.name - Nombre de la categoría.
     * @param {string} data.description - Descripción corta.
     * @param {string} data.imageUrl - URL de la imagen principal.
     * @returns {Promise<number>} ID insertado.
     */
    static async create(data) {
        const { name, description, imageUrl } = data;
        const [result] = await db.query(
            "INSERT INTO categories (name, description, imageUrl) VALUES (?, ?, ?)",
            [name, description, imageUrl]
        );
        return result.insertId;
    }

    /**
     * Actualiza una categoría existente.
     * @param {number} id - ID de la categoría.
     * @param {Object} data - Datos a actualizar.
     * @returns {Promise<boolean>} TRUE si se modificó.
     */
    static async update(id, data) {
        const { name, description, imageUrl } = data;
        const [res] = await db.query(
            `UPDATE categories SET name=?, description=?, imageUrl=? WHERE id=?`,
            [name, description, imageUrl, id]
        );
        return res.affectedRows > 0;
    }

    /**
     * Elimina una categoría.
     * @param {number} id - ID de la categoría.
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        const [res] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
        return res.affectedRows > 0;
    }
}
