/**
 * @file routes/destinationRoutes.js
 * @description Rutas para gestión de destinos turísticos.
 * @module routes/destinationRoutes
 */

import express from "express";
import { DestinationController } from "../controllers/destinationController.js";

const router = express.Router();


// ======================================================
// 📘 SWAGGER DOCS — DESTINATIONS
// ======================================================

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Gestión de destinos turísticos
 */


/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Obtiene todos los destinos registrados
 *     tags: [Destinations]
 *     responses:
 *       200:
 *         description: Lista de destinos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Destination'
 */
router.get("/", DestinationController.getAll);


/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Obtiene un destino por su ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino encontrado
 *       404:
 *         description: Destino no encontrado
 */
router.get("/:id", DestinationController.getById);


/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Crea un nuevo destino turístico
 *     tags: [Destinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DestinationInput'
 *     responses:
 *       201:
 *         description: Destino creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", DestinationController.create);


/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Actualiza un destino existente
 *     tags: [Destinations]
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
 *             $ref: '#/components/schemas/DestinationUpdate'
 *     responses:
 *       200:
 *         description: Destino actualizado
 *       404:
 *         description: No existe el destino
 */
router.put("/:id", DestinationController.update);


/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Elimina un destino por ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Destino eliminado correctamente
 *       404:
 *         description: Destino no encontrado
 */
router.delete("/:id", DestinationController.delete);

export default router;
