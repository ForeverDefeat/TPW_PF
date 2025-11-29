/**
 * @file repositories/DestinationRepository.js
 */

import { db } from "../config/db.js";

export class DestinationRepository {

    static async getAll() {
        const [rows] = await db.query("SELECT * FROM destinations ORDER BY id DESC");
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query("SELECT * FROM destinations WHERE id = ?", [id]);
        return rows[0];
    }

    static async getBySlug(slug) {
        const [rows] = await db.query(
            "SELECT * FROM destinations WHERE slug = ? LIMIT 1",
            [slug]
        );
        return rows[0];
    }

    static async getByCategory(category_id) {
        const [rows] = await db.query(
            "SELECT * FROM destinations WHERE category_id = ? ORDER BY id DESC",
            [category_id]
        );
        return rows;
    }

    static async search(q) {
        const like = `%${q}%`;

        const [rows] = await db.query(
            `SELECT d.*, c.name AS category
             FROM destinations d
             LEFT JOIN categories c ON c.id = d.category_id
             WHERE d.name LIKE ? OR d.description LIKE ?`,
            [like, like]
        );

        return rows;
    }

    static async create(data) {
        const [res] = await db.query("INSERT INTO destinations SET ?", data);
        return { id: res.insertId, ...data };
    }

    static async update(id, data) {
        await db.query("UPDATE destinations SET ? WHERE id = ?", [data, id]);
        return { id, ...data };
    }

    static async delete(id) {
        await db.query("DELETE FROM destinations WHERE id = ?", [id]);
    }
}
