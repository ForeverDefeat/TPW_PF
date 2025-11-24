/**
 * @file routes/userRoutes.js
 * @description Rutas HTTP para la gestión CRUD de usuarios.
 * Todas las rutas utilizan UserController y validaciones con express-validator.
 */

import express from "express";
import { UserController } from "../controllers/userController.js";
import {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserByIdValidator
} from "../validations/userValidator.js";

const router = express.Router();

/**
 * GET /api/users
 * Obtiene la lista completa de usuarios.
 */
router.get("/", UserController.getAll);

/**
 * GET /api/users/:id
 * Obtiene un usuario por ID.
 */
router.get("/:id", getUserByIdValidator, UserController.getById);

/**
 * POST /api/users
 * Crea un nuevo usuario.
 */
router.post("/", createUserValidator, UserController.create);

/**
 * PUT /api/users/:id
 * Actualiza un usuario existente.
 */
router.put("/:id", updateUserValidator, UserController.update);

/**
 * DELETE /api/users/:id
 * Elimina un usuario por ID.
 */
router.delete("/:id", deleteUserValidator, UserController.delete);

export default router;
