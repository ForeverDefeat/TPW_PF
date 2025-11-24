/**
 * @file repositories/DestinationRepository.js
 * @description Capa de persistencia para la entidad Destination.
 * @module repositories/DestinationRepository
 */

import { db } from "../config/db.js";

/**
 * @typedef {Object} Destination
 * @property {number} id - ID único del destino.
 * @property {number} categoryId - ID de la categoría a la que pertenece.
 * @property {number|null} locationId - ID de la ubicación (ciudad/localidad), puede ser null.
 * @property {string} name - Nombre del destino turístico.
 * @property {string} [slug] - Slug amigable para URLs (opcional).
 * @property {string} [summary] - Descripción corta que se usa en cards/listas.
 * @property {string} [description] - Descripción larga que se muestra en la ficha detallada.
 * @property {string|null} [mainImageUrl] - Imagen principal (card).
 * @property {string|null} [heroImageUrl] - Imagen para el banner/hero.
 * @property {boolean} [isFeatured] - Indica si es un destino destacado en el home.
 * @property {string} createdAt - Fecha de creación (ISO string).
 * @property {string} updatedAt - Fecha de actualización (ISO string).
 */

/**
 * @typedef {Object} DestinationInput
 * @property {number} categoryId
 * @property {number|null} [locationId]
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [summary]
 * @property {string} [description]
 * @property {string|null} [mainImageUrl]
 * @property {string|null} [heroImageUrl]
 * @property {boolean} [isFeatured]
 */

/**
 * @typedef {Object} DestinationUpdate
 * @property {number} [categoryId]
 * @property {number|null} [locationId]
 * @property {string} [name]
 * @property {string} [slug]
 * @property {string} [summary]
 * @property {string} [description]
 * @property {string|null} [mainImageUrl]
 * @property {string|null} [heroImageUrl]
 * @property {boolean} [isFeatured]
 */

/**
 * Funciones de acceso a datos para la entidad Destination.
 * Encapsula todas las consultas SQL a la tabla `destinations`.
 */
export class DestinationRepository {

  /**
   * Obtiene todos los destinos, ordenados por fecha de creación descendente.
   * @returns {Promise<Destination[]>}
   */
  static async findAll() {
    const [rows] = await db.query(
      `SELECT
         id,
         category_id    AS categoryId,
         location_id    AS locationId,
         name,
         slug,
         summary,
         description,
         main_image_url AS mainImageUrl,
         hero_image_url AS heroImageUrl,
         is_featured    AS isFeatured,
         created_at     AS createdAt,
         updated_at     AS updatedAt
       FROM destinations
       ORDER BY created_at DESC`
    );
    return rows;
  }

  /**
   * Obtiene un destino por su ID.
   * @param {number} id
   * @returns {Promise<Destination|null>}
   */
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT
         id,
         category_id    AS categoryId,
         location_id    AS locationId,
         name,
         slug,
         summary,
         description,
         main_image_url AS mainImageUrl,
         hero_image_url AS heroImageUrl,
         is_featured    AS isFeatured,
         created_at     AS createdAt,
         updated_at     AS updatedAt
       FROM destinations
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Obtiene destinos filtrando por categoría.
   * Útil para las páginas tipo /playa, /montaña, /cultura.
   * @param {number} categoryId
   * @returns {Promise<Destination[]>}
   */
  static async findByCategory(categoryId) {
    const [rows] = await db.query(
      `SELECT
         id,
         category_id    AS categoryId,
         location_id    AS locationId,
         name,
         slug,
         summary,
         description,
         main_image_url AS mainImageUrl,
         hero_image_url AS heroImageUrl,
         is_featured    AS isFeatured,
         created_at     AS createdAt,
         updated_at     AS updatedAt
       FROM destinations
       WHERE category_id = ?
       ORDER BY created_at DESC`,
      [categoryId]
    );
    return rows;
  }

  /**
   * Obtiene destinos destacados para el home (is_featured = 1).
   * @returns {Promise<Destination[]>}
   */
  static async findFeatured() {
    const [rows] = await db.query(
      `SELECT
         id,
         category_id    AS categoryId,
         location_id    AS locationId,
         name,
         slug,
         summary,
         description,
         main_image_url AS mainImageUrl,
         hero_image_url AS heroImageUrl,
         is_featured    AS isFeatured,
         created_at     AS createdAt,
         updated_at     AS updatedAt
       FROM destinations
       WHERE is_featured = 1
       ORDER BY created_at DESC`
    );
    return rows;
  }

  /**
   * Crea un nuevo destino.
   * @param {DestinationInput} data
   * @returns {Promise<number>} ID insertado
   */
  static async create(data) {
    const {
      categoryId,
      locationId = null,
      name,
      slug = null,
      summary = null,
      description = null,
      mainImageUrl = null,
      heroImageUrl = null,
      isFeatured = false
    } = data;

    const [result] = await db.query(
      `INSERT INTO destinations (
         category_id,
         location_id,
         name,
         slug,
         summary,
         description,
         main_image_url,
         hero_image_url,
         is_featured
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId,
        locationId,
        name,
        slug,
        summary,
        description,
        mainImageUrl,
        heroImageUrl,
        isFeatured ? 1 : 0
      ]
    );

    return result.insertId;
  }

  /**
   * Actualiza un destino existente.
   * Solo actualiza los campos enviados en data.
   * @param {number} id
   * @param {DestinationUpdate} data
   * @returns {Promise<boolean>} true si se actualizó algún registro.
   */
  static async update(id, data) {
    // Construimos dinámicamente el SET dependiendo de los campos que lleguen
    const fields = [];
    const values = [];

    if (data.categoryId !== undefined) {
      fields.push("category_id = ?");
      values.push(data.categoryId);
    }
    if (data.locationId !== undefined) {
      fields.push("location_id = ?");
      values.push(data.locationId);
    }
    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }
    if (data.slug !== undefined) {
      fields.push("slug = ?");
      values.push(data.slug);
    }
    if (data.summary !== undefined) {
      fields.push("summary = ?");
      values.push(data.summary);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.mainImageUrl !== undefined) {
      fields.push("main_image_url = ?");
      values.push(data.mainImageUrl);
    }
    if (data.heroImageUrl !== undefined) {
      fields.push("hero_image_url = ?");
      values.push(data.heroImageUrl);
    }
    if (data.isFeatured !== undefined) {
      fields.push("is_featured = ?");
      values.push(data.isFeatured ? 1 : 0);
    }

    if (fields.length === 0) {
      // Nada que actualizar
      return false;
    }

    const sql = `
      UPDATE destinations
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
  }

  /**
   * Elimina un destino por ID.
   * (Importante: en el futuro, si existen tablas de relación como
   * favorites o destination_hotels, aquí deberías manejar el borrado
   * en cascada o validaciones de integridad).
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM destinations WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
