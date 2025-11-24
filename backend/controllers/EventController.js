/**
 * @file controllers/eventController.js
 * @description Controlador para la gestión de eventos turísticos.
 * Se encarga de recibir solicitudes HTTP, aplicar validaciones y 
 * delegar la lógica al EventService.
 */

import { validationResult } from "express-validator";
import { EventService } from "../services/EventService.js";

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gestión de eventos turísticos vinculados a destinos
 */

export class EventController {

    /**
     * @swagger
     * /api/events:
     *   get:
     *     summary: Obtener lista de eventos
     *     tags: [Events]
     *     parameters:
     *       - in: query
     *         name: destination_id
     *         schema:
     *           type: integer
     *         description: Filtrar eventos por destino
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Buscar por título o descripción
     *     responses:
     *       200:
     *         description: Lista de eventos obtenida correctamente
     */
    static async getAll(req, res) {
        try {
            const filters = req.query;
            const data = await EventService.getAll(filters);

            return res.json({
                ok: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/events/{id}:
     *   get:
     *     summary: Obtener un evento específico
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del evento
     *     responses:
     *       200:
     *         description: Evento encontrado
     *       404:
     *         description: Evento no encontrado
     */
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const event = await EventService.getById(id);

            if (!event) {
                return res.status(404).json({
                    ok: false,
                    message: "Evento no encontrado"
                });
            }

            return res.json({
                ok: true,
                data: event
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/events:
     *   post:
     *     summary: Crear un evento turístico
     *     tags: [Events]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EventInput'
     *     responses:
     *       201:
     *         description: Evento creado correctamente
     *       400:
     *         description: Error de validación o datos incompletos
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

            const id = await EventService.create(req.body);

            return res.status(201).json({
                ok: true,
                message: "Evento creado correctamente",
                id
            });

        } catch (error) {
            res.status(400).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/events/{id}:
     *   put:
     *     summary: Actualizar un evento turístico
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del evento
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/EventUpdate'
     *     responses:
     *       200:
     *         description: Evento actualizado correctamente
     *       404:
     *         description: Evento no encontrado
     */
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);

            const updated = await EventService.update(id, req.body);

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
            res.status(400).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/events/{id}:
     *   delete:
     *     summary: Eliminar un evento turístico
     *     tags: [Events]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del evento
     *     responses:
     *       200:
     *         description: Evento eliminado correctamente
     *       404:
     *         description: Evento no encontrado
     */
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await EventService.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    ok: false,
                    message: "Evento no encontrado"
                });
            }

            return res.json({
                ok: true,
                message: "Evento eliminado correctamente"
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }
}
