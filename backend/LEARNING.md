# 🎓 Guía de Aprendizaje - Arquitectura Hexagonal

## 📚 Conceptos Clave

### 1. ¿Qué es la Arquitectura Hexagonal?

También llamada **Ports & Adapters**, es un patrón arquitectónico que separa la **lógica de negocio** (núcleo) de los **detalles técnicos** (base de datos, framework web, etc.).

**Analogía:** Piensa en tu aplicación como un teléfono con puertos USB-C:
- El **núcleo** (domain) es el teléfono mismo con su lógica
- Los **puertos** (repositories) son las entradas USB-C
- Los **adaptadores** (infrastructure) son los cables que conectas (MySQL, Express, etc.)

Si cambias el cable (MySQL → PostgreSQL), el teléfono sigue funcionando igual.

### 2. Las Capas del Hexágono

```
   ┌─────────────────────────────────────┐
   │     INFRASTRUCTURE LAYER            │
   │  (Adaptadores externos - MySQL,     │
   │   Express, APIs externas)           │
   │                                     │
   │  ┌───────────────────────────────┐ │
   │  │   APPLICATION LAYER           │ │
   │  │  (Casos de Uso - Orquestación)│ │
   │  │                               │ │
   │  │  ┌─────────────────────────┐ │ │
   │  │  │   DOMAIN LAYER         │ │ │
   │  │  │  (Lógica de Negocio)   │ │ │
   │  │  │  • Entities            │ │ │
   │  │  │  • Business Rules      │ │ │
   │  │  │  • Repositories (Port) │ │ │
   │  │  └─────────────────────────┘ │ │
   │  └───────────────────────────────┘ │
   └─────────────────────────────────────┘
```

### 3. Flujo de una Petición (Ejemplo Real)

Vamos a seguir paso a paso qué sucede cuando un usuario crea un vehículo:

#### **Paso 1: Cliente hace petición**
```javascript
// Frontend
POST http://localhost:3000/api/vehicles
Body: {
  "id_placa": "ABC-123",
  "marca": "Toyota",
  "modelo": "Hilux",
  ...
}
```

#### **Paso 2: Express Router recibe petición**
```javascript
// infrastructure/http/routes/vehicleRoutes.js
router.post('/', vehicleController.createVehicle);
```

#### **Paso 3: Controller procesa la petición HTTP**
```javascript
// infrastructure/http/controllers/VehicleController.js
createVehicle = async (req, res) => {
  const vehicle = await this.vehicleUseCases.createVehicle(req.body);
  res.status(201).json({ success: true, data: vehicle });
}
```

#### **Paso 4: Use Case orquesta la operación**
```javascript
// application/use-cases/VehicleUseCases.js
async createVehicle(data) {
  // Crear entidad de dominio
  const vehicle = new Vehicle(data);
  
  // Validar usando lógica del dominio
  const validation = vehicle.validate();
  if (!validation.valid) throw new Error(...);
  
  // Guardar usando el repositorio
  const created = await this.vehicleRepository.create(vehicle);
  return created.toJSON();
}
```

#### **Paso 5: Entity aplica lógica de negocio**
```javascript
// domain/entities/Vehicle.js
validate() {
  const errors = [];
  if (!this.id_placa) errors.push('Placa obligatoria');
  if (!this.id_usuario) errors.push('Debe tener conductor');
  // ... más validaciones
  return { valid: errors.length === 0, errors };
}
```

#### **Paso 6: Repository guarda en base de datos**
```javascript
// infrastructure/database/MySQLVehicleRepository.js
async create(vehicle) {
  await pool.query(`
    INSERT INTO vehiculos (...)
    VALUES (?, ?, ?, ...)
  `, [vehicle.id_placa, vehicle.marca, ...]);
  
  return await this.findById(vehicle.id_placa);
}
```

