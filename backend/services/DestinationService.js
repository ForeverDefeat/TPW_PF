/**
 * @file services/DestinationService.js
 * @description Lógica de negocio para destinos turísticos.
 */

import { DestinationRepository } from "../repositories/DestinationRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { db } from "../config/db.js";
export class DestinationService {

    /* ============================================================
       VALIDACIONES — Usado en create y update (parcial)
    ============================================================ */
    static validateDestinationInput(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 3) {
            errors.push("El nombre debe tener al menos 3 caracteres.");
        }

        if (!data.category_id || isNaN(data.category_id)) {
            errors.push("Categoría inválida.");
        }

        if (!data.description || data.description.trim().length < 20) {
            errors.push("La descripción debe tener al menos 20 caracteres.");
        }

        if (errors.length > 0) {
            const err = new Error("Datos inválidos");
            err.status = 400;
            err.details = errors;
            throw err;
        }
    }

    /* ============================================================
       GET ALL
    ============================================================ */
    static async getAllDestinations() {
        return await DestinationRepository.findAll();
    }

    /* ============================================================
       GET BY ID
    ============================================================ */
    static async getDestinationById(id) {
        return await DestinationRepository.findById(id);
    }

    /* ============================================================
       CREATE
    ============================================================ */
    static async createDestination(data) {
        this.validateDestinationInput(data);

        const category = await CategoryRepository.findById(data.category_id);
        if (!category) {
            throw Object.assign(new Error("La categoría no existe"), { status: 404 });
        }

        const slug = data.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        const destinationData = {
            categoryId: Number(data.category_id),
            locationId: data.location_id || null,
            name: data.name,
            slug,
            summary: data.summary || null,
            description: data.description,
            mainImageUrl: data.main_image || null,
            heroImageUrl: data.hero_image || null,
            isFeatured: Number(data.is_featured) === 1
        };

        return await DestinationRepository.create(destinationData);
    }

    /* ============================================================
       UPDATE — 🔥 CORREGIDO POR COMPLETO
    ============================================================ */
    static async updateDestination(id, data) {

        // Mapeo seguro de campos
        const mappedData = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.summary !== undefined && { summary: data.summary }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.category_id !== undefined && { categoryId: Number(data.category_id) }),
            ...(data.is_featured !== undefined && { isFeatured: Number(data.is_featured) === 1 }),

            // Imágenes: SOLO filename real, nunca el objeto entero de Multer
            ...(data.main_image !== undefined && {
                mainImageUrl: data.main_image || null
            }),
            ...(data.hero_image !== undefined && {
                heroImageUrl: data.hero_image || null
            })
        };

        // Validar input si se envió algo clave
        if (mappedData.name || mappedData.description || mappedData.categoryId) {
            this.validateDestinationInput({
                name: mappedData.name ?? "temp",
                description: mappedData.description ?? "descripcion minima 123456789012345678",
                category_id: mappedData.categoryId ?? 1
            });
        }

        // Validar categoría si cambió
        if (mappedData.categoryId) {
            const category = await CategoryRepository.findById(mappedData.categoryId);
            if (!category) {
                throw Object.assign(new Error("La categoría asignada no existe"), { status: 404 });
            }
        }

        // Nuevo slug si cambia el nombre
        if (mappedData.name) {
            mappedData.slug = mappedData.name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "");
        }

        return await DestinationRepository.update(id, mappedData);
    }

    /* ============================================================
       DELETE
    ============================================================ */
    static async deleteDestination(id) {
        const dest = await DestinationRepository.findById(id);

        if (!dest) {
            throw Object.assign(new Error("El destino no existe"), { status: 404 });
        }

        if (dest.isFeatured === 1) {
            throw Object.assign(new Error("No puedes eliminar un destino destacado"), {
                status: 409
            });
        }

        return await DestinationRepository.delete(id);
    }

    // Buscar por slug
    static async findBySlug(slug) {
        const [rows] = await db.query(
            `SELECT * FROM destinations WHERE slug = ? LIMIT 1`,
            [slug]
        );
        return rows[0] || null;
    }

    // Obtener destinos por categoría
    static async findByCategory(categoryId) {
        const [rows] = await db.query(
            `SELECT * FROM destinations WHERE category_id = ?`,
            [categoryId]
        );
        return rows;
    }

    // Buscador
    static async search(text) {
        const like = `%${text}%`;

        const [rows] = await db.query(
            `
        SELECT 
            d.*, 
            c.name AS category
        FROM destinations d
        LEFT JOIN categories c 
            ON c.id = d.category_id
        WHERE d.name LIKE ? 
           OR d.description LIKE ?
        `,
            [like, like]
        );

        return rows;
    }

}
