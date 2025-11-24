/**
 * @file services/DestinationService.js
 * @description Capa de servicio para la entidad Destination.
 * Maneja reglas de negocio, validaciones y comunicación con el repository.
 * @module services/DestinationService
 */

import { DestinationRepository } from "../repositories/DestinationRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";

/**
 * Servicio para gestionar destinos turísticos.
 * Se encarga de:
 * - Validar datos de entrada
 * - Aplicar reglas de negocio
 * - Coordinar acceso a datos mediante el Repository Pattern
 */
export class DestinationService {

    /**
     * Obtiene todos los destinos disponibles.
     * @returns {Promise<Array>}
     */
    static async getAllDestinations() {
        return await DestinationRepository.findAll();
    }

    /**
     * Obtiene un destino por su ID.
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    static async getDestinationById(id) {
        return await DestinationRepository.findById(id);
    }

    /**
     * Valida datos comunes de un destino.
     * @private
     */
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

    /**
     * Crea un nuevo destino turístico.
     * Aplica reglas de negocio como:
     *  - Verificar que la categoría exista
     *  - Validar campos obligatorios
     *  - Crear slug automáticamente
     *
     * @param {Object} data
     * @returns {Promise<number>} ID del destino creado
     */
    static async createDestination(data) {

        // === Validación de input ===
        this.validateDestinationInput(data);

        // === Regla de negocio: categoría debe existir ===
        const category = await CategoryRepository.findById(data.category_id);
        if (!category) {
            const error = new Error("La categoría asignada no existe.");
            error.status = 404;
            throw error;
        }

        // === Generar slug amigable ===
        const slug = data.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        const destinationData = {
            ...data,
            slug
        };

        return await DestinationRepository.create(destinationData);
    }

    /**
     * Actualiza un destino existente.
     *
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<boolean>}
     */
    static async updateDestination(id, data) {

        // Validar input parcial
        if (data.name || data.description || data.category_id) {
            this.validateDestinationInput({
                name: data.name ?? "dummy",
                description: data.description ?? "descripcion minima 1234567890123456",
                category_id: data.category_id ?? 1
            });
        }

        // Si cambia categoría, verificar que exista
        if (data.category_id) {
            const category = await CategoryRepository.findById(data.category_id);
            if (!category) {
                const error = new Error("La categoría asignada no existe.");
                error.status = 404;
                throw error;
            }
        }

        // Si actualiza nombre, regenerar slug
        if (data.name) {
            data.slug = data.name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "");
        }

        return await DestinationRepository.update(id, data);
    }

    /**
     * Elimina un destino.
     * Aplica reglas de negocio como:
     * - No permitir eliminar destinos destacados (is_featured = 1)
     *
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    static async deleteDestination(id) {
        const destination = await DestinationRepository.findById(id);

        if (!destination) {
            const error = new Error("El destino no existe.");
            error.status = 404;
            throw error;
        }

        // Regla de negocio: no eliminar destinos destacados
        if (destination.is_featured === 1) {
            const error = new Error("No se puede eliminar un destino destacado.");
            error.status = 409;
            throw error;
        }

        return await DestinationRepository.delete(id);
    }
}
