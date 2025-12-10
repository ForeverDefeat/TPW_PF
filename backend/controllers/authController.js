/**
 * @file controllers/authController.js
 * @description Controlador de autenticación (register, login, me)
 */

import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

/* ============================================================
   REGISTER
   ============================================================ */
export const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos obligatorios"
            });
        }

        // Verificar email único
        const [exists] = await db.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (exists.length > 0) {
            return res.status(400).json({
                ok: false,
                message: "El email ya está registrado"
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
            [full_name, email, hashed]
        );

        res.status(201).json({
            ok: true,
            message: "Usuario registrado correctamente",
            user_id: result.insertId
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ ok: false, message: "Error en el servidor" });
    }
};


/* ============================================================
   LOGIN
   ============================================================ */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos"
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                ok: false,
                message: "Usuario no encontrado"
            });
        }

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                ok: false,
                message: "Contraseña incorrecta"
            });
        }

        // 🔥 IMPORTANTE: devolver user.id para guardarlo en localStorage
        res.json({
            ok: true,
            message: "Login correcto",
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ ok: false, message: "Error en el servidor" });
    }
};


/* ============================================================
   ME (simulado)
   ============================================================ */
export const me = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ ok: false, message: "Email requerido" });
        }

        const [rows] = await db.query(
            "SELECT id, full_name, email, role FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        }

        res.json({ ok: true, user: rows[0] });

    } catch (error) {
        console.error("ME ERROR:", error);
        res.status(500).json({ ok: false, message: "Error en el servidor" });
    }
};
