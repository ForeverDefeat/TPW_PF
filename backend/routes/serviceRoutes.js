/**
 * @file routes/serviceRoutes.js
 * @description Rutas de la API para la entidad Services.
 * Maneja hoteles, restaurantes, tours, transporte y más.
 */

import express from "express";
import { ServiceController } from "../controllers/serviceController.js";

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Listar servicios turísticos
 *     tags: [Services]
 */
router.get("/", ServiceController.getAll);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Services]
 */
router.get("/:id", ServiceController.getById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Services]
 */
router.post("/", ServiceController.create);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Actualizar un servicio turístico
 *     tags: [Services]
 */
router.put("/:id", ServiceController.update);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Eliminar un servicio turístico
 *     tags: [Services]
 */
router.delete("/:id", ServiceController.delete);

export default router;
