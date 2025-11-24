/**
 * @file routes/serviceTypeRoutes.js
 * @description Rutas API para Service Types.
 */

import express from "express";
import { ServiceTypeController } from "../controllers/serviceTypeController.js";

const router = express.Router();

/**
 * @swagger
 * /api/service-types:
 *   get:
 *     summary: Obtener todos los tipos de servicio
 *     tags: [ServiceTypes]
 */
router.get("/", ServiceTypeController.getAll);

/**
 * @swagger
 * /api/service-types/{id}:
 *   get:
 *     summary: Obtener un tipo de servicio por ID
 *     tags: [ServiceTypes]
 */
router.get("/:id", ServiceTypeController.getById);

/**
 * @swagger
 * /api/service-types:
 *   post:
 *     summary: Crear un nuevo tipo de servicio
 *     tags: [ServiceTypes]
 */
router.post("/", ServiceTypeController.create);

/**
 * @swagger
 * /api/service-types/{id}:
 *   put:
 *     summary: Actualizar un tipo de servicio
 *     tags: [ServiceTypes]
 */
router.put("/:id", ServiceTypeController.update);

/**
 * @swagger
 * /api/service-types/{id}:
 *   delete:
 *     summary: Eliminar un tipo de servicio
 *     tags: [ServiceTypes]
 */
router.delete("/:id", ServiceTypeController.delete);

export default router;
