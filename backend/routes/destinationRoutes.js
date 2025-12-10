/**
 * @file routes/destinationsRoutes.js
 */

import { Router } from "express";
import { DestinationController } from "../controllers/destinationController.js";
import { upload, saveUploadedFiles} from "../middlewares/upload.js";

const router = Router();

/* ===========================
   Rutas públicas
=========================== */

/** Obtener destino por slug */
router.get("/slug/:slug", DestinationController.getBySlug);

/** Obtener destinos por categoría */
router.get("/category/:id", DestinationController.getByCategory);

/** Buscar destinos */
router.get("/search", DestinationController.search);

/* ===========================
   CRUD ADMIN
=========================== */

router.get("/", DestinationController.getAll);
router.get("/:id", DestinationController.getById);

router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "hero_image", maxCount: 1 },
  ]),
  saveUploadedFiles,
  DestinationController.create
);

router.put(
  "/:id",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "hero_image", maxCount: 1 }
  ]),
  saveUploadedFiles,
  DestinationController.update
);

/** DELETE DESTINATION */
router.delete("/:id", DestinationController.delete);

export default router;
