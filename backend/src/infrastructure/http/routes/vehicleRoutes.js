// =====================================================
// INFRASTRUCTURE LAYER - VEHICLE HTTP ROUTES
// =====================================================
// Define las rutas HTTP para vehículos

import express from 'express';
import { 
  validateCreateVehicle,
  validateUpdateVehicle,
  validateGetVehicleByPlaca,
  handleValidationErrors 
} from '../../middlewares/validator.js';
import { writeLimiter } from '../../middlewares/rateLimiter.js';
import { verifyToken, requireSupervisor } from '../../middlewares/auth.middleware.js';
import { uploadSingle } from '../../config/multer.config.js';

/**
 * Crea el router de vehículos
 * @param {VehicleController} vehicleController - Controlador de vehículos
 * @returns {express.Router}
 */
export const createVehicleRouter = (vehicleController) => {
  const router = express.Router();

  // ==============================================
  // RUTAS DE CONSULTA (Requieren autenticación)
  // ==============================================

  /**
   * GET /api/vehicles/stats
   * Estadísticas de vehículos
   * Protección: Token JWT requerido
   */
  router.get('/stats', 
    verifyToken,
    vehicleController.getVehicleStats
  );

  /**
   * GET /api/vehicles/driver/:id_usuario
   * Vehículos por conductor
   * Protección: Token JWT requerido
   */
  router.get('/driver/:id_usuario', 
    verifyToken,
    vehicleController.getVehiclesByDriver
  );

  /**
   * GET /api/vehicles
   * Listar todos los vehículos (con filtro opcional ?status=...)
   * Protección: Token JWT requerido
   */
  router.get('/', 
    verifyToken,
    vehicleController.getAllVehicles
  );

  /**
   * GET /api/vehicles/:id
   * Obtener un vehículo por placa
   * Protección: Token JWT requerido + validación de placa
   */
  router.get('/:id', 
    verifyToken,
    validateGetVehicleByPlaca,
    handleValidationErrors,
    vehicleController.getVehicleById
  );

  // ==============================================
  // RUTAS DE MODIFICACIÓN (Requieren Supervisor+)
  // ==============================================

  /**
   * POST /api/vehicles
   * Crear nuevo vehículo
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   * - Validación de datos obligatorios
   * 
   * Body requerido:
   * {
   *   "placa": "ABC-123"
   * }
   */
  router.post('/', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    validateCreateVehicle,
    handleValidationErrors,
    vehicleController.createVehicle
  );

  /**
   * PUT /api/vehicles/:id
   * Actualizar vehículo existente
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   * - Validación de datos
   */
  router.put('/:id', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    validateUpdateVehicle,
    handleValidationErrors,
    vehicleController.updateVehicle
  );

  /**
   * DELETE /api/vehicles/:id
   * Eliminar vehículo
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   */
  router.delete('/:id', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    vehicleController.deleteVehicle
  );

  // ==============================================
  // RUTAS DE DOCUMENTOS (SOAT y Tecnomecánica)
  // ==============================================

  /**
   * POST /api/vehicles/:placa/documents
   * Subir documento (SOAT o Tecnomecánica)
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   * - Multer para manejar archivos
   * 
   * Body (multipart/form-data):
   * - file: archivo (PDF, JPG, JPEG, PNG - máx 5MB)
   * - docType: "soat" o "tecno"
   * - placa: placa del vehículo
   */
  router.post('/:placa/documents', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    uploadSingle('file'),
    vehicleController.uploadDocument
  );

  /**
   * GET /api/vehicles/:placa/documents/:docType
   * Descargar documento (SOAT o Tecnomecánica)
   * 
   * Protecciones:
   * - Token JWT requerido
   */
  router.get('/:placa/documents/:docType', 
    verifyToken,
    vehicleController.downloadDocument
  );

  /**
   * DELETE /api/vehicles/:placa/documents/:docType
   * Eliminar documento (SOAT o Tecnomecánica)
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   */
  router.delete('/:placa/documents/:docType', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    vehicleController.deleteDocument
  );

  return router;
};
