/**
 * Rutas HTTP para Mantenimientos
 * 
 * Parte de INFRASTRUCTURE/HTTP (Capa de Infraestructura - Arquitectura Hexagonal)
 * Define las rutas HTTP que conectan con el controlador
 */

import { Router } from 'express';

/**
 * Factory function para crear las rutas de mantenimientos
 * @param {MaintenanceController} maintenanceController - Controlador de mantenimientos
 * @returns {Router} Router de Express con las rutas configuradas
 */
export function createMaintenanceRoutes(maintenanceController) {
  const router = Router();

  // ==========================================
  // RUTAS DE CONSULTA
  // ==========================================

  /**
   * GET /api/maintenances/stats
   * Obtener estadísticas de mantenimientos (costos, conteo por tipo)
   * Query params opcionales: placa, tipo, fechaInicio, fechaFin
   * 
   * Ejemplo: GET /api/maintenances/stats?placa=ABC-123
   */
  router.get('/stats', maintenanceController.getMaintenanceStats);

  /**
   * GET /api/maintenances/alerts
   * Obtener alertas de mantenimientos (vencidos y próximos)
   * 
   * Respuesta:
   * {
   *   vencidos: [...],
   *   proximos: [...],
   *   totalVencidos: 5,
   *   totalProximos: 3
   * }
   */
  router.get('/alerts', maintenanceController.getMaintenanceAlerts);

  /**
   * GET /api/maintenances/upcoming
   * Obtener mantenimientos próximos a vencer
   * Query params: dias (default: 30)
   * 
   * Ejemplo: GET /api/maintenances/upcoming?dias=15
   */
  router.get('/upcoming', maintenanceController.getUpcomingMaintenances);

  /**
   * GET /api/maintenances/overdue
   * Obtener mantenimientos vencidos
   */
  router.get('/overdue', maintenanceController.getOverdueMaintenances);

  /**
   * GET /api/maintenances/vehicle/:placa/last
   * Obtener el último mantenimiento de un vehículo específico
   * 
   * Ejemplo: GET /api/maintenances/vehicle/ABC-123/last
   */
  router.get('/vehicle/:placa/last', maintenanceController.getLastMaintenanceByVehicle);

  /**
   * GET /api/maintenances/:id
   * Obtener un mantenimiento específico por ID
   * 
   * Ejemplo: GET /api/maintenances/5
   */
  router.get('/:id', maintenanceController.getMaintenanceById);

  /**
   * GET /api/maintenances
   * Listar todos los mantenimientos con filtros opcionales
   * 
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
  router.get('/', maintenanceController.getAllMaintenances);

  // ==========================================
  // RUTAS DE MODIFICACIÓN
  // ==========================================

  /**
   * POST /api/maintenances
   * Crear un nuevo mantenimiento
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
  router.post('/', maintenanceController.createMaintenance);

  /**
   * PUT /api/maintenances/:id
   * Actualizar un mantenimiento existente
   * 
   * Body: Cualquier campo del mantenimiento que se desee actualizar
   * 
   * Ejemplo: PUT /api/maintenances/5
   * {
   *   "costo": 300000.00,
   *   "descripcion": "Cambio de aceite y filtros"
   * }
   */
  router.put('/:id', maintenanceController.updateMaintenance);

  /**
   * DELETE /api/maintenances/:id
   * Eliminar un mantenimiento
   * 
   * Ejemplo: DELETE /api/maintenances/5
   */
  router.delete('/:id', maintenanceController.deleteMaintenance);

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
