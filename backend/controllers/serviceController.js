/**
 * @file controllers/serviceController.js
 * @description Controlador para los servicios turísticos.
 * Recibe solicitudes HTTP y delega la lógica al ServiceService.
 */

import { ServiceService } from "../services/ServiceService.js";

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Gestión de servicios turísticos (hoteles, restaurantes, tours, etc.)
 */

export class ServiceController {

    /**
     * @swagger
     * /api/services:
     *   get:
     *     summary: Obtener lista de servicios
     *     tags: [Services]
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: integer
     *         description: Filtrar por tipo de servicio (FK service_types)
     *       - in: query
     *         name: destination_id
     *         schema:
     *           type: integer
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         description: Buscar por nombre o descripción
     *     responses:
     *       200:
     *         description: Lista filtrada de servicios
     */
    static async getAll(req, res) {
        try {
            const filters = req.query;
            const data = await ServiceService.getAll(filters);
            return res.json({ ok: true, data });
        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/services/{id}:
     *   get:
     *     summary: Obtener un servicio específico
     *     tags: [Services]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Servicio encontrado
     *       404:
     *         description: Servicio no encontrado
     */
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const service = await ServiceService.getById(id);

            if (!service) {
                return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
            }

            return res.json({ ok: true, data: service });
        } catch (error) {
            res.status(500).json({ ok: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /api/services:
     *   post:
     *     summary: Crear un servicio turístico
     *     tags: [Services]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ServiceInput'
     *     responses:
     *       201:
     *         description: Servicio creado correctamente
     */
    static async create(req, res) {
        try {
            const id = await ServiceService.create(req.body);

            res.status(201).json({
                ok: true,
                message: "Servicio creado correctamente",
                id
            });
        } catch (error) {
            res.status(400).json({ ok: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /api/services/{id}:
     *   put:
     *     summary: Actualizar un servicio turístico
     *     tags: [Services]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ServiceUpdate'
     *     responses:
     *       200:
     *         description: Servicio actualizado
     */
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updated = await ServiceService.update(id, req.body);

            if (!updated) {
                return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
            }

            res.json({ ok: true, message: "Servicio actualizado correctamente" });
        } catch (error) {
            res.status(400).json({ ok: false, error: error.message });
        }
    }

    /**
     * @swagger
     * /api/services/{id}:
     *   delete:
     *     summary: Eliminar un servicio turístico
     *     tags: [Services]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Servicio eliminado
     */
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await ServiceService.delete(id);

            if (!deleted) {
                return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
            }

            res.json({ ok: true, message: "Servicio eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ ok: false, error: error.message });
        }
    }
}
