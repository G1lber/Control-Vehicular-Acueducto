/**
 * Rutas HTTP para Información Adicional (Cuestionario PESV)
 * 
 * Parte de INFRASTRUCTURE/HTTP (Capa de Infraestructura - Arquitectura Hexagonal)
 * Define las rutas HTTP que conectan con el controlador
 */

import { Router } from 'express';

/**
 * Factory function para crear las rutas del cuestionario
 * @param {AdditionalInfoController} additionalInfoController - Controlador
 * @returns {Router} Router de Express con las rutas configuradas
 */
export function createSurveyRoutes(additionalInfoController) {
  const router = Router();

  // ==========================================
  // RUTAS DE CONSULTA ESPECIALIZADAS
  // ==========================================

  /**
   * GET /api/survey/stats
   * Obtener estadísticas del cuestionario
   * 
   * Respuesta:
   * {
   *   general: { totalRegistros, conLicencia, conAccidentes, ... },
   *   porGenero: { Masculino: 10, Femenino: 5 },
   *   porEdad: { "28-37": 8, "38-48": 7, ... }
   * }
   */
  router.get('/stats', additionalInfoController.getSurveyStats);

  /**
   * GET /api/survey/alerts
   * Obtener alertas de seguridad vial
   * (licencias vencidas, próximas a vencer, usuarios alto riesgo, etc.)
   */
  router.get('/alerts', additionalInfoController.getSecurityAlerts);

  /**
   * GET /api/survey/expired-licenses
   * Obtener usuarios con licencias vencidas
   */
  router.get('/expired-licenses', additionalInfoController.getExpiredLicenses);

  /**
   * GET /api/survey/upcoming-licenses
   * Obtener usuarios con licencias próximas a vencer
   * Query params: dias (default: 30)
   * 
   * Ejemplo: GET /api/survey/upcoming-licenses?dias=15
   */
  router.get('/upcoming-licenses', additionalInfoController.getUpcomingLicenses);

  /**
   * GET /api/survey/high-risk
   * Obtener usuarios de alto riesgo
   * (con accidentes, comparendos, licencia vencida, alto kilometraje)
   */
  router.get('/high-risk', additionalInfoController.getHighRiskUsers);

  /**
   * GET /api/survey/with-accidents
   * Obtener usuarios que tuvieron accidentes en los últimos 5 años
   */
  router.get('/with-accidents', additionalInfoController.getUsersWithAccidents);

  /**
   * GET /api/survey/with-comparendos
   * Obtener usuarios con comparendos de tránsito
   */
  router.get('/with-comparendos', additionalInfoController.getUsersWithComparendos);

  /**
   * GET /api/survey/user/:idUsuario
   * Obtener cuestionario de un usuario específico por su cédula
   * 
   * Ejemplo: GET /api/survey/user/1234567890
   */
  router.get('/user/:idUsuario', additionalInfoController.getSurveyByUserId);

  /**
   * GET /api/survey/:id
   * Obtener cuestionario por ID del registro
   * 
   * Ejemplo: GET /api/survey/5
   */
  router.get('/:id', additionalInfoController.getSurveyById);

  /**
   * GET /api/survey
   * Listar todos los cuestionarios registrados
   */
  router.get('/', additionalInfoController.getAllSurveys);

  // ==========================================
  // RUTAS DE MODIFICACIÓN
  // ==========================================

  /**
   * POST /api/survey
   * Crear o actualizar cuestionario (automático)
   * Si el usuario ya tiene cuestionario, lo actualiza; si no, lo crea
   * 
   * Body requerido:
   * {
   *   "idUsuario": 1234567890,
   *   "consentimiento": "SI"
   * }
   * 
   * Body opcional (54+ campos):
   * {
   *   "ciudad": "Bogotá",
   *   "cargo": "Conductor",
   *   "edad": "28-37",
   *   "genero": "Masculino",
   *   "licencia": "SI",
   *   "vigenciaLicencia": "2027-12-31",
   *   "categoriaLicencia": "B1",
   *   "accidente5Anios": "NO",
   *   "tieneComparendos": "NO",
   *   "medioDesplazamiento": ["Conduciendo propio", "Transporte publico"],
   *   "riesgos": ["Infraestructura", "Clima"],
   *   "causas": ["Trafico", "Vehiculo"],
   *   "causasComparendo": [],
   *   "kmMensuales": 350,
   *   ...
   * }
   */
  router.post('/', additionalInfoController.saveSurvey);

  /**
   * PUT /api/survey/:id
   * Actualizar cuestionario existente por ID
   * 
   * Body: Cualquier campo del cuestionario que se desee actualizar
   * 
   * Ejemplo: PUT /api/survey/5
   * {
   *   "licencia": "SI",
   *   "vigenciaLicencia": "2028-06-30",
   *   "categoriaLicencia": "C1"
   * }
   */
  router.put('/:id', additionalInfoController.updateSurvey);

  /**
   * DELETE /api/survey/:id
   * Eliminar cuestionario
   * 
   * Ejemplo: DELETE /api/survey/5
   */
  router.delete('/:id', additionalInfoController.deleteSurvey);

  return router;
}

