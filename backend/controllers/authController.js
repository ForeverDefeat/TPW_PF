/**
 * @file controllers/authController.js
 * @description Controlador HTTP para autenticación (login / register / me).
 * @module controllers/authController
 */

import { UserRepository } from "../repositories/UserRepository.js";

/**
 * @typedef {Object} RegisterRequestBody
 * @property {string} full_name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginRequestBody
 * @property {string} email
 * @property {string} password
 */

/**
 * POST /api/auth/register
 * Registra un nuevo usuario con rol "user".
 */
export const register = async (req, res) => {
  try {
    /** @type {RegisterRequestBody} */
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "fullName, email y password son obligatorios",
      });
    }

    // ¿ya existe?
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        ok: false,
        message: "El email ya está registrado",
      });
    }

    const id = await UserRepository.create({
      full_name,
      email,
      password, // ⚠ texto plano solo para entorno académico
      role: "user",
    });

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      user: {
        id,
        full_name,
        email,
        role: "user",
      },
    });
  } catch (err) {
    console.error("Error en register:", err);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor en registro",
    });
  }
};

/**
 * POST /api/auth/login
 * Inicia sesión comparando email + password en texto plano.
 */
export const login = async (req, res) => {
  try {
    /** @type {LoginRequestBody} */
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "email y password son obligatorios",
      });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas",
      });
    }

    // En un sistema real aquí se generaría un JWT
    return res.json({
      ok: true,
      message: "Login correcto",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor en login",
    });
  }
};

/**
 * GET /api/auth/me
 * Endpoint de ejemplo estilo "me".
 * Por ahora NO usa JWT, solo acepta ?email=...
 * (sirve para pruebas y para mostrar el patrón).
 */
export const me = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        ok: false,
        message: "Parámetro 'email' requerido (por ahora sin JWT)",
      });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    return res.json({
      ok: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error en me:", err);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor en /me",
    });
  }
};
