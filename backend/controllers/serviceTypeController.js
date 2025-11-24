/**
 * @file controllers/serviceTypeController.js
 * @description Controlador HTTP para la entidad Service Types.
 * Gestiona las peticiones REST y delega la lógica en ServiceTypeService.
 *
 * @module ServiceTypeController
 */

import { ServiceTypeService } from "../services/ServiceTypeService.js";

/**
 * @swagger
 * tags:
 *   name: ServiceTypes
 *   description: Gestión de tipos de servicios turísticos (Hoteles, Tours, Restaurantes, etc.)
 */
export class ServiceTypeController {

    /**
     * Controlador: Obtener lista de tipos de servicio.
     *
     * @swagger
     * /api/service-types:
     *   get:
     *     summary: Obtener todos los tipos de servicio
     *     tags: [ServiceTypes]
     *     responses:
     *       200:
     *         description: Lista de tipos obtenida correctamente
     */
    static async getAll(req, res) {
        try {
            const data = await ServiceTypeService.getAll();
            return res.json({ ok: true, data });
        } catch (error) {
            res.status(500).json({ ok: false, error: error.message });
        }
    }

    /**
     * Controlador: Obtener un tipo de servicio por ID.
     *
     * @swagger
     * /api/service-types/{id}:
     *   get:
     *     summary: Obtener tipo por ID
     *     tags: [ServiceTypes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Tipo encontrado
     *       404:
     *         description: No existe
     */
    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const serviceType = await ServiceTypeService.getById(id);

            if (!serviceType) {
                return res.status(404).json({ ok: false, message: "Tipo de servicio no encontrado" });
            }

            return res.json({ ok: true, data: serviceType });
        } catch (error) {
            res.status(500).json({ ok: false, error: error.message });
        }
    }

    /**
     * Controlador: Crear un tipo de servicio nuevo.
     *
     * @swagger
     * /api/service-types:
     *   post:
     *     summary: Crear un tipo
     *     tags: [ServiceTypes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/ServiceTypeInput"
     *     responses:
     *       201:
     *         description: Tipo creado
     */
    static async create(req, res) {
        try {
            const id = await ServiceTypeService.create(req.body);

            return res.status(201).json({
                ok: true,
                message: "Tipo de servicio creado correctamente",
                id
            });
        } catch (error) {
            res.status(400).json({ ok: false, error: error.message });
        }
    }

    /**
     * Controlador: Actualizar un tipo de servicio.
     *
     * @swagger
     * /api/service-types/{id}:
     *   put:
     *     summary: Actualizar tipo
     *     tags: [ServiceTypes]
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
     *             $ref: "#/components/schemas/ServiceTypeUpdate"
     *     responses:
     *       200:
     *         description: Tipo actualizado
     */
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updated = await ServiceTypeService.update(id, req.body);

            if (!updated) {
                return res.status(404).json({ ok: false, message: "Tipo no encontrado" });
            }

            return res.json({ ok: true, message: "Tipo actualizado correctamente" });

        } catch (error) {
            res.status(400).json({ ok: false, error: error.message });
        }
    }

    /**
     * Controlador: Eliminar un tipo de servicio.
     *
     * @swagger
     * /api/service-types/{id}:
     *   delete:
     *     summary: Eliminar tipo
     *     tags: [ServiceTypes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Tipo eliminado
     */
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await ServiceTypeService.delete(id);

            if (!deleted) {
                return res.status(404).json({ ok: false, message: "Tipo no encontrado" });
            }

            return res.json({ ok: true, message: "Tipo eliminado correctamente" });

        } catch (error) {
            res.status(500).json({ ok: false, error: error.message });
        }
    }
}
