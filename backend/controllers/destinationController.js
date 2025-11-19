// controllers/destinationController.js
import Destination from "../models/Destination.js";
import { db } from "../config/db.js";


export async function getDestinations(req, res) {
    try {
        const data = await Destination.getAll();
        res.json(data);
    } catch (err) {
        console.error("Error obteniendo destinos:", err);
        res.status(500).json({ ok: false, message: "Error del servidor" });
    }
}

export async function addDestination(req, res) {
    try {
        const { name, category, description, imageUrl } = req.body;

        await Destination.create(name, category, description, imageUrl);

        res.json({ ok: true, message: "Destino añadido" });
    } catch (err) {
        console.error("Error agregando destino:", err);
        res.status(500).json({ ok: false, message: "Error del servidor" });
    }
}

export async function getCategoryCounts(req, res) {
    try {
        const [rows] = await db.query(`
            SELECT category, COUNT(*) AS total
            FROM destinations
            GROUP BY category
        `);

        res.json({
            ok: true,
            counts: rows
        });

    } catch (err) {
        console.error("Error obteniendo conteos:", err);
        res.status(500).json({ ok: false, message: "Error del servidor" });
    }
}

export const searchDestinations = async (req, res) => {
    try {
        const q = req.query.q?.toLowerCase() || "";

        const destinations = await Destination.getAll();

        const filtered = destinations.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q)
        );

        res.json({ ok: true, results: filtered });

    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
};

