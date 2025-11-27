import { validationResult } from "express-validator";   //  <-- FALTA ESTA LÍNEA
import { EventService } from "../services/EventService.js"

export class EventController {

    static async getAll(req, res) {
        try {
            const filters = req.query;
            const data = await EventService.getAll(filters);
            return res.json({ ok: true, data });
        } catch (e) {
            return res.status(500).json({ ok: false, error: e.message });
        }
    }

    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const event = await EventService.getById(id);

            if (!event)
                return res.status(404).json({ ok: false, message: "Evento no encontrado" });

            return res.json({ ok: true, data: event });
        } catch (e) {
            return res.status(500).json({ ok: false, error: e.message });
        }
    }

    static async create(req, res) {
        try {
            const body = {
                ...req.body,
                image_url: req.file ? req.file.filename : null
            };

            const id = await EventService.create(body);

            return res.status(201).json({
                ok: true,
                message: "Evento creado correctamente",
                id
            });
        } catch (e) {
            return res.status(400).json({ ok: false, error: e.message });
        }
    }

    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);

            // 📌 obtener filename si se sube imagen
            const imageFile = req.files?.image?.[0] ?? null;

            const body = {
                title: req.body.title ?? null,
                description: req.body.description ?? null,
                date: req.body.date ?? null,
                destination_id: req.body.destination_id ?? null,
                location: req.body.location ?? null,
                image_url: imageFile ? imageFile.filename : null   // <--- JAMÁS undefined
            };

            const updated = await EventService.update(id, body);

            if (!updated) {
                return res.status(404).json({
                    ok: false,
                    message: "Evento no encontrado"
                });
            }

            return res.json({
                ok: true,
                message: "Evento actualizado correctamente"
            });

        } catch (error) {
            console.error("Error en update:", error);
            return res.status(400).json({ ok: false, error: error.message });
        }
    }




    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await EventService.delete(id);

            if (!deleted)
                return res.status(404).json({ ok: false, message: "Evento no encontrado" });

            return res.json({ ok: true, message: "Evento eliminado correctamente" });
        } catch (e) {
            return res.status(500).json({ ok: false, error: e.message });
        }
    }
}
