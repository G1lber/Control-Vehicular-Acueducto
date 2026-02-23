/**
 * MySQLMaintenanceRepository - Implementación MySQL del repositorio de Mantenimientos
 * 
 * Parte de INFRASTRUCTURE (Capa de Infraestructura - Arquitectura Hexagonal)
 * Este es un ADAPTER - Implementa el port MaintenanceRepository usando MySQL
 */

import pool from '../../config/database.js';
import Maintenance from '../../domain/entities/Maintenance.js';
import MaintenanceRepository from '../../domain/repositories/MaintenanceRepository.js';

class MySQLMaintenanceRepository extends MaintenanceRepository {
  /**
   * Obtener todos los mantenimientos
   * @returns {Promise<Array<Maintenance>>}
   */
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM mantenimientos
        ORDER BY fecha_realizado DESC
      `);

      return rows.map(row => new Maintenance(row));
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
      throw new Error('Error al obtener mantenimientos de la base de datos');
    }
  }

  /**
   * Obtener un mantenimiento por ID
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<Maintenance|null>}
   */
  async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM mantenimientos WHERE id_mantenimiento = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return new Maintenance(rows[0]);
    } catch (error) {
      console.error('Error al obtener mantenimiento por ID:', error);
      throw new Error('Error al obtener mantenimiento de la base de datos');
    }
  }

  /**
   * Obtener todos los mantenimientos de un vehículo
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Array<Maintenance>>}
   */
  async findByVehicle(placa) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM mantenimientos 
         WHERE id_placa = ?
         ORDER BY fecha_realizado DESC`,
        [placa.toUpperCase()]
      );

      return rows.map(row => new Maintenance(row));
    } catch (error) {
      console.error('Error al obtener mantenimientos por vehículo:', error);
      throw new Error('Error al obtener mantenimientos del vehículo');
    }
  }

  /**
   * Obtener mantenimientos por tipo
   * @param {string} tipo - Tipo de mantenimiento
   * @returns {Promise<Array<Maintenance>>}
   */
  async findByType(tipo) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM mantenimientos 
         WHERE tipo_mantenimiento LIKE ?
         ORDER BY fecha_realizado DESC`,
        [`%${tipo}%`]
      );

      return rows.map(row => new Maintenance(row));
    } catch (error) {
      console.error('Error al obtener mantenimientos por tipo:', error);
      throw new Error('Error al filtrar mantenimientos por tipo');
    }
  }

  /**
   * Obtener mantenimientos en un rango de fechas
   * @param {Date} fechaInicio - Fecha inicial
   * @param {Date} fechaFin - Fecha final
   * @returns {Promise<Array<Maintenance>>}
   */
  async findByDateRange(fechaInicio, fechaFin) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM mantenimientos 
         WHERE fecha_realizado BETWEEN ? AND ?
         ORDER BY fecha_realizado DESC`,
        [fechaInicio, fechaFin]
      );

      return rows.map(row => new Maintenance(row));
    } catch (error) {
      console.error('Error al obtener mantenimientos por rango de fechas:', error);
      throw new Error('Error al filtrar mantenimientos por fechas');
    }
  }

  /**
   * Obtener mantenimientos próximos a vencer
   * @param {number} dias - Días de anticipación (default: 30)
   * @returns {Promise<Array<Maintenance>>}
   */
  async findUpcoming(dias = 30) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM mantenimientos 
         WHERE fecha_proxima IS NOT NULL
         AND fecha_proxima > CURDATE()
         AND fecha_proxima <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
         ORDER BY fecha_proxima ASC`,
        [dias]
      );

      return rows.map(row => new Maintenance(row));
    } catch (error) {
      console.error('Error al obtener mantenimientos próximos:', error);
      throw new Error('Error al obtener mantenimientos próximos');
    }
  }

  /**
   * Obtener mantenimientos vencidos
   * @returns {Promise<Array<Maintenance>>}
   */
  async findOverdue() {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM mantenimientos 
         WHERE fecha_proxima IS NOT NULL
         AND fecha_proxima < CURDATE()
         ORDER BY fecha_proxima ASC`
      );

      return rows.map(row => new Maintenance(row));
    } catch (error) {
      console.error('Error al obtener mantenimientos vencidos:', error);
      throw new Error('Error al obtener mantenimientos vencidos');
    }
  }

  /**
   * Crear un nuevo mantenimiento
   * @param {Maintenance} maintenance - Entidad de mantenimiento
   * @returns {Promise<Maintenance>} El mantenimiento creado con su ID
   */
  async create(maintenance) {
    try {
      const data = maintenance.toDB();
      
      // Remover el ID ya que es AUTO_INCREMENT
      delete data.id_mantenimiento;

      const [result] = await pool.query(
        `INSERT INTO mantenimientos SET ?`,
        data
      );

      // Obtener el mantenimiento recién creado
      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      
      // Manejar errores específicos
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('El vehículo especificado no existe');
      }
      
      throw new Error('Error al crear el mantenimiento en la base de datos');
    }
  }

  /**
   * Actualizar un mantenimiento existente
   * @param {number} id - ID del mantenimiento
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Maintenance>} El mantenimiento actualizado
   */
  async update(id, data) {
    try {
      // Construir objeto de actualización solo con campos permitidos
      const updateData = {};
      
      if (data.id_placa !== undefined) updateData.id_placa = data.id_placa.toUpperCase();
      if (data.tipo_mantenimiento !== undefined) updateData.tipo_mantenimiento = data.tipo_mantenimiento;
      if (data.fecha_realizado !== undefined) updateData.fecha_realizado = data.fecha_realizado;
      if (data.fecha_proxima !== undefined) updateData.fecha_proxima = data.fecha_proxima;
      if (data.kilometraje !== undefined) updateData.kilometraje = data.kilometraje;
      if (data.costo !== undefined) updateData.costo = data.costo;
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
      if (data.informacion_adicional !== undefined) updateData.informacion_adicional = data.informacion_adicional;

      // Si no hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        return await this.findById(id);
      }

      const [result] = await pool.query(
        'UPDATE mantenimientos SET ? WHERE id_mantenimiento = ?',
        [updateData, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Mantenimiento no encontrado');
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error al actualizar mantenimiento:', error);
      
      if (error.message === 'Mantenimiento no encontrado') {
        throw error;
      }
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('El vehículo especificado no existe');
      }
      
      throw new Error('Error al actualizar el mantenimiento');
    }
  }

  /**
   * Eliminar un mantenimiento
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM mantenimientos WHERE id_mantenimiento = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      throw new Error('Error al eliminar el mantenimiento');
    }
  }

  /**
   * Obtener estadísticas de costos de mantenimientos
   * @param {Object} filters - Filtros opcionales (placa, tipo, fechaInicio, fechaFin)
   * @returns {Promise<Object>} Estadísticas de costos
   */
  async getCostStats(filters = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_mantenimientos,
          SUM(costo) as costo_total,
          AVG(costo) as costo_promedio,
          MIN(costo) as costo_minimo,
          MAX(costo) as costo_maximo,
          COUNT(CASE WHEN costo IS NULL THEN 1 END) as sin_costo
        FROM mantenimientos
        WHERE 1=1
      `;
      
      const params = [];

      if (filters.placa) {
        query += ' AND id_placa = ?';
        params.push(filters.placa.toUpperCase());
      }

      if (filters.tipo) {
        query += ' AND tipo_mantenimiento LIKE ?';
        params.push(`%${filters.tipo}%`);
      }

      if (filters.fechaInicio && filters.fechaFin) {
        query += ' AND fecha_realizado BETWEEN ? AND ?';
        params.push(filters.fechaInicio, filters.fechaFin);
      }

      const [rows] = await pool.query(query, params);
      
      return {
        totalMantenimientos: rows[0].total_mantenimientos || 0,
        costoTotal: parseFloat(rows[0].costo_total) || 0,
        costoPromedio: parseFloat(rows[0].costo_promedio) || 0,
        costoMinimo: parseFloat(rows[0].costo_minimo) || 0,
        costoMaximo: parseFloat(rows[0].costo_maximo) || 0,
        sinCosto: rows[0].sin_costo || 0
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de costos:', error);
      throw new Error('Error al calcular estadísticas de costos');
    }
  }

  /**
   * Contar mantenimientos por tipo
   * @returns {Promise<Object>} Conteo por tipo de mantenimiento
   */
  async countByType() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          tipo_mantenimiento,
          COUNT(*) as cantidad,
          SUM(costo) as costo_total
        FROM mantenimientos
        GROUP BY tipo_mantenimiento
        ORDER BY cantidad DESC
      `);

      const result = {};
      rows.forEach(row => {
        result[row.tipo_mantenimiento] = {
          cantidad: row.cantidad,
          costoTotal: parseFloat(row.costo_total) || 0
        };
      });

      return result;
    } catch (error) {
      console.error('Error al contar mantenimientos por tipo:', error);
      throw new Error('Error al contar mantenimientos por tipo');
    }
  }

  /**
   * Obtener el último mantenimiento de un vehículo
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Maintenance|null>}
   */
  async getLastMaintenanceByVehicle(placa) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM mantenimientos 
         WHERE id_placa = ?
         ORDER BY fecha_realizado DESC
         LIMIT 1`,
        [placa.toUpperCase()]
      );

      if (rows.length === 0) {
        return null;
      }

      return new Maintenance(rows[0]);
    } catch (error) {
      console.error('Error al obtener último mantenimiento:', error);
      throw new Error('Error al obtener último mantenimiento del vehículo');
    }
  }

  /**
   * Verificar si existe un mantenimiento
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM mantenimientos WHERE id_mantenimiento = ?',
        [id]
      );

      return rows[0].count > 0;
    } catch (error) {
      console.error('Error al verificar existencia de mantenimiento:', error);
      throw new Error('Error al verificar mantenimiento');
    }
  }
}

export default MySQLMaintenanceRepository;
