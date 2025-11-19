import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();   // ← IMPORTANTE: esto va ANTES de app.use()

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";

app.use("/api", authRoutes);
app.use("/api", destinationRoutes);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});
