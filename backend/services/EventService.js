/**
 * @file services/EventService.js
 * @description Capa de lógica de negocio para los eventos turísticos.
 * Esta capa valida, transforma o procesa datos antes de enviarlos
 * o recibirlos del EventRepository.
 */

import { EventRepository } from "../repositories/EventRepository.js";

export class EventService {

    /**
     * Obtener lista de eventos con filtros opcionales.
     *
     * @async
     * @param {Object} filters - Filtros recibidos desde el Controller.
     * @returns {Promise<Array>} Lista de eventos.
     */
    static async getAll(filters) {
        return await EventRepository.getAll(filters);
    }

    /**
     * Obtener un evento por su ID.
     *
     * @async
     * @param {number} id - ID del evento.
     * @returns {Promise<Object|null>} Evento encontrado o null si no existe.
     */
    static async getById(id) {
        return await EventRepository.getById(id);
    }

    /**
     * Crear un nuevo evento.
     *
     * @async
     * @param {Object} data - Datos del evento.
     * @returns {Promise<number>} ID del evento creado.
     */
    static async create(data) {
        return await EventRepository.create(data);
    }

    /**
     * Actualizar un evento existente.
     *
     * @async
     * @param {number} id - ID del evento a actualizar.
     * @param {Object} data - Datos actualizados.
     * @returns {Promise<boolean>} true si se actualizó, false si no existe.
     */
    static async update(id, data) {
        return await EventRepository.update(id, data);
    }

    /**
     * Eliminar un evento por su ID.
     *
     * @async
     * @param {number} id - ID del evento.
     * @returns {Promise<boolean>} true si se eliminó, false si no existe.
     */
    static async delete(id) {
        return await EventRepository.delete(id);
    }
}
