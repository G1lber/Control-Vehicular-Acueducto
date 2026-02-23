/**
 * Middleware de validación usando express-validator
 * Define reglas de validación para diferentes endpoints
 */

import { body, param, validationResult } from 'express-validator';

// ==================== VALIDACIONES PARA LOGIN ====================

// Validación para login principal (cédula + password)
const validateLogin = [
  body('cedula')
    .notEmpty().withMessage('La cédula es obligatoria')
    .isString().withMessage('La cédula debe ser texto')
    .trim()
    .isLength({ min: 6, max: 15 }).withMessage('La cédula debe tener entre 6 y 15 dígitos')
    .matches(/^\d+$/).withMessage('La cédula debe contener solo números'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isString().withMessage('La contraseña debe ser texto')
    .isLength({ min: 1 }).withMessage('La contraseña no puede estar vacía')
];

// Validación para login de cuestionario (solo cédula)
const validateLoginSurvey = [
  body('cedula')
    .notEmpty().withMessage('La cédula es obligatoria')
    .isString().withMessage('La cédula debe ser texto')
    .trim()
    .isLength({ min: 6, max: 15 }).withMessage('La cédula debe tener entre 6 y 15 dígitos')
    .matches(/^\d+$/).withMessage('La cédula debe contener solo números')
];

// ==================== VALIDACIONES PARA USUARIOS ====================

const validateCreateUser = [
  body('cedula')
    .notEmpty().withMessage('La cédula es obligatoria')
    .isString().withMessage('La cédula debe ser texto')
    .trim()
    .isLength({ min: 6, max: 15 }).withMessage('La cédula debe tener entre 6 y 15 dígitos')
    .matches(/^\d+$/).withMessage('La cédula debe contener solo números'),
  
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('id_rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isInt({ min: 1, max: 3 }).withMessage('El rol debe ser 1 (Conductor), 2 (Supervisor) o 3 (Administrador)'),
  
  body('area')
    .optional()
    .isString().withMessage('El área debe ser texto')
    .trim()
    .isLength({ max: 100 }).withMessage('El área no puede exceder 100 caracteres'),
  
  body('celular')
    .optional()
    .isString().withMessage('El celular debe ser texto')
    .trim()
    .matches(/^\d{10}$/).withMessage('El celular debe tener 10 dígitos'),
  
  body('password')
    .optional()
    .isString().withMessage('La contraseña debe ser texto')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// ==================== VALIDACIONES PARA CUESTIONARIO ====================

const validateSurvey = [
  body('idUsuario')
    .notEmpty().withMessage('El ID de usuario es obligatorio')
    .isString().withMessage('El ID de usuario debe ser texto')
    .matches(/^\d+$/).withMessage('El ID de usuario debe contener solo números'),
  
  body('consentimiento')
    .notEmpty().withMessage('El consentimiento es obligatorio')
    .isIn(['SI', 'NO']).withMessage('El consentimiento debe ser SI o NO'),
  
  body('ciudad')
    .notEmpty().withMessage('La ciudad es obligatoria')
    .isString().withMessage('La ciudad debe ser texto')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('La ciudad debe tener entre 2 y 50 caracteres'),
  
  body('sitioLabor')
    .optional()
    .isString().withMessage('El sitio de labor debe ser texto')
    .trim(),
  
  body('edad')
    .optional()
    .isInt({ min: 18, max: 120 }).withMessage('La edad debe estar entre 18 y 120 años'),
  
  body('tipoContratacion')
    .optional()
    .isString().withMessage('El tipo de contratación debe ser texto'),
  
  body('genero')
    .optional()
    .isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género inválido'),
  
  body('licencia')
    .optional()
    .isIn(['SI', 'NO']).withMessage('La licencia debe ser SI o NO'),
  
  body('vigenciaLicencia')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  
  body('accidente5Anios')
    .optional()
    .isIn(['SI', 'NO']).withMessage('El campo accidente 5 años debe ser SI o NO'),
  
  body('medioDesplazamiento')
    .optional()
    .isArray().withMessage('Medio de desplazamiento debe ser un array'),
  
  body('riesgos')
    .optional()
    .isArray().withMessage('Riesgos debe ser un array'),
  
  body('causas')
    .optional()
    .isArray().withMessage('Causas debe ser un array'),
  
  body('causasComparendo')
    .optional()
    .isArray().withMessage('Causas de comparendo debe ser un array'),
  
  body('tieneComparendos')
    .optional()
    .isIn(['SI', 'NO']).withMessage('Tiene comparendos debe ser SI o NO')
];

// Validación para obtener encuesta por cédula
const validateGetSurveyByCedula = [
  param('cedula')
    .notEmpty().withMessage('La cédula es obligatoria')
    .isString().withMessage('La cédula debe ser texto')
    .matches(/^\d{6,15}$/).withMessage('Cédula inválida')
];

// ==================== MIDDLEWARE PARA MANEJAR ERRORES DE VALIDACIÓN ====================

/**
 * Middleware que verifica si hay errores de validación
 * Si hay errores, devuelve una respuesta 400 con los detalles
 * Si no hay errores, continúa al siguiente middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Formatear errores de manera más legible
    const formattedErrors = errors.array().map(error => ({
      campo: error.param,
      mensaje: error.msg,
      valorRecibido: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en los datos enviados',
      errors: formattedErrors
    });
  }
  
  next();
};

// ==================== EXPORTS ====================

export {
  // Login
  validateLogin,
  validateLoginSurvey,
  
  // Usuarios
  validateCreateUser,
  
  // Cuestionario
  validateSurvey,
  validateGetSurveyByCedula,
  
  // Handler de errores
  handleValidationErrors
};
