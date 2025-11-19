// models/User.js
import { db } from "../config/db.js";

export default class User {

    static async findByEmailAndPassword(email, password) {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1",
            [email, password]
        );
        return rows[0];
    }

    static async create(fullName, email, password) {
        await db.query(
            "INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)",
            [fullName, email, password, "user"]
        );
    }
}
