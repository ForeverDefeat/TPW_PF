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
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ ok: false, message: "ID inválido" });

            const imageFile = req.files?.image?.[0] ?? null;

            const body = {
                title: req.body.title ?? null,
                description: req.body.description ?? null,
                event_date: req.body.event_date ?? null,
                destination_id: req.body.destination_id ?? null,
                location: req.body.location ?? null,
                image_url: imageFile ? imageFile.filename : undefined  // 🔥 FIX
            };

            const updated = await EventService.update(id, body);

            return res.json({
                ok: true,
                message: "Evento actualizado correctamente",
                data: updated
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

    static async getByDestinationId(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ ok: false, message: "ID inválido" });

            const events = await EventService.getByDestinationId(id);

            res.json({ ok: true, events });

        } catch (err) {
            res.status(500).json({ ok: false, message: err.message });
        }
    }

    static async getFollowedByUser(req, res) {
        try {
            const userId = Number(req.params.userId);

            if (isNaN(userId)) {
                return res.status(400).json({ ok: false, message: "ID inválido" });
            }

            const events = await EventService.getFollowedByUser(userId);

            return res.json({
                ok: true,
                data: events
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ ok: false, message: "Error obteniendo eventos seguidos" });
        }
    }


}
