/**
 * @file controllers/DashboardController.js
 * @description Controlador de métricas para el dashboard admin.
 */

import { DashboardService } from "../services/dashboardService.js";

export class DashboardController {

    static async getStats(req, res) {
        try {
            const stats = await DashboardService.calculateStats();

            return res.json({
                ok: true,
                ...stats
            });

        } catch (err) {
            console.error("Error Dashboard:", err);
            res.status(500).json({
                ok: false,
                message: "Error obteniendo estadísticas"
            });
        }
    }
}
