/**
 * @file controllers/destinationServiceController.js
 * @description Controlador para la relación muchos-a-muchos entre destinos y servicios.
 * Gestiona servicios cercanos a un destino específico.
 */

import { validationResult } from "express-validator";
import { DestinationServiceService } from "../services/DestinationServiceService.js";

/**
 * @swagger
 * tags:
 *   name: DestinationServices
 *   description: Relación entre destinos y servicios cercanos
 */

export class DestinationServiceController {

    /**
     * @swagger
     * /api/destination-services/destination/{id}:
     *   get:
     *     summary: Obtener todos los servicios relacionados a un destino
     *     tags: [DestinationServices]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del destino
     *     responses:
     *       200:
     *         description: Lista de servicios relacionados al destino
     *       404:
     *         description: Destino no encontrado o sin servicios relacionados
     */
    static async getByDestination(req, res) {
        try {
            const destinationId = parseInt(req.params.id);

            const data = await DestinationServiceService.getByDestination(destinationId);

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
     * /api/destination-services:
     *   post:
     *     summary: Crear relación destino-servicio
     *     tags: [DestinationServices]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/DestinationServiceInput'
     *     responses:
     *       201:
     *         description: Relación creada correctamente
     *       400:
     *         description: Datos inválidos
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

            const { destination_id, service_id } = req.body;

            const relation = await DestinationServiceService.create(destination_id, service_id);

            return res.status(201).json({
                ok: true,
                message: "Relación destino-servicio creada correctamente",
                data: relation
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
     * /api/destination-services/{id}:
     *   delete:
     *     summary: Eliminar una relación destino-servicio
     *     tags: [DestinationServices]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la relación destino-servicio
     *     responses:
     *       200:
     *         description: Relación eliminada correctamente
     *       404:
     *         description: Relación no encontrada
     */
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);

            await DestinationServiceService.delete(id);

            return res.json({
                ok: true,
                message: "Relación destino-servicio eliminada correctamente"
            });

        } catch (error) {
            res.status(404).json({
                ok: false,
                error: error.message
            });
        }
    }
}
