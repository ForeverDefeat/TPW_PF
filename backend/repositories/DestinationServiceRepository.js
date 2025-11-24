/**
 * @file repositories/DestinationServiceRepository.js
 * @description Repository para la tabla destination_services (Many-to-Many)
 */

import db from "../config/db.js";

export class DestinationServiceRepository {
    /**
     * Obtiene todos los servicios relacionados a un destino
     * @param {number} destinationId
     * @returns {Promise<Array>}
     */
    static async getByDestination(destinationId) {
        const [rows] = await db.execute(
            `SELECT ds.id, ds.destination_id, ds.service_id, s.name AS service_name, s.type_id
             FROM destination_services ds
             INNER JOIN services s ON s.id = ds.service_id
             WHERE ds.destination_id = ?`,
            [destinationId]
        );
        return rows;
    }

    /**
     * Crea relación destino-servicio
     * @param {number} destinationId
     * @param {number} serviceId
     * @returns {Promise<Object>}
     */
    static async create(destinationId, serviceId) {
        const [result] = await db.execute(
            `INSERT INTO destination_services (destination_id, service_id)
             VALUES (?, ?)`,
            [destinationId, serviceId]
        );
        return { id: result.insertId, destination_id: destinationId, service_id: serviceId };
    }

    /**
     * Elimina una relación destino-servicio
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM destination_services WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
