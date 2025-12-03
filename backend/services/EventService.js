import { EventRepository } from "../repositories/EventRepository.js";

export class EventService {

    static async getAll(filters) {
        return await EventRepository.getAll(filters);
    }

    static async getById(id) {
        return await EventRepository.getById(id);
    }

    static async create(data) {
        const eventData = {
            destination_id: Number(data.destination_id),
            title: data.title,
            description: data.description ?? null,
            event_date: data.event_date,
            location: data.location ?? null,
            image_url: data.image_url ?? null
        };

        return await EventRepository.create(eventData);
    }

    static async update(id, data) {

        const clean = {
            title: data.title ?? null,
            description: data.description ?? null,
            event_date: data.date ?? null,
            location: data.location ?? null,
            destination_id: data.destination_id ? Number(data.destination_id) : null,
            image_url: data.image_url ?? null,
        };

        return await EventRepository.update(id, clean);
    }


    static async delete(id) {
        return await EventRepository.delete(id);
    }

    static async getByDestination(destination_id) {
        return await EventRepository.getByDestination(destination_id);
    }

}
