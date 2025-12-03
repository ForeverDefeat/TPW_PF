/**
 * @file routes/destinationsRoutes.js
 */

import { Router } from "express";
import { DestinationController } from "../controllers/destinationController.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

/* ===========================
   🔵 RUTAS NUEVAS NECESARIAS
=========================== */

/** Obtener destino por slug */
router.get("/slug/:slug", DestinationController.getBySlug);

/** Obtener destinos por categoría */
router.get("/category/:id", DestinationController.getByCategory);

/** Buscar destinos */
router.get("/search", DestinationController.search);


/* ===========================
   🟢 CRUD EXISTENTE
=========================== */

router.get("/", DestinationController.getAll);
router.get("/:id", DestinationController.getById);

router.post("/", upload.single("image"), DestinationController.create);

/* router.put("/:id", upload.single("image"), DestinationController.update); */

router.put(
  "/:id",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "hero_image", maxCount: 1 }
  ]),
  DestinationController.update
);


router.delete("/:id", DestinationController.delete);

export default router;
