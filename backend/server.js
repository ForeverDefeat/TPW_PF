/**
 * @file server.js
 * @description Servidor principal del Portal de Turismo.
 *              Compatible con Express 5 + SPA para Admin + API REST.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ===============================
// Importación de rutas API
// ===============================
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceTypeRoutes from "./routes/serviceTypeRoutes.js";
import destinationServiceRoutes from "./routes/destinationServiceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import eventsFollowedRoutes from "./routes/eventsFollowedRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

// Swagger
import { swaggerDocs } from "./config/swagger.js";

// ===============================
// Inicialización
// ===============================
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del frontend
const FRONTEND_PATH = path.join(__dirname, "../frontend");

// ===============================
// Middleware global
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// SERVIR ARCHIVOS ESTÁTICOS
// ===============================

// Sitio público
app.use(express.static(FRONTEND_PATH));

// Archivos REALES del panel admin (JS, CSS, HTML, assets)
app.use("/admin", express.static(path.join(FRONTEND_PATH, "admin")));

// Carpeta de imágenes subidas
app.use("/uploads", express.static("uploads"));

// ===============================
// RUTAS API
// ===============================
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-types", serviceTypeRoutes);
app.use("/api/destination-services", destinationServiceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/events-followed", eventsFollowedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/upload", uploadRoutes);

// ===============================
// SPA DEL PANEL ADMIN (EXPRESS 5 — FIX DEFINITIVO)
// ===============================

// Cualquier ruta bajo /admin/ que NO sea archivo → cargar index.html
app.get(/^\/admin(\/.*)?$/, (req, res, next) => {
    // Si tiene extensión (.js, .css, .png, .html...) → permitir static
    if (path.extname(req.path)) return next();

    res.sendFile(path.join(FRONTEND_PATH, "admin/index.html"));
});

// ===============================
// SPA DEL SITIO PÚBLICO
// ===============================
app.get(/^\/(?!api|uploads|admin).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// ===============================
// Swagger
// ===============================
swaggerDocs(app);

// ===============================
// Servidor ON
// ===============================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
