/**
 * @file services/DestinationServiceService.js
 * @description Lógica de negocio para la relación destino-servicio
 */

import { DestinationServiceRepository } from "../repositories/DestinationServiceRepository.js";

export class DestinationServiceService {

    /**
     * Obtiene servicios cercanos para un destino
     * @param {number} destinationId
     */
    static async getByDestination(destinationId) {
        return await DestinationServiceRepository.getByDestination(destinationId);
    }

    /**
     * Crea la relación muchos a muchos
     * @param {number} destinationId
     * @param {number} serviceId
     */
    static async create(destinationId, serviceId) {
        return await DestinationServiceRepository.create(destinationId, serviceId);
    }

    /**
     * Elimina relación destino-servicio
     * @param {number} id
     */
    static async delete(id) {
        const deleted = await DestinationServiceRepository.delete(id);
        if (!deleted) {
            throw new Error("No se encontró la relación destino-servicio");
        }
        return deleted;
    }
}
