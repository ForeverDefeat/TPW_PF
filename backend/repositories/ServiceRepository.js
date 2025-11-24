/**
 * @file repositories/ServiceRepository.js
 * @description Capa de acceso a datos para la entidad Service.
 * Encapsula todas las consultas SQL relacionadas con servicios turísticos
 * (hoteles, restaurantes, tours, transporte, etc.).
 */

import { db } from "../config/db.js";

/**
 * @typedef {Object} Service
 * @property {number} id                - ID del servicio
 * @property {number} service_type_id   - ID del tipo de servicio (FK de service_types)
 * @property {string} name              - Nombre comercial del servicio
 * @property {string} [location]        - Ubicación o localidad
 * @property {string} [description]     - Descripción del servicio
 * @property {string} [price_range]     - Rango de precios (texto: "S/ 100 - 200", "desde S/ 50", etc.)
 * @property {string} [image_url]       - URL/Path de imagen
 * @property {string} [serviceTypeName] - Nombre del tipo de servicio (JOIN con service_types)
 */

/**
 * @typedef {Object} ServiceFilters
 * @property {number} [serviceTypeId]  - Filtrar por ID de tipo de servicio (service_types.id)
 * @property {string} [typeName]       - Filtrar por nombre del tipo (Hotel, Restaurante, etc.)
 * @property {string} [location]       - Filtrar por ubicación (ej: "Paracas")
 * @property {string} [q]              - Búsqueda de texto en name/description
 * @property {number} [destinationId]  - Filtrar servicios asociados a un destino específico
 */

export class ServiceRepository {
  /**
   * Obtiene la lista de servicios, con filtros opcionales.
   *
   * @param {ServiceFilters} [filters={}] - Filtros dinámicos para la consulta.
   * @returns {Promise<Service[]>} Lista de servicios.
   */
  static async findAll(filters = {}) {
    const {
      serviceTypeId,
      typeName,
      location,
      q,
      destinationId,
    } = filters;

    // Base query con JOIN a service_types (para tener el nombre del tipo)
    let sql = `
      SELECT 
        s.id,
        s.service_type_id,
        s.name,
        s.location,
        s.description,
        s.price_range,
        s.image_url,
        st.name AS serviceTypeName
      FROM services s
      LEFT JOIN service_types st ON s.service_type_id = st.id
    `;

    // Si se filtra por destino, unimos con destination_services
    const whereClauses = [];
    const params = [];

    if (destinationId) {
      sql += `
        INNER JOIN destination_services ds 
          ON ds.service_id = s.id
      `;
      whereClauses.push("ds.destination_id = ?");
      params.push(destinationId);
    }

    if (serviceTypeId) {
      whereClauses.push("s.service_type_id = ?");
      params.push(serviceTypeId);
    }

    if (typeName) {
      // Filtrar por nombre del tipo (Hotel, Restaurante...)
      whereClauses.push("st.name LIKE ?");
      params.push(`%${typeName}%`);
    }

    if (location) {
      whereClauses.push("s.location LIKE ?");
      params.push(`%${location}%`);
    }

    if (q) {
      // Búsqueda de texto en nombre o descripción
      whereClauses.push("(s.name LIKE ? OR s.description LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }

    if (whereClauses.length > 0) {
      sql += " WHERE " + whereClauses.join(" AND ");
    }

    // Orden básico (puedes cambiar a otro criterio)
    sql += " ORDER BY s.id DESC";

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Obtiene un servicio por su ID.
   * @param {number} id - ID del servicio.
   * @returns {Promise<Service|null>} Servicio encontrado o null.
   */
  static async findById(id) {
    const sql = `
      SELECT 
        s.id,
        s.service_type_id,
        s.name,
        s.location,
        s.description,
        s.price_range,
        s.image_url,
        st.name AS serviceTypeName
      FROM services s
      LEFT JOIN service_types st ON s.service_type_id = st.id
      WHERE s.id = ?
    `;

    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  /**
   * Crea un nuevo servicio turístico.
   *
   * @param {Object} data
   * @param {number} data.service_type_id - Tipo de servicio (FK service_types)
   * @param {string} data.name            - Nombre del servicio
   * @param {string} [data.location]      - Localidad
   * @param {string} [data.description]   - Descripción
   * @param {string} [data.price_range]   - Rango de precios (texto libre)
   * @param {string} [data.image_url]     - URL o path de imagen
   * @returns {Promise<number>} ID del nuevo servicio creado.
   */
  static async create(data) {
    const {
      service_type_id,
      name,
      location = null,
      description = null,
      price_range = null,
      image_url = null,
    } = data;

    const [result] = await db.query(
      `
      INSERT INTO services 
        (service_type_id, name, location, description, price_range, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [service_type_id, name, location, description, price_range, image_url]
    );

    return result.insertId;
  }

  /**
   * Actualiza un servicio existente.
   *
   * @param {number} id   - ID del servicio a actualizar.
   * @param {Object} data - Campos a actualizar.
   * @returns {Promise<boolean>} true si se actualizó al menos una fila.
   */
  static async update(id, data) {
    const {
      service_type_id,
      name,
      location,
      description,
      price_range,
      image_url,
    } = data;

    const [result] = await db.query(
      `
      UPDATE services
      SET 
        service_type_id = ?,
        name = ?,
        location = ?,
        description = ?,
        price_range = ?,
        image_url = ?
      WHERE id = ?
      `,
      [
        service_type_id,
        name,
        location ?? null,
        description ?? null,
        price_range ?? null,
        image_url ?? null,
        id,
      ]
    );

    return result.affectedRows > 0;
  }

  /**
   * Elimina un servicio por ID.
   *
   * @param {number} id - ID del servicio a eliminar.
   * @returns {Promise<boolean>} true si se eliminó, false si no existía.
   */
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM services WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }
}
