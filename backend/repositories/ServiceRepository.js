/**
 * @file repositories/ServiceRepository.js
 * @description Capa de acceso a datos para la entidad Service.
 */

import { db } from "../config/db.js";

export class ServiceRepository {

    /** LISTAR SERVICIOS */
    static async findAll(filters = {}) {
        const { serviceTypeId, typeName, location, q, destinationId } = filters;

        let sql = `
            SELECT 
                s.id,
                s.service_type_id,
                s.name,
                s.location,
                s.description,
                s.price_min,
                s.price_max,
                s.image_url,
                st.name AS serviceTypeName
            FROM services s
            LEFT JOIN service_types st ON s.service_type_id = st.id
        `;

        const where = [];
        const params = [];

        if (destinationId) {
            sql += `
            INNER JOIN destination_services ds
                ON ds.service_id = s.id
            `;
            where.push("ds.destination_id = ?");
            params.push(destinationId);
        }

        if (serviceTypeId) {
            where.push("s.service_type_id = ?");
            params.push(serviceTypeId);
        }

        if (typeName) {
            where.push("st.name LIKE ?");
            params.push(`%${typeName}%`);
        }

        if (location) {
            where.push("s.location LIKE ?");
            params.push(`%${location}%`);
        }

        if (q) {
            where.push("(s.name LIKE ? OR s.description LIKE ?)");
            params.push(`%${q}%`, `%${q}%`);
        }

        if (where.length > 0) {
            sql += " WHERE " + where.join(" AND ");
        }

        sql += " ORDER BY s.id DESC";

        const [rows] = await db.query(sql, params);
        return rows;
    }

    /** OBTENER POR ID */
    static async findById(id) {
        const sql = `
            SELECT 
                s.id,
                s.service_type_id,
                s.name,
                s.location,
                s.description,
                s.price_min,
                s.price_max,
                s.image_url,
                st.name AS serviceTypeName
            FROM services s
            LEFT JOIN service_types st ON s.service_type_id = st.id
            WHERE s.id = ?
        `;
        const [rows] = await db.query(sql, [id]);
        return rows[0] || null;
    }

    /** CREAR SERVICIO */
    static async create(data) {
        const {
            service_type_id,
            name,
            location = null,
            description = null,
            price_min = null,
            price_max = null,
            image_url = null
        } = data;

        const [result] = await db.query(`
            INSERT INTO services
                (service_type_id, name, location, description, price_min, price_max, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            service_type_id,
            name,
            location,
            description,
            price_min,
            price_max,
            image_url
        ]);

        return result.insertId;
    }

    /** ACTUALIZAR (solo campos enviados) */
    /*** Actualizar servicio. */
    static async update(id, data) {
        const {
            service_type_id,
            name,
            location,
            description,
            price_min,
            price_max,
            image_url
        } = data;

        // Base UPDATE dinámico
        let sql = `UPDATE services SET 
        service_type_id = ?,
        name = ?,
        location = ?,
        description = ?,
        price_min = ?,
        price_max = ?`;

        const params = [
            service_type_id,
            name,
            location ?? null,
            description ?? null,
            price_min ?? null,
            price_max ?? null
        ];

        // Solo agregar image_url si existe archivo nuevo
        if (image_url) {
            sql += `, image_url = ?`;
            params.push(image_url);
        }

        // Agregar WHERE final
        sql += ` WHERE id = ?`;
        params.push(id);

        const [result] = await db.query(sql, params);

        return result.affectedRows > 0;
    }



    /** ELIMINAR */
    static async delete(id) {
        const [result] = await db.query(
            "DELETE FROM services WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }

    static async findByDestination(destination_id) {
        const [rows] = await db.query(
            `SELECT s.*
         FROM services s
         INNER JOIN destination_services ds ON ds.service_id = s.id
         WHERE ds.destination_id = ?`,
            [destination_id]
        );

        return rows;
    }

    static async getByDestination(destinationId) {
        const [rows] = await db.query(
            `
        SELECT 
            s.id,
            s.name,
            s.description,
            s.location,
            s.image_url
        FROM destination_services ds
        INNER JOIN services s ON s.id = ds.service_id
        WHERE ds.destination_id = ?
        `,
            [destinationId]
        );

        return rows;
    }



}
