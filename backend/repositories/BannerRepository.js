import { db } from "../config/db.js";

export class BannerRepository {

    static async getAll() {
        const [rows] = await db.query(`
            SELECT * FROM banners 
            WHERE active = 1 
            ORDER BY sort_order ASC, id DESC
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(`SELECT * FROM banners WHERE id = ?`, [id]);
        return rows[0];
    }

    static async create({ image_url, title, sort_order }) {
        const [result] = await db.query(
            `INSERT INTO banners (image_url, title, sort_order) VALUES (?, ?, ?)`,
            [image_url, title, sort_order]
        );
        return result.insertId;
    }

    static async update(id, { image_url, title, sort_order }) {
        await db.query(
            `UPDATE banners SET image_url=?, title=?, sort_order=? WHERE id=?`,
            [image_url, title, sort_order, id]
        );
    }

    static async softDelete(id) {
        await db.query(`UPDATE banners SET active = 0 WHERE id=?`, [id]);
    }
}
