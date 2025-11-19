// routes/destinationRoutes.js
import express from "express";
import { getDestinations, addDestination, getCategoryCounts, searchDestinations } from "../controllers/destinationController.js";

const router = express.Router();

router.get("/", getDestinations);
router.post("/", addDestination);
router.get("/counts", getCategoryCounts);
router.get("/search", searchDestinations);



export default router;
