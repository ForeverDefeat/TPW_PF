/**
 * @file middlewares/upload.js
 * @description Middleware para manejar subida de imágenes usando Multer.
 * Guarda archivos en /uploads y valida tipo + tamaño.
 */

import multer from "multer";
import fs from "fs";
import path from "path";

// Crear carpeta /uploads si no existe
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

// Validación de tipo de archivo
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo JPG, PNG o WEBP."), false);
  }
}

// Tamaño máximo: 5 MB
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});
