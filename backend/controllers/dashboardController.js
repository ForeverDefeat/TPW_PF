import db from "../config/db.js";

export class DashboardController {

    static async getStats(req, res) {
        try {

            /* ───────────────────────────────────────────────
               MÉTRICAS PRINCIPALES
            ─────────────────────────────────────────────── */
            const [cat] = await db.query("SELECT COUNT(*) AS total FROM categories");
            const [dest] = await db.query("SELECT COUNT(*) AS total FROM destinations");
            const [serv] = await db.query("SELECT COUNT(*) AS total FROM services");
            const [evt] = await db.query("SELECT COUNT(*) AS total FROM events");
            const [usr] = await db.query("SELECT COUNT(*) AS total FROM users");


            /* ───────────────────────────────────────────────
               DESTINOS POR CATEGORÍA
            ─────────────────────────────────────────────── */
            const [destByCat] = await db.query(`
                SELECT c.name, COUNT(d.id) AS total
                FROM categories c
                LEFT JOIN destinations d ON d.category_id = c.id
                GROUP BY c.id
            `);


            /* ───────────────────────────────────────────────
               ACTIVIDAD RECIENTE (EVENTOS CREADOS)
            ─────────────────────────────────────────────── */
            const [recentAct] = await db.query(`
                SELECT DATE(created_at) AS date, COUNT(*) AS count
                FROM events
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at) DESC
                LIMIT 7
            `);


            /* ───────────────────────────────────────────────
               NUEVA MÉTRICA 1: USERS BY ROLE
            ─────────────────────────────────────────────── */
            const [usersByRole] = await db.query(`
                SELECT role, COUNT(*) AS total
                FROM users
                GROUP BY role
            `);


            /* ───────────────────────────────────────────────
               NUEVA MÉTRICA 2: CRECIMIENTO MENSUAL DE USUARIOS
            ─────────────────────────────────────────────── */
            const [growth] = await db.query(`
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                       COUNT(*) AS total
                FROM users
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            `);


            /* ───────────────────────────────────────────────
               NUEVA MÉTRICA 3: CATEGORÍAS MÁS VISITADAS
               (usa tabla "visits" si existe; si no, genera 0)
            ─────────────────────────────────────────────── */
            let [catVisits] = [];
            try {
                [catVisits] = await db.query(`
                    SELECT c.name AS category, COUNT(v.id) AS visits
                    FROM categories c
                    LEFT JOIN visits v ON v.category_id = c.id
                    GROUP BY c.id
                `);
            } catch {
                // fallback
                catVisits = destByCat.map(x => ({
                    category: x.name,
                    visits: 0
                }));
            }


            /* ───────────────────────────────────────────────
               NUEVA MÉTRICA 4: EVENTOS CREADOS VS SEGUIDOS
            ─────────────────────────────────────────────── */
            const [eventStats] = await db.query(`
                SELECT 
                    DATE_FORMAT(e.created_at, '%Y-%m') AS month,
                    COUNT(e.id) AS created,
                    (
                        SELECT COUNT(*) 
                        FROM event_follows ef
                        WHERE DATE_FORMAT(ef.created_at, '%Y-%m') = DATE_FORMAT(e.created_at, '%Y-%m')
                    ) AS followed
                FROM events e
                GROUP BY DATE_FORMAT(e.created_at, '%Y-%m')
            `);


            /* ───────────────────────────────────────────────
               NUEVA MÉTRICA 5: SERVICIOS MÁS USADOS
               (usa tabla "service_usage" si existe)
            ─────────────────────────────────────────────── */
            let [servicesPopularity] = [];
            try {
                [servicesPopularity] = await db.query(`
                    SELECT s.name, COUNT(u.id) AS used
                    FROM services s
                    LEFT JOIN service_usage u ON u.service_id = s.id
                    GROUP BY s.id
                `);
            } catch {
                // fallback seguro
                const [servicesList] = await db.query("SELECT name FROM services");
                servicesPopularity = servicesList.map(s => ({
                    name: s.name,
                    used: 0
                }));
            }


            /* ───────────────────────────────────────────────
               RESPUESTA COMPLETA
            ─────────────────────────────────────────────── */
            return res.json({
                ok: true,
                categories: cat[0].total,
                destinations: dest[0].total,
                services: serv[0].total,
                events: evt[0].total,
                users: usr[0].total,

                destinationsPerCategory: destByCat,
                recentActivity: recentAct,

                // nuevos
                usersByRole,
                userGrowth: growth,
                categoryVisits: catVisits,
                eventsStats: eventStats,
                servicesPopularity
            });

        } catch (error) {
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }
}
