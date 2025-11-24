/**
 * @file services/EventsFollowedService.js
 * @description Capa de lógica de negocio para la gestión de eventos seguidos por los usuarios.
 * Se encarga de aplicar reglas como evitar duplicados y validar que los registros existan
 * antes de llamar al EventsFollowedRepository.
 */

import { EventsFollowedRepository } from "../repositories/EventsFollowedRepository.js";

export class EventsFollowedService {

    /**
     * Obtener todos los eventos que un usuario está siguiendo.
     *
     * @async
     * @param {number} userId - ID del usuario.
     * @returns {Promise<Array>} Lista de eventos seguidos.
     */
    static async getByUser(userId) {
        return await EventsFollowedRepository.getByUser(userId);
    }

    /**
     * Registrar que un usuario está siguiendo un evento.
     * Aplica la regla: "un usuario no puede seguir un evento más de una vez".
     *
     * @async
     * @param {number} userId - ID del usuario.
     * @param {number} eventId - ID del evento.
     * @returns {Promise<number>} ID del registro creado.
     * @throws {Error} Si ya existe el registro.
     */
    static async create(userId, eventId) {

        // Verificar duplicado
        const exists = await EventsFollowedRepository.exists(userId, eventId);
        if (exists) {
            throw new Error("El usuario ya está siguiendo este evento.");
        }

        return await EventsFollowedRepository.create(userId, eventId);
    }

    /**
     * Eliminar la relación de seguimiento a un evento.
     *
     * @async
     * @param {number} followId - ID del registro en events_followed.
     * @returns {Promise<boolean>} true si se eliminó correctamente.
     * @throws {Error} Si no existe el registro.
     */
    static async delete(followId) {
        const deleted = await EventsFollowedRepository.delete(followId);

        if (!deleted) {
            throw new Error("No se encontró el registro de evento seguido a eliminar.");
        }

        return true;
    }
}
