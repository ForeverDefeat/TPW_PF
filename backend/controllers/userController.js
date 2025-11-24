/**
 * @file controllers/userController.js
 * @description Controlador HTTP para la gestión CRUD de usuarios.
 * Este módulo utiliza UserService para realizar la lógica de negocio.
 */

import { validationResult } from "express-validator";
import { UserService } from "../services/UserService.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema (CRUD educativo).
 */

export class UserController {

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Obtener lista de usuarios
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Lista de usuarios
   */
  static async getAll(req, res) {
    try {
      const data = await UserService.getAllUsers();
      return res.json({ ok: true, data });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Obtener un usuario por ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *       404:
   *         description: Usuario no existe
   */
  static async getById(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
      }

      return res.json({ ok: true, data: user });

    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Crear un nuevo usuario
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       201:
   *         description: Usuario creado correctamente
   *       400:
   *         description: Datos inválidos o email ya registrado
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const id = await UserService.createUser(req.body);

      return res.status(201).json({
        ok: true,
        message: "Usuario creado correctamente",
        id
      });

    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Actualizar un usuario existente
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdate'
   *     responses:
   *       200:
   *         description: Usuario actualizado correctamente
   *       404:
   *         description: Usuario no encontrado
   */
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const id = parseInt(req.params.id);

      const updated = await UserService.updateUser(id, req.body);

      if (!updated) {
        return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
      }

      return res.json({
        ok: true,
        message: "Usuario actualizado correctamente"
      });

    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Eliminar un usuario
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuario eliminado correctamente
   *       404:
   *         description: Usuario no encontrado
   */
  static async delete(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const id = parseInt(req.params.id);

      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
      }

      return res.json({
        ok: true,
        message: "Usuario eliminado correctamente"
      });

    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }
}
