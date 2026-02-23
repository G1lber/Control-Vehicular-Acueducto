// =====================================================
// INFRASTRUCTURE LAYER - MYSQL VEHICLE REPOSITORY (ADAPTER)
// =====================================================
// Este es un ADAPTER que implementa el PORT (VehicleRepository)
// Aquí SÍ usamos tecnología específica (MySQL)

import { VehicleRepository } from '../../domain/repositories/VehicleRepository.js';
import { Vehicle } from '../../domain/entities/Vehicle.js';
import pool from '../../config/database.js';

/**
 * Implementación del repositorio de vehículos usando MySQL
 * Esta clase implementa el contrato definido en VehicleRepository
 */
export class MySQLVehicleRepository extends VehicleRepository {
  /**
   * Obtiene todos los vehículos con información del conductor
   * @returns {Promise<Vehicle[]>}
   */
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          v.*,
          u.nombre as conductor_nombre,
          u.celular as conductor_celular
        FROM vehiculos v
        LEFT JOIN usuarios u ON v.id_usuario = u.id_cedula
        ORDER BY v.id_placa
      `);

      return rows.map(row => new Vehicle({
        id_placa: row.id_placa,
        modelo: row.modelo,
        marca: row.marca,
        anio: row.anio,
        color: row.color,
        tipo_combustible: row.tipo_combustible,
        kilometraje_actual: row.kilometraje_actual,
        ultimo_mantenimiento: row.ultimo_mantenimiento,
        id_usuario: row.id_usuario,
        soat: row.soat,
        tecno: row.tecno
      }));
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error('Error al obtener vehículos');
    }
  }

  /**
   * Busca un vehículo por su placa
   * @param {string} id_placa - Placa del vehículo
   * @returns {Promise<Vehicle|null>}
   */
  async findById(id_placa) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          v.*,
          u.nombre as conductor_nombre,
          u.celular as conductor_celular
        FROM vehiculos v
        LEFT JOIN usuarios u ON v.id_usuario = u.id_cedula
        WHERE v.id_placa = ?
      `, [id_placa]);

      if (rows.length === 0) {
        return null;
      }

      return new Vehicle({
        id_placa: rows[0].id_placa,
        modelo: rows[0].modelo,
        marca: rows[0].marca,
        anio: rows[0].anio,
        color: rows[0].color,
        tipo_combustible: rows[0].tipo_combustible,
        kilometraje_actual: rows[0].kilometraje_actual,
        ultimo_mantenimiento: rows[0].ultimo_mantenimiento,
        id_usuario: rows[0].id_usuario,
        soat: rows[0].soat,
        tecno: rows[0].tecno
      });
    } catch (error) {
      console.error('Error en findById:', error);
      throw new Error('Error al buscar vehículo');
    }
  }

  /**
   * Busca vehículos de un conductor específico
   * @param {number} id_usuario - ID del conductor
   * @returns {Promise<Vehicle[]>}
   */
  async findByDriver(id_usuario) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM vehiculos
        WHERE id_usuario = ?
        ORDER BY id_placa
      `, [id_usuario]);

      return rows.map(row => new Vehicle(row));
    } catch (error) {
      console.error('Error en findByDriver:', error);
      throw new Error('Error al buscar vehículos por conductor');
    }
  }

  /**
   * Busca vehículos por estado
   * Nota: Esta es una operación especial que filtra en el backend
   * porque el estado se calcula dinámicamente
   */
  async findByStatus(status) {
    try {
      const vehicles = await this.findAll();
      return vehicles.filter(vehicle => vehicle.getStatus() === status);
    } catch (error) {
      console.error('Error en findByStatus:', error);
      throw new Error('Error al buscar vehículos por estado');
    }
  }

  /**
   * Crea un nuevo vehículo
   * @param {Vehicle} vehicle - Entidad del vehículo
   * @returns {Promise<Vehicle>}
   */
  async create(vehicle) {
    try {
      // Validar antes de insertar
      const validation = vehicle.validate();
      if (!validation.valid) {
        throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
      }

      await pool.query(`
        INSERT INTO vehiculos (
          id_placa, modelo, marca, anio, color, tipo_combustible,
          kilometraje_actual, ultimo_mantenimiento, id_usuario, soat, tecno
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        vehicle.id_placa,
        vehicle.modelo,
        vehicle.marca,
        vehicle.anio,
        vehicle.color,
        vehicle.tipo_combustible,
        vehicle.kilometraje_actual,
        vehicle.ultimo_mantenimiento,
        vehicle.id_usuario,
        vehicle.soat,
        vehicle.tecno
      ]);

      return await this.findById(vehicle.id_placa);
    } catch (error) {
      console.error('Error en create:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe un vehículo con esa placa');
      }
      throw new Error('Error al crear vehículo');
    }
  }

  /**
   * Actualiza un vehículo existente
   * @param {string} id_placa - Placa del vehículo
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Vehicle|null>}
   */
  async update(id_placa, data) {
    try {
      // Verificar que el vehículo existe
      const existing = await this.findById(id_placa);
      if (!existing) {
        return null;
      }

      // Construir query dinámico solo con campos proporcionados
      const updates = [];
      const values = [];

      const allowedFields = [
        'modelo', 'marca', 'anio', 'color', 'tipo_combustible',
        'kilometraje_actual', 'ultimo_mantenimiento', 'id_usuario', 'soat', 'tecno'
      ];

      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updates.push(`${field} = ?`);
          values.push(data[field]);
        }
      }

      if (updates.length === 0) {
        return existing; // No hay nada que actualizar
      }

      values.push(id_placa); // Para el WHERE

      await pool.query(`
        UPDATE vehiculos
        SET ${updates.join(', ')}
        WHERE id_placa = ?
      `, values);

      return await this.findById(id_placa);
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error('Error al actualizar vehículo');
    }
  }

  /**
   * Elimina un vehículo
   * @param {string} id_placa - Placa del vehículo
   * @returns {Promise<boolean>}
   */
  async delete(id_placa) {
    try {
      const [result] = await pool.query(
        'DELETE FROM vehiculos WHERE id_placa = ?',
        [id_placa]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw new Error('Error al eliminar vehículo');
    }
  }

  /**
   * Cuenta el total de vehículos
   * @returns {Promise<number>}
   */
  async count() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as total FROM vehiculos');
      return rows[0].total;
    } catch (error) {
      console.error('Error en count:', error);
      throw new Error('Error al contar vehículos');
    }
  }
}
