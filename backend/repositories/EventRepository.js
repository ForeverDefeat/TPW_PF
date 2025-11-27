import db from "../config/db.js";

export class EventRepository {

    static async getAll(filters = {}) {
        let sql = `SELECT * FROM events WHERE 1 = 1`;
        const params = [];

        if (filters.destination_id) {
            sql += ` AND destination_id = ?`;
            params.push(filters.destination_id);
        }

        if (filters.q) {
            sql += ` AND (title LIKE ? OR description LIKE ?)`;
            params.push(`%${filters.q}%`, `%${filters.q}%`);
        }

        const [rows] = await db.execute(sql, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT * FROM events WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    }

    static async create(data) {
        const { destination_id, title, description, event_date, location, image_url } = data;

        const [result] = await db.execute(
            `INSERT INTO events (destination_id, title, description, event_date, location, image_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [destination_id, title, description, event_date, location, image_url]
        );

        return result.insertId;
    }

    /* static async update(id, data) {
        const {
            title,
            description,
            event_date,
            location,
            destination_id,
            image_url
        } = data;

        const sql = `
        UPDATE events SET
            title = ?,
            description = ?,
            event_date = ?,
            location = ?,
            destination_id = ?,
            image_url = ?
        WHERE id = ?
    `;

        const params = [
            title,
            description,
            event_date,
            location,
            destination_id,
            image_url ?? null,
            id
        ];

        const [result] = await db.execute(sql, params);
        return result.affectedRows > 0;
    } */
    static async update(id, data) {
        const { title, description, event_date, location, destination_id, image_url } = data;

        const [result] = await db.execute(`
        UPDATE events SET
            title = ?,
            description = ?,
            event_date = ?,
            location = ?,
            destination_id = ?,
            image_url = ?
        WHERE id = ?
    `, [title, description, event_date, location, destination_id, image_url, id]);

        return result.affectedRows > 0;
    }


    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM events WHERE id = ?`,
            [id]
        );

        return result.affectedRows > 0;
    }
}
