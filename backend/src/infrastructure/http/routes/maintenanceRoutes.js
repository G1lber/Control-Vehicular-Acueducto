/**
 * Rutas HTTP para Mantenimientos
 * 
 * Parte de INFRASTRUCTURE/HTTP (Capa de Infraestructura - Arquitectura Hexagonal)
 * Define las rutas HTTP que conectan con el controlador
 */

import { Router } from 'express';
import {
  validateCreateMaintenance,
  validateUpdateMaintenance,
  validateGetMaintenanceById,
  handleValidationErrors
} from '../../middlewares/validator.js';
import { writeLimiter } from '../../middlewares/rateLimiter.js';
import { verifyToken, requireSupervisor } from '../../middlewares/auth.middleware.js';

/**
 * Factory function para crear las rutas de mantenimientos
 * @param {MaintenanceController} maintenanceController - Controlador de mantenimientos
 * @returns {Router} Router de Express con las rutas configuradas
 */
export function createMaintenanceRoutes(maintenanceController) {
  const router = Router();

  // ==========================================
  // RUTAS DE CONSULTA (Requieren autenticación)
  // ==========================================

  /**
   * GET /api/maintenances/stats
   * Obtener estadísticas de mantenimientos (costos, conteo por tipo)
   * Query params opcionales: placa, tipo, fechaInicio, fechaFin
   * 
   * Protección: Token JWT requerido
   * Ejemplo: GET /api/maintenances/stats?placa=ABC-123
   */
  router.get('/stats', 
    verifyToken,
    maintenanceController.getMaintenanceStats
  );

  /**
   * GET /api/maintenances/alerts
   * Obtener alertas de mantenimientos (vencidos y próximos)
   * 
   * Protección: Token JWT requerido
   * Respuesta:
   * {
   *   vencidos: [...],
   *   proximos: [...],
   *   totalVencidos: 5,
   *   totalProximos: 3
   * }
   */
  router.get('/alerts', 
    verifyToken,
    maintenanceController.getMaintenanceAlerts
  );

  /**
   * GET /api/maintenances/upcoming
   * Obtener mantenimientos próximos a vencer
   * Query params: dias (default: 30)
   * 
   * Protección: Token JWT requerido
   * Ejemplo: GET /api/maintenances/upcoming?dias=15
   */
  router.get('/upcoming', 
    verifyToken,
    maintenanceController.getUpcomingMaintenances
  );

  /**
   * GET /api/maintenances/overdue
   * Obtener mantenimientos vencidos
   * 
   * Protección: Token JWT requerido
   */
  router.get('/overdue', 
    verifyToken,
    maintenanceController.getOverdueMaintenances
  );

  /**
   * GET /api/maintenances/vehicle/:placa/last
   * Obtener el último mantenimiento de un vehículo específico
   * 
   * Protección: Token JWT requerido
   * Ejemplo: GET /api/maintenances/vehicle/ABC-123/last
   */
  router.get('/vehicle/:placa/last', 
    verifyToken,
    maintenanceController.getLastMaintenanceByVehicle
  );

  /**
   * GET /api/maintenances/:id
   * Obtener un mantenimiento específico por ID
   * 
   * Protección: Token JWT requerido + validación de ID
   * Ejemplo: GET /api/maintenances/5
   */
  router.get('/:id', 
    verifyToken,
    validateGetMaintenanceById,
    handleValidationErrors,
    maintenanceController.getMaintenanceById
  );

  /**
   * GET /api/maintenances
   * Listar todos los mantenimientos con filtros opcionales
   * 
   * Protección: Token JWT requerido
   * Query params:
   * - placa: Filtrar por placa de vehículo
   * - tipo: Filtrar por tipo de mantenimiento
   * - year: Filtrar por año
   * - month: Filtrar por mes (requiere year)
   * 
   * Ejemplos:
   * GET /api/maintenances
   * GET /api/maintenances?placa=ABC-123
   * GET /api/maintenances?tipo=Cambio%20de%20aceite
   * GET /api/maintenances?year=2026&month=2
   */
  router.get('/', 
    verifyToken,
    maintenanceController.getAllMaintenances
  );

  // ==========================================
  // RUTAS DE MODIFICACIÓN (Requieren Supervisor+)
  // ==========================================

  /**
   * POST /api/maintenances
   * Crear un nuevo mantenimiento
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   * - Validación de datos obligatorios
   * 
   * Body requerido:
   * {
   *   "placa": "ABC-123",
   *   "tipo": "Cambio de aceite",
   *   "fechaRealizado": "2026-02-20"
   * }
   * 
   * Body opcional:
   * {
   *   "fechaProxima": "2026-05-20",
   *   "kilometraje": 45000,
   *   "costo": 250000.00,
   *   "descripcion": "Cambio de aceite sintético 5W-30",
   *   "informacionAdicional": "Se revisó filtro de aire"
   * }
   */
  router.post('/', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    validateCreateMaintenance,
    handleValidationErrors,
    maintenanceController.createMaintenance
  );

  /**
   * PUT /api/maintenances/:id
   * Actualizar un mantenimiento existente
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   * - Validación de datos
   * 
   * Body: Cualquier campo del mantenimiento que se desee actualizar
   * 
   * Ejemplo: PUT /api/maintenances/5
   * {
   *   "costo": 300000.00,
   *   "descripcion": "Cambio de aceite y filtros"
   * }
   */
  router.put('/:id', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    validateUpdateMaintenance,
    handleValidationErrors,
    maintenanceController.updateMaintenance
  );

  /**
   * DELETE /api/maintenances/:id
   * Eliminar un mantenimiento
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o Administrador
   * - Rate limiting: 20 operaciones por minuto
   * 
   * Ejemplo: DELETE /api/maintenances/5
   */
  router.delete('/:id', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    maintenanceController.deleteMaintenance
  );

  return router;
}

// ==========================================
// DOCUMENTACIÓN DE RESPUESTAS ESTÁNDAR
// ==========================================

/**
 * RESPUESTA EXITOSA:
 * {
 *   "success": true,
 *   "data": {...} | [...],
 *   "count": 10 (opcional, en listados)
 * }
 * 
 * RESPUESTA DE ERROR:
 * {
 *   "success": false,
 *   "message": "Descripción del error"
 * }
 * 
 * CÓDIGOS DE ESTADO HTTP:
 * - 200: Operación exitosa
 * - 201: Recurso creado exitosamente
 * - 400: Datos inválidos (validación fallida)
 * - 404: Recurso no encontrado
 * - 500: Error interno del servidor
 */
