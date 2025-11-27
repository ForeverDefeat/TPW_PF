// routes/eventsFollowedRoutes.js
import express from "express";
import { EventsFollowedController } from "../controllers/EventsFollowedController.js";
import { createFollowValidator, deleteFollowValidator } from "../validations/eventsFollowedValidator.js";

const router = express.Router();

// Listar todos
router.get("/", EventsFollowedController.getAll);

// Obtener 1 por ID
router.get("/:id", EventsFollowedController.getById);

// Obtener por usuario
router.get("/user/:id", EventsFollowedController.getByUser);

// Obtener por evento
router.get("/event/:id", EventsFollowedController.getByEvent);

// Crear
router.post("/", createFollowValidator, EventsFollowedController.create);

// Eliminar
router.delete("/:id", deleteFollowValidator, EventsFollowedController.delete);

export default router;
