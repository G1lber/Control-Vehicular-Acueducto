/**
 * AdditionalInfoController - Controlador HTTP para Información Adicional (Cuestionario PESV)
 * 
 * Parte de INFRASTRUCTURE/HTTP (Capa de Infraestructura - Arquitectura Hexagonal)
 * Maneja las peticiones HTTP y delega la lógica a los casos de uso
 */

class AdditionalInfoController {
  constructor(additionalInfoUseCases) {
    this.additionalInfoUseCases = additionalInfoUseCases;
  }

  /**
   * GET /api/survey
   * Obtener todos los cuestionarios
   */
  getAllSurveys = async (req, res) => {
    try {
      const surveys = await this.additionalInfoUseCases.getAllSurveys();

      res.json({
        success: true,
        data: surveys,
        count: surveys.length
      });
    } catch (error) {
      console.error('Error en getAllSurveys:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuestionarios',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/stats
   * Obtener estadísticas del cuestionario
   */
  getSurveyStats = async (req, res) => {
    try {
      const stats = await this.additionalInfoUseCases.getSurveyStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error en getSurveyStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/alerts
   * Obtener alertas de seguridad vial
   */
  getSecurityAlerts = async (req, res) => {
    try {
      const alerts = await this.additionalInfoUseCases.getSecurityAlerts();

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error en getSecurityAlerts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener alertas',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/expired-licenses
   * Obtener usuarios con licencias vencidas
   */
  getExpiredLicenses = async (req, res) => {
    try {
      const users = await this.additionalInfoUseCases.getUsersWithExpiredLicenses();

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getExpiredLicenses:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener licencias vencidas',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/upcoming-licenses
   * Obtener usuarios con licencias próximas a vencer
   */
  getUpcomingLicenses = async (req, res) => {
    try {
      const dias = parseInt(req.query.dias) || 30;
      const users = await this.additionalInfoUseCases.getUsersWithUpcomingLicenseExpiry(dias);

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getUpcomingLicenses:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener licencias próximas a vencer',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/high-risk
   * Obtener usuarios de alto riesgo
   */
  getHighRiskUsers = async (req, res) => {
    try {
      const users = await this.additionalInfoUseCases.getHighRiskUsers();

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getHighRiskUsers:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios de alto riesgo',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/with-accidents
   * Obtener usuarios con accidentes
   */
  getUsersWithAccidents = async (req, res) => {
    try {
      const users = await this.additionalInfoUseCases.getUsersWithAccidents();

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getUsersWithAccidents:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios con accidentes',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/with-comparendos
   * Obtener usuarios con comparendos
   */
  getUsersWithComparendos = async (req, res) => {
    try {
      const users = await this.additionalInfoUseCases.getUsersWithComparendos();

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getUsersWithComparendos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios con comparendos',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/user/:cedula
   * Obtener cuestionario de un usuario específico
   */
  getSurveyByUserId = async (req, res) => {
    try {
      const { cedula } = req.params;  // Cambio: de idUsuario a cedula
      const survey = await this.additionalInfoUseCases.getSurveyByUserId(cedula);

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'El usuario no tiene cuestionario registrado'
        });
      }

      res.json({
        success: true,
        data: survey
      });
    } catch (error) {
      console.error('Error en getSurveyByUserId:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuestionario del usuario',
        error: error.message
      });
    }
  };

  /**
   * GET /api/survey/:id
   * Obtener cuestionario por ID
   */
  getSurveyById = async (req, res) => {
    try {
      const { id } = req.params;
      const survey = await this.additionalInfoUseCases.getSurveyById(parseInt(id));

      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Cuestionario no encontrado'
        });
      }

      res.json({
        success: true,
        data: survey
      });
    } catch (error) {
      console.error('Error en getSurveyById:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuestionario',
        error: error.message
      });
    }
  };

  /**
   * POST /api/survey
   * Crear o actualizar cuestionario (automático)
   */
  saveSurvey = async (req, res) => {
    try {
      const data = this._transformRequestData(req.body);

      // Validar campos mínimos
      if (!data.id_usuario || !data.consentimiento) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
          required: ['idUsuario', 'consentimiento']
        });
      }

      const survey = await this.additionalInfoUseCases.saveSurvey(data);

      const statusCode = survey.id ? 200 : 201;
      res.status(statusCode).json({
        success: true,
        message: statusCode === 201 
          ? 'Cuestionario registrado exitosamente' 
          : 'Cuestionario actualizado exitosamente',
        data: survey
      });
    } catch (error) {
      console.error('Error en saveSurvey:', error);

      if (error.message.includes('Datos inválidos')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('usuario especificado no existe')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al guardar cuestionario',
        error: error.message
      });
    }
  };

  /**
   * PUT /api/survey/:id
   * Actualizar cuestionario existente
   */
  updateSurvey = async (req, res) => {
    try {
      const { id } = req.params;
      const data = this._transformRequestData(req.body);

      const survey = await this.additionalInfoUseCases.updateSurvey(parseInt(id), data);

      res.json({
        success: true,
        message: 'Cuestionario actualizado exitosamente',
        data: survey
      });
    } catch (error) {
      console.error('Error en updateSurvey:', error);

      if (error.message === 'Cuestionario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Datos inválidos')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar cuestionario',
        error: error.message
      });
    }
  };

  /**
   * DELETE /api/survey/:id
   * Eliminar cuestionario
   */
  deleteSurvey = async (req, res) => {
    try {
      const { id } = req.params;
      await this.additionalInfoUseCases.deleteSurvey(parseInt(id));

      res.json({
        success: true,
        message: 'Cuestionario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en deleteSurvey:', error);

      if (error.message === 'Cuestionario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al eliminar cuestionario',
        error: error.message
      });
    }
  };

  /**
   * Helper: Transformar nombres de campos del frontend (camelCase) a la BD (snake_case)
   * @private
   */
  _transformRequestData(body) {
    const mapping = {
      idUsuario: 'id_usuario',
      fechaRegistro: 'fecha_registro',
      sitioLabor: 'sitio_labor',
      tipoContratacion: 'tipo_contratacion',
      grupoOtro: 'grupo_otro',
      medioTransporteDesplazamiento: 'medio_transporte_desplazamiento',
      claseVehiculo: 'clase_vehiculo',
      claseVehiculoOtro: 'clase_vehiculo_otro',
      vigenciaLicencia: 'vigencia_licencia',
      categoriaLicencia: 'categoria_licencia',
      accidente5Anios: 'accidente_5_anios',
      accidenteLaboral: 'accidente_laboral',
      cantidadAccidentes: 'cantidad_accidentes',
      cantidadAccidentesLaborales: 'cantidad_accidentes_laborales',
      rolAccidente: 'rol_accidente',
      viasPublicas: 'vias_publicas',
      frecuenciaVehiculoPropio: 'frecuencia_vehiculo_propio',
      tipoVehiculoPropio: 'tipo_vehiculo_propio',
      tipoVehiculoPropioOtro: 'tipo_vehiculo_propio_otro',
      empresaPagaRodamiento: 'empresa_paga_rodamiento',
      realizaInspeccionPropio: 'realiza_inspeccion_propio',
      frecuenciaChequeoPropio: 'frecuencia_chequeo_propio',
      usaVehiculoEmpresa: 'usa_vehiculo_empresa',
      tipoVehiculoEmpresa: 'tipo_vehiculo_empresa',
      tipoVehiculoEmpresaOtro: 'tipo_vehiculo_empresa_otro',
      realizaInspeccionEmpresa: 'realiza_inspeccion_empresa',
      frecuenciaChequeoEmpresa: 'frecuencia_chequeo_empresa',
      kmMensuales: 'km_mensuales',
      tieneComparendos: 'tiene_comparendos',
      medioDesplazamiento: 'medio_desplazamiento',
      causasComparendo: 'causas_comparendo',
      riesgoOtro: 'riesgo_otro',
      causaOtra: 'causa_otra',
      causaComparendoOtra: 'causa_comparendo_otra',
      informacionAdicional: 'informacion_adicional'
    };

    const transformed = {};
    for (const [key, value] of Object.entries(body)) {
      const dbKey = mapping[key] || key;
      transformed[dbKey] = value;
    }

    return transformed;
  }
}

export default AdditionalInfoController;
