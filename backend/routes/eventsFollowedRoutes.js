/**
 * @file routes/eventsFollowedRoutes.js
 * @description Rutas para la gestión de eventos seguidos por los usuarios.
 * Cada endpoint está asociado a un método del EventsFollowedController.
 */

import express from "express";
import { EventsFollowedController } from "../controllers/EventsFollowedController.js";
import {
    createFollowValidator,
    deleteFollowValidator
} from "../validations/eventsFollowedValidator.js";

const router = express.Router();

/**
 * GET /api/events-followed/user/:id
 * Obtener todos los eventos que un usuario está siguiendo.
 */
router.get("/user/:id", EventsFollowedController.getByUser);

/**
 * POST /api/events-followed
 * Seguir un evento turístico.
 */
router.post("/", createFollowValidator, EventsFollowedController.create);

/**
 * DELETE /api/events-followed/:id
 * Dejar de seguir un evento turístico.
 */
router.delete("/:id", deleteFollowValidator, EventsFollowedController.delete);

export default router;
