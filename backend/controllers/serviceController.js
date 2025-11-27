/**
 * @file controllers/serviceController.js
 * @description Controlador para los servicios turísticos.
 */

import { ServiceService } from "../services/ServiceService.js";

export class ServiceController {

    /** Obtener todos los servicios */
    static async getAll(req, res) {
        try {
            const filters = req.query;
            const data = await ServiceService.getAll(filters);
            return res.json({ ok: true, data });
        } catch (error) {
            console.error("Error en getAll:", error);
            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    /** Obtener servicio por ID */
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const service = await ServiceService.getById(id);

            if (!service) {
                return res.status(404).json({
                    ok: false,
                    message: "Servicio no encontrado"
                });
            }

            return res.json({ ok: true, data: service });
        } catch (error) {
            console.error("Error en getById:", error);
            return res.status(500).json({ ok: false, error: error.message });
        }
    }

    /** Crear servicio */
    static async create(req, res) {
        try {
            const imageFile = req.files?.image?.[0] ?? null;

            const body = {
                ...req.body,
                service_type_id: Number(req.body.service_type_id),
                price_min: req.body.price_min ? Number(req.body.price_min) : null,
                price_max: req.body.price_max ? Number(req.body.price_max) : null,
                image_url: imageFile ? imageFile.filename : null
            };

            const id = await ServiceService.create(body);

            return res.status(201).json({
                ok: true,
                message: "Servicio creado correctamente",
                id
            });

        } catch (error) {
            console.error("Error en create:", error);
            return res.status(400).json({ ok: false, error: error.message });
        }
    }

    /** Actualizar servicio */
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);

            // 📌 Si subes imagen nueva, estará en req.files.image[0]
            const imageFile = req.files?.image?.[0];

            const body = {
                ...req.body,
                service_type_id: req.body.service_type_id
                    ? Number(req.body.service_type_id)
                    : undefined,
                price_min: req.body.price_min
                    ? Number(req.body.price_min)
                    : undefined,
                price_max: req.body.price_max
                    ? Number(req.body.price_max)
                    : undefined,
                image_url: imageFile ? imageFile.filename : undefined  // ✅ CORREGIDO
            };

            const updated = await ServiceService.update(id, body);

            if (!updated) {
                return res.status(404).json({
                    ok: false,
                    message: "Servicio no encontrado"
                });
            }

            return res.json({
                ok: true,
                message: "Servicio actualizado correctamente"
            });

        } catch (error) {
            console.error("Error en update:", error);
            return res.status(400).json({ ok: false, error: error.message });
        }
    }




    /** Eliminar servicio */
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await ServiceService.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    ok: false,
                    message: "Servicio no encontrado"
                });
            }

            return res.json({
                ok: true,
                message: "Servicio eliminado correctamente"
            });

        } catch (error) {
            console.error("Error en delete:", error);
            return res.status(500).json({ ok: false, error: error.message });
        }
    }
}
