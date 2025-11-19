// routes/destinationRoutes.js
import express from "express";
import { getDestinations, addDestination } from "../controllers/destinationController.js";

const router = express.Router();

router.get("/destinations", getDestinations);
router.post("/destinations", addDestination);

export default router;
