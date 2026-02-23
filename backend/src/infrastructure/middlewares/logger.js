/**
 * Middleware de logging para registrar todas las peticiones HTTP
 * Útil para debugging y auditoría
 */

const logger = (req, res, next) => {
  const start = Date.now();
  
  // Capturar cuando termine la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    // Determinar color según status code
    let statusColor;
    if (res.statusCode >= 500) {
      statusColor = '\x1b[31m'; // Rojo - Error servidor
    } else if (res.statusCode >= 400) {
      statusColor = '\x1b[33m'; // Amarillo - Error cliente
    } else if (res.statusCode >= 300) {
      statusColor = '\x1b[36m'; // Cyan - Redirección
    } else {
      statusColor = '\x1b[32m'; // Verde - Éxito
    }
    
    // Determinar color según método HTTP
    let methodColor;
    switch (req.method) {
      case 'GET':
        methodColor = '\x1b[34m'; // Azul
        break;
      case 'POST':
        methodColor = '\x1b[35m'; // Magenta
        break;
      case 'PUT':
        methodColor = '\x1b[33m'; // Amarillo
        break;
      case 'DELETE':
        methodColor = '\x1b[31m'; // Rojo
        break;
      default:
        methodColor = '\x1b[37m'; // Blanco
    }
    
    // Color para duración (si es lento, en amarillo)
    const durationColor = duration > 500 ? '\x1b[33m' : '\x1b[37m';
    
    // Construir mensaje de log
    const logMessage = [
      `\x1b[90m[${timestamp}]\x1b[0m`, // Timestamp en gris
      `${methodColor}${req.method}\x1b[0m`, // Método con color
      `${req.originalUrl}`, // URL
      `${statusColor}${res.statusCode}\x1b[0m`, // Status con color
      `${durationColor}${duration}ms\x1b[0m` // Duración
    ].join(' ');
    
    console.log(logMessage);
    
    // Log adicional para peticiones lentas (> 1 segundo)
    if (duration > 1000) {
      console.warn(`⚠️  Petición lenta detectada: ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  });
  
  next();
};

export default logger;
