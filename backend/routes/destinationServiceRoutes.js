/**
 * @file routes/destinationServiceRoutes.js
 * @description Rutas para la relación destino-servicio
 */

import express from "express";
import { DestinationServiceController } from "../controllers/destinationServiceController.js";
import { createDestinationServiceValidator } from "../validations/destinationServiceValidator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DestinationServices
 *   description: Relación entre destinos y servicios cercanos
 */

/**
 * @swagger
 * /api/destination-services/destination/{id}:
 *   get:
 *     summary: Obtener todos los servicios cercanos de un destino
 *     tags: [DestinationServices]
 */
router.get("/destination/:id", DestinationServiceController.getByDestination);

/**
 * @swagger
 * /api/destination-services:
 *   post:
 *     summary: Crear relación destino-servicio
 *     tags: [DestinationServices]
 */
router.post("/", createDestinationServiceValidator, DestinationServiceController.create);

/**
 * @swagger
 * /api/destination-services/{id}:
 *   delete:
 *     summary: Eliminar relación destino-servicio
 *     tags: [DestinationServices]
 */
router.delete("/:id", DestinationServiceController.delete);

export default router;
