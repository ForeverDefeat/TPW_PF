/**
 * @file routes/authRoutes.js
 * @description Rutas de autenticación (login, register, me).
 * @module routes/authRoutes
 */

import express from "express";
import { register, login, me } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registro de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos o email ya registrado
 */
router.post("/register", register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inicio de sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login correcto
 *       400:
 *         description: Faltan campos
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Obtiene datos del usuario actual (simulado)
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       400:
 *         description: Falta parámetro email
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/me", me);

export default router;
