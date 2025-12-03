/**
 * @file services/ServiceService.js
 * @description Reglas de negocio para servicios turísticos.
 */

import { ServiceRepository } from "../repositories/ServiceRepository.js";
import { db } from "../config/db.js";

export class ServiceService {

    /** Obtener todos los servicios */
    static async getAll(filters = {}) {
        return await ServiceRepository.findAll(filters);
    }

    /** Obtener un servicio por ID */
    static async getById(id) {
        if (!id) throw new Error("ID es obligatorio");
        return await ServiceRepository.findById(id);
    }

    /** Crear servicio */
    static async create(data) {
        this.validateRequiredFields(data);

        // Validar FK
        await this.validateServiceType(data.service_type_id);

        // Normalizar datos
        const serviceData = {
            service_type_id: Number(data.service_type_id),
            name: data.name,
            location: data.location ?? null,
            description: data.description ?? null,
            price_min: data.price_min ? Number(data.price_min) : null,
            price_max: data.price_max ? Number(data.price_max) : null,
            image_url: data.image_url ?? null
        };

        return await ServiceRepository.create(serviceData);
    }

    /** Actualizar servicio */
    static async update(id, data) {
        if (!id) throw new Error("ID es obligatorio");

        // Validar tipo de servicio si viene en la actualización
        if (data.service_type_id !== undefined) {
            await this.validateServiceType(data.service_type_id);
        }

        // Armado dinámico (solo actualiza lo que el frontend envía)
        const updateData = {
            ...(data.service_type_id !== undefined && { service_type_id: Number(data.service_type_id) }),
            ...(data.name !== undefined && { name: data.name }),
            ...(data.location !== undefined && { location: data.location }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.price_min !== undefined && { price_min: Number(data.price_min) }),
            ...(data.price_max !== undefined && { price_max: Number(data.price_max) }),
            ...(data.image_url && { image_url: data.image_url })

        };

        return await ServiceRepository.update(id, updateData);
    }

    /** Eliminar servicio */
    static async delete(id) {
        if (!id) throw new Error("ID es obligatorio");
        return await ServiceRepository.delete(id);
    }

    // =======================================================
    // VALIDACIONES DE NEGOCIO
    // =======================================================

    static validateRequiredFields(data) {
        if (!data.name) throw new Error("El nombre del servicio es obligatorio");
        if (!data.service_type_id) throw new Error("service_type_id es obligatorio");
    }

    static async validateServiceType(serviceTypeId) {
        const [rows] = await db.query(
            "SELECT id FROM service_types WHERE id = ?",
            [serviceTypeId]
        );

        if (rows.length === 0) {
            throw new Error(`El service_type_id ${serviceTypeId} no existe`);
        }
    }

    static async getByDestination(destination_id) {
        return await ServiceRepository.findByDestination(destination_id);
    }

}
