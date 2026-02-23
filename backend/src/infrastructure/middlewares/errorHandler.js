/**
 * Middleware centralizado para manejo de errores
 * Captura todos los errores y devuelve respuestas consistentes
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error capturado:', {
    message: err.message,
    code: err.code,
    name: err.name,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error de cédula/placa duplicada en BD
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un registro con esos datos',
      error: 'El valor ingresado ya está registrado en el sistema'
    });
  }

  // Error de foreign key - referencia inválida
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      error: 'El registro relacionado no existe en la base de datos'
    });
  }

  // Error de foreign key - no se puede eliminar por dependencias
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      success: false,
      message: 'No se puede eliminar',
      error: 'Existen registros relacionados que dependen de este elemento'
    });
  }

  // Error de JWT - Token inválido
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      error: 'El token de autenticación no es válido'
    });
  }

  // Error de JWT - Token expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Sesión expirada',
      error: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
    });
  }

  // Error 404 - No encontrado
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({
      success: false,
      message: 'Recurso no encontrado',
      error: err.message || 'El recurso solicitado no existe'
    });
  }

  // Error 400 - Bad Request
  if (err.status === 400 || err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Solicitud incorrecta',
      error: err.error || 'Los datos enviados no son válidos'
    });
  }

  // Error 403 - Forbidden
  if (err.status === 403 || err.statusCode === 403) {
    return res.status(403).json({
      success: false,
      message: err.message || 'Acceso denegado',
      error: 'No tienes permisos para realizar esta acción'
    });
  }

  // Error genérico del servidor
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Ha ocurrido un error inesperado'
  });
};

export default errorHandler;
