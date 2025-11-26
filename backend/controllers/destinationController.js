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
            console.error("Error en getAll:", error);
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
            console.error("Error en getById:", error);
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
            console.error("Error en create:", error);

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
    /*     static async update(req, res) {
            try {
                const { id } = req.params;
    
                // Convertir campos enviados por FormData
                const data = { ...req.body };
    
                // Normalizar valores (FormData siempre envía strings)
                if (data.category_id) data.category_id = Number(data.category_id);
                if (data.is_featured !== undefined) data.is_featured = Number(data.is_featured);
    
                // =======================
                //  PROCESAR ARCHIVOS
                // =======================
                if (req.files?.main_image) {
                    data.main_image_url = "/uploads/" + req.files.main_image[0].filename;
                }
    
                if (req.files?.hero_image) {
                    data.hero_image_url = "/uploads/" + req.files.hero_image[0].filename;
                }
    
                // =======================
                // ENVIAR SOLO CAMPOS VÁLIDOS AL SERVICIO
                // =======================
                const payload = {
                    ...(data.name && { name: data.name }),
                    ...(data.summary && { summary: data.summary }),
                    ...(data.description && { description: data.description }),
                    ...(data.category_id && { category_id: data.category_id }),
                    ...(data.is_featured !== undefined && { is_featured: data.is_featured }),
                    ...(data.main_image_url && { main_image_url: data.main_image_url }),
                    ...(data.hero_image_url && { hero_image_url: data.hero_image_url })
                };
    
                const updated = await DestinationService.updateDestination(id, payload);
    
                if (!updated) {
                    return res.status(404).json({
                        ok: false,
                        message: "Destino no encontrado"
                    });
                }
    
                res.json({ ok: true, message: "Destino actualizado correctamente" });
    
            } catch (error) {
                console.error("Error en update:", error);
    
                res.status(error.status || 500).json({
                    ok: false,
                    message: error.message
                });
            }
        } */

    static async update(req, res) {
        try {
            const { id } = req.params;

            const body = {
                ...req.body,
                main_image: req.files?.main_image ? req.files.main_image[0].filename : null,
                hero_image: req.files?.hero_image ? req.files.hero_image[0].filename : null
            };


            const updated = await DestinationService.updateDestination(id, body);

            if (!updated) {
                return res.status(404).json({ ok: false, message: "Destino no encontrado" });
            }

            res.json({ ok: true, message: "Destino actualizado correctamente" });

        } catch (error) {
            console.error("Error en update:", error);
            res.status(error.status || 500).json({
                ok: false,
                message: error.message
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
            console.error("Error al eliminar destino:", error);

            res.status(error.status || 500).json({
                ok: false,
                message: error.message
            });
        }
    }
}
