# Backend - Control Vehicular Acueducto

Backend desarrollado con **Arquitectura Hexagonal** (Ports & Adapters)

## 🏗️ Arquitectura Hexagonal - Explicación

La arquitectura hexagonal separa la aplicación en capas concéntricas:

### 🔵 DOMAIN (Núcleo - Centro del Hexágono)
**Ubicación:** `src/domain/`

Esta es la capa más importante. Contiene la **lógica de negocio pura**, sin dependencias externas.

#### `domain/entities/` - Entidades de Dominio
Clases que representan los conceptos centrales del negocio:
- `Vehicle.js` - Lógica de vehículo (calcular vencimientos, validaciones, etc.)
- **NO dependen de tecnologías** (sin Express, MySQL, etc.)
- Solo contienen lógica de negocio

**Ejemplo:**
```javascript
class Vehicle {
  getDaysUntilSoatExpiry() { /* cálculo puro */ }
  getStatus() { /* lógica de negocio */ }
  validate() { /* reglas del dominio */ }
}
```

#### `domain/repositories/` - Puertos (Interfaces)
Definen **QUÉ** operaciones existen, pero **NO** cómo se implementan:
- `VehicleRepository.js` - Contrato para operaciones de vehículos
- Son interfaces/contratos que definen métodos
- La implementación real estará en Infrastructure

**Ejemplo:**
```javascript
class VehicleRepository {
  async findAll() { throw new Error('Must implement'); }
  async create(vehicle) { throw new Error('Must implement'); }
}
```

### 🟢 APPLICATION (Casos de Uso)
**Ubicación:** `src/application/use-cases/`

Orquesta las operaciones del dominio. Cada archivo representa las **acciones que los usuarios pueden hacer**.

- `VehicleUseCases.js` - Operaciones de vehículos (crear, listar, actualizar, etc.)
- Usa el Domain (entities + repositories)
- Coordina el flujo de datos
- Valida y transforma datos

**Ejemplo:**
```javascript
class VehicleUseCases {
  constructor(vehicleRepository) { /* DI */ }
  
  async createVehicle(data) {
    const vehicle = new Vehicle(data); // Entity
    vehicle.validate(); // Lógica de dominio
    return this.vehicleRepository.create(vehicle); // Port
  }
}
```

### 🟡 INFRASTRUCTURE (Adaptadores Externos)
**Ubicación:** `src/infrastructure/`

Implementaciones concretas de tecnologías externas.

#### `infrastructure/database/` - Adaptadores de Base de Datos
Implementan los **Ports** del Domain usando tecnología específica:
- `MySQLVehicleRepository.js` - Implementación con MySQL
- **Aquí SÍ usamos** `mysql2`, queries SQL, etc.
- Implementa el contrato de `VehicleRepository`

**Ejemplo:**
```javascript
class MySQLVehicleRepository extends VehicleRepository {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM vehiculos');
    return rows.map(row => new Vehicle(row));
  }
}
```

#### `infrastructure/http/` - Adaptadores HTTP
Manejan las peticiones web:

##### `controllers/` - Controladores HTTP
- `VehicleController.js` - Maneja peticiones Express
- Recibe req/res de Express
- Llama a los casos de uso
- Formatea respuestas JSON

##### `routes/` - Rutas HTTP
- `vehicleRoutes.js` - Define rutas (GET, POST, PUT, DELETE)
- Conecta URLs con métodos del controlador

## 📐 Flujo de Datos

```
1. HTTP Request
   ↓
2. Route (infrastructure/http/routes)
   ↓
3. Controller (infrastructure/http/controllers)
   ↓
4. Use Case (application/use-cases)
   ↓
5. Entity + Repository (domain)
   ↓
6. Database Implementation (infrastructure/database)
   ↓
7. MySQL Database
```

**Ejemplo de flujo completo:**

```
POST /api/vehicles
  ↓
vehicleRoutes.js → router.post('/', controller.createVehicle)
  ↓
VehicleController.createVehicle() → recibe req.body
  ↓
VehicleUseCases.createVehicle(data) → valida y crea entidad
  ↓
Vehicle.validate() → lógica de dominio
  ↓
MySQLVehicleRepository.create(vehicle) → INSERT SQL
  ↓
MySQL Database
```

## 🎯 Ventajas de esta Arquitectura

