/**
 * User Routes - Rutas HTTP para usuarios
 * 
 * Define todos los endpoints de la API de usuarios.
 */

import express from 'express';
import { 
  validateLogin, 
  validateLoginSurvey,
  validateCreateUser,
  handleValidationErrors 
} from '../../middlewares/validator.js';
import { loginLimiter, surveyLoginLimiter, writeLimiter } from '../../middlewares/rateLimiter.js';
import { verifyToken, requireAdmin, requireSupervisor } from '../../middlewares/auth.middleware.js';

const createUserRoutes = (userController) => {
  const router = express.Router();

  // ======================
  // RUTAS DE CONSULTA
  // ======================

  /**
   * GET /api/users/stats
   * Obtiene estadísticas de usuarios por rol
   * IMPORTANTE: Esta ruta debe ir ANTES de /api/users/:cedula
   * para evitar que 'stats' sea interpretada como una cédula
   * 
   * Protección: Token JWT requerido
   */
  router.get('/stats', 
    verifyToken,
    (req, res) => userController.getUserStats(req, res)
  );

  /**
   * GET /api/users/exists/:cedula
   * Verifica si existe un usuario con una cédula
   * 
   * Protección: Token JWT requerido
   */
  router.get('/exists/:cedula', 
    verifyToken,
    (req, res) => userController.checkUserExists(req, res)
  );

  /**
   * GET /api/users/role/:role
   * Obtiene usuarios por rol específico
   * Ejemplo: /api/users/role/conductor
   * Valores válidos: conductor, supervisor, administrador
   * 
   * Protección: Token JWT requerido
   */
  router.get('/role/:role', 
    verifyToken,
    (req, res) => userController.getUsersByRole(req, res)
  );

  /**
   * GET /api/users/:cedula
   * Obtiene un usuario específico por cédula
   * Ejemplo: /api/users/1001234567
   * 
   * Protección: Token JWT requerido
   */
  router.get('/:cedula', 
    verifyToken,
    (req, res) => userController.getUserByCedula(req, res)
  );

  /**
   * GET /api/users
   * Obtiene todos los usuarios
   * 
   * Protección: Token JWT requerido
   * 
   * Query params opcionales:
   * - role: Filtrar por rol (conductor, supervisor, administrador)
   * - area: Filtrar por área
   * - search: Buscar por nombre
   * 
   * Ejemplos:
   * - /api/users
   * - /api/users?role=conductor
   * - /api/users?area=Operaciones
   * - /api/users?search=Carlos
   */
  router.get('/', 
    verifyToken,
    (req, res) => userController.getAllUsers(req, res)
  );

  // ======================
  // RUTAS DE MODIFICACIÓN
  // ======================

  /**
   * POST /api/users
   * Crea un nuevo usuario
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o superior (Supervisores y Administradores pueden crear usuarios)
   * - Rate limiting: 20 operaciones por minuto
   * - Validación de datos obligatorios
   * 
   * Body esperado:
   * {
   *   "cedula": "1234567890",
   *   "name": "Juan Pérez",
   *   "id_rol": 1,
   *   "area": "Operaciones",
   *   "phone": "3001234567",
   *   "password": "123456" (solo requerido si id_rol es 2 o 3)
   * }
   */
  router.post('/', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    validateCreateUser, 
    handleValidationErrors,
    (req, res) => userController.createUser(req, res)
  );

  /**
   * PUT /api/users/:cedula
   * Actualiza un usuario existente
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o superior (Supervisores y Administradores pueden modificar usuarios)
   * - Rate limiting: 20 operaciones por minuto
   * 
   * Body puede incluir cualquiera de estos campos:
   * {
   *   "name": "Nuevo nombre",
   *   "id_rol": 2,
   *   "area": "Nueva área",
   *   "phone": "3009876543",
   *   "password": "nuevaContraseña" (opcional)
   * }
   */
  router.put('/:cedula', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    (req, res) => userController.updateUser(req, res)
  );

  /**
   * DELETE /api/users/:cedula
   * Elimina un usuario
   * Ejemplo: DELETE /api/users/1001234567
   * 
   * Protecciones:
   * - Token JWT requerido
   * - Rol Supervisor o superior (Supervisores y Administradores pueden eliminar usuarios)
   * - Rate limiting: 20 operaciones por minuto
   * 
   * NOTA: No se puede eliminar si el usuario tiene vehículos asignados
   */
  router.delete('/:cedula', 
    verifyToken,
    requireSupervisor,
    writeLimiter,
    (req, res) => userController.deleteUser(req, res)
  );

  /**
   * GET /api/users/:cedula/pdf
   * Genera y descarga la hoja de vida del usuario en PDF
   * Ejemplo: GET /api/users/1001234567/pdf
   * 
   * Protecciones:
   * - Token JWT requerido
   * 
   * Respuesta: Archivo PDF para descarga
   */
  router.get('/:cedula/pdf',
    verifyToken,
    (req, res) => userController.generateUserPDF(req, res)
  );

  // ======================
  // AUTENTICACIÓN (futuro)
  // ======================

  /**
   * POST /api/users/auth/login
   * Autentica un usuario (Supervisores y Administradores únicamente)
   * 
   * Protecciones:
   * - Rate limiting: Máximo 5 intentos por IP cada 15 minutos
   * - Validación de datos: Cédula y password obligatorios
   */
  router.post('/auth/login', 
    loginLimiter,
    validateLogin,
    handleValidationErrors,
    (req, res) => userController.login(req, res)
  );

  /**
   * POST /api/users/auth/login-survey
   * Login simplificado para acceder al cuestionario
   * Solo requiere cédula (para todos los usuarios, especialmente conductores)
   * 
   * Body:
   * {
   *   "cedula": "1001234567"
   * }
   * 
   * Protecciones:
   * - Rate limiting: Máximo 10 intentos por IP cada 15 minutos
   * - Validación de datos: Cédula obligatoria y formato correcto
   */
  router.post('/auth/login-survey', 
    surveyLoginLimiter,
    validateLoginSurvey,
    handleValidationErrors,
    (req, res) => userController.loginSurvey(req, res)
  );

  return router;
};

export default createUserRoutes;
