import { db } from "../config/db.js";

export class GalleryRepository {

    static async getByDestination(destinationId) {
        const [rows] = await db.query(
            "SELECT * FROM destination_gallery WHERE destination_id = ? ORDER BY id DESC",
            [destinationId]
        );
        return rows;
    }

    static async addImage(destinationId, imageUrl) {
        const [result] = await db.query(
            "INSERT INTO destination_gallery (destination_id, image_url) VALUES (?, ?)",
            [destinationId, imageUrl]
        );
        return { id: result.insertId, destinationId, imageUrl };
    }

    static async deleteImage(id) {
        await db.query(
            "DELETE FROM destination_gallery WHERE id = ?",
            [id]
        );
        return true;
    }
}