// ==========================================
// DOCUMENTACIÓN DE CAMPOS
// ==========================================

/**
 * CAMPOS DEL CUESTIONARIO (54+ campos):
 * 
 * IDENTIFICACIÓN:
 * - idUsuario (bigint, requerido)
 * - consentimiento (SI/NO, requerido)
 * 
 * DATOS BÁSICOS:
 * - ciudad, sitioLabor, cargo
 * 
 * PERSONALES:
 * - edad, tipoContratacion, genero (Masculino/Femenino)
 * - grupo, grupoOtro
 * 
 * TRANSPORTE:
 * - medioTransporteDesplazamiento
 * - claseVehiculo, claseVehiculoOtro
 * 
 * LICENCIA:
 * - licencia (SI/NO)
 * - vigenciaLicencia (fecha YYYY-MM-DD)
 * - categoriaLicencia (A1, A2, B1, B2, B3, C1, C2, C3)
 * - experiencia
 * 
 * ACCIDENTES:
 * - accidente5Anios (SI/NO)
 * - accidenteLaboral (SI/NO)
 * - cantidadAccidentes, cantidadAccidentesLaborales
 * - rolAccidente, incidente (SI/NO)
 * 
 * DESPLAZAMIENTOS:
 * - viasPublicas (SI/NO)
 * - medioDesplazamiento (array de strings)
 * - frecuenciaVehiculoPropio
 * - tipoVehiculoPropio, tipoVehiculoPropioOtro
 * - empresaPagaRodamiento (SI/NO)
 * - realizaInspeccionPropio (SI/NO)
 * - frecuenciaChequeoPropio
 * 
 * VEHÍCULO EMPRESA:
 * - usaVehiculoEmpresa (SI/NO)
 * - tipoVehiculoEmpresa, tipoVehiculoEmpresaOtro
 * - realizaInspeccionEmpresa (SI/NO)
 * - frecuenciaChequeoEmpresa
 * 
 * PLANIFICACIÓN:
 * - planificacion, antelacion
 * - kmMensuales (número)
 * 
 * COMPARENDOS:
 * - tieneComparendos (SI/NO)
 * - causasComparendo (array de strings)
 * - causaComparendoOtra
 * 
 * RIESGOS:
 * - riesgos (array de strings)
 * - riesgoOtro
 * - causas (array de strings)
 * - causaOtra
 * 
 * ADICIONAL:
 * - informacionAdicional (texto libre)
 * 
 * CÓDIGOS DE ESTADO HTTP:
 * - 200: Operación exitosa
 * - 201: Recurso creado exitosamente
 * - 400: Datos inválidos (validación fallida)
 * - 404: Recurso no encontrado
 * - 500: Error interno del servidor
 */