#### **Paso 7: Respuesta al cliente**
```json
{
  "success": true,
  "message": "Vehículo creado correctamente",
  "data": {
    "id_placa": "ABC-123",
    "marca": "Toyota",
    "status": "vigente",
    ...
  }
}
```

## 🎯 Reglas de Oro

### ✅ LO QUE SÍ DEBES HACER

1. **Domain NO depende de nadie**
   ```javascript
   // ✅ CORRECTO - No imports de tecnologías
   export class Vehicle {
     validate() { /* lógica pura */ }
   }
   ```

2. **Application usa Domain**
   ```javascript
   // ✅ CORRECTO
   import { Vehicle } from '../../domain/entities/Vehicle.js';
   import { VehicleRepository } from '../../domain/repositories/VehicleRepository.js';
   ```

3. **Infrastructure implementa contratos del Domain**
   ```javascript
   // ✅ CORRECTO - Implementa el port
   export class MySQLVehicleRepository extends VehicleRepository {
     async create(vehicle) { /* código MySQL */ }
   }
   ```

4. **Dependency Injection en server.js**
   ```javascript
   // ✅ CORRECTO - Ensamblar todo en un solo lugar
   const repository = new MySQLVehicleRepository();
   const useCases = new VehicleUseCases(repository);
   const controller = new VehicleController(useCases);
   ```

### ❌ LO QUE NO DEBES HACER

1. **Domain NO debe importar Express o MySQL**
   ```javascript
   // ❌ INCORRECTO
   import pool from '../../config/database.js';
   export class Vehicle {
     async save() { await pool.query(...) } // ¡NO!
   }
   ```

2. **No saltar capas**
   ```javascript
   // ❌ INCORRECTO - Controller no debe llamar al Repository directamente
   class VehicleController {
     async create(req, res) {
       await vehicleRepository.create(...); // ¡NO! Usa el UseCase
     }
   }
   ```

3. **No poner lógica de negocio fuera del Domain**
   ```javascript
   // ❌ INCORRECTO - Validación en el Controller
   class VehicleController {
     async create(req, res) {
       if (!req.body.id_placa) { /* NO! Esto va en Vehicle.validate() */ }
     }
   }
   ```

## 🔧 Cómo Agregar una Nueva Funcionalidad

Ejemplo: Agregar gestión de **Usuarios**

### Paso 1: Domain Layer

```javascript
// src/domain/entities/User.js
export class User {
  constructor({ id_cedula, nombre, id_rol, area, celular, password }) {
    this.id_cedula = id_cedula;
    this.nombre = nombre;
    // ... más campos
  }

  validate() {
    const errors = [];
    if (!this.id_cedula) errors.push('Cédula obligatoria');
    if (!this.nombre) errors.push('Nombre obligatorio');
    return { valid: errors.length === 0, errors };
  }

  isDriver() {
    return this.id_rol === 1;
  }

  isSupervisor() {
    return this.id_rol === 2;
  }
}
```

```javascript
// src/domain/repositories/UserRepository.js
export class UserRepository {
  async findAll() { throw new Error('Must implement'); }
  async findById(id_cedula) { throw new Error('Must implement'); }
  async findByRole(id_rol) { throw new Error('Must implement'); }
  async create(user) { throw new Error('Must implement'); }
  async update(id_cedula, data) { throw new Error('Must implement'); }
  async delete(id_cedula) { throw new Error('Must implement'); }
}
```

### Paso 2: Infrastructure Layer

