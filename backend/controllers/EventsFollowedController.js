// controllers/EventsFollowedController.js
import { validationResult } from "express-validator";
import { EventsFollowedService } from "../services/EventsFollowedService.js";

export class EventsFollowedController {

    static async getAll(req, res) {
        try {
            const data = await EventsFollowedService.getAll();
            return res.json({ ok: true, data });
        } catch (error) {
            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = await EventsFollowedService.getById(id);
            return res.json({ ok: true, data });
        } catch (error) {
            return res.status(404).json({ ok: false, error: error.message });
        }
    }

    static async getByUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const data = await EventsFollowedService.getByUser(userId);
            return res.json({ ok: true, data });
        } catch (error) {
            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    static async getByEvent(req, res) {
        try {
            const eventId = parseInt(req.params.id);
            const data = await EventsFollowedService.getByEvent(eventId);
            return res.json({ ok: true, data });
        } catch (error) {
            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ ok: false, errors: errors.array() });
            }

            const { user_id, event_id } = req.body;
            const id = await EventsFollowedService.create(user_id, event_id);

            return res.status(201).json({
                ok: true,
                message: "Ahora el usuario sigue este evento",
                id
            });

        } catch (error) {
            return res.status(400).json({ ok: false, error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const followId = parseInt(req.params.id);
            await EventsFollowedService.delete(followId);
            return res.json({ ok: true, message: "El usuario dejó de seguir este evento" });
        } catch (error) {
            return res.status(404).json({ ok: false, error: error.message });
        }
    }
}
