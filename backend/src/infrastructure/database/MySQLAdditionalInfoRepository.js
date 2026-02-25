/**
 * MySQLAdditionalInfoRepository - Implementación MySQL del repositorio de Información Adicional
 * 
 * Parte de INFRASTRUCTURE (Capa de Infraestructura - Arquitectura Hexagonal)
 * Este es un ADAPTER - Implementa el port AdditionalInfoRepository usando MySQL
 */

import pool from '../../config/database.js';
import AdditionalInfo from '../../domain/entities/AdditionalInfo.js';
import AdditionalInfoRepository from '../../domain/repositories/AdditionalInfoRepository.js';

class MySQLAdditionalInfoRepository extends AdditionalInfoRepository {
  /**
   * Obtener toda la información adicional registrada
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT ia.*, u.nombre as nombre_usuario
        FROM informacion_adicional ia
        LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
        ORDER BY ia.fecha_registro DESC
      `);

      return rows.map(row => new AdditionalInfo(row));
    } catch (error) {
      console.error('Error al obtener información adicional:', error);
      throw new Error('Error al obtener información adicional de la base de datos');
    }
  }

  /**
   * Obtener información adicional por ID
   * @param {number} id - ID del registro
   * @returns {Promise<AdditionalInfo|null>}
   */
  async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT ia.*, u.nombre as nombre_usuario
         FROM informacion_adicional ia
         LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
         WHERE ia.id_adicional = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return new AdditionalInfo(rows[0]);
    } catch (error) {
      console.error('Error al obtener información adicional por ID:', error);
      throw new Error('Error al obtener información adicional');
    }
  }

  /**
   * Obtener información adicional de un usuario específico
   * @param {bigint} idUsuario - Cédula del usuario
   * @returns {Promise<AdditionalInfo|null>}
   */
  async findByUserId(idUsuario) {
    try {
      console.log(`[MySQLAdditionalInfoRepository] 🔍 Buscando cuestionario para idUsuario:`, idUsuario);
      console.log(`[MySQLAdditionalInfoRepository] Tipo de idUsuario:`, typeof idUsuario);
      
      const [rows] = await pool.query(
        `SELECT ia.*, u.nombre as nombre_usuario
         FROM informacion_adicional ia
         LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
         WHERE ia.id_usuario = ?
         ORDER BY ia.fecha_registro DESC
         LIMIT 1`,
        [idUsuario]
      );

      console.log(`[MySQLAdditionalInfoRepository] 📊 Filas encontradas:`, rows.length);
      if (rows.length > 0) {
        console.log(`[MySQLAdditionalInfoRepository] ✅ Registro encontrado:`, {
          id_adicional: rows[0].id_adicional,
          id_usuario: rows[0].id_usuario,
          ciudad: rows[0].ciudad
        });
      } else {
        console.log(`[MySQLAdditionalInfoRepository] ❌ No se encontró registro`);
      }

      if (rows.length === 0) {
        return null;
      }

      return new AdditionalInfo(rows[0]);
    } catch (error) {
      console.error('[MySQLAdditionalInfoRepository] ❌ Error al obtener información adicional por usuario:', error);
      throw new Error('Error al obtener información adicional del usuario');
    }
  }

  /**
   * Crear o actualizar información adicional de un usuario
   * Si ya existe, actualiza; si no, crea nuevo
   * @param {AdditionalInfo} additionalInfo - Entidad de información adicional
   * @returns {Promise<AdditionalInfo>}
   */
  async save(additionalInfo) {
    try {
      const exists = await this.existsByUserId(additionalInfo.id_usuario);

      if (exists) {
        // Actualizar existente
        const existing = await this.findByUserId(additionalInfo.id_usuario);
        return await this.update(existing.id_adicional, additionalInfo.toDB());
      } else {
        // Crear nuevo
        return await this.create(additionalInfo);
      }
    } catch (error) {
      console.error('Error al guardar información adicional:', error);
      throw error;
    }
  }

  /**
   * Crear nueva información adicional
   * @param {AdditionalInfo} additionalInfo - Entidad de información adicional
   * @returns {Promise<AdditionalInfo>}
   */
  async create(additionalInfo) {
    try {
      const data = additionalInfo.toDB();
      
      // Remover el ID ya que es AUTO_INCREMENT
      delete data.id_adicional;

      const [result] = await pool.query(
        'INSERT INTO informacion_adicional SET ?',
        data
      );

      // Obtener el registro recién creado
      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error al crear información adicional:', error);
      
      // Manejar errores específicos
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('El usuario especificado no existe');
      }
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('El usuario ya tiene información adicional registrada');
      }
      
      throw new Error('Error al crear la información adicional en la base de datos');
    }
  }

  /**
   * Actualizar información adicional existente
   * @param {number} id - ID del registro
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<AdditionalInfo>}
   */
  async update(id, data) {
    try {
      // Preparar datos para actualización
      const updateData = { ...data };
      delete updateData.id_adicional;
      delete updateData.id_usuario; // No permitir cambiar el usuario
      delete updateData.fecha_registro; // No permitir cambiar la fecha

      // Convertir arrays a JSON si están presentes
      if (updateData.medio_desplazamiento && Array.isArray(updateData.medio_desplazamiento)) {
        updateData.medio_desplazamiento = JSON.stringify(updateData.medio_desplazamiento);
      }
      if (updateData.riesgos && Array.isArray(updateData.riesgos)) {
        updateData.riesgos = JSON.stringify(updateData.riesgos);
      }
      if (updateData.causas && Array.isArray(updateData.causas)) {
        updateData.causas = JSON.stringify(updateData.causas);
      }
      if (updateData.causas_comparendo && Array.isArray(updateData.causas_comparendo)) {
        updateData.causas_comparendo = JSON.stringify(updateData.causas_comparendo);
      }

      // Si no hay datos para actualizar
      if (Object.keys(updateData).length === 0) {
        return await this.findById(id);
      }

      const [result] = await pool.query(
        'UPDATE informacion_adicional SET ? WHERE id_adicional = ?',
        [updateData, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Información adicional no encontrada');
      }

      return await this.findById(id);
    } catch (error) {
      console.error('Error al actualizar información adicional:', error);
      
      if (error.message === 'Información adicional no encontrada') {
        throw error;
      }
      
      throw new Error('Error al actualizar la información adicional');
    }
  }

  /**
   * Eliminar información adicional
   * @param {number} id - ID del registro
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM informacion_adicional WHERE id_adicional = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar información adicional:', error);
      throw new Error('Error al eliminar la información adicional');
    }
  }

  /**
   * Verificar si un usuario ya tiene información adicional registrada
   * @param {bigint} idUsuario - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async existsByUserId(idUsuario) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM informacion_adicional WHERE id_usuario = ?',
        [idUsuario]
      );

      return rows[0].count > 0;
    } catch (error) {
      console.error('Error al verificar existencia:', error);
      throw new Error('Error al verificar información adicional');
    }
  }

  /**
   * Obtener estadísticas generales del cuestionario
   * @returns {Promise<Object>}
   */
  async getStats() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(*) as total_registros,
          SUM(CASE WHEN consentimiento = 'SI' THEN 1 ELSE 0 END) as con_consentimiento,
          SUM(CASE WHEN licencia = 'SI' THEN 1 ELSE 0 END) as con_licencia,
          SUM(CASE WHEN accidente_5_anios = 'SI' THEN 1 ELSE 0 END) as con_accidentes,
          SUM(CASE WHEN accidente_laboral = 'SI' THEN 1 ELSE 0 END) as con_accidentes_laborales,
          SUM(CASE WHEN tiene_comparendos = 'SI' THEN 1 ELSE 0 END) as con_comparendos,
          SUM(CASE WHEN usa_vehiculo_empresa = 'SI' THEN 1 ELSE 0 END) as usan_vehiculo_empresa,
          SUM(CASE WHEN licencia = 'SI' AND vigencia_licencia < CURDATE() THEN 1 ELSE 0 END) as licencias_vencidas,
          AVG(km_mensuales) as km_promedio_mensual
        FROM informacion_adicional
      `);

      // Estadísticas por género
      const [genderStats] = await pool.query(`
        SELECT genero, COUNT(*) as cantidad
        FROM informacion_adicional
        WHERE genero IS NOT NULL
        GROUP BY genero
      `);

      // Estadísticas por edad
      const [ageStats] = await pool.query(`
        SELECT edad, COUNT(*) as cantidad
        FROM informacion_adicional
        WHERE edad IS NOT NULL
        GROUP BY edad
        ORDER BY edad
      `);

      return {
        general: {
          totalRegistros: stats[0].total_registros || 0,
          conConsentimiento: stats[0].con_consentimiento || 0,
          conLicencia: stats[0].con_licencia || 0,
          conAccidentes: stats[0].con_accidentes || 0,
          conAccidentesLaborales: stats[0].con_accidentes_laborales || 0,
          conComparendos: stats[0].con_comparendos || 0,
          usanVehiculoEmpresa: stats[0].usan_vehiculo_empresa || 0,
          licenciasVencidas: stats[0].licencias_vencidas || 0,
          kmPromedioMensual: parseFloat(stats[0].km_promedio_mensual) || 0
        },
        porGenero: genderStats.reduce((acc, row) => {
          acc[row.genero] = row.cantidad;
          return acc;
        }, {}),
        porEdad: ageStats.reduce((acc, row) => {
          acc[row.edad] = row.cantidad;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('Error al calcular estadísticas');
    }
  }

  /**
   * Obtener usuarios con licencias vencidas
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findExpiredLicenses() {
    try {
      const [rows] = await pool.query(`
        SELECT ia.*, u.nombre as nombre_usuario
        FROM informacion_adicional ia
        LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
        WHERE ia.licencia = 'SI'
        AND ia.vigencia_licencia < CURDATE()
        ORDER BY ia.vigencia_licencia ASC
      `);

      return rows.map(row => new AdditionalInfo(row));
    } catch (error) {
      console.error('Error al obtener licencias vencidas:', error);
      throw new Error('Error al obtener licencias vencidas');
    }
  }

  /**
   * Obtener usuarios con licencias próximas a vencer
   * @param {number} dias - Días de anticipación (default: 30)
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findUpcomingLicenseExpiry(dias = 30) {
    try {
      const [rows] = await pool.query(`
        SELECT ia.*, u.nombre as nombre_usuario
        FROM informacion_adicional ia
        LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
        WHERE ia.licencia = 'SI'
        AND ia.vigencia_licencia > CURDATE()
        AND ia.vigencia_licencia <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
        ORDER BY ia.vigencia_licencia ASC
      `, [dias]);

      return rows.map(row => new AdditionalInfo(row));
    } catch (error) {
      console.error('Error al obtener licencias próximas a vencer:', error);
      throw new Error('Error al obtener licencias próximas a vencer');
    }
  }

  /**
   * Obtener usuarios de alto riesgo
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findHighRiskUsers() {
    try {
      const [rows] = await pool.query(`
        SELECT ia.*, u.nombre as nombre_usuario
        FROM informacion_adicional ia
        LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
        WHERE (
          ia.accidente_5_anios = 'SI'
          OR ia.tiene_comparendos = 'SI'
          OR (ia.licencia = 'SI' AND ia.vigencia_licencia < CURDATE())
          OR ia.km_mensuales > 3000
        )
        ORDER BY ia.fecha_registro DESC
      `);

      return rows.map(row => new AdditionalInfo(row));
    } catch (error) {
      console.error('Error al obtener usuarios de alto riesgo:', error);
      throw new Error('Error al obtener usuarios de alto riesgo');
    }
  }

  /**
   * Obtener usuarios que tuvieron accidentes
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findUsersWithAccidents() {
    try {
      const [rows] = await pool.query(`
        SELECT ia.*, u.nombre as nombre_usuario
        FROM informacion_adicional ia
        LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
        WHERE ia.accidente_5_anios = 'SI'
        ORDER BY ia.fecha_registro DESC
      `);

      return rows.map(row => new AdditionalInfo(row));
    } catch (error) {
      console.error('Error al obtener usuarios con accidentes:', error);
      throw new Error('Error al obtener usuarios con accidentes');
    }
  }

  /**
   * Obtener usuarios con comparendos
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findUsersWithComparendos() {
    try {
      const [rows] = await pool.query(`
        SELECT ia.*, u.nombre as nombre_usuario
        FROM informacion_adicional ia
        LEFT JOIN usuarios u ON ia.id_usuario = u.id_cedula
        WHERE ia.tiene_comparendos = 'SI'
        ORDER BY ia.fecha_registro DESC
      `);

      return rows.map(row => new AdditionalInfo(row));
    } catch (error) {
      console.error('Error al obtener usuarios con comparendos:', error);
      throw new Error('Error al obtener usuarios con comparendos');
    }
  }
}

export default MySQLAdditionalInfoRepository;
