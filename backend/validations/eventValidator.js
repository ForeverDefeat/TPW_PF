import { body } from "express-validator";

/* ======================================
   VALIDACIÓN PARA CREAR EVENTO
====================================== */
export const createEventValidator = [
    body("destination_id")
        .isInt({ min: 1 })
        .withMessage("El campo 'destination_id' es obligatorio y debe ser un número entero válido"),

    body("title")
        .notEmpty()
        .withMessage("El campo 'title' es obligatorio"),

    body("event_date")
        .isISO8601()
        .withMessage("El campo 'event_date' debe ser YYYY-MM-DD"),

    body("description")
        .optional()
        .isString()
        .withMessage("El campo 'description' debe ser una cadena de texto"),

    body("location")
        .optional()
        .isString()
        .withMessage("El campo 'location' debe ser una cadena de texto"),

    // ❌ Eliminado image_url
];

/* ======================================
   VALIDACIÓN PARA EDITAR EVENTO
====================================== */
export const updateEventValidator = [
    body("destination_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("destination_id debe ser un número válido"),

    body("title")
        .optional()
        .isString()
        .withMessage("El campo 'title' debe ser una cadena de texto"),

    body("event_date")
        .optional()
        .isISO8601()
        .withMessage("El campo 'event_date' debe tener un formato válido YYYY-MM-DD"),

    body("description")
        .optional()
        .isString()
        .withMessage("El campo 'description' debe ser una cadena de texto"),

    body("location")
        .optional()
        .isString()
        .withMessage("El campo 'location' debe ser una cadena de texto"),

    // ❌ Eliminado image_url (porque tu envío es archivo)
];
