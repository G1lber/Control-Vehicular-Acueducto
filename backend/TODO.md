# ✅ Checklist - Completar el Backend

## 🎯 Estado Actual
- ✅ Arquitectura hexagonal implementada
- ✅ API de vehículos completa (CRUD + filtros + stats)
- ✅ API de usuarios completa (CRUD + filtros + stats + auth)
- ✅ Conexión a MySQL funcionando
- ✅ Datos de prueba disponibles
- ✅ Documentación completa

## 📋 Tareas Pendientes

### 1️⃣ API de Usuarios (Alta Prioridad) ✅ COMPLETADA
- ✅ Crear `domain/entities/User.js`
- ✅ Crear `domain/repositories/UserRepository.js`
- ✅ Crear `infrastructure/database/MySQLUserRepository.js`
- ✅ Crear `application/use-cases/UserUseCases.js`
- ✅ Crear `infrastructure/http/controllers/UserController.js`
- ✅ Crear `infrastructure/http/routes/userRoutes.js`
- ✅ Conectar en `server.js`
- ✅ **Funcionalidades:**
  - ✅ GET /api/users - Listar todos
  - ✅ GET /api/users/:id - Ver uno
  - ✅ GET /api/users/role/:role - Filtrar por rol
  - ✅ POST /api/users - Crear (con hash de password si es Supervisor)
  - ✅ PUT /api/users/:id - Actualizar
  - ✅ DELETE /api/users/:id - Eliminar
  - ✅ GET /api/users/stats - Estadísticas (total, conductores, supervisores)
  - ✅ POST /api/users/auth/login - Login básico

**✅ Características implementadas:**
- ✅ Solo Supervisores y Admins tienen password (hasheado con bcrypt)
- ✅ Validación de cédula única
- ✅ JOIN con tabla roles para obtener nombre_rol
- ✅ Password NUNCA se incluye en respuestas (seguridad)
- ✅ Validaciones completas en la entidad
- ✅ Manejo de errores específicos
- ✅ 100% probado y funcional

### 2️⃣ API de Mantenimientos (Alta Prioridad)
- [ ] Crear `domain/entities/Maintenance.js`
- [ ] Crear `domain/repositories/MaintenanceRepository.js`
- [ ] Crear `infrastructure/database/MySQLMaintenanceRepository.js`
- [ ] Crear `application/use-cases/MaintenanceUseCases.js`
- [ ] Crear `infrastructure/http/controllers/MaintenanceController.js`
- [ ] Crear `infrastructure/http/routes/maintenanceRoutes.js`
- [ ] Conectar en `server.js`
- [ ] **Funcionalidades:**
  - GET /api/maintenances - Listar todos
  - GET /api/maintenances/vehicle/:placa - Por vehículo
  - GET /api/maintenances/type/:type - Por tipo
  - GET /api/maintenances/date?month=X&year=Y - Filtrar por fecha
  - POST /api/maintenances - Registrar nuevo
  - PUT /api/maintenances/:id - Actualizar
  - DELETE /api/maintenances/:id - Eliminar
  - GET /api/maintenances/stats - Estadísticas de costos

### 3️⃣ API de Información Adicional (Cuestionario PESV)
- [ ] Crear `domain/entities/AdditionalInfo.js`
- [ ] Crear `domain/repositories/AdditionalInfoRepository.js`
- [ ] Crear `infrastructure/database/MySQLAdditionalInfoRepository.js`
- [ ] Crear `application/use-cases/AdditionalInfoUseCases.js`
- [ ] Crear `infrastructure/http/controllers/AdditionalInfoController.js`
- [ ] Crear `infrastructure/http/routes/additionalInfoRoutes.js`
- [ ] Conectar en `server.js`
- [ ] **Funcionalidades:**
  - GET /api/survey/:id_usuario - Ver cuestionario de un usuario
  - POST /api/survey - Crear/actualizar cuestionario
  - GET /api/survey/stats - Estadísticas (cuántos completados, accidentes, etc.)

**Consideraciones especiales:**
- Campos JSON (medio_desplazamiento, riesgos, causas, causas_comparendo)
- Validaciones complejas con lógica condicional

### 4️⃣ Autenticación y Autorización (Alta Prioridad)
- [ ] Crear `infrastructure/middlewares/auth.js`
- [ ] Implementar login endpoint:
  - POST /api/auth/login - Login con cédula + password
  - Generar JWT token
  - Solo Supervisores y Admins pueden hacer login
