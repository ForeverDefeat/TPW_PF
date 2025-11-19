// controllers/destinationController.js
import Destination from "../models/Destination.js";

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
        const { title, category, description, image } = req.body;

        await Destination.create(title, category, description, image);

        res.json({ ok: true, message: "Destino añadido" });
    } catch (err) {
        console.error("Error agregando destino:", err);
        res.status(500).json({ ok: false, message: "Error del servidor" });
    }
}

