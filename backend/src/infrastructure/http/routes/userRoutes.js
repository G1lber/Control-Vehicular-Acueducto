/**
 * User Routes - Rutas HTTP para usuarios
 * 
 * Define todos los endpoints de la API de usuarios.
 */

import express from 'express';

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
   */
  router.get('/stats', (req, res) => userController.getUserStats(req, res));

  /**
   * GET /api/users/exists/:cedula
   * Verifica si existe un usuario con una cédula
   */
  router.get('/exists/:cedula', (req, res) => userController.checkUserExists(req, res));

  /**
   * GET /api/users/role/:role
   * Obtiene usuarios por rol específico
   * Ejemplo: /api/users/role/conductor
   * Valores válidos: conductor, supervisor, administrador
   */
  router.get('/role/:role', (req, res) => userController.getUsersByRole(req, res));

  /**
   * GET /api/users/:cedula
   * Obtiene un usuario específico por cédula
   * Ejemplo: /api/users/1001234567
   */
  router.get('/:cedula', (req, res) => userController.getUserByCedula(req, res));

  /**
   * GET /api/users
   * Obtiene todos los usuarios
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
  router.get('/', (req, res) => userController.getAllUsers(req, res));

  // ======================
  // RUTAS DE MODIFICACIÓN
  // ======================

  /**
   * POST /api/users
   * Crea un nuevo usuario
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
  router.post('/', (req, res) => userController.createUser(req, res));

  /**
   * PUT /api/users/:cedula
   * Actualiza un usuario existente
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
  router.put('/:cedula', (req, res) => userController.updateUser(req, res));

  /**
   * DELETE /api/users/:cedula
   * Elimina un usuario
   * Ejemplo: DELETE /api/users/1001234567
   * 
   * NOTA: No se puede eliminar si el usuario tiene vehículos asignados
   */
  router.delete('/:cedula', (req, res) => userController.deleteUser(req, res));

  // ======================
  // AUTENTICACIÓN (futuro)
  // ======================

  /**
   * POST /api/users/auth/login
   * Autentica un usuario (Supervisores y Administradores únicamente)
   * 
   * Body:
   * {
   *   "cedula": "1002345678",
   *   "password": "contraseña123"
   * }
   */
  router.post('/auth/login', (req, res) => userController.login(req, res));

  /**
   * POST /api/users/auth/login-survey
   * Login simplificado para acceder al cuestionario
   * Solo requiere cédula (para todos los usuarios, especialmente conductores)
   * 
   * Body:
   * {
   *   "cedula": "1001234567"
   * }
   */
  router.post('/auth/login-survey', (req, res) => userController.loginSurvey(req, res));

  return router;
};

export default createUserRoutes;
