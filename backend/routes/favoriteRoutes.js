/**
 * @file routes/favoriteRoutes.js
 * @description Rutas para la gestión de favoritos del usuario.
 * Estas rutas enlazan directamente con los métodos del FavoriteController.
 */

import express from "express";
import { FavoriteController } from "../controllers/FavoriteController.js";
import {
    createFavoriteValidator,
    deleteFavoriteValidator
} from "../validations/favoriteValidator.js";

const router = express.Router();

/**
 * GET /api/favorites/user/:id
 * Obtener todos los destinos favoritos de un usuario.
 */
router.get("/user/:id", FavoriteController.getByUser);

/**
 * POST /api/favorites
 * Agregar un destino a favoritos.
 */
router.post("/", createFavoriteValidator, FavoriteController.create);

/**
 * DELETE /api/favorites/:id
 * Eliminar un destino de favoritos.
 */
router.delete("/:id", deleteFavoriteValidator, FavoriteController.delete);

export default router;
