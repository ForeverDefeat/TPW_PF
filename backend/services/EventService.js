import { db } from "../config/db.js";
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

        const [rows] = await db.query(
            "SELECT * FROM events WHERE id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) return null;

        const existing = rows[0];

        const finalImage =
            data.image_url !== undefined ? data.image_url : existing.image_url;

        const finalDate =
            data.event_date !== undefined ? data.event_date : existing.event_date;

        await db.query(
            `UPDATE events SET 
        title = ?, 
        description = ?, 
        event_date = ?, 
        destination_id = ?, 
        location = ?, 
        image_url = ?
      WHERE id = ?`,
            [
                data.title,
                data.description,
                finalDate,
                data.destination_id,
                data.location,
                finalImage,
                id
            ]
        );

        return { id, ...data, image_url: finalImage };
    }


    static async delete(id) {
        return await EventRepository.delete(id);
    }

    static async getByDestination(destination_id) {
        return await EventRepository.getByDestination(destination_id);
    }

    static async getFollowedByUser(userId) {
        return await EventRepository.getFollowedByUser(userId);
    }

}
