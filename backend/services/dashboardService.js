/**
 * @file services/dashboardService.js
 */

import { DashboardRepository } from "../repositories/DashboardRepository.js";
import { db } from "../config/db.js";

export class DashboardService {

    static async calculateStats() {

        /* =============================
           MÉTRICAS BASE
        ==============================*/
        const categories = await DashboardRepository.countCategories();
        const destinations = await DashboardRepository.countDestinations();
        const services = await DashboardRepository.countServices();
        const events = await DashboardRepository.countEvents();
        const users = await DashboardRepository.countUsers();

        const destinationsPerCategory = await DashboardRepository.groupDestinationsByCategory();
        const recentActivity = await DashboardRepository.getRecentEvents();


        /* =============================
           USUARIOS POR ROL (SEGURO)
        ==============================*/
        let usersByRole = [];
        try {
            const [rows] = await db.query(`
                SELECT IFNULL(role, 'Sin rol') AS role,
                       COUNT(*) AS total
                FROM users
                GROUP BY role;
            `);
            usersByRole = rows;
        } catch (e) {
            usersByRole = [{ role: "N/A", total: users }];
        }


        /* =============================
           CRECIMIENTO DE USUARIOS (SEGURO)
        ==============================*/
        let userGrowth = [];
        try {
            const [rows] = await db.query(`
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                       COUNT(*) AS total
                FROM users
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month ASC;
            `);
            userGrowth = rows;
        } catch {
            userGrowth = [];
        }


        /* =============================
           VISITAS A CATEGORÍAS (SEGURO)
        ==============================*/
        let categoryVisits = [];
        try {
            const [rows] = await db.query(`
                SELECT c.name AS category,
                       COUNT(v.id) AS visits
                FROM categories c
                LEFT JOIN visits v ON v.category_id = c.id
                GROUP BY c.id;
            `);
            categoryVisits = rows;
        } catch {
            categoryVisits = destinationsPerCategory.map(x => ({
                category: x.name,
                visits: 0
            }));
        }


        /* =============================
           EVENTOS (CREADOS VS SEGUIDOS)
        ==============================*/
        let eventsStats = [];
        try {
            const [rows] = await db.query(`
                SELECT DATE_FORMAT(e.created_at, '%Y-%m') AS month,
                       COUNT(e.id) AS created,
                       (
                           SELECT COUNT(*)
                           FROM events_followed ef
                           WHERE DATE_FORMAT(ef.created_at, '%Y-%m') =
                                 DATE_FORMAT(e.created_at, '%Y-%m')
                       ) AS followed
                FROM events e
                GROUP BY month
                ORDER BY month ASC;
            `);
            eventsStats = rows;
        } catch {
            eventsStats = [];
        }


        /* =============================
           POPULARIDAD DE SERVICIOS (SEGURO)
        ==============================*/
        let servicesPopularity = [];
        try {
            const [rows] = await db.query(`
                SELECT s.name,
                       COUNT(su.id) AS used
                FROM services s
                LEFT JOIN service_usage su ON su.service_id = s.id
                GROUP BY s.id;
            `);
            servicesPopularity = rows;
        } catch {
            const [srv] = await db.query(`SELECT name FROM services`);
            servicesPopularity = srv.map(s => ({
                name: s.name,
                used: 0
            }));
        }


        return {
            categories,
            destinations,
            services,
            events,
            users,
            destinationsPerCategory,
            recentActivity,
            usersByRole,
            userGrowth,
            categoryVisits,
            eventsStats,
            servicesPopularity
        };
    }
}