- [ ] Crear middleware para verificar JWT
- [ ] Proteger rutas con middleware auth
- [ ] Implementar niveles de permisos:
  - **Conductor:** Solo puede ver sus propios datos
  - **Supervisor:** Puede ver y editar todo
  - **Admin:** Control total

**Estructura de JWT:**
```javascript
{
  id_cedula: 1002345678,
  nombre: "Roberto Sánchez",
  id_rol: 2,
  nombre_rol: "Supervisor"
}
```

### 5️⃣ Validaciones y Middlewares
- [ ] Crear `infrastructure/middlewares/validator.js`
- [ ] Validar datos de entrada con express-validator
- [ ] Middleware para manejo de errores centralizado
- [ ] Middleware para logging de peticiones
- [ ] Middleware para rate limiting (opcional)

### 6️⃣ API de Reportes
- [ ] Crear `application/use-cases/ReportUseCases.js`
- [ ] Crear controlador y rutas
- [ ] **Reportes a implementar:**
  - GET /api/reports/vehicles - Reporte de vehículos con filtros
  - GET /api/reports/maintenances - Reporte de mantenimientos
  - GET /api/reports/expenses - Reporte de costos
  - GET /api/reports/drivers - Reporte de conductores
  - GET /api/reports/expiring - Documentos próximos a vencer
  - GET /api/reports/expired - Documentos vencidos

### 7️⃣ Mejoras de Infraestructura
- [ ] Implementar sistema de logging (Winston)
- [ ] Crear archivo de configuración para constantes
- [ ] Agregar validación de variables de entorno al inicio
- [ ] Manejo de errores más específico por tipo
- [ ] Agregar CORS configuration más detallada
- [ ] Implementar paginación en endpoints que listen muchos datos

### 8️⃣ Testing (Opcional pero recomendado)
- [ ] Configurar Jest o Mocha
- [ ] Tests unitarios para entidades del Domain
- [ ] Tests de integración para repositories
- [ ] Tests de casos de uso
- [ ] Tests E2E para endpoints HTTP

### 9️⃣ Documentación
- [ ] Agregar Swagger/OpenAPI documentation
- [ ] Crear colección de Postman
- [ ] Documentar códigos de error
- [ ] Documentar formato de respuestas

### 🔟 Deployment
- [ ] Configurar variables de entorno para producción
- [ ] Configurar HTTPS
- [ ] Configurar PM2 para mantener el servidor activo
- [ ] Configurar nginx como reverse proxy (opcional)
- [ ] Configurar backup automático de base de datos

## ✅ API de usuarios (completado)
4. API de mantenimientos (siguiente)
### Semana 1 - Fundamentos
1. ✅ Arquitectura base (completado)
2. ✅ API de vehículos (completado)
3. API de usuarios
4. API de mantenimientos

### Semana 2 - Autenticación
1. Sistema de autenticación JWT
2. Middleware de autorización
3. Proteger rutas según roles

### Semana 3 - Completar APIs
1. API de cuestionario PESV
2. API de reportes
3. Validaciones completas

### Semana 4 - Integración
1. Conectar frontend con backend
2. Testing manual completo
3. Corrección de bugs
4. Documentación final

## 📝 Notas Importantes

### Orden de Desarrollo Recomendado
1. **Domain** (entities + repositories interface)
2. **Infrastructure** (database implementation)
3. **Application** (use cases)
4. **Infrastructure/HTTP** (controllers + routes)
5. **Server** (dependency injection)

### Convenciones de Código
- Nombres de archivos en PascalCase para clases
- Nombres en camelCase para funciones y variables
- Comentarios explicativos en español
- JSDoc para documentar funciones públicas

### Commits Git Sugeridos
```bash
git commit -m "feat: add User entity and repository"
git commit -m "feat: implement MySQL User repository"
git commit -m "feat: add User use cases"
git commit -m "feat: add User HTTP endpoints"
git commit -m "feat: implement JWT authentication"
```

## 🎯 Objetivo Final

Backend completo con:
- ✅ 4 APIs principales (Vehículos, Usuarios, Mantenimientos, Cuestionario PESV)
- ✅ Autenticación JWT con roles
- ✅ Validaciones completas
- ✅ Sistema de reportes
- ✅ Documentación API
- ✅ Integración con frontend
- ✅ Ready para producción

---

💪 **¡Tú puedes!** Sigue la arquitectura hexagonal y mantén el código limpio y organizado.