```javascript
// src/infrastructure/database/MySQLUserRepository.js
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { User } from '../../domain/entities/User.js';
import pool from '../../config/database.js';

export class MySQLUserRepository extends UserRepository {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY u.nombre
    `);
    return rows.map(row => new User(row));
  }

  async findById(id_cedula) {
    const [rows] = await pool.query(`
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_cedula = ?
    `, [id_cedula]);
    
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  async findByRole(id_rol) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE id_rol = ?',
      [id_rol]
    );
    return rows.map(row => new User(row));
  }

  async create(user) {
    const validation = user.validate();
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    await pool.query(`
      INSERT INTO usuarios (id_cedula, nombre, id_rol, area, celular, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      user.id_cedula,
      user.nombre,
      user.id_rol,
      user.area,
      user.celular,
      user.password // TODO: Hashear con bcrypt
    ]);

    return await this.findById(user.id_cedula);
  }

  // ... más métodos
}
```

### Paso 3: Application Layer

```javascript
// src/application/use-cases/UserUseCases.js
import { User } from '../../domain/entities/User.js';

export class UserUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(u => ({
      id_cedula: u.id_cedula,
      nombre: u.nombre,
      area: u.area,
      celular: u.celular,
      role: u.id_rol,
      isDriver: u.isDriver(),
      isSupervisor: u.isSupervisor()
    }));
  }

  async getUserById(id_cedula) {
    const user = await this.userRepository.findById(id_cedula);
    return user ? user.toJSON() : null;
  }

  async getUsersByRole(role) {
    const id_rol = role === 'Conductor' ? 1 : role === 'Supervisor' ? 2 : null;
    if (!id_rol) throw new Error('Rol no válido');
    
    const users = await this.userRepository.findByRole(id_rol);
    return users.map(u => u.toJSON());
  }

  async createUser(data) {
    const user = new User(data);
    const validation = user.validate();
    
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const created = await this.userRepository.create(user);
    return created.toJSON();
  }

  // ... más casos de uso
}
```

### Paso 4: Infrastructure/HTTP Layer

```javascript
// src/infrastructure/http/controllers/UserController.js
export class UserController {
  constructor(userUseCases) {
    this.userUseCases = userUseCases;
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userUseCases.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await this.userUseCases.getUserById(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const user = await this.userUseCases.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // ... más métodos
}
```

```javascript
// src/infrastructure/http/routes/userRoutes.js
import express from 'express';

export const createUserRouter = (userController) => {
  const router = express.Router();

  router.get('/', userController.getAllUsers);
  router.get('/:id', userController.getUserById);
  router.post('/', userController.createUser);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);

  return router;
};
```

### Paso 5: Conectar en server.js

```javascript
// src/server.js
import { MySQLUserRepository } from './infrastructure/database/MySQLUserRepository.js';
import { UserUseCases } from './application/use-cases/UserUseCases.js';
import { UserController } from './infrastructure/http/controllers/UserController.js';
import { createUserRouter } from './infrastructure/http/routes/userRoutes.js';

// Dependency Injection
const userRepository = new MySQLUserRepository();
const userUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCases);
const userRouter = createUserRouter(userController);

// Registrar rutas
app.use('/api/users', userRouter);
```

## 🧪 Beneficios de esta Arquitectura

1. **Testeable:** Puedes testear lógica sin base de datos
2. **Mantenible:** Cada capa tiene responsabilidad clara
3. **Flexible:** Cambiar MySQL por PostgreSQL solo afecta Infrastructure
4. **Escalable:** Fácil agregar nuevas funcionalidades
5. **Independiente:** El dominio no conoce Express ni MySQL

## 📖 Recursos de Aprendizaje

- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)

## 💡 Preguntas Frecuentes

**P: ¿Por qué no poner toda la lógica en el Controller?**
R: Si pones lógica en el Controller, estará mezclada con Express. Si quieres cambiar de framework, tendrás que reescribir todo.

**P: ¿No es más trabajo esta arquitectura?**
R: Al principio sí, pero a largo plazo facilita mantenimiento y cambios.

**P: ¿Cuándo usar esta arquitectura?**
R: Para aplicaciones que crecerán y tendrán mantenimiento a largo plazo.

**P: ¿Para proyectos pequeños también?**
R: Para proyectos muy pequeños (< 5 endpoints) puede ser overkill. Pero es buena práctica aprenderla.

---

🎨 **Recuerda:** El Domain es el corazón de tu aplicación. Todo lo demás es reemplazable.
