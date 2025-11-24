/**
 * @file validations/eventsFollowedValidator.js
 * @description Validaciones para el módulo de eventos seguidos por los usuarios.
 * Se encarga de asegurar que los datos enviados por el cliente
 * cumplan con los formatos correctos antes de llegar al controlador.
 */

import { body, param } from "express-validator";

/**
 * Validación para seguir un evento.
 *
 * @constant
 * @type {Array}
 */
export const createFollowValidator = [

    body("user_id")
        .isInt({ min: 1 })
        .withMessage("El campo 'user_id' es obligatorio y debe ser un número entero válido"),

    body("event_id")
        .isInt({ min: 1 })
        .withMessage("El campo 'event_id' es obligatorio y debe ser un número entero válido"),
];

/**
 * Validación para eliminar un registro de evento seguido.
 * Se valida el parámetro 'id' del path.
 *
 * @constant
 * @type {Array}
 */
export const deleteFollowValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El parámetro 'id' debe ser un número entero válido"),
];
