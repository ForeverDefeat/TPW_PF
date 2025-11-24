/**
 * @file routes/dashboardRoutes.js
 */

import express from "express";
import { DashboardService } from "../services/dashboardService.js";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas generales del dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Estadísticas devueltas correctamente
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await DashboardService.calculateStats();

    // Esto es lo que tu frontend espera EXACTAMENTE
    return res.json({
      ok: true,
      ...stats    // <<--- EXPANDE categories, destinations, etc.
    });

  } catch (err) {
    console.error("Error obteniendo estadísticas:", err);
    return res.status(500).json({
      ok: false,
      message: "Error obteniendo estadísticas"
    });
  }
});

export default router;
