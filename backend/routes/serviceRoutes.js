/**
 * @file routes/serviceRoutes.js
 * @description Rutas de la API para servicios turísticos.
 */

import express from "express";
import { ServiceController } from "../controllers/serviceController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getById);

router.get("/destination/:id", ServiceController.getByDestination);

router.post("/", upload.fields([{ name: "image", maxCount: 1 }]), ServiceController.create);
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), ServiceController.update);
router.delete("/:id", ServiceController.delete);

export default router;
