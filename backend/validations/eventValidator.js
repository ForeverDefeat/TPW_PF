/**
 * @file validations/eventValidator.js
 * @description Conjunto de validaciones para el módulo de eventos turísticos.
 * Estas validaciones aseguran que los datos enviados desde el cliente
 * cumplan con los formatos correctos antes de pasar al controlador.
 */

import { body } from "express-validator";

/**
 * Validación para la creación de un evento.
 *
 * @constant
 * @type {Array}
 */
export const createEventValidator = [
    body("destination_id")
        .isInt({ min: 1 })
        .withMessage("El campo 'destination_id' es obligatorio y debe ser un número entero válido"),

    body("title")
        .notEmpty()
        .withMessage("El campo 'title' es obligatorio"),

    body("date")
        .isISO8601()
        .withMessage("El campo 'date' debe tener un formato válido YYYY-MM-DD"),

    body("description")
        .optional()
        .isString()
        .withMessage("El campo 'description' debe ser una cadena de texto"),

    body("location")
        .optional()
        .isString()
        .withMessage("El campo 'location' debe ser una cadena de texto"),

    body("image_url")
        .optional()
        .isURL()
        .withMessage("El campo 'image_url' debe ser una URL válida"),
];

/**
 * Validación para actualizar un evento.
 *
 * @constant
 * @type {Array}
 */
export const updateEventValidator = [
    body("date")
        .optional()
        .isISO8601()
        .withMessage("El campo 'date' debe tener un formato válido YYYY-MM-DD"),

    body("title")
        .optional()
        .isString()
        .withMessage("El campo 'title' debe ser una cadena de texto"),

    body("description")
        .optional()
        .isString()
        .withMessage("El campo 'description' debe ser una cadena de texto"),

    body("location")
        .optional()
        .isString()
        .withMessage("El campo 'location' debe ser una cadena de texto"),

    body("image_url")
        .optional()
        .isURL()
        .withMessage("El campo 'image_url' debe ser una URL válida"),
];
