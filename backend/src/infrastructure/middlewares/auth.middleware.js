/**
 * Middlewares de Autenticación JWT
 * 
 * Middleware para proteger rutas y verificar permisos de usuario
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar token JWT
 * Extrae el token del header Authorization y lo verifica
 * Adjunta la información del usuario a req.user
 */
export const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Acceso denegado.'
      });
    }

    // El formato es "Bearer TOKEN"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Acceso denegado.'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar información del usuario a la request
    req.user = {
      cedula: decoded.cedula,
      nombre: decoded.nombre,
      id_rol: decoded.id_rol,
      nombre_rol: decoded.nombre_rol,
      access_type: decoded.access_type || 'full'
    };

    next();
  } catch (error) {
    console.error('Error al verificar token:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor inicia sesión nuevamente.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Acceso denegado.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al autenticar',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar que el usuario sea Supervisor o Admin
 * Debe usarse DESPUÉS de verifyToken
 */
export const requireSupervisor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  // id_rol: 1=Conductor, 2=Supervisor, 3=Administrador
  if (req.user.id_rol < 2) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de Supervisor o Administrador.'
    });
  }

  next();
};

/**
 * Middleware para verificar que el usuario sea Administrador
 * Debe usarse DESPUÉS de verifyToken
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  // id_rol: 3=Administrador
  if (req.user.id_rol !== 3) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de Administrador.'
    });
  }

  next();
};

/**
 * Middleware para verificar que el usuario tenga acceso al cuestionario
 * Permite tanto acceso full como survey_only
 */
export const requireSurveyAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  // Permitir tanto acceso completo como acceso solo al cuestionario
  if (req.user.access_type !== 'full' && req.user.access_type !== 'survey_only') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado al cuestionario.'
    });
  }

  next();
};

/**
 * Middleware opcional para verificar token
 * Si el token existe y es válido, adjunta req.user
 * Si no existe o es inválido, continúa sin error
 * Útil para rutas que pueden funcionar con o sin autenticación
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      cedula: decoded.cedula,
      nombre: decoded.nombre,
      id_rol: decoded.id_rol,
      nombre_rol: decoded.nombre_rol,
      access_type: decoded.access_type || 'full'
    };

    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin usuario autenticado
    next();
  }
};
