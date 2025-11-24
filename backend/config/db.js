/* // config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

//export const db = mysql.createPool({ 
    export const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}); */

/**
 * @file config/db.js
 * @description Configuración de la conexión MySQL usando mysql2/promise.
 * Utiliza variables de entorno definidas en el archivo .env.
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * @constant db
 * @description Pool de conexiones MySQL exportado como variable nombrada.
 * Se usa para ejecutar consultas desde los repositories.
 */
export const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Exportación por defecto para permitir:
 *   import db from "../config/db.js";
 * desde cualquier repository.
 */
export default db;
