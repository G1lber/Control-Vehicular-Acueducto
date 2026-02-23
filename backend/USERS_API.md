# 👥 Users API - Guía Rápida

## ✅ API Completada e Implementada

La API de Usuarios está **100% funcional** siguiendo la arquitectura hexagonal.

---

## 📋 Endpoints Disponibles

### 1️⃣ Obtener todos los usuarios
```bash
GET http://localhost:3000/api/users
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "cedula": "1001234567",
      "name": "Carlos Andrés López García",
      "area": "Operaciones",
      "phone": "3001234567",
      "role": "Conductor",
      "id_rol": 1
    }
  ],
  "count": 8
}
```

---

### 2️⃣ Obtener estadísticas
```bash
GET http://localhost:3000/api/users/stats
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 8,
    "conductores": 5,
    "supervisores": 2,
    "administradores": 1
  }
}
```

---

### 3️⃣ Filtrar por rol
```bash
GET http://localhost:3000/api/users?role=conductor
GET http://localhost:3000/api/users?role=supervisor
GET http://localhost:3000/api/users?role=administrador
```

**Respuesta:**
```json
{
  "success": true,
  "data": [...usuarios filtrados...],
  "count": 5
}
```

---

### 4️⃣ Buscar por nombre
```bash
GET http://localhost:3000/api/users?search=Carlos
```

---

### 5️⃣ Obtener un usuario específico
```bash
GET http://localhost:3000/api/users/1001234567
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "cedula": "1001234567",
    "name": "Carlos Andrés López García",
    "area": "Operaciones",
    "phone": "3001234567",
    "role": "Conductor",
    "id_rol": 1
  }
}
```

---

### 6️⃣ Crear un usuario

**Conductor (sin password):**
```bash
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "cedula": "1111111111",
  "name": "Nuevo Conductor",
  "id_rol": 1,
  "area": "Operaciones",
  "phone": "3001234567"
}
```

**Supervisor (CON password - REQUERIDO):**
```bash
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "cedula": "2222222222",
  "name": "Nuevo Supervisor",
  "id_rol": 2,
  "area": "Supervisión",
  "phone": "3009876543",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "cedula": "1111111111",
    "name": "Nuevo Conductor",
    "area": "Operaciones",
    "phone": "3001234567",
    "role": "Conductor",
    "id_rol": 1
  }
}
```

**📌 IMPORTANTE:**
- ✅ **Conductores (id_rol=1):** NO requieren password
- ✅ **Supervisores (id_rol=2):** REQUIEREN password
- ✅ **Administradores (id_rol=3):** REQUIEREN password
- ✅ La contraseña se hashea automáticamente con bcrypt

---

### 7️⃣ Actualizar un usuario
```bash
PUT http://localhost:3000/api/users/1001234567
Content-Type: application/json

{
  "name": "Nombre Actualizado",
  "area": "Nueva Área",
  "phone": "3001111111",
  "password": "nuevaContraseña" (opcional, solo si es Supervisor/Admin)
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "cedula": "1001234567",
    "name": "Nombre Actualizado",
    "area": "Nueva Área",
    "phone": "3001111111",
    "role": "Conductor",
    "id_rol": 1
  }
}
```

---

### 8️⃣ Eliminar un usuario
```bash
DELETE http://localhost:3000/api/users/1001234567
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

**Error si tiene vehículos asignados:**
```json
{
  "success": false,
  "message": "No se puede eliminar el usuario porque tiene vehículos asignados"
}
```

---

## 🔒 Seguridad

### Password Hashing
- Todas las contraseñas se hashean con **bcrypt** (10 salt rounds)
- Las contraseñas **NUNCA** se devuelven en las respuestas de la API
- Solo se pueden verificar mediante el endpoint de autenticación

### Autenticación (Login)
```bash
POST http://localhost:3000/api/users/auth/login
Content-Type: application/json

{
  "cedula": "1002345678",
  "password": "supervisor123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "cedula": "1002345678",
    "name": "Roberto Carlos Sánchez Méndez",
    "area": "Supervisión",
    "phone": "3201234567",
    "role": "Supervisor",
    "id_rol": 2
  }
}
```

**❌ Conductores NO pueden hacer login:**
```json
{
  "success": false,
  "message": "Los conductores no pueden hacer login en el sistema"
}
```

---

## 🧪 Testing con PowerShell

### Listar todos
```powershell
curl http://localhost:3000/api/users
```

### Estadísticas
```powershell
curl http://localhost:3000/api/users/stats
```

### Crear Conductor
```powershell
$body = @{
  cedula='9999999999'
  name='Test Conductor'
  id_rol=1
  area='Testing'
  phone='3001111111'
} | ConvertTo-Json

