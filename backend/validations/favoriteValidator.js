/**
 * @file validations/favoriteValidator.js
 * @description Validaciones para la gestión de destinos favoritos del usuario.
 * Se aplica express-validator para asegurar que los datos enviados
 * desde el cliente cumplan con los formatos requeridos.
 */

import { body, param } from "express-validator";

/**
 * Validación para agregar un destino a favoritos.
 *
 * @constant
 * @type {Array}
 */
export const createFavoriteValidator = [

    body("user_id")
        .isInt({ min: 1 })
        .withMessage("El campo 'user_id' es obligatorio y debe ser un número entero válido"),

    body("destination_id")
        .isInt({ min: 1 })
        .withMessage("El campo 'destination_id' es obligatorio y debe ser un número entero válido"),
];

/**
 * Validación para eliminar un favorito.
 * Solo valida el ID del registro favorites.
 *
 * @constant
 * @type {Array}
 */
export const deleteFavoriteValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El parámetro 'id' debe ser un número entero válido"),
];