1. **Independencia de Frameworks**: El dominio no depende de Express o MySQL
2. **Testeable**: Puedes probar lógica sin base de datos
3. **Flexible**: Cambiar MySQL por PostgreSQL solo afecta Infrastructure
4. **Mantenible**: Cada capa tiene responsabilidad clara
5. **Escalable**: Fácil agregar nuevas entidades

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de MySQL
# Asegurarte que la base de datos exista (ejecutar db.sql)

# Iniciar en desarrollo (con nodemon)
npm run dev

# Iniciar en producción
npm start
```

## 📦 Dependencias

- **express** - Framework web
- **mysql2** - Cliente MySQL con soporte para Promises
- **dotenv** - Variables de entorno
- **cors** - Permitir peticiones del frontend
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **express-validator** - Validación de datos
- **express-rate-limit** - Limitación de peticiones (seguridad)
- **exceljs** - Generación de archivos Excel
- **pdfkit** - Generación de archivos PDF

## 📁 Estructura Completa

```
backend/
├── src/
│   ├── domain/                    # 🔵 NÚCLEO (sin dependencias)
│   │   ├── entities/              # Lógica de negocio
│   │   │   ├── Vehicle.js         # Entidad vehículo
│   │   │   ├── User.js            # Entidad usuario
│   │   │   ├── Maintenance.js     # Entidad mantenimiento
│   │   │   └── AdditionalInfo.js  # Entidad cuestionario PESV
│   │   ├── repositories/          # Interfaces/Puertos
│   │   │   ├── VehicleRepository.js
│   │   │   ├── UserRepository.js
│   │   │   ├── MaintenanceRepository.js
│   │   │   ├── AdditionalInfoRepository.js
│   │   │   └── ReportRepository.js
│   │   └── services/              # Servicios de dominio
│   │
│   ├── application/               # 🟢 CASOS DE USO
│   │   └── use-cases/
│   │       ├── VehicleUseCases.js
│   │       ├── UserUseCases.js
│   │       ├── MaintenanceUseCases.js
│   │       ├── AdditionalInfoUseCases.js
│   │       └── ReportUseCases.js
│   │
│   ├── infrastructure/            # 🟡 ADAPTADORES
│   │   ├── database/              # Implementación MySQL
│   │   │   ├── MySQLVehicleRepository.js
│   │   │   ├── MySQLUserRepository.js
│   │   │   ├── MySQLMaintenanceRepository.js
│   │   │   ├── MySQLAdditionalInfoRepository.js
│   │   │   └── MySQLReportRepository.js
│   │   ├── http/                  # Capa web
│   │   │   ├── routes/
│   │   │   │   ├── vehicleRoutes.js
│   │   │   │   ├── userRoutes.js
│   │   │   │   ├── maintenanceRoutes.js
│   │   │   │   ├── surveyRoutes.js
│   │   │   │   └── reportRoutes.js
│   │   │   └── controllers/
│   │   │       ├── VehicleController.js
│   │   │       ├── UserController.js
│   │   │       ├── MaintenanceController.js
│   │   │       ├── AdditionalInfoController.js
│   │   │       └── ReportController.js
│   │   └── middlewares/           # Middlewares Express
│   │       ├── authMiddleware.js  # Autenticación JWT
│   │       └── validationMiddleware.js
│   │
│   ├── config/                    # Configuración
│   │   └── database.js            # Pool MySQL
│   │
│   └── server.js                  # 🎯 PUNTO DE ENTRADA
│                                  # (Dependency Injection aquí)
├── .env                           # Variables de entorno
├── .env.example                   # Plantilla de variables
├── package.json
├── USERS_API.md                   # Documentación API Usuarios
├── MAINTENANCES_API.md            # Documentación API Mantenimientos
└── README.md                      # Este archivo
```

## 🔌 API Endpoints

### 🚗 Vehículos (`/api/vehicles`)

```
GET    /api/vehicles              # Listar todos
GET    /api/vehicles?status=...   # Filtrar por estado (active, expiring, expired)
GET    /api/vehicles/stats        # Estadísticas
GET    /api/vehicles/:id          # Obtener por placa
GET    /api/vehicles/driver/:id   # Vehículos de un conductor
POST   /api/vehicles              # Crear nuevo
PUT    /api/vehicles/:id          # Actualizar
DELETE /api/vehicles/:id          # Eliminar
```

### 👥 Usuarios (`/api/users`)

```
GET    /api/users                 # Listar todos
GET    /api/users?role=...        # Filtrar por rol (Conductor, Supervisor, Admin)
GET    /api/users/stats           # Estadísticas
GET    /api/users/exists/:cedula  # Verificar si existe cédula
GET    /api/users/role/:role      # Obtener por rol
GET    /api/users/:cedula         # Obtener por cédula
GET    /api/users/:cedula/pdf     # Generar PDF hoja de vida
POST   /api/users                 # Crear nuevo
POST   /api/users/auth/login      # Login administrador
POST   /api/users/auth/login-survey  # Login conductor (cuestionario)
PUT    /api/users/:cedula         # Actualizar
DELETE /api/users/:cedula          # Eliminar
```

### 🔧 Mantenimientos (`/api/maintenances`)

```
GET    /api/maintenances          # Listar todos
GET    /api/maintenances?placa=...&year=...&month=...  # Filtros
GET    /api/maintenances/stats    # Estadísticas
GET    /api/maintenances/alerts   # Alertas de mantenimientos próximos
GET    /api/maintenances/upcoming # Mantenimientos próximos (7 días)
GET    /api/maintenances/overdue  # Mantenimientos vencidos
GET    /api/maintenances/vehicle/:placa/last  # Último mantenimiento de vehículo
GET    /api/maintenances/:id      # Obtener por ID
POST   /api/maintenances          # Crear nuevo
PUT    /api/maintenances/:id      # Actualizar
DELETE /api/maintenances/:id      # Eliminar
```

### 📋 Cuestionarios PESV (`/api/survey`)

```
GET    /api/survey                # Listar todos
GET    /api/survey/stats          # Estadísticas
GET    /api/survey/alerts         # Alertas de vencimientos
GET    /api/survey/expired-licenses      # Licencias vencidas
GET    /api/survey/upcoming-licenses     # Licencias por vencer (30 días)
GET    /api/survey/high-risk      # Conductores de alto riesgo
GET    /api/survey/with-accidents # Con accidentes últimos 5 años
GET    /api/survey/with-comparendos  # Con comparendos
GET    /api/survey/user/:cedula   # Cuestionario de un usuario
GET    /api/survey/:id            # Obtener por ID
POST   /api/survey                # Crear nuevo cuestionario
PUT    /api/survey/:id            # Actualizar
DELETE /api/survey/:id            # Eliminar
```

### 📊 Reportes (`/api/reports`)

```
GET    /api/reports/generate      # Generar reporte Excel
   Parámetros:
   - reportType: vehicles | users | maintenances | vehicles_maintenance | drivers_vehicles
   - fields: campos separados por coma
   - startDate, endDate: filtros de fecha (opcional)
   - role: filtro de rol para usuarios (opcional)
   - maintenanceType: filtro de tipo de mantenimiento (opcional)

