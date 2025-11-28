/**
 * @file dashboardPage.js
 * @description Controlador del Dashboard del Panel Admin.
 * Renderiza tarjetas y gráficos usando Chart.js.
 */

import { apiGet } from "./adminApi.js";

export async function renderDashboard() {

    /* --------------------------------------------
       1. Obtener métricas desde backend
    -------------------------------------------- */
    let statsRaw = {};
    try {
        statsRaw = await apiGet("/dashboard/stats");
    } catch (e) {
        console.error("Error obteniendo /dashboard/stats:", e);
        return;
    }

    /* Valores base con fallback */
    const stats = {
        categories: statsRaw.categories ?? 0,
        destinations: statsRaw.destinations ?? 0,
        services: statsRaw.services ?? 0,
        events: statsRaw.events ?? 0,
        users: statsRaw.users ?? 0,

        destinationsPerCategory: statsRaw.destinationsPerCategory ?? [],
        recentActivity: statsRaw.recentActivity ?? [],
        usersByRole: statsRaw.usersByRole ?? [],
        userGrowth: statsRaw.userGrowth ?? [],
        categoryVisits: statsRaw.categoryVisits ?? [],
        eventsStats: statsRaw.eventsStats ?? [],
        servicesPopularity: statsRaw.servicesPopularity ?? []
    };

    /* --------------------------------------------
       2. Insertar métricas en tarjetas
    -------------------------------------------- */
    document.getElementById("statCategories").textContent = stats.categories;
    document.getElementById("statDestinations").textContent = stats.destinations;
    document.getElementById("statServices").textContent = stats.services;
    document.getElementById("statEvents").textContent = stats.events;
    document.getElementById("statUsers").textContent = stats.users;



    /* --------------------------------------------
       FUNCIÓN ÚTIL PARA EVITAR CRASHES
    -------------------------------------------- */
    const safeGetCanvas = (id) => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`⚠ Canvas #${id} no existe en el DOM.`);
        }
        return el;
    };

    /* --------------------------------------------
       FUNCIÓN PARA EVITAR GRAFICOS VACÍOS
    -------------------------------------------- */
    const hasData = (arr) => Array.isArray(arr) && arr.length > 0;



    /* --------------------------------------------
       3. Gráfico: Destinos por categoría (Bar)
    -------------------------------------------- */
    const ctx1 = safeGetCanvas("chartDestinationsPerCategory");
    if (ctx1 && hasData(stats.destinationsPerCategory)) {
        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: stats.destinationsPerCategory.map(x => x.name),
                datasets: [{
                    label: "Destinos por categoría",
                    data: stats.destinationsPerCategory.map(x => x.total),
                    backgroundColor: "rgba(37, 99, 235, 0.5)",
                    borderColor: "rgba(37, 99, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }



    /* --------------------------------------------
       4. Gráfico: Actividad reciente (Línea)
    -------------------------------------------- */
    const ctx2 = safeGetCanvas("chartRecentActivity");
    if (ctx2 && hasData(stats.recentActivity)) {
        new Chart(ctx2, {
            type: "line",
            data: {
                labels: stats.recentActivity.map(x => x.date),
                datasets: [{
                    label: "Eventos creados",
                    data: stats.recentActivity.map(x => x.count),
                    tension: 0.3,
                    borderWidth: 2,
                    borderColor: "rgba(16,185,129,1)",
                    backgroundColor: "rgba(16,185,129,0.25)"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }



    /* --------------------------------------------
       5. Gráfico: Usuarios por tipo (Pie)
    -------------------------------------------- */
    const ctxUsersRole = safeGetCanvas("chartUsersByRole");
    if (ctxUsersRole && hasData(stats.usersByRole)) {
        new Chart(ctxUsersRole, {
            type: "pie",
            data: {
                labels: stats.usersByRole.map(r => r.role),
                datasets: [{
                    data: stats.usersByRole.map(r => r.total),
                    backgroundColor: [
                        "rgba(37,99,235,0.6)",
                        "rgba(16,185,129,0.6)"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }



    /* --------------------------------------------
       6. Gráfico: Crecimiento mensual usuarios
    -------------------------------------------- */
    const ctxGrowth = safeGetCanvas("chartUserGrowth");
    if (ctxGrowth && hasData(stats.userGrowth)) {
        new Chart(ctxGrowth, {
            type: "line",
            data: {
                labels: stats.userGrowth.map(x => x.month),
                datasets: [{
                    label: "Usuarios registrados",
                    data: stats.userGrowth.map(x => x.total),
                    borderWidth: 2,
                    borderColor: "rgba(99,102,241,1)",
                    backgroundColor: "rgba(99,102,241,0.25)",
                    tension: 0.3
                }]
            },
           options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }



    /* --------------------------------------------
       7. Gráfico: Categorías más visitadas (Doughnut)
    -------------------------------------------- */
    const ctxCatVisits = safeGetCanvas("chartCategoryVisits");
    if (ctxCatVisits && hasData(stats.categoryVisits)) {
        new Chart(ctxCatVisits, {
            type: "doughnut",
            data: {
                labels: stats.categoryVisits.map(c => c.category),
                datasets: [{
                    data: stats.categoryVisits.map(c => c.visits),
                    backgroundColor: [
                        "rgba(59,130,246,0.6)",
                        "rgba(16,185,129,0.6)",
                        "rgba(239,68,68,0.6)"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }


    /* --------------------------------------------
       8. Gráfico: Eventos creados vs seguidos (Combinado)
    -------------------------------------------- */
    /* const ctxCombined = safeGetCanvas("chartEventsCombined");
    if (ctxCombined && hasData(stats.eventsStats)) {
        new Chart(ctxCombined, {
            type: "bar",
            data: {
                labels: stats.eventsStats.map(e => e.month),
                datasets: [
                    {
                        type: "bar",
                        label: "Eventos creados",
                        data: stats.eventsStats.map(e => e.created),
                        backgroundColor: "rgba(16,185,129,0.6)"
                    },
                    {
                        type: "line",
                        label: "Eventos seguidos",
                        data: stats.eventsStats.map(e => e.followed),
                        borderColor: "rgba(37,99,235,1)",
                        backgroundColor: "rgba(37,99,235,0.25)",
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } */


    /* --------------------------------------------
       9. Gráfico: Servicios más usados
    -------------------------------------------- */
    const ctxServices = safeGetCanvas("chartServicePopularity");
    if (ctxServices && hasData(stats.servicesPopularity)) {
        new Chart(ctxServices, {
            type: "bar",
            data: {
                labels: stats.servicesPopularity.map(s => s.name),
                datasets: [{
                    label: "Uso de servicio",
                    data: stats.servicesPopularity.map(s => s.used),
                    backgroundColor: "rgba(99,102,241,0.5)",
                    borderColor: "rgba(99,102,241,1)",
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                devicePixelRatio: 2,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

}
