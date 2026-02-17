// Configuración de la API
const API_CONFIG = {
  // URL del backend - cambiar según el entorno
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000,
  
  // Headers por defecto
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

export default API_CONFIG;
