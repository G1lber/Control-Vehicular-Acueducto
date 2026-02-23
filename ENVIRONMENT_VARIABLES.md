# Variables de Entorno

Este proyecto utiliza variables de entorno para configurar la conexión entre el frontend y el backend, así como otras configuraciones sensibles.

## Frontend (React + Vite)

**Ubicación:** `frontend/.env`

### Variables Disponibles

```env
# URL del Backend API
VITE_API_URL=http://localhost:3000/api
```

### Notas Importantes

- **Prefijo `VITE_`**: Vite requiere que todas las variables de entorno expuestas al cliente tengan el prefijo `VITE_`. Variables sin este prefijo NO estarán disponibles en el código del cliente.

- **Archivo `.env.example`**: Existe un archivo de ejemplo con todas las variables necesarias. Copia y renombra este archivo a `.env` para comenzar:
  ```bash
  cd frontend
  cp .env.example .env
  ```

- **Git**: El archivo `.env` está incluido en `.gitignore` por seguridad. Nunca subas tus credenciales al repositorio.

### Uso en el Código

```javascript
// Acceder a la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

// Con fallback por seguridad
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### Archivos que Usan Variables de Entorno

- `src/pages/Login.jsx` - Login principal
- `src/pages/LoginSurvey.jsx` - Login del cuestionario
- `src/pages/SurveyTalentoHumano.jsx` - Formulario de encuesta
- `src/config/api.config.js` - Configuración centralizada de API

## Backend (Node.js + Express)

**Ubicación:** `backend/.env`

### Variables Disponibles

```env
# Puerto del servidor
PORT=3000

# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=control_vehicular_acueducto

# Configuración de JWT (Autenticación)
JWT_SECRET=cambiar_en_produccion_clave_super_secreta_2026
JWT_EXPIRES_IN=24h

# Entorno de ejecución
NODE_ENV=development
```

### Notas Importantes

- **JWT_SECRET**: En producción, cambia esto por una clave segura y compleja. Puedes generar una con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- **DB_PASSWORD**: Si tu MySQL tiene contraseña, agrégala aquí.

- **NODE_ENV**: Cambia a `production` en el servidor de producción.

## Configuración para Diferentes Ambientes

### Desarrollo Local
```env
VITE_API_URL=http://localhost:3000/api
```

### Producción
```env
VITE_API_URL=https://api.tudominio.com/api
```

### Testing/Staging
```env
VITE_API_URL=https://staging-api.tudominio.com/api
```

## Reiniciar Servidor Después de Cambios

**Frontend (Vite):**
- Vite requiere reiniciar el servidor de desarrollo cuando cambias variables de entorno:
  ```bash
  # Detener con Ctrl+C
  npm run dev
  ```

**Backend (Express con nodemon):**
- Nodemon reinicia automáticamente cuando detecta cambios en `.env`
- Si no reinicia automáticamente, reinicia manualmente:
  ```bash
  # Detener con Ctrl+C
  npm run dev
  ```

## Seguridad

⚠️ **IMPORTANTE:**

1. Nunca subas archivos `.env` al repositorio Git
2. Usa `.env.example` como plantilla para otros desarrolladores
3. Cambia todas las claves secretas en producción
4. Usa HTTPS en producción para las URLs del API
5. Mantén las credenciales de base de datos seguras

## Troubleshooting

### Error: "Cannot read property 'VITE_API_URL' of undefined"
- Verifica que el archivo `.env` exista en la raíz de `frontend/`
- Asegúrate que la variable tenga el prefijo `VITE_`
- Reinicia el servidor de desarrollo de Vite

### Error: "fetch failed" o "Network Error"
- Verifica que la URL en `VITE_API_URL` sea correcta
- Asegúrate que el backend esté corriendo en el puerto especificado
- Revisa la consola del navegador para más detalles

### Backend no encuentra variables
- Verifica que el archivo `.env` exista en la raíz de `backend/`
- Asegúrate que `dotenv` esté instalado: `npm install dotenv`
- Verifica que se importe al inicio del archivo: `import 'dotenv/config'`
