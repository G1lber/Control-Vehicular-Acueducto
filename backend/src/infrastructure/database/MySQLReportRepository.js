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
        // Campos de información adicional (encuesta talento humano)
        ciudad: 'ia.ciudad',
        sitioLabor: 'ia.sitio_labor',
        cargo: 'ia.cargo',
        edad: 'ia.edad',
        genero: 'ia.genero',
        grupo: 'CASE WHEN ia.grupo = "Otro" THEN CONCAT("Otro: ", ia.grupo_otro) ELSE ia.grupo END AS grupo',
        tipoContratacion: 'ia.tipo_contratacion',
        medioTransporteDesplazamiento: 'ia.medio_transporte_desplazamiento',
        claseVehiculo: 'CASE WHEN ia.clase_vehiculo = "Otro" THEN CONCAT("Otro: ", ia.clase_vehiculo_otro) ELSE ia.clase_vehiculo END AS claseVehiculo',
        licencia: 'ia.licencia',
        categoriaLicencia: 'ia.categoria_licencia',
        vigenciaLicencia: 'ia.vigencia_licencia',
        experiencia: 'ia.experiencia',
        accidente5Anios: 'ia.accidente_5_anios',
        accidenteLaboral: 'ia.accidente_laboral',
        cantidadAccidentes: 'ia.cantidad_accidentes',
        cantidadAccidentesLaborales: 'ia.cantidad_accidentes_laborales',
        rolAccidente: 'ia.rol_accidente',
        incidente: 'ia.incidente',
        viasPublicas: 'ia.vias_publicas',
        medioDesplazamiento: 'ia.medio_desplazamiento',
        frecuenciaVehiculoPropio: 'ia.frecuencia_vehiculo_propio',
        tipoVehiculoPropio: 'CASE WHEN ia.tipo_vehiculo_propio = "Otro" THEN CONCAT("Otro: ", ia.tipo_vehiculo_propio_otro) ELSE ia.tipo_vehiculo_propio END AS tipoVehiculoPropio',
        empresaPagaRodamiento: 'ia.empresa_paga_rodamiento',
        realizaInspeccionPropio: 'ia.realiza_inspeccion_propio',
        frecuenciaChequeoPropio: 'ia.frecuencia_chequeo_propio',
        usaVehiculoEmpresa: 'ia.usa_vehiculo_empresa',
        tipoVehiculoEmpresa: 'CASE WHEN ia.tipo_vehiculo_empresa = "Otro" THEN CONCAT("Otro: ", ia.tipo_vehiculo_empresa_otro) ELSE ia.tipo_vehiculo_empresa END AS tipoVehiculoEmpresa',
        realizaInspeccionEmpresa: 'ia.realiza_inspeccion_empresa',
        frecuenciaChequeoEmpresa: 'ia.frecuencia_chequeo_empresa',
        planificacion: 'ia.planificacion',
        antelacion: 'ia.antelacion',
        kmMensuales: 'ia.km_mensuales',
        tieneComparendos: 'ia.tiene_comparendos',
        riesgos: `CASE
          WHEN ia.riesgo_otro IS NOT NULL AND TRIM(ia.riesgo_otro) <> '' THEN
            CASE
              WHEN JSON_VALID(ia.riesgos) THEN JSON_ARRAY_APPEND(COALESCE(ia.riesgos, JSON_ARRAY()), '$', CONCAT('Otro: ', ia.riesgo_otro))
              WHEN ia.riesgos IS NULL OR TRIM(ia.riesgos) = '' THEN CONCAT('Otro: ', ia.riesgo_otro)
              ELSE CONCAT(ia.riesgos, ', Otro: ', ia.riesgo_otro)
            END
          ELSE ia.riesgos
        END AS riesgos`,
        causas: `CASE
          WHEN ia.causa_otra IS NOT NULL AND TRIM(ia.causa_otra) <> '' THEN
            CASE
              WHEN JSON_VALID(ia.causas) THEN JSON_ARRAY_APPEND(COALESCE(ia.causas, JSON_ARRAY()), '$', CONCAT('Otro: ', ia.causa_otra))
              WHEN ia.causas IS NULL OR TRIM(ia.causas) = '' THEN CONCAT('Otro: ', ia.causa_otra)
              ELSE CONCAT(ia.causas, ', Otro: ', ia.causa_otra)
            END
          ELSE ia.causas
        END AS causas`,
        causasComparendo: `CASE
          WHEN ia.causa_comparendo_otra IS NOT NULL AND TRIM(ia.causa_comparendo_otra) <> '' THEN
            CASE
              WHEN JSON_VALID(ia.causas_comparendo) THEN JSON_ARRAY_APPEND(COALESCE(ia.causas_comparendo, JSON_ARRAY()), '$', CONCAT('Otro: ', ia.causa_comparendo_otra))
              WHEN ia.causas_comparendo IS NULL OR TRIM(ia.causas_comparendo) = '' THEN CONCAT('Otro: ', ia.causa_comparendo_otra)
              ELSE CONCAT(ia.causas_comparendo, ', Otro: ', ia.causa_comparendo_otra)
            END
          ELSE ia.causas_comparendo
        END AS causasComparendo`,
        informacionAdicional: 'ia.informacion_adicional',
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
   * Cada fila representa un conductor-vehículo (sin agrupar) para tener información completa
   */
  async getDriversWithVehiclesReport(filters = {}, selectedFields = []) {
    try {
      const { startDate, endDate } = filters;

      let query = `
        SELECT 
          u.id_cedula as cedula,
          u.nombre as nombreConductor,
          u.area,
          u.celular,
          v.id_placa as placa,
          v.marca,
          v.modelo,
          v.anio,
          v.color,
          v.tipo_combustible as combustible,
          v.kilometraje_actual as kilometraje,
          v.ultimo_mantenimiento as ultimoMantenimiento,
          v.soat,
          v.tecno,
          ia.licencia,
          ia.categoria_licencia as categoriaLicencia,
          ia.vigencia_licencia as vigenciaLicencia,
          ia.accidente_5_anios as accidentes,
          ia.tiene_comparendos as comparendos,
          ia.cargo,
          ia.ciudad,
          ia.sitio_labor as sitioLabor,
          ia.edad,
          ia.genero,
          ia.tipo_contratacion as tipoContratacion
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

      query += ' ORDER BY u.nombre, v.id_placa';

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
