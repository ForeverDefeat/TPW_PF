/**
 * @file routes/uploadRoutes.js
 * @description Rutas públicas para subir imágenes desde el panel administrativo.
 *              Recibe archivos mediante Multer y los pasa al UploadController.
 * @module uploadRoutes
 */

import express from "express";
import { upload } from "../middlewares/upload.js";   // Multer configurado
import { UploadController } from "../controllers/uploadController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoints para subir imágenes al servidor
 */

/**
 * POST /api/upload/image
 *
 * Sube una sola imagen al servidor.
 *
 * El campo del formulario debe llamarse "image":
 *   fd.append("image", fileInput.files[0])
 *
 * Respuesta exitosa:
 * {
 *   ok: true,
 *   filename: "123456789.jpg",
 *   url: "/uploads/123456789.jpg"
 * }
 */
router.post(
    "/image",
    upload.single("image"),          // Middleware Multer → procesa 1 archivo
    UploadController.uploadImage     // Controlador encargado de responder
);

export default router;
