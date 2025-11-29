import { getDashboardStats } from "../api.js";

document.addEventListener("componentsLoaded", async () => {

    const totalsSection = document.getElementById("totalsSection");
    if (!totalsSection) return console.warn("totalsSection no encontrado");

    try {
        const stats = await getDashboardStats();

        if (!stats.destinationsPerCategory) throw new Error("destinationsPerCategory faltante");

        totalsSection.innerHTML = stats.destinationsPerCategory.map(cat => `
            <div class="box">
                <h4>${cat.name}</h4>
                <p>Total: <span>${cat.total}</span></p>
            </div>
        `).join("");

        console.log("✔ Totales cargados:", stats.destinationsPerCategory);

    } catch (err) {
        console.error("❌ Error cargando totales:", err);
    }
});
