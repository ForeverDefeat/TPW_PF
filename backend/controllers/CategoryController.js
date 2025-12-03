/**
 * @file controllers/CategoryController.js
 * @description Controlador HTTP para la entidad Category con soporte para subida de imágenes.
 * @module controllers/CategoryController
 */

import { CategoryService } from "../services/CategoryService.js";

export class CategoryController {

    /**
     * GET /api/categories
     * Obtiene todas las categorías.
     */
    static async getAll(req, res) {
        try {
            const categories = await CategoryService.getAll();
            res.json({ ok: true, categories });
        } catch (err) {
            res.status(500).json({ ok: false, message: err.message });
        }
    }

    /**
     * GET /api/categories/:id
     */
    static async getById(req, res) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id))
                return res.status(400).json({ ok: false, message: "ID inválido" });

            const category = await CategoryService.getById(id);
            res.json({ ok: true, category });

        } catch (err) {
            if (err.message === "Categoría no encontrada")
                return res.status(404).json({ ok: false, message: err.message });

            res.status(500).json({ ok: false, message: err.message });
        }
    }

    /**
     * POST /api/categories
     * Crea una categoría con soporte para subir imagen.
     */
    static async create(req, res) {
        try {
            const { name, description } = req.body;

            // Si se subió una imagen → guardamos su URL pública
            const image_url = req.file
                ? `/uploads/${req.file.filename}`  // <-- Multer genera filename único
                : null;

            const created = await CategoryService.create({
                name,
                description,
                image_url
            });

            res.status(201).json({
                ok: true,
                message: "Categoría creada",
                category: created
            });

        } catch (err) {
            res.status(400).json({ ok: false, message: err.message });
        }
    }

    /**
     * PUT /api/categories/:id
     * Actualiza una categoría con soporte para reemplazar imagen si se envía una nueva.
     */
    static async update(req, res) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id))
                return res.status(400).json({ ok: false, message: "ID inválido" });

            // Leer campos enviados
            const { name, description } = req.body;

            // Si se subió una nueva imagen → usarla. Si no, dejar undefined para no reemplazar.
            const image_url = req.file
                ? `/uploads/${req.file.filename}`
                : undefined;  // esto permite conservar la existente

            const updated = await CategoryService.update(id, {
                name,
                description,
                image_url
            });

            res.json({
                ok: true,
                message: "Categoría actualizada",
                category: updated
            });

        } catch (err) {
            if (err.message === "Categoría no encontrada")
                return res.status(404).json({ ok: false, message: err.message });

            res.status(400).json({ ok: false, message: err.message });
        }
    }

    /**
     * DELETE /api/categories/:id
     */
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);

            if (isNaN(id))
                return res.status(400).json({ ok: false, message: "ID inválido" });

            await CategoryService.delete(id);

            res.json({
                ok: true,
                message: "Categoría eliminada"
            });

        } catch (err) {
            if (err.message === "Categoría no encontrada")
                return res.status(404).json({ ok: false, message: err.message });

            res.status(500).json({ ok: false, message: err.message });
        }
    }

    /* static async getBySlug(req, res) {
        try {
            const { slug } = req.params;
            const category = await CategoryRepository.getBySlug(slug);

            if (!category) {
                return res.status(404).json({ ok: false, message: "Categoría no encontrada" });
            }

            res.json(category);

        } catch (err) {
            console.error("Error getBySlug:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }
 */

    static async getBySlug(req, res) {
        try {
            const { slug } = req.params;

            if (!slug)
                return res.status(400).json({ ok: false, message: "Slug requerido" });

            const category = await CategoryService.getBySlug(slug);

            if (!category)
                return res.status(404).json({ ok: false, message: "Categoría no encontrada" });

            res.json({ ok: true, category });

        } catch (err) {
            console.error("Error getBySlug:", err);
            res.status(500).json({ ok: false, message: "Error interno" });
        }
    }

}
