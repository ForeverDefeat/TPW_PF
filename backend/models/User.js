/**
 * @file models/User.js
 * @description Modelo de dominio para la entidad User.
 * @module models/User
 */

/**
 * @typedef {Object} User
 * @property {number} id - ID del usuario
 * @property {string} full_name - Nombre completo
 * @property {string} email - Correo electrónico único
 * @property {string} password - Contraseña (texto plano para pruebas)
 * @property {"user"|"admin"} role - Rol del usuario
 */

export class User {
    /**
     * Crea una instancia de User a partir de una fila de BD.
     * Acepta tanto `full_name` como `fullName`.
     * @param {User} row
     */
    static fromRow(row) {
        if (!row) return null;

        return {
            id: row.id,
            full_name: row.full_name || row.fullName, // <-- FIX PRINCIPAL
            email: row.email,
            password: row.password,
            role: row.role,
        };
    }
}
