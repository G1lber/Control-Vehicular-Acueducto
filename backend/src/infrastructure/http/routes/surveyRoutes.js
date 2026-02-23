/**
 * Rutas HTTP para Información Adicional (Cuestionario PESV)
 * 
 * Parte de INFRASTRUCTURE/HTTP (Capa de Infraestructura - Arquitectura Hexagonal)
 * Define las rutas HTTP que conectan con el controlador
 */

import { Router } from 'express';
import { 
  validateSurvey, 
  validateGetSurveyByCedula,
  handleValidationErrors 
} from '../../middlewares/validator.js';
import { writeLimiter } from '../../middlewares/rateLimiter.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

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
   * Protección: Token JWT requerido
   * 
   * Respuesta:
   * {
   *   general: { totalRegistros, conLicencia, conAccidentes, ... },
   *   porGenero: { Masculino: 10, Femenino: 5 },
   *   porEdad: { "28-37": 8, "38-48": 7, ... }
   * }
   */
  router.get('/stats', 
    verifyToken,
    additionalInfoController.getSurveyStats
  );

  /**
   * GET /api/survey/alerts
   * Obtener alertas de seguridad vial
   * (licencias vencidas, próximas a vencer, usuarios alto riesgo, etc.)
   * 
   * Protección: Token JWT requerido
   */
  router.get('/alerts', 
    verifyToken,
    additionalInfoController.getSecurityAlerts
  );

  /**
   * GET /api/survey/expired-licenses
   * Obtener usuarios con licencias vencidas
   * 
   * Protección: Token JWT requerido
   */
  router.get('/expired-licenses', 
    verifyToken,
    additionalInfoController.getExpiredLicenses
  );

  /**
   * GET /api/survey/upcoming-licenses
   * Obtener usuarios con licencias próximas a vencer
   * Query params: dias (default: 30)
   * 
   * Protección: Token JWT requerido
   * Ejemplo: GET /api/survey/upcoming-licenses?dias=15
   */
  router.get('/upcoming-licenses', 
    verifyToken,
    additionalInfoController.getUpcomingLicenses
  );

  /**
   * GET /api/survey/high-risk
   * Obtener usuarios de alto riesgo
   * (con accidentes, comparendos, licencia vencida, alto kilometraje)
   * 
   * Protección: Token JWT requerido
   */
  router.get('/high-risk', 
    verifyToken,
    additionalInfoController.getHighRiskUsers
  );

  /**
   * GET /api/survey/with-accidents
   * Obtener usuarios que tuvieron accidentes en los últimos 5 años
   * 
   * Protección: Token JWT requerido
   */
  router.get('/with-accidents', 
    verifyToken,
    additionalInfoController.getUsersWithAccidents
  );

  /**
   * GET /api/survey/with-comparendos
   * Obtener usuarios con comparendos de tránsito
   * 
   * Protección: Token JWT requerido
   */
  router.get('/with-comparendos', 
    verifyToken,
    additionalInfoController.getUsersWithComparendos
  );

  /**
   * GET /api/survey/user/:idUsuario
   * Obtener cuestionario de un usuario específico por su cédula
   * 
   * Ejemplo: GET /api/survey/user/1234567890
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Validación del formato de cédula
   */
  router.get('/user/:cedula', 
    verifyToken,
    validateGetSurveyByCedula,
    handleValidationErrors,
    additionalInfoController.getSurveyByUserId
  );

  /**
   * GET /api/survey/:id
   * Obtener cuestionario por ID del registro
   * 
   * Protección: Token JWT requerido
   * Ejemplo: GET /api/survey/5
   */
  router.get('/:id', 
    verifyToken,
    additionalInfoController.getSurveyById
  );

  /**
   * GET /api/survey
   * Listar todos los cuestionarios registrados
   * 
   * Protección: Token JWT requerido
   */
  router.get('/', 
    verifyToken,
    additionalInfoController.getAllSurveys
  );

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
   * 
   * Protecciones:
   * - Token JWT requerido (cualquier usuario autenticado)
   * - Rate limiting: Máximo 20 envíos por minuto
   * - Validación de datos obligatorios y formatos
   */
  router.post('/', 
    verifyToken,
    writeLimiter,
    validateSurvey,
    handleValidationErrors,
    additionalInfoController.saveSurvey
  );

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
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rate limiting: Máximo 20 actualizaciones por minuto
   */
  router.put('/:id', 
    verifyToken,
    writeLimiter,
    additionalInfoController.updateSurvey
  );

  /**
   * DELETE /api/survey/:id
   * Eliminar cuestionario
   * 
   * Ejemplo: DELETE /api/survey/5
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rate limiting: Máximo 20 eliminaciones por minuto
   */
  router.delete('/:id', 
    verifyToken,
    writeLimiter,
    additionalInfoController.deleteSurvey
  );

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
