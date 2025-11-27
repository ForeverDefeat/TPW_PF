/**
 * @file controllers/destinationController.js
 * @description Controlador para la entidad Destination.
 */

import { DestinationService } from "../services/DestinationService.js";

export class DestinationController {

    /* ============================================================
       GET ALL
    ============================================================ */
    static async getAll(req, res) {
        try {
            const destinations = await DestinationService.getAllDestinations();
            res.json({ ok: true, data: destinations });

        } catch (error) {
            console.error("❌ Error en getAll:", error);
            res.status(500).json({ ok: false, message: "Error interno del servidor" });
        }
    }

    /* ============================================================
       GET BY ID
    ============================================================ */
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

    /* ============================================================
       CREATE
    ============================================================ */
    static async create(req, res) {
        try {
            const body = {
                ...req.body,
                main_image: req.files?.main_image ? req.files.main_image[0].filename : null,
                hero_image: req.files?.hero_image ? req.files.hero_image[0].filename : null
            };

            const newId = await DestinationService.createDestination(body);

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

    /* ============================================================
       UPDATE — 🔥 VERSIÓN FINAL
    ============================================================ */
    static async update(req, res) {
        try {
            const { id } = req.params;

            // Solo pasamos los filenames, NUNCA los objetos Multer
            const body = {
                ...req.body,
                main_image: req.files?.main_image ? req.files.main_image[0].filename : undefined,
                hero_image: req.files?.hero_image ? req.files.hero_image[0].filename : undefined
            };

            const updated = await DestinationService.updateDestination(id, body);

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
                message: error.message
            });
        }
    }

    /* ============================================================
       DELETE
    ============================================================ */
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
