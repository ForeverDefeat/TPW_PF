/**
 * @file controllers/DestinationController.js
 */

import { DestinationRepository } from "../repositories/DestinationRepository.js";
import { DestinationService } from "../services/DestinationService.js";


export class DestinationController {

    static async getAll(req, res) {
        try {
            const rows = await DestinationRepository.getAll();
            res.json(rows);
        } catch (err) {
            console.error("Error getAll:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

    static async getById(req, res) {
        try {
            const id = req.params.id;
            const row = await DestinationRepository.getById(id);

            if (!row) return res.status(404).json({ ok: false, message: "No encontrado" });

            res.json(row);

        } catch (err) {
            console.error("Error getById:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

    static async getBySlug(req, res) {
        try {
            const slug = req.params.slug;
            const item = await DestinationService.findBySlug(slug);

            if (!item) {
                return res.status(404).json({ ok: false, message: "No encontrado" });
            }

            res.json({ ok: true, data: item });
        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, message: "Error obteniendo destino por slug" });
        }
    }


    static async getByCategory(req, res) {
        try {
            const list = await DestinationService.findByCategory(req.params.id);
            res.json({ ok: true, data: list });
        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, message: "Error obteniendo destinos por categoría" });
        }
    }


    static async search(req, res) {
        try {
            const results = await DestinationService.search(req.query.q || "");
            res.json({ ok: true, results });
        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, message: "Error en búsqueda" });
        }
    }


    /* CRUD ADMIN (create, update, delete) */
    static async create(req, res) {
        try {
            const data = req.body;

            const main = req.files?.main_image?.[0];
            const hero = req.files?.hero_image?.[0];

            const created = await DestinationRepository.create({
                ...data,
                main_image_url: main ? main.filename : null,
                hero_image_url: hero ? hero.filename : null
            });

            res.json({ ok: true, destination: created });

        } catch (err) {
            console.error("Error create:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const main = req.files?.main_image?.[0];
            const hero = req.files?.hero_image?.[0];

            const updated = await DestinationRepository.update(id, {
                ...data,
                main_image_url: main ? main.filename : data.main_image_url,
                hero_image_url: hero ? hero.filename : data.hero_image_url
            });

            res.json({ ok: true, destination: updated });

        } catch (err) {
            console.error("Error update:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await DestinationRepository.delete(id);
            res.json({ ok: true });
        } catch (err) {
            console.error("Error delete:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }
}
