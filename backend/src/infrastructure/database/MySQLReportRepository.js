/**
 * MySQLReportRepository - Implementación de consultas para reportes
 * 
 * INFRASTRUCTURE LAYER (Arquitectura Hexagonal)
 * Implementación concreta del acceso a datos para generación de reportes
 */

import pool from '../../config/database.js';

class MySQLReportRepository {
  /**
   * Obtener datos de vehículos con filtros y campos seleccionados
   */
  async getVehiclesReport(filters = {}, selectedFields = []) {
    try {
      const { startDate, endDate } = filters;
      
      // Definir campos disponibles y sus mapeos
      const fieldMapping = {
        placa: 'v.id_placa',
        modelo: 'v.modelo',
        marca: 'v.marca',
        anio: 'v.anio',
        color: 'v.color',
        combustible: 'v.tipo_combustible',
        kilometraje: 'v.kilometraje_actual',
        ultimoMantenimiento: 'v.ultimo_mantenimiento',
        soat: 'v.soat',
        tecno: 'v.tecno',
        conductor: 'u.nombre',
        cedulaConductor: 'u.id_cedula',
        area: 'u.area'
      };

      // Si no se especifican campos, seleccionar todos
      const fields = selectedFields.length > 0 
        ? selectedFields.map(f => fieldMapping[f] || f).join(', ')
        : Object.values(fieldMapping).join(', ');

      let query = `
        SELECT ${fields}
        FROM vehiculos v
        LEFT JOIN usuarios u ON v.id_usuario = u.id_cedula
        WHERE 1=1
      `;

      const params = [];

      // Aplicar filtros de fecha si existen
      if (startDate) {
        query += ' AND v.ultimo_mantenimiento >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND v.ultimo_mantenimiento <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY v.id_placa';

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error en getVehiclesReport:', error);
      throw new Error('Error al obtener reporte de vehículos');
    }
  }

  /**
   * Obtener datos de usuarios/personal con filtros y campos seleccionados
   */
  async getUsersReport(filters = {}, selectedFields = []) {
    try {
      const { startDate, endDate, role } = filters;
      
      const fieldMapping = {
        cedula: 'u.id_cedula',
        nombre: 'u.nombre',
        rol: 'r.nombre_rol',
        area: 'u.area',
        celular: 'u.celular',
        // Campos de información adicional
        ciudad: 'ia.ciudad',
        sitioLabor: 'ia.sitio_labor',
        cargo: 'ia.cargo',
        edad: 'ia.edad',
        genero: 'ia.genero',
        tipoContratacion: 'ia.tipo_contratacion',
        licencia: 'ia.licencia',
        categoriaLicencia: 'ia.categoria_licencia',
        vigenciaLicencia: 'ia.vigencia_licencia',
        accidente5Anios: 'ia.accidente_5_anios',
        tieneComparendos: 'ia.tiene_comparendos',
        fechaRegistroSurvey: 'ia.fecha_registro'
      };

      const fields = selectedFields.length > 0 
        ? selectedFields.map(f => fieldMapping[f] || f).join(', ')
        : Object.values(fieldMapping).join(', ');

      let query = `
        SELECT ${fields}
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        LEFT JOIN informacion_adicional ia ON u.id_cedula = ia.id_usuario
        WHERE 1=1
      `;

      const params = [];

      if (role) {
        query += ' AND r.nombre_rol = ?';
        params.push(role);
      }

      if (startDate) {
        query += ' AND ia.fecha_registro >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND ia.fecha_registro <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY u.nombre';

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error en getUsersReport:', error);
      throw new Error('Error al obtener reporte de personal');
    }
  }

  /**
   * Obtener datos de mantenimientos con filtros y campos seleccionados
   */
  async getMaintenancesReport(filters = {}, selectedFields = []) {
    try {
      const { startDate, endDate, maintenanceType } = filters;
      
      const fieldMapping = {
        id: 'm.id_mantenimiento',
        placa: 'm.id_placa',
        vehiculo: 'CONCAT(v.marca, " ", v.modelo) as vehiculo',
        tipo: 'm.tipo_mantenimiento',
        fechaRealizado: 'm.fecha_realizado',
        fechaProxima: 'm.fecha_proxima',
        kilometraje: 'm.kilometraje',
        costo: 'm.costo',
        descripcion: 'm.descripcion',
        infoAdicional: 'm.informacion_adicional',
        // Datos del vehículo
        marca: 'v.marca',
        modelo: 'v.modelo',
        anio: 'v.anio',
        // Datos del conductor
        conductor: 'u.nombre',
        area: 'u.area'
      };

      const fields = selectedFields.length > 0 
        ? selectedFields.map(f => fieldMapping[f] || f).join(', ')
        : Object.values(fieldMapping).join(', ');

      let query = `
        SELECT ${fields}
        FROM mantenimientos m
        INNER JOIN vehiculos v ON m.id_placa = v.id_placa
        LEFT JOIN usuarios u ON v.id_usuario = u.id_cedula
        WHERE 1=1
      `;

      const params = [];

      if (startDate) {
        query += ' AND m.fecha_realizado >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND m.fecha_realizado <= ?';
        params.push(endDate);
      }

      if (maintenanceType) {
        query += ' AND m.tipo_mantenimiento = ?';
        params.push(maintenanceType);
      }

      query += ' ORDER BY m.fecha_realizado DESC';

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error en getMaintenancesReport:', error);
      throw new Error('Error al obtener reporte de mantenimientos');
    }
  }

  /**
   * Reporte combinado: Vehículos con sus conductores y mantenimientos
   */
  async getVehiclesWithMaintenanceReport(filters = {}, selectedFields = []) {
    try {
      const { startDate, endDate } = filters;

      let query = `
        SELECT 
          v.id_placa as placa,
          CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) as vehiculo,
          v.marca,
          v.modelo,
          v.anio,
          v.kilometraje_actual as kilometraje,
          IFNULL(u.nombre, 'Sin asignar') as conductor,
          IFNULL(u.area, 'Sin área') as area,
          COUNT(m.id_mantenimiento) as totalMantenimientos,
          IFNULL(SUM(m.costo), 0) as costoTotal,
          MAX(m.fecha_realizado) as ultimoMantenimiento,
          MIN(m.fecha_proxima) as proximoMantenimiento
        FROM vehiculos v
        LEFT JOIN usuarios u ON v.id_usuario = u.id_cedula
        LEFT JOIN mantenimientos m ON v.id_placa = m.id_placa
      `;

      const params = [];
      const conditions = [];

      if (startDate) {
        conditions.push('(m.fecha_realizado >= ? OR m.fecha_realizado IS NULL)');
        params.push(startDate);
      }

      if (endDate) {
        conditions.push('(m.fecha_realizado <= ? OR m.fecha_realizado IS NULL)');
        params.push(endDate);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' GROUP BY v.id_placa, v.marca, v.modelo, v.anio, v.kilometraje_actual, u.nombre, u.area';
      query += ' ORDER BY v.id_placa';

      console.log('Query Vehículos+Mantenimientos:', query);
      console.log('Params:', params);

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error en getVehiclesWithMaintenanceReport:', error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  /**
   * Reporte de conductores con sus vehículos y datos de seguridad vial
   */
  async getDriversWithVehiclesReport(filters = {}, selectedFields = []) {
    try {
      const { startDate, endDate } = filters;

      let query = `
        SELECT 
          u.id_cedula as cedula,
          u.nombre,
          u.area,
          u.celular,
          COUNT(v.id_placa) as vehiculosAsignados,
          GROUP_CONCAT(v.id_placa SEPARATOR ', ') as placas,
          ia.licencia,
          ia.categoria_licencia as categoriaLicencia,
          ia.vigencia_licencia as vigenciaLicencia,
          ia.accidente_5_anios as accidentes,
          ia.tiene_comparendos as comparendos,
          ia.cargo,
          ia.ciudad
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        LEFT JOIN vehiculos v ON u.id_cedula = v.id_usuario
        LEFT JOIN informacion_adicional ia ON u.id_cedula = ia.id_usuario
        WHERE r.nombre_rol = 'Conductor'
      `;

      const params = [];
      const additionalConditions = [];

      if (startDate) {
        additionalConditions.push('(ia.fecha_registro >= ? OR ia.fecha_registro IS NULL)');
        params.push(startDate);
      }

      if (endDate) {
        additionalConditions.push('(ia.fecha_registro <= ? OR ia.fecha_registro IS NULL)');
        params.push(endDate);
      }

      if (additionalConditions.length > 0) {
        query += ' AND ' + additionalConditions.join(' AND ');
      }

      query += ' GROUP BY u.id_cedula, u.nombre, u.area, u.celular, ia.licencia, ia.categoria_licencia, ia.vigencia_licencia, ia.accidente_5_anios, ia.tiene_comparendos, ia.cargo, ia.ciudad';
      query += ' ORDER BY u.nombre';

      console.log('Query Conductores+Vehículos:', query);
      console.log('Params:', params);

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error en getDriversWithVehiclesReport:', error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  /**
   * Obtener tipos de mantenimiento disponibles para filtros
   */
  async getMaintenanceTypes() {
    try {
      const [rows] = await pool.query(`
        SELECT DISTINCT tipo_mantenimiento 
        FROM mantenimientos 
        WHERE tipo_mantenimiento IS NOT NULL
        ORDER BY tipo_mantenimiento
      `);
      return rows.map(r => r.tipo_mantenimiento);
    } catch (error) {
      console.error('Error en getMaintenanceTypes:', error);
      throw new Error('Error al obtener tipos de mantenimiento');
    }
  }

  /**
   * Obtener estadísticas generales para dashboards de reportes
   */
  async getReportStats() {
    try {
      const [vehicleStats] = await pool.query('SELECT COUNT(*) as total FROM vehiculos');
      const [userStats] = await pool.query('SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 1');
      const [maintenanceStats] = await pool.query('SELECT COUNT(*) as total FROM mantenimientos');
      const [costStats] = await pool.query('SELECT COALESCE(SUM(costo), 0) as total FROM mantenimientos');

      return {
        totalVehicles: vehicleStats[0].total,
        totalDrivers: userStats[0].total,
        totalMaintenances: maintenanceStats[0].total,
        totalCosts: parseFloat(costStats[0].total)
      };
    } catch (error) {
      console.error('Error en getReportStats:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }
}

export default MySQLReportRepository;
