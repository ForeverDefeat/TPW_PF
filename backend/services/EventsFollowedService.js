// services/EventsFollowedService.js
import { EventsFollowedRepository } from "../repositories/EventsFollowedRepository.js";

export class EventsFollowedService {

    static async getAll() {
        return await EventsFollowedRepository.getAll();
    }

    static async getById(id) {
        const row = await EventsFollowedRepository.getById(id);
        if (!row) throw new Error("Registro no encontrado");
        return row;
    }

    static async getByUser(userId) {
        return await EventsFollowedRepository.getByUser(userId);
    }

    static async getByEvent(eventId) {
        return await EventsFollowedRepository.getByEvent(eventId);
    }

    static async create(userId, eventId) {
        const exists = await EventsFollowedRepository.exists(userId, eventId);
        if (exists) throw new Error("El usuario ya está siguiendo este evento.");
        return await EventsFollowedRepository.create(userId, eventId);
    }

    static async delete(followId) {
        const deleted = await EventsFollowedRepository.delete(followId);
        if (!deleted)
            throw new Error("No se encontró el registro de evento seguido a eliminar.");
        return true;
    }
}
