/**
 * @file repositories/UserRepository.js
 * @description Capa de persistencia para la entidad User.
 * Aquí se realizan las consultas SQL directas usando el pool `db`.
 * Este módulo implementa todas las operaciones necesarias para un CRUD
 * educativo de usuarios (sin seguridad avanzada).
 */

import { db } from "../config/db.js";
import { User } from "../models/User.js";

export class UserRepository {

  /**
   * Buscar un usuario por email.
   * Usado por: authController (login, register)
   *
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT id, full_name, email, password, role 
       FROM users 
       WHERE email = ?`,
      [email]
    );

    if (!rows.length) return null;
    return User.fromRow(rows[0]);
  }

  /**
   * Crear un nuevo usuario.
   *
   * @param {Object} data
   * @param {string} data.full_name
   * @param {string} data.email
   * @param {string} data.password
   * @param {"admin"|"user"} data.role
   * @returns {Promise<number>} ID insertado
   */
  static async create(data) {
    const { full_name, email, password, role = "user" } = data;

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, password, role]
    );

    return result.insertId;
  }

  /**
   * Obtener lista completa de usuarios.
   *
   * @returns {Promise<User[]>}
   */
  static async getAll() {
    const [rows] = await db.query(
      `SELECT id, full_name, email, password, role 
       FROM users`
    );

    return rows.map(row => User.fromRow(row));
  }

  /**
   * Obtener un usuario por ID.
   *
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT id, full_name, email, password, role 
       FROM users 
       WHERE id = ?`,
      [id]
    );

    if (!rows.length) return null;
    return User.fromRow(rows[0]);
  }

  /**
   * Actualizar un usuario por ID.
   *
   * @param {number} id
   * @param {Object} data
   * @param {string} [data.full_name]
   * @param {string} [data.email]
   * @param {string} [data.password]
   * @param {"admin"|"user"} [data.role]
   * @returns {Promise<boolean>} true si se actualizó correctamente
   */
  static async update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    // Sin campos → no actualizar
    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await db.query(
      `UPDATE users 
       SET ${fields.join(", ")} 
       WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Eliminar un usuario por su ID.
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Verificar si existe un usuario por ID.
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async exists(id) {
    const [rows] = await db.query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );
    return rows.length > 0;
  }
}
