/**
 * @file routes/eventRoutes.js
 * @description Rutas para la gestión de eventos turísticos.
 * Aquí solo se definen los endpoints y se enlazan con los métodos del EventController.
 * La documentación Swagger se maneja en el controlador para mayor claridad.
 */

import express from "express";
import { EventController } from "../controllers/EventController.js";
import {
    createEventValidator,
    updateEventValidator
} from "../validations/eventValidator.js";

const router = express.Router();

/**
 * GET /api/events
 * Obtener todos los eventos con filtros opcionales
 */
router.get("/", EventController.getAll);

/**
 * GET /api/events/:id
 * Obtener un evento por ID
 */
router.get("/:id", EventController.getById);

/**
 * POST /api/events
 * Crear un evento turístico
 */
router.post("/", createEventValidator, EventController.create);

/**
 * PUT /api/events/:id
 * Actualizar un evento turístico
 */
router.put("/:id", updateEventValidator, EventController.update);

/**
 * DELETE /api/events/:id
 * Eliminar un evento turístico
 */
router.delete("/:id", EventController.delete);

export default router;
