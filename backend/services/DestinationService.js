/**
 * @file services/DestinationService.js
 * @description Capa de servicio para gestionar destinos turísticos.
 */

import { DestinationRepository } from "../repositories/DestinationRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";

export class DestinationService {

    /** Obtener todos los destinos */
    static async getAllDestinations() {
        return await DestinationRepository.findAll();
    }

    /** Obtener destino por ID */
    static async getDestinationById(id) {
        return await DestinationRepository.findById(id);
    }

    /** Validar datos base */
    static validateDestinationInput(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 3) {
            errors.push("El nombre del destino debe tener al menos 3 caracteres.");
        }

        if (!data.category_id || isNaN(data.category_id)) {
            errors.push("Se requiere una categoría válida.");
        }

        if (!data.description || data.description.trim().length < 20) {
            errors.push("La descripción debe contener al menos 20 caracteres.");
        }

        if (errors.length > 0) {
            const error = new Error("Datos inválidos para creación/actualización de destino");
            error.status = 400;
            error.details = errors;
            throw error;
        }
    }

    /** Crear nuevo destino */
    static async createDestination(data) {

        this.validateDestinationInput(data);

        const category = await CategoryRepository.findById(data.category_id);
        if (!category) {
            const error = new Error("La categoría asignada no existe.");
            error.status = 404;
            throw error;
        }

        const slug = data.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        const destinationData = {
            ...data,
            categoryId: Number(data.category_id),
            slug
        };

        return await DestinationRepository.create(destinationData);
    }

    /** Actualizar destino */
    static async updateDestination(id, data) {

    const mappedData = {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category_id !== undefined && { categoryId: Number(data.category_id) }),

        ...(data.is_featured !== undefined && { 
            isFeatured: Number(data.is_featured) === 1 
        }),

        // 🔥 SOLO insertar si hay imagen nueva
        ...(data.main_image !== null && data.main_image !== undefined && { 
            mainImageUrl: data.main_image 
        }),

        ...(data.hero_image !== null && data.hero_image !== undefined && { 
            heroImageUrl: data.hero_image 
        })
    };

    // Slug al cambiar nombre
    if (mappedData.name) {
        mappedData.slug = mappedData.name.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
    }

    return await DestinationRepository.update(id, mappedData);
}


    /** Eliminar destino */
    static async deleteDestination(id) {
        const destination = await DestinationRepository.findById(id);

        if (!destination) {
            const error = new Error("El destino no existe.");
            error.status = 404;
            throw error;
        }

        if (destination.isFeatured === 1) {
            const error = new Error("No se puede eliminar un destino destacado.");
            error.status = 409;
            throw error;
        }

        return await DestinationRepository.delete(id);
    }
}
