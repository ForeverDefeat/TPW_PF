import express from "express";
import { upload } from "../middlewares/upload.js";
import { BannerController } from "../controllers/bannerController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Gestión de banners del portal
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Listar banners activos
 *     tags: [Banners]
 */
router.get("/", BannerController.getAll);

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Crear banner
 *     tags: [Banners]
 */
router.post("/", upload.single("image"), BannerController.create);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Editar banner
 *     tags: [Banners]
 */
router.put("/:id", upload.single("image"), BannerController.update);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Eliminar banner (soft delete)
 *     tags: [Banners]
 */
router.delete("/:id", BannerController.delete);

export default router;
