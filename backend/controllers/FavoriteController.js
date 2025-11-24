/**
 * @file controllers/favoriteController.js
 * @description Controlador para la gestión de destinos favoritos de los usuarios.
 * Recibe solicitudes HTTP, aplica validaciones y delega la lógica al FavoriteService.
 */

import { validationResult } from "express-validator";
import { FavoriteService } from "../services/FavoriteService.js";

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Gestión de destinos favoritos del usuario
 */

export class FavoriteController {

    /**
     * @swagger
     * /api/favorites/user/{id}:
     *   get:
     *     summary: Obtener la lista de destinos favoritos de un usuario
     *     tags: [Favorites]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del usuario
     *     responses:
     *       200:
     *         description: Lista de destinos favoritos obtenida correctamente
     */
    static async getByUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const data = await FavoriteService.getByUser(userId);

            return res.json({
                ok: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/favorites:
     *   post:
     *     summary: Agregar un destino a la lista de favoritos del usuario
     *     tags: [Favorites]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FavoriteInput'
     *     responses:
     *       201:
     *         description: Favorito agregado correctamente
     *       400:
     *         description: Error de validación o destino ya marcado como favorito
     */
    static async create(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    ok: false,
                    errors: errors.array()
                });
            }

            const { user_id, destination_id } = req.body;

            const id = await FavoriteService.create(user_id, destination_id);

            return res.status(201).json({
                ok: true,
                message: "Destino agregado a favoritos correctamente",
                id
            });

        } catch (error) {
            return res.status(400).json({
                ok: false,
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/favorites/{id}:
     *   delete:
     *     summary: Eliminar un destino de la lista de favoritos
     *     tags: [Favorites]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del registro favorites
     *     responses:
     *       200:
     *         description: Favorito eliminado correctamente
     *       404:
     *         description: Favorito no encontrado
     */
    static async delete(req, res) {
        try {
            const favoriteId = parseInt(req.params.id);

            await FavoriteService.delete(favoriteId);

            return res.json({
                ok: true,
                message: "Destino eliminado de favoritos correctamente"
            });

        } catch (error) {
            return res.status(404).json({
                ok: false,
                error: error.message
            });
        }
    }
}
