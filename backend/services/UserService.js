/**
 * @file services/UserService.js
 * @description Capa de lógica de negocio para la gestión de usuarios.
 * Aquí se valida la información y se coordinan las operaciones antes de
 * interactuar con el UserRepository. Este módulo NO implementa seguridad
 * avanzada (sin JWT / bcrypt), ya que el proyecto es académico.
 */

import { UserRepository } from "../repositories/UserRepository.js";

export class UserService {

  /**
   * Obtener todos los usuarios del sistema.
   *
   * @async
   * @returns {Promise<Array>} Lista de usuarios.
   */
  static async getAllUsers() {
    return await UserRepository.getAll();
  }

  /**
   * Obtener un usuario por ID.
   *
   * @async
   * @param {number} id - ID del usuario.
   * @returns {Promise<Object|null>} Usuario encontrado o null.
   */
  static async getUserById(id) {
    return await UserRepository.getById(id);
  }

  /**
   * Crear un nuevo usuario.
   * (Proyecto educativo: password sin encriptación)
   *
   * @async
   * @param {Object} data
   * @param {string} data.fullName
   * @param {string} data.email
   * @param {string} data.password
   * @param {"user"|"admin"} data.role
   * @returns {Promise<number>} ID del usuario creado.
   * @throws {Error} Si el email ya está registrado.
   */
  static async createUser(data) {
    // Validación: Correo único
    const exists = await UserRepository.findByEmail(data.email);
    if (exists) {
      throw new Error("El email ya está registrado en el sistema.");
    }

    return await UserRepository.create(data);
  }

  /**
   * Actualizar los datos de un usuario.
   *
   * @async
   * @param {number} id - ID del usuario.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<boolean>} true si se actualizó correctamente.
   * @throws {Error} Si el usuario no existe.
   */
  static async updateUser(id, data) {
    // Validar existencia
    const exists = await UserRepository.exists(id);
    if (!exists) {
      throw new Error("El usuario no existe.");
    }

    return await UserRepository.update(id, data);
  }

  /**
   * Eliminar un usuario del sistema.
   *
   * @async
   * @param {number} id - ID del usuario.
   * @returns {Promise<boolean>} true si se eliminó correctamente.
   * @throws {Error} Si el usuario no existe.
   */
  static async deleteUser(id) {
    const exists = await UserRepository.exists(id);
    if (!exists) {
      throw new Error("El usuario no existe.");
    }

    return await UserRepository.delete(id);
  }
}
