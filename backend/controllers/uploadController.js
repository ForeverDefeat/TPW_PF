/**
 * @file controllers/uploadController.js
 * @description Controlador responsable de manejar la subida de imágenes al servidor.
 *              Recibe el archivo procesado por Multer y devuelve la URL pública.
 * @module UploadController
 */

export class UploadController {

  /**
   * @swagger
   * /api/upload/image:
   *   post:
   *     summary: Subir una imagen al servidor
   *     tags: [Upload]
   *     consumes:
   *       - multipart/form-data
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Imagen subida correctamente
   *       400:
   *         description: Archivo no válido
   *       500:
   *         description: Error interno
   */
  static uploadImage(req, res) {
    try {
      // Si no existe archivo, Multer NO recibió nada
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          message: "No se subió ninguna imagen o el archivo es inválido."
        });
      }

      // Validar MIME permitido (más seguridad)
      const allowedMime = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedMime.includes(req.file.mimetype)) {
        return res.status(400).json({
          ok: false,
          message: "Formato inválido. Solo se permiten JPG, PNG o WEBP."
        });
      }

      // Construir URL completa
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      return res.status(200).json({
        ok: true,
        message: "Imagen subida correctamente",
        filename: req.file.filename,
        url: fileUrl
      });

    } catch (err) {
      console.error("❌ Error al subir imagen:", err);

      return res.status(500).json({
        ok: false,
        message: "Error interno del servidor al procesar la imagen",
        error: err.message
      });
    }
  }
}