curl -Method POST -Uri http://localhost:3000/api/users -Headers @{'Content-Type'='application/json'} -Body $body
```

### Crear Supervisor
```powershell
$body = @{
  cedula='8888888888'
  name='Test Supervisor'
  id_rol=2
  area='Testing'
  phone='3002222222'
  password='test123'
} | ConvertTo-Json

curl -Method POST -Uri http://localhost:3000/api/users -Headers @{'Content-Type'='application/json'} -Body $body
```

### Actualizar
```powershell
$body = @{
  name='Nombre Actualizado'
  area='Nueva Área'
} | ConvertTo-Json

curl -Method PUT -Uri http://localhost:3000/api/users/9999999999 -Headers @{'Content-Type'='application/json'} -Body $body
```

### Eliminar
```powershell
curl -Method DELETE http://localhost:3000/api/users/9999999999
```

---

## 📊 Datos de Prueba Actuales

La base de datos tiene estos usuarios de prueba:

| Cédula | Nombre | Rol | Área | Password |
|--------|--------|-----|------|----------|
| 1001234567 | Carlos Andrés López García | Conductor | Operaciones | - |
| 1001234568 | María Fernanda Ruiz Torres | Conductor | Mantenimiento | - |
| 1001234569 | José Manuel Gómez Pérez | Conductor | Distribución | - |
| 1001234570 | Ana Lucía Martínez Silva | Conductor | Operaciones | - |
| 1001234571 | Luis Fernando Castro Díaz | Conductor | Logística | - |
| **1002345678** | **Roberto Carlos Sánchez Méndez** | **Supervisor** | Supervisión | ✅ |
| **1002345679** | **Patricia Elena Ramírez Ortiz** | **Supervisor** | Control Interno | ✅ |
| **1003456789** | **Juan Pablo Admin González** | **Administrador** | Administración | ✅ |

---

## ✅ Validaciones Implementadas

### Cédula
- ✅ Requerida
- ✅ Numérica
- ✅ Entre 6 y 12 dígitos
- ✅ Única (no puede haber duplicados)

### Nombre
- ✅ Requerido
- ✅ Mínimo 3 caracteres

### Rol
- ✅ Requerido
- ✅ Debe ser 1, 2 o 3

### Password
- ✅ Requerida para Supervisores (id_rol=2)
- ✅ Requerida para Administradores (id_rol=3)
- ✅ Mínimo 6 caracteres
- ✅ Hasheada con bcrypt

### Celular
- ✅ Opcional
- ✅ Si existe, debe ser 10 dígitos

---

## 🏗️ Arquitectura Implementada

### ✅ Domain Layer
- `domain/entities/User.js` - Entidad con validaciones y lógica de negocio
- `domain/repositories/UserRepository.js` - Interface (Puerto)

### ✅ Infrastructure Layer
- `infrastructure/database/MySQLUserRepository.js` - Adaptador MySQL con bcrypt
- `infrastructure/http/controllers/UserController.js` - Controlador HTTP
- `infrastructure/http/routes/userRoutes.js` - Rutas Express

### ✅ Application Layer
- `application/use-cases/UserUseCases.js` - Casos de uso (orquestación)

### ✅ Server
- `server.js` - Dependency Injection conectado

---

## 🎯 Siguientes Pasos Sugeridos

1. ✅ **Users API** - COMPLETADA
2. ⏭️ **Maintenances API** - Siguiente tarea
3. ⏭️ **Additional Info API** (Cuestionario PESV)
4. ⏭️ **JWT Authentication** (mejorar el login actual)
5. ⏭️ **Conectar Frontend con Backend**

---

## 💡 Tips para el Frontend

Cuando conectes el frontend (Users.jsx), deberás:

1. **Reemplazar el mock data** por llamadas a la API:
```javascript
// En Users.jsx
useEffect(() => {
  fetch('http://localhost:3000/api/users')
    .then(res => res.json())
    .then(data => setUsers(data.data));
}, []);
```

2. **Obtener estadísticas:**
```javascript
fetch('http://localhost:3000/api/users/stats')
  .then(res => res.json())
  .then(data => {
    const { total, conductores, supervisores } = data.data;
    // Actualizar estado
  });
```

3. **Crear usuario:**
```javascript
const handleAddUser = async (userData) => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const result = await response.json();
  if (result.success) {
    // Usuario creado exitosamente
  }
};
```

---

✅ **API de Usuarios 100% funcional y probada!**
