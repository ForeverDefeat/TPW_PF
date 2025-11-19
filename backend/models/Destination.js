// models/Destination.js
import { db } from "../config/db.js";

export default class Destination {

    static async getAll() {
        const [rows] = await db.query("SELECT * FROM destinations");
        return rows;
    }

    static async create(title, category, description, image) {
        await db.query(
            "INSERT INTO destinations (title, category, description, image) VALUES (?, ?, ?, ?)",
            [title, category, description, image]
        );
    }
}
