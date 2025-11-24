/**
 * @file controllers/eventsFollowedController.js
 * @description Controlador para la gestión de eventos seguidos por los usuarios.
 * Recibe solicitudes HTTP, aplica validaciones y delega la lógica al EventsFollowedService.
 */

import { validationResult } from "express-validator";
import { EventsFollowedService } from "../services/EventsFollowedService.js";

/**
 * @swagger
 * tags:
 *   name: EventsFollowed
 *   description: Gestión de eventos seguidos por los usuarios
 */

export class EventsFollowedController {

    /**
     * @swagger
     * /api/events-followed/user/{id}:
     *   get:
     *     summary: Obtener la lista de eventos que un usuario está siguiendo
     *     tags: [EventsFollowed]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID del usuario
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista obtenida correctamente
     */
    static async getByUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const data = await EventsFollowedService.getByUser(userId);

            return res.json({
                ok: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/events-followed:
     *   post:
     *     summary: Seguir un evento turístico
     *     tags: [EventsFollowed]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EventFollowInput'
     *     responses:
     *       201:
     *         description: Registro creado correctamente
     *       400:
     *         description: Error de validación o usuario ya sigue el evento
     */
    static async create(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    ok: false,
                    errors: errors.array()
                });
            }

            const { user_id, event_id } = req.body;

            const id = await EventsFollowedService.create(user_id, event_id);

            return res.status(201).json({
                ok: true,
                message: "Ahora el usuario sigue este evento",
                id
            });

        } catch (error) {
            return res.status(400).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/events-followed/{id}:
     *   delete:
     *     summary: Dejar de seguir un evento
     *     tags: [EventsFollowed]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del registro en `events_followed`
     *     responses:
     *       200:
     *         description: Registro eliminado correctamente
     *       404:
     *         description: Registro no encontrado
     */
    static async delete(req, res) {
        try {
            const followId = parseInt(req.params.id);

            await EventsFollowedService.delete(followId);

            return res.json({
                ok: true,
                message: "El usuario dejó de seguir este evento"
            });

        } catch (error) {
            return res.status(404).json({
                ok: false,
                error: error.message
            });
        }
    }
}
