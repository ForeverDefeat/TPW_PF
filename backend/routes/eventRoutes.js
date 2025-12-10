import express from "express";
import { EventController } from "../controllers/EventController.js";
import { createEventValidator, updateEventValidator } from "../validations/eventValidator.js";
import { upload, saveUploadedFiles } from "../middlewares/upload.js";

const router = express.Router();

// GET
router.get("/", EventController.getAll);
router.get("/:id", EventController.getById);

router.get("/destination/:id", EventController.getByDestinationId);

router.get("/followed/:userId", EventController.getFollowedByUser);

// POST (con imagen)
router.post(
    "/",
    upload.fields([{ name: "image", maxCount: 1 }]),
    createEventValidator,
    EventController.create
);

// PUT (con imagen) ← ESTA ES LA PARTE QUE FALTABA
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  saveUploadedFiles,
  EventController.update
);


// DELETE
router.delete("/:id", EventController.delete);

export default router;
