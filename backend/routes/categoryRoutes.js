/**
 * @file routes/categoryRoutes.js
 * @description Rutas para la gestión de categorías con soporte para subida de imágenes.
 * @module routes/categoryRoutes
 */

import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";

// Importar Multer (el mismo configurado en uploadRoutes)
import { upload } from "../middlewares/upload.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Obtener todas las categorías
 */
router.get("/", CategoryController.getAll);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Obtener una categoría por ID
 */
router.get("/:id", CategoryController.getById);

/**
 * RUTA NUEVA 
 * Obtener categoría por slug
 * GET /api/categories/slug/:slug
 */
router.get("/slug/:slug", CategoryController.getBySlug);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Crear una nueva categoría con imagen
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.post(
    "/",
    upload.single("image"),       // <------- SE AÑADE MULTER
    CategoryController.create
);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Actualizar categoría (con opción de subir nueva imagen)
 */
router.put(
    "/:id",
    upload.single("image"),       // <------- SE AÑADE MULTER
    CategoryController.update
);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Eliminar una categoría por ID
 */
router.delete("/:id", CategoryController.delete);

export default router;
