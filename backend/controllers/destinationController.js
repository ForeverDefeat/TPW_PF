/**
 * @file controllers/destinationController.js
 * @description Controlador para la entidad Destination.
 * @module controllers/destinationController
 */

import { DestinationService } from "../services/DestinationService.js";

export class DestinationController {

    /**
     * Obtener todos los destinos.
     * @route GET /api/destinations
     */
    static async getAll(req, res) {
        try {
            const destinations = await DestinationService.getAllDestinations();
            res.json({ ok: true, data: destinations });

        } catch (error) {
            console.error("❌ Error en getAll:", error);
            res.status(500).json({ ok: false, message: "Error interno del servidor" });
        }
    }

    /**
     * Obtener destino por ID.
     * @route GET /api/destinations/{id}
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const destination = await DestinationService.getDestinationById(id);

            if (!destination) {
                return res.status(404).json({
                    ok: false,
                    message: "Destino no encontrado"
                });
            }

            res.json({ ok: true, data: destination });

        } catch (error) {
            console.error("❌ Error en getById:", error);
            res.status(500).json({ ok: false, message: "Error interno del servidor" });
        }
    }

    /**
     * Crear un nuevo destino.
     * @route POST /api/destinations
     */
    static async create(req, res) {
        try {
            const newId = await DestinationService.createDestination(req.body);

            res.status(201).json({
                ok: true,
                message: "Destino creado correctamente",
                id: newId
            });

        } catch (error) {
            console.error("❌ Error en create:", error);

            res.status(error.status || 500).json({
                ok: false,
                message: error.message,
                details: error.details || null
            });
        }
    }

    /**
     * Actualizar destino por ID.
     * @route PUT /api/destinations/{id}
     */
    static async update(req, res) {
        try {
            const { id } = req.params;

            const updated = await DestinationService.updateDestination(id, req.body);

            if (!updated) {
                return res.status(404).json({
                    ok: false,
                    message: "Destino no encontrado"
                });
            }

            res.json({
                ok: true,
                message: "Destino actualizado correctamente"
            });

        } catch (error) {
            console.error("❌ Error en update:", error);

            res.status(error.status || 500).json({
                ok: false,
                message: error.message,
                details: error.details || null
            });
        }
    }

    /**
     * Eliminar un destino por ID.
     * @route DELETE /api/destinations/{id}
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const deleted = await DestinationService.deleteDestination(id);

            if (!deleted) {
                return res.status(404).json({
                    ok: false,
                    message: "Destino no encontrado"
                });
            }

            res.json({
                ok: true,
                message: "Destino eliminado correctamente"
            });

        } catch (error) {
            console.error("❌ Error al eliminar destino:", error);

            res.status(error.status || 500).json({
                ok: false,
                message: error.message
            });
        }
    }
}
