// repositories/EventsFollowedRepository.js
import db from "../config/db.js";

export class EventsFollowedRepository {

    // Obtener todos los registros
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT ef.id, ef.user_id, ef.event_id,
                   u.full_name, u.email,
                   e.title, e.event_date
            FROM events_followed ef
            INNER JOIN users u ON u.id = ef.user_id
            INNER JOIN events e ON e.id = ef.event_id
            ORDER BY ef.id DESC
        `);
        return rows;
    }

    // Obtener 1 por ID
    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM events_followed WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    // Obtener por usuario
    static async getByUser(userId) {
        const [rows] = await db.execute(`
        SELECT 
            ef.id AS follow_id,
            e.id AS event_id,
            e.title,
            e.description,
            e.event_date,
            e.image_url,
            d.slug AS destination_slug
        FROM events_followed ef
        JOIN events e ON e.id = ef.event_id
        JOIN destinations d ON d.id = e.destination_id
        WHERE ef.user_id = ?
        ORDER BY ef.id DESC
    `, [userId]);

        return rows;
    }


    // Obtener por evento
    static async getByEvent(eventId) {
        const [rows] = await db.execute(`
            SELECT ef.id, ef.user_id, ef.event_id,
                   u.full_name, u.email,
                   e.title, e.event_date
            FROM events_followed ef
            INNER JOIN users u ON u.id = ef.user_id
            INNER JOIN events e ON e.id = ef.event_id
            WHERE ef.event_id = ?
            ORDER BY ef.id DESC
        `, [eventId]);
        return rows;
    }

    // Verificar duplicado
    static async exists(userId, eventId) {
        const [rows] = await db.execute(
            `SELECT id FROM events_followed WHERE user_id = ? AND event_id = ?`,
            [userId, eventId]
        );
        return rows.length > 0;
    }

    // Crear registro
    static async create(userId, eventId) {
        // Verificar evento válido
        const [[event]] = await db.execute(
            `SELECT id, destination_id FROM events WHERE id = ?`,
            [eventId]
        );
        if (!event) {
            throw new Error("El evento no existe.");
        }

        // Verificar destino válido
        const [[dest]] = await db.execute(
            `SELECT id FROM destinations WHERE id = ?`,
            [event.destination_id]
        );
        if (!dest) {
            throw new Error("El destino asociado al evento no existe.");
        }

        // Verificar duplicado
        const [[exists]] = await db.execute(
            `SELECT id FROM events_followed WHERE user_id = ? AND event_id = ?`,
            [userId, eventId]
        );
        if (exists) throw new Error("Ya sigues este evento.");

        const [res] = await db.execute(
            `INSERT INTO events_followed (user_id, event_id) VALUES (?, ?)`,
            [userId, eventId]
        );

        return res.insertId;
    }


    // Eliminar registro
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM events_followed WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}
