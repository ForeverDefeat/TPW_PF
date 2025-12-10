import { Router } from "express";
import { GalleryController } from "../controllers/GalleryController.js";
import { upload, saveUploadedFiles } from "../middlewares/upload.js";

const router = Router();

router.get("/destination/:destinationId", GalleryController.getByDestination);

router.post(
    "/destination/:destinationId",
    upload.array("images", 10),
    saveUploadedFiles,
    GalleryController.uploadImages
);


router.delete("/:id", GalleryController.delete);

export default router;
