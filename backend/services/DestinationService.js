/**
 * @file services/DestinationService.js
 * @description Lógica de negocio para destinos turísticos.
 */

import { DestinationRepository } from "../repositories/DestinationRepository.js";
import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { EventRepository } from "../repositories/EventRepository.js";
import { ServiceRepository } from "../repositories/ServiceRepository.js";
import { GalleryRepository } from "../repositories/GalleryRepository.js";

import { db } from "../config/db.js";
export class DestinationService {

    // VALIDACIONES — Usado en create y update (parcial)
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

    // GET ALL
    static async getAllDestinations() {
        return await DestinationRepository.findAll();
    }

    // GET BY ID
    static async getDestinationById(id) {
        return await DestinationRepository.findById(id);
    }

    // CREATE
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

    // UPDATE 
    static async update(id, data) {
        const {
            name,
            summary,
            description,
            category_id,
            main_image_url,
            hero_image_url
        } = data;

        // Obtenemos primero el destino existente
        const [rows] = await db.query(
            "SELECT * FROM destinations WHERE id = ? LIMIT 1",
            [id]
        );

        if (rows.length === 0) throw new Error("Destino no encontrado");

        const existing = rows[0];

        // Si no mandas imagen → conservar la existente
        const finalMainImage = main_image_url ?? existing.main_image_url;
        const finalHeroImage = hero_image_url ?? existing.hero_image_url;

        // Actualizar en BD
        await db.query(
            `UPDATE destinations 
             SET name = ?, summary = ?, description = ?, category_id = ?, 
                 main_image_url = ?, hero_image_url = ?
             WHERE id = ?`,
            [
                name,
                summary,
                description,
                category_id,
                finalMainImage,
                finalHeroImage,
                id
            ]
        );

        return {
            id,
            name,
            summary,
            description,
            category_id,
            main_image_url: finalMainImage,
            hero_image_url: finalHeroImage
        };
    }

    // DELETE
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
    /* static async findBySlug(slug) {
        const [rows] = await db.query(
            `SELECT * FROM destinations WHERE slug = ? LIMIT 1`,
            [slug]
        );
        return rows[0] || null;
    } */
    static async findBySlug(slug) {
        const [rows] = await db.query(
            `SELECT * FROM destinations WHERE slug = ? LIMIT 1`,
            [slug]
        );

        const destination = rows[0];
        if (!destination) return null;

        const gallery = await GalleryService.getGallery(destination.id);
        const servicesNearby = await ServiceRepository.getByDestination(destination.id);
        const events = await EventRepository.getByDestination(destination.id);

        return {
            ...destination,
            gallery,
            servicesNearby,
            events
        };
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
