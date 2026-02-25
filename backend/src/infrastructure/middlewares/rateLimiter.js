/**
 * Middleware de rate limiting (límite de peticiones)
 * Previene abuso del API y ataques de fuerza bruta
 */

import rateLimit from 'express-rate-limit';

// ==================== LIMITADOR GENERAL ====================
/**
 * Límite general para todas las rutas de la API
 * 10000 peticiones por IP cada 15 minutos (sistema interno)
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10000, // Máximo 10000 peticiones (amplio para uso interno)
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP',
    error: 'Has excedido el límite de peticiones. Por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true, // Incluye info de rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
  // Handler cuando se excede el límite
  handler: (req, res) => {
    console.warn(`⚠️  Rate limit excedido para IP: ${req.ip} - Ruta: ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      message: 'Demasiadas peticiones',
      error: 'Has realizado demasiadas peticiones. Espera un momento antes de intentar nuevamente.'
    });
  }
});

// ==================== LIMITADOR PARA LOGIN PRINCIPAL ====================
/**
 * Límite estricto para login principal (supervisores/admins)
 * 5 intentos por IP cada 15 minutos
 * Previene ataques de fuerza bruta para obtener contraseñas
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de login',
    error: 'Has excedido el límite de intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.'
  },
  skipSuccessfulRequests: true, // No cuenta peticiones exitosas (códigos 2xx)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const cedula = req.body?.cedula || 'desconocido';
    console.warn(`🚨 ALERTA: Demasiados intentos de login - IP: ${req.ip} - Cédula: ${cedula}`);
    res.status(429).json({
      success: false,
      message: 'Demasiados intentos de inicio de sesión',
      error: 'Por razones de seguridad, tu cuenta ha sido temporalmente bloqueada. Intenta de nuevo en 15 minutos.'
    });
  }
});

// ==================== LIMITADOR PARA LOGIN DE CUESTIONARIO ====================
/**
 * Límite moderado para login de cuestionario (conductores)
 * 10 intentos por IP cada 15 minutos
 * Más permisivo porque no requiere password
 */
const surveyLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de acceso al cuestionario',
    error: 'Has excedido el límite de intentos. Por favor intenta de nuevo en 15 minutos.'
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️  Límite de login survey excedido - IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Demasiados intentos',
      error: 'Has realizado demasiados intentos de acceso al cuestionario. Espera 15 minutos.'
    });
  }
});

// ==================== LIMITADOR PARA CREAR/EDITAR/ELIMINAR ====================
/**
 * Límite para operaciones de escritura (POST, PUT, DELETE)
 * 1000 peticiones por IP cada minuto (sistema interno)
 * Para uso interno sin restricciones excesivas
 */
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 1000, // Máximo 1000 operaciones (amplio para uso interno)
  message: {
    success: false,
    message: 'Demasiadas operaciones de escritura',
    error: 'Estás realizando cambios muy rápido. Espera un momento antes de continuar.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️  Write limit excedido - IP: ${req.ip} - Método: ${req.method} - Ruta: ${req.originalUrl}`);
    res.status(429).json({
      success: false,
      message: 'Operaciones demasiado frecuentes',
      error: 'Por favor espera un momento antes de realizar más cambios.'
    });
  }
});

// ==================== EXPORTS ====================

export {
  generalLimiter,      // Para todas las rutas
  loginLimiter,        // Para login principal (strict)
  surveyLoginLimiter,  // Para login de cuestionario (moderado)
  writeLimiter        // Para POST/PUT/DELETE
};
