/**
 * @file dashboardPage.js
 * @description Controlador de la página Dashboard del Panel Admin.
 *              Carga métricas generales del sistema y renderiza gráficos
 *              mediante Chart.js.
 *
 * @module dashboardPage
 */

import { apiGet } from "./adminApi.js";

/* ===========================================================================
   RENDERIZAR DASHBOARD
   =========================================================================== */

/**
 * Renderiza el Dashboard administrativo:
 *
 * 1.   Obtiene métricas globales desde `/dashboard/stats`.  
 * 2.   Inserta esos valores en las tarjetas estadísticas.  
 * 3.   Dibuja dos gráficos mediante Chart.js:
 *        - Destinos por categoría (gráfico de barras)
 *        - Actividad reciente (gráfico de línea)
 *
 * @async
 * @function renderDashboard
 *
 * @example
 * import { renderDashboard } from "./dashboardPage.js";
 * renderDashboard();
 */
export async function renderDashboard() {

    /* -----------------------------------------------------------------------
       1. Obtener métricas desde backend
       ----------------------------------------------------------------------- */
    const statsRaw = await apiGet("/dashboard/stats");

    const stats = {
        categories: statsRaw.categories ?? 0,
        destinations: statsRaw.destinations ?? 0,
        services: statsRaw.services ?? 0,
        events: statsRaw.events ?? 0,
        users: statsRaw.users ?? 0,

        // Arrays que deben existir
        destinationsPerCategory: Array.isArray(statsRaw.destinationsPerCategory)
            ? statsRaw.destinationsPerCategory
            : [],

        recentActivity: Array.isArray(statsRaw.recentActivity)
            ? statsRaw.recentActivity
            : []
    };

    /* -----------------------------------------------------------------------
   2. Insertar valores en las tarjetas
   ----------------------------------------------------------------------- */

    document.getElementById("statCategories").textContent = stats.categories;
    document.getElementById("statDestinations").textContent = stats.destinations;
    document.getElementById("statServices").textContent = stats.services;
    document.getElementById("statEvents").textContent = stats.events;
    document.getElementById("statUsers").textContent = stats.users;



    /* -----------------------------------------------------------------------
       GRÁFICO: Destinos por categoría (Barras)
       ----------------------------------------------------------------------- */

    /**
     * @type {HTMLCanvasElement}
     */
    const ctx1 = document.getElementById("chartDestinationsPerCategory");

    new Chart(ctx1, {
        type: "bar",
        data: {
            labels: stats.destinationsPerCategory.map(x => x.name),
            datasets: [
                {
                    label: "Destinos por categoría",
                    data: stats.destinationsPerCategory.map(x => x.total),
                    backgroundColor: "rgba(37, 99, 235, 0.5)", // azul suave
                    borderColor: "rgba(37, 99, 235, 1)",
                    borderWidth: 1
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

    /* -----------------------------------------------------------------------
       GRÁFICO: Actividad reciente (Línea)
       ----------------------------------------------------------------------- */

    /**
     * @type {HTMLCanvasElement}
     */
    const ctx2 = document.getElementById("chartRecentActivity");

    new Chart(ctx2, {
        type: "line",
        data: {
            labels: stats.recentActivity.map(x => x.date),
            datasets: [
                {
                    label: "Eventos creados",
                    data: stats.recentActivity.map(x => x.count),
                    tension: 0.3,        // curva suave
                    borderWidth: 2,
                    borderColor: "rgba(16, 185, 129, 1)", // verde
                    backgroundColor: "rgba(16, 185, 129, 0.25)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: 2 // <--- importante
        }
    });
}