GET    /api/reports/fields/:type  # Obtener campos disponibles por tipo
GET    /api/reports/maintenance-types  # Obtener tipos de mantenimiento
GET    /api/reports/stats         # Estadísticas de reportes
```

### Ejemplos de Reportes

```bash
# Reporte de vehículos
GET /api/reports/generate?reportType=vehicles&fields=placa,marca,modelo,anio

# Reporte de conductores
GET /api/reports/generate?reportType=users&role=Conductor&fields=nombre,cedula,area

# Reporte de mantenimientos con filtro de fecha
GET /api/reports/generate?reportType=maintenances&startDate=2026-01-01&endDate=2026-12-31

# Reporte combinado vehículos con mantenimientos  
GET /api/reports/generate?reportType=vehicles_maintenance&fields=placa,vehiculo,totalMantenimientos

# Reporte combinado conductores con vehículos
GET /api/reports/generate?reportType=drivers_vehicles&fields=nombre,cedula,vehiculosAsignados
```

### 🏥 Salud del Sistema

```
GET    /api/health                # Estado del servidor
GET    /                          # Info del API
```

## 🧪 Probar la API

### Con curl:

```bash
# Salud del servidor
curl http://localhost:3000/api/health

# Login administrador
curl -X POST http://localhost:3000/api/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cedula": "admin", "password": "admin123"}'

# Listar vehículos con filtro
curl http://localhost:3000/api/vehicles?status=active

# Estadísticas de vehículos
curl http://localhost:3000/api/vehicles/stats

