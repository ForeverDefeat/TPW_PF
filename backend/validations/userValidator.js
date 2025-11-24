/**
 * @file validations/userValidator.js
 * @description Validaciones para el módulo de usuarios.
 * Se utiliza express-validator para asegurar que los datos enviados por el
 * cliente cumplan con los formatos requeridos antes de llegar al controlador.
 */

import { body, param } from "express-validator";

/**
 * Validación para crear un nuevo usuario.
 *
 * @constant
 * @type {Array}
 */
export const createUserValidator = [

  body("full_name")
    .notEmpty()
    .withMessage("El campo 'fullName' es obligatorio.")
    .isString()
    .withMessage("El campo 'fullName' debe ser una cadena de texto."),

  body("email")
    .notEmpty()
    .withMessage("El campo 'email' es obligatorio.")
    .isEmail()
    .withMessage("Debe proporcionar un email válido."),

  body("password")
    .notEmpty()
    .withMessage("El campo 'password' es obligatorio.")
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener al menos 4 caracteres."),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("El campo 'role' debe ser 'admin' o 'user'."),
];

/**
 * Validación para actualizar un usuario existente.
 *
 * @constant
 * @type {Array}
 */
export const updateUserValidator = [

  param("id")
    .isInt({ min: 1 })
    .withMessage("El parámetro 'id' debe ser un número entero válido."),

  body("full_name")
    .optional()
    .isString()
    .withMessage("El campo 'fullName' debe ser una cadena de texto."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Debe proporcionar un email válido."),

  body("password")
    .optional()
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener al menos 4 caracteres."),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("El campo 'role' debe ser 'admin' o 'user'."),
];

/**
 * Validación para eliminar un usuario.
 *
 * @constant
 * @type {Array}
 */
export const deleteUserValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El parámetro 'id' debe ser un número entero válido."),
];

/**
 * Validación para obtener un usuario por ID.
 *
 * @constant
 * @type {Array}
 */
export const getUserByIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El parámetro 'id' debe ser un número entero válido."),
];
