/**
 * @file services/ServiceService.js
 * @description Reglas de negocio para la entidad Service.
 * Valida datos, aplica lógica y coordina interacción entre controller y repository.
 */

import { ServiceRepository } from "../repositories/ServiceRepository.js";
import { db } from "../config/db.js"; // Para validar service_types

/**
 * @typedef {import("../repositories/ServiceRepository.js").Service} Service
 * @typedef {import("../repositories/ServiceRepository.js").ServiceFilters} ServiceFilters
 */

export class ServiceService {

    /**
     * Obtiene servicios con filtros opcionales.
     * @param {ServiceFilters} filters
     * @returns {Promise<Service[]>}
     */
    static async getAll(filters = {}) {
        return await ServiceRepository.findAll(filters);
    }

    /**
     * Obtiene un servicio por su ID.
     * @param {number} id
     * @returns {Promise<Service|null>}
     */
    static async getById(id) {
        if (!id) throw new Error("ID es obligatorio");
        return await ServiceRepository.findById(id);
    }

    /**
     * Crea un nuevo servicio turístico.
     *
     * @param {Object} data
     * @param {number} data.service_type_id
     * @param {string} data.name
     * @param {string} [data.location]
     * @param {string} [data.description]
     * @param {string} [data.price_range]
     * @param {string} [data.image_url]
     * @returns {Promise<number>} ID insertado
     */
    static async create(data) {
        this.validateRequiredFields(data);
        await this.validateServiceType(data.service_type_id);

        return await ServiceRepository.create(data);
    }

    /**
     * Actualiza un servicio existente.
     *
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<boolean>}
     */
    static async update(id, data) {
        if (!id) throw new Error("ID es obligatorio");

        if (data.service_type_id) {
            await this.validateServiceType(data.service_type_id);
        }

        return await ServiceRepository.update(id, data);
    }

    /**
     * Elimina un servicio.
     *
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        if (!id) throw new Error("ID es obligatorio");
        return await ServiceRepository.delete(id);
    }

    // =======================================================
    // 🔍 VALIDACIONES INTERNAS
    // =======================================================

    /**
     * Valida campos obligatorios.
     * @private
     */
    static validateRequiredFields(data) {
        if (!data.name) throw new Error("El nombre del servicio es obligatorio");
        if (!data.service_type_id) throw new Error("service_type_id es obligatorio");
    }

    /**
     * Valida que el tipo de servicio exista (FK service_types).
     * @private
     * @param {number} serviceTypeId
     */
    static async validateServiceType(serviceTypeId) {
        const [rows] = await db.query(
            "SELECT id FROM service_types WHERE id = ?",
            [serviceTypeId]
        );

        if (rows.length === 0) {
            throw new Error(`El service_type_id ${serviceTypeId} no existe`);
        }
    }
}
