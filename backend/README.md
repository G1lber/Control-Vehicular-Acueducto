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

## 📁 Estructura Completa

```
backend/
├── src/
│   ├── domain/                    # 🔵 NÚCLEO (sin dependencias)
│   │   ├── entities/              # Lógica de negocio
│   │   │   └── Vehicle.js         # Entidad vehículo
│   │   ├── repositories/          # Interfaces/Puertos
│   │   │   └── VehicleRepository.js
│   │   └── services/              # Servicios de dominio
│   │
│   ├── application/               # 🟢 CASOS DE USO
│   │   └── use-cases/
│   │       └── VehicleUseCases.js # Orquestación
│   │
│   ├── infrastructure/            # 🟡 ADAPTADORES
│   │   ├── database/              # Implementación MySQL
│   │   │   └── MySQLVehicleRepository.js
│   │   ├── http/                  # Capa web
│   │   │   ├── routes/
│   │   │   │   └── vehicleRoutes.js
│   │   │   └── controllers/
│   │   │       └── VehicleController.js
│   │   └── middlewares/           # Middlewares Express
│   │
│   ├── config/                    # Configuración
│   │   └── database.js            # Pool MySQL
│   │
│   └── server.js                  # 🎯 PUNTO DE ENTRADA
│                                  # (Dependency Injection aquí)
├── .env                           # Variables de entorno
├── .env.example                   # Plantilla de variables
├── package.json
└── README.md                      # Este archivo
```

## 🔌 API Endpoints

### Vehículos

```
GET    /api/vehicles              # Listar todos
GET    /api/vehicles?status=...   # Filtrar por estado
GET    /api/vehicles/stats        # Estadísticas
GET    /api/vehicles/:id          # Obtener por placa
GET    /api/vehicles/driver/:id   # Vehículos de un conductor
POST   /api/vehicles              # Crear nuevo
PUT    /api/vehicles/:id          # Actualizar
DELETE /api/vehicles/:id          # Eliminar
```

### Salud del Sistema

```
GET    /api/health                # Estado del servidor
GET    /                          # Info del API
```

## 🧪 Probar la API

### Con curl:

```bash
# Salud del servidor
curl http://localhost:3000/api/health

# Listar vehículos
curl http://localhost:3000/api/vehicles

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
    "tecno": "2026-06-30"
  }'
```

### Con Postman/Insomnia:

Importa estas peticiones o crea manualmente las requests a los endpoints listados arriba.

## 📚 Próximos Pasos

Para agregar una nueva entidad (ejemplo: Users):

1. **Domain:**
   - Crear `domain/entities/User.js`
   - Crear `domain/repositories/UserRepository.js`

2. **Infrastructure:**
   - Crear `infrastructure/database/MySQLUserRepository.js`

3. **Application:**
   - Crear `application/use-cases/UserUseCases.js`

4. **Infrastructure/HTTP:**
   - Crear `infrastructure/http/controllers/UserController.js`
   - Crear `infrastructure/http/routes/userRoutes.js`

5. **Server:**
   - Conectar todo en `server.js` con Dependency Injection

## 🎓 Recursos de Aprendizaje

- **Arquitectura Hexagonal**: https://alistair.cockburn.us/hexagonal-architecture/
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID

---

💡 **Tip:** La clave de la arquitectura hexagonal es que el **Domain** (núcleo) nunca debe depender de Infrastructure. Las dependencias siempre apuntan hacia adentro.
