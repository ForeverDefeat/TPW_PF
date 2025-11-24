/**
 * @file services/CategoryService.js
 * @description Lógica de negocio para la entidad Category, con soporte para imágenes.
 * @module services/CategoryService
 */

import { CategoryRepository } from "../repositories/CategoryRepository.js";

export class CategoryService {

    /**
     * Obtiene todas las categorías.
     * @returns {Promise<Array>}
     */
    static async getAll() {
        return await CategoryRepository.findAll();
    }

    /**
     * Obtiene una categoría por ID.
     * @param {number} id
     * @returns {Promise<Object>}
     * @throws {Error} Si no existe la categoría
     */
    static async getById(id) {
        const category = await CategoryRepository.findById(id);

        if (!category)
            throw new Error("Categoría no encontrada");

        return category;
    }

    /**
     * Crea una nueva categoría.
     *
     * @param {Object} data
     * @param {string} data.name
     * @param {string} data.description
     * @param {string} [data.image_url]  // imagen opcional
     *
     * @returns {Promise<Object>} categoría creada
     * @throws {Error} si faltan campos
     */
    static async create(data) {

        if (!data.name)
            throw new Error("El nombre es obligatorio");

        // Inserción
        const id = await CategoryRepository.create({
            name: data.name,
            description: data.description || null,
            image_url: data.image_url || null
        });

        return await CategoryRepository.findById(id);
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param {number} id
     * @param {Object} data
     * @param {string} [data.name]
     * @param {string} [data.description]
     * @param {string|undefined} [data.image_url]
     *    - undefined → NO modificar imagen
     *    - null      → eliminar imagen
     *    - string    → reemplazar imagen
     *
     * @returns {Promise<Object>} categoría actualizada
     * @throws {Error} si no existe
     */
    static async update(id, data) {
        const category = await CategoryRepository.findById(id);

        if (!category)
            throw new Error("Categoría no encontrada");

        // Construimos nuevo objeto, conservando lo existente
        const updatedData = {
            name: data.name ?? category.name,
            description: data.description ?? category.description
        };

        // Manejo de la imagen:
        // ✨ undefined = NO tocar imagen
        // ✨ string = nueva imagen
        // ✨ null = quitar imagen
        if (data.image_url !== undefined) {
            updatedData.image_url = data.image_url;
        }

        await CategoryRepository.update(id, updatedData);

        return await CategoryRepository.findById(id);
    }

    /**
     * Elimina una categoría.
     * @param {number} id
     * @returns {Promise<boolean>}
     * @throws {Error} si no existe
     */
    static async delete(id) {
        const exists = await CategoryRepository.findById(id);
        if (!exists)
            throw new Error("Categoría no encontrada");

        return await CategoryRepository.delete(id);
    }
}
