/**
 * @file services/DashboardService.js
 * @description Procesa datos para métricas del dashboard.
 */

import { DashboardRepository } from "../repositories/DashboardRepository.js";

export class DashboardService {

    static async calculateStats() {

        const [
            categories,
            destinations,
            services,
            events,
            users,
            destinationsPerCategory,
            recentActivity
        ] = await Promise.all([
            DashboardRepository.countCategories(),
            DashboardRepository.countDestinations(),
            DashboardRepository.countServices(),
            DashboardRepository.countEvents(),
            DashboardRepository.countUsers(),
            DashboardRepository.groupDestinationsByCategory(),
            DashboardRepository.getRecentEvents()
        ]);

        return {
            categories,
            destinations,
            services,
            events,
            users,
            destinationsPerCategory,
            recentActivity
        };
    }
}