# Crear vehículo
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "id_placa": "ABC-123",
    "marca": "Toyota",
    "modelo": "Hilux",
    "anio": 2022,
    "color": "Blanco",
    "tipo_combustible": "Diesel",
    "id_usuario": 123456789,
    "soat": "2026-12-31",
    "tecno": "2026-06-30",
    "kilometraje_actual": 50000
  }'

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id_cedula": "1234567890",
    "nombre": "Juan Pérez",
    "celular": "3001234567",
    "area": "Operaciones",
    "id_rol": 2
  }'

# Crear mantenimiento
curl -X POST http://localhost:3000/api/maintenances \
  -H "Content-Type: application/json" \
  -d '{
    "id_placa": "ABC-123",
    "tipo_mantenimiento": "Cambio de aceite",
    "fecha_realizado": "2026-02-26",
    "fecha_proxima": "2026-05-26",
    "kilometraje": 51000,
    "costo": 150000,
    "descripcion": "Cambio de aceite y filtro"
  }'

# Descargar reporte de vehículos en Excel
curl http://localhost:3000/api/reports/generate?reportType=vehicles \
  --output vehiculos.xlsx

# Generar PDF hoja de vida
curl http://localhost:3000/api/users/1234567890/pdf \
  --output hoja_vida.pdf
```

### Con PowerShell (Windows):

```powershell
# Login
$body = @{
  cedula = "admin"
  password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/users/auth/login' `
  -Method Post -ContentType 'application/json' -Body $body

# Listar usuarios
(Invoke-RestMethod -Uri 'http://localhost:3000/api/users').data | Format-Table

# Estadísticas de mantenimientos
Invoke-RestMethod -Uri 'http://localhost:3000/api/maintenances/stats'

# Descargar reporte
Invoke-WebRequest -Uri 'http://localhost:3000/api/reports/generate?reportType=vehicles' `
  -OutFile 'vehiculos.xlsx'
```

### Con Postman/Insomnia:

Importa estas peticiones o crea manualmente las requests a los endpoints listados arriba.

## 📚 Funcionalidades Completadas

### ✅ Entidades Implementadas

Todas las entidades principales del sistema están completamente implementadas con arquitectura hexagonal:

1. **Vehículos** ✅
   - CRUD completo
   - Estadísticas y alertas
   - Filtros por estado

2. **Usuarios** ✅
   - CRUD completo
   - Autenticación dual (Admin + Conductor)
   - Generación de PDF (hoja de vida)
   - Validación de datos

3. **Mantenimientos** ✅
   - CRUD completo
   - Alertas automáticas
   - Filtros avanzados
   - Estadísticas

4. **Cuestionarios PESV** ✅
   - CRUD completo
   - Alertas de vencimientos
   - Análisis de riesgo
   - 54 campos según normativa

5. **Reportes** ✅
   - 5 tipos de reportes
   - Exportación a Excel
   - Campos personalizables
   - Filtros dinámicos

### 📋 Para Agregar Nueva Entidad (Patrón)

Si necesitas agregar una nueva entidad en el futuro:

1. **Domain:**
   - Crear `domain/entities/NuevaEntidad.js`
   - Crear `domain/repositories/NuevaEntidadRepository.js`

2. **Infrastructure:**
   - Crear `infrastructure/database/MySQLNuevaEntidadRepository.js`

3. **Application:**
   - Crear `application/use-cases/NuevaEntidadUseCases.js`

4. **Infrastructure/HTTP:**
   - Crear `infrastructure/http/controllers/NuevaEntidadController.js`
   - Crear `infrastructure/http/routes/nuevaEntidadRoutes.js`

5. **Server:**
   - Conectar todo en `server.js` con Dependency Injection

### 🚀 Mejoras Futuras Sugeridas

- [ ] Cache con Redis para consultas frecuentes
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Tests unitarios y de integración (Jest)
- [ ] CI/CD con GitHub Actions
- [ ] Documentación automática con Swagger
- [ ] Versionado de API (v1, v2)
- [ ] Logs estructurados con Winston
- [ ] Monitoreo con Prometheus + Grafana

## 🎓 Recursos de Aprendizaje

- **Arquitectura Hexagonal**: https://alistair.cockburn.us/hexagonal-architecture/
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID

---

💡 **Tip:** La clave de la arquitectura hexagonal es que el **Domain** (núcleo) nunca debe depender de Infrastructure. Las dependencias siempre apuntan hacia adentro.
