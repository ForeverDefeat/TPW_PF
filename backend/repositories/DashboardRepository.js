/**
 * @file repositories/DashboardRepository.js
 * @description Consultas SQL para dashboard.
 */

import { db } from "../config/db.js";

export class DashboardRepository {

    static async countCategories() {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM categories");
        return rows[0].total;
    }

    static async countDestinations() {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM destinations");
        return rows[0].total;
    }

    static async countServices() {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM services");
        return rows[0].total;
    }

    static async countEvents() {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM events");
        return rows[0].total;
    }

    static async countUsers() {
        const [rows] = await db.query("SELECT COUNT(*) AS total FROM users");
        return rows[0].total;
    }

    static async groupDestinationsByCategory() {
        const [rows] = await db.query(`
            SELECT c.name, COUNT(d.id) AS total
            FROM categories c
            LEFT JOIN destinations d ON d.category_id = c.id
            GROUP BY c.id;
        `);
        return rows;
    }

    static async getRecentEvents() {
        const [rows] = await db.query(`
            SELECT DATE(created_at) AS date, COUNT(*) AS count
            FROM events
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 7;
        `);
        return rows.reverse();
    }
}
