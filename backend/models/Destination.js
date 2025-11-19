// models/Destination.js
import { db } from "../config/db.js";

export default class Destination {

    /**
     * Obtener todos los destinos
     */
    static async getAll() {
        const [rows] = await db.query(`
            SELECT 
                id, 
                name, 
                category, 
                description, 
                imageUrl AS image
            FROM destinations
        `);
        return rows;
    }

    /**
     * Crear un nuevo destino
     */
    static async create(name, category, description, imageUrl) {
        await db.query(
            `INSERT INTO destinations (name, category, description, imageUrl)
             VALUES (?, ?, ?, ?)`,
            [name, category, description, imageUrl]
        );
    }

    /**
     * Buscar destino por ID (útil para detalles o edición en el futuro)
     */
    static async findById(id) {
        const [rows] = await db.query(
            `SELECT 
                id, 
                name, 
                category, 
                description, 
                imageUrl AS image
             FROM destinations
             WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    /**
     * Buscar destinos por texto (opcional si quieres mover la lógica aquí)
     */
    static async search(queryText) {
        const q = `%${queryText.toLowerCase()}%`;

        const [rows] = await db.query(
            `SELECT 
                id, 
                name, 
                category, 
                description, 
                imageUrl AS image
             FROM destinations
             WHERE 
                LOWER(name) LIKE ?
                OR LOWER(description) LIKE ?
                OR LOWER(category) LIKE ?`,
            [q, q, q]
        );

        return rows;
    }
}
