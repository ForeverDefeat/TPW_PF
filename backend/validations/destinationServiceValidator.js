/**
 * @file validations/destinationServiceValidator.js
 * @description Validaciones para Destination–Service
 */

import { body } from "express-validator";

export const createDestinationServiceValidator = [
    body("destination_id")
        .isInt({ min: 1 })
        .withMessage("destination_id debe ser un entero válido"),

    body("service_id")
        .isInt({ min: 1 })
        .withMessage("service_id debe ser un entero válido"),
];
