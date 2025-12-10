/**
 * @file middlewares/upload.js
 * @description Middleware Multer con:
 *  - Detección de archivos duplicados (hash SHA256)
 *  - Evita guardar imágenes repetidas en /uploads
 *  - Guarda nombres únicos solo cuando es necesario
 */

import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ============================================================
// 1. Crear carpeta /uploads si no existe
// ============================================================
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ============================================================
// 2. Función para generar hash SHA256 del archivo
// ============================================================
function generateFileHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// ============================================================
// 3. Configuración Multer — usamos memoryStorage
// Esto permite leer el archivo *antes* de guardarlo
// ============================================================
const storage = multer.memoryStorage();

// ============================================================
// 4. Filtro de tipos permitidos
// ============================================================
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Tipo de archivo no permitido. Solo JPG, PNG o WEBP."));
  }
  cb(null, true);
}

// ============================================================
// 5. Inicializar Multer
// ============================================================
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ============================================================
// 6. Middleware final para guardar evitando duplicados
// ============================================================
export function saveUploadedFiles(req, res, next) {
  if (!req.files) return next();

  for (const field in req.files) {
    req.files[field].forEach(file => {
      const ext = path.extname(file.originalname).toLowerCase();

      // Hash del archivo
      const hash = generateFileHash(file.buffer);
      const finalName = `${hash}${ext}`;
      const finalPath = path.join(uploadDir, finalName);

      // Verificar si ya existe una imagen igual
      if (!fs.existsSync(finalPath)) {
        // Guardar solo si NO existe
        fs.writeFileSync(finalPath, file.buffer);
        console.log(`Imagen nueva guardada: ${finalName}`);
      } else {
        console.log(`Imagen duplicada detectada, NO se guardó: ${finalName}`);
      }

      // Modificar file para que Multer devuelva la ruta correcta
      file.filename = finalName;
      file.path = finalPath;
    });
  }

  next();
}
