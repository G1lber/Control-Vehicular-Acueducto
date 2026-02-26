/**
 * Report Routes - Rutas para generación de reportes
 * 
 * INFRASTRUCTURE LAYER (Arquitectura Hexagonal)
 */

import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';

export const createReportRoutes = (reportController) => {
  const router = Router();

  /**
   * @route GET /api/reports/generate
   * @desc Generar y descargar reporte en Excel
   * @access Protegido - Requiere autenticación
   * @query {string} reportType - Tipo de reporte (vehicles, users, maintenances, etc.)
   * @query {string} startDate - Fecha inicial (opcional)
   * @query {string} endDate - Fecha final (opcional)
   * @query {string} fields - Campos a incluir separados por coma (opcional)
   * @query {string} role - Filtrar por rol (opcional, para usuarios)
   * @query {string} maintenanceType - Filtrar por tipo (opcional, para mantenimientos)
   * @returns Archivo Excel
   */
  router.get('/generate',
    verifyToken,
    (req, res) => reportController.generateReport(req, res)
  );

  /**
   * @route GET /api/reports/fields/:reportType
   * @desc Obtener campos disponibles para un tipo de reporte
   * @access Protegido - Requiere autenticación
   * @param {string} reportType - Tipo de reporte
   * @returns {Array} Lista de campos disponibles
   */
  router.get('/fields/:reportType',
    verifyToken,
    (req, res) => reportController.getAvailableFields(req, res)
  );

  /**
   * @route GET /api/reports/maintenance-types
   * @desc Obtener tipos de mantenimiento disponibles para filtros
   * @access Protegido - Requiere autenticación
   * @returns {Array} Lista de tipos de mantenimiento
   */
  router.get('/maintenance-types',
    verifyToken,
    (req, res) => reportController.getMaintenanceTypes(req, res)
  );

  /**
   * @route GET /api/reports/stats
   * @desc Obtener estadísticas generales para reportes
   * @access Protegido - Requiere autenticación
   * @returns {Object} Estadísticas
   */
  router.get('/stats',
    verifyToken,
    (req, res) => reportController.getStats(req, res)
  );

  return router;
};

export default createReportRoutes;
