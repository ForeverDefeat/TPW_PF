/**
 * @file services/ServiceTypeService.js
 * @description Capa de negocio para gestionar los tipos de servicios turísticos.
 * Aquí se realizan validaciones previas al acceso a la BD y se definen las reglas.
 *
 * @module ServiceTypeService
 */

import { ServiceTypeRepository } from "../repositories/ServiceTypeRepository.js";

export class ServiceTypeService {

    /**
     * Obtiene todos los tipos de servicio.
     *
     * @returns {Promise<Array>} Lista de tipos de servicio
     */
    static async getAll() {
        return await ServiceTypeRepository.findAll();
    }

    /**
     * Obtiene un tipo de servicio por su ID.
     *
     * @param {number} id - ID del tipo de servicio
     * @returns {Promise<Object|null>} El tipo encontrado o null
     */
    static async getById(id) {
        return await ServiceTypeRepository.findById(id);
    }

    /**
     * Crea un nuevo tipo de servicio turístico.
     *
     * @param {Object} data - Datos del tipo
     * @param {string} data.name - Nombre del tipo
     * @param {string} [data.icon_url] - Icono opcional
     * @returns {Promise<number>} ID insertado
     *
     * @throws {Error} Si falta un dato obligatorio
     */
    static async create(data) {
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("El campo 'name' del tipo de servicio es obligatorio.");
        }

        return await ServiceTypeRepository.create(data);
    }

    /**
     * Actualiza un tipo de servicio existente.
     *
     * @param {number} id - ID del tipo
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<boolean>} true si se actualizó, false si no existe
     */
    static async update(id, data) {
        return await ServiceTypeRepository.update(id, data);
    }

    /**
     * Elimina un tipo de servicio por ID.
     *
     * @param {number} id - ID del tipo
     * @returns {Promise<boolean>} true si se eliminó, false si no existe
     */
    static async delete(id) {
        return await ServiceTypeRepository.delete(id);
    }
}
