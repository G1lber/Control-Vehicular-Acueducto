# 🔧 API de Mantenimientos - Documentación Completa

## 📋 Descripción General

La API de Mantenimientos permite gestionar el historial de mantenimientos de los vehículos del sistema, incluyendo cambios de aceite, llantas, frenos, filtros, baterías, suspensión, transmisión, etc.

## 🏗️ Arquitectura Hexagonal

```
Domain (Reglas de negocio)
  ├── entities/Maintenance.js          - Entidad con validaciones
  └── repositories/MaintenanceRepository.js - Interface (Port)

Application (Casos de uso)
  └── use-cases/MaintenanceUseCases.js  - Orquestación

Infrastructure (Adaptadores)
  ├── database/MySQLMaintenanceRepository.js  - Adapter MySQL
  └── http/
      ├── controllers/MaintenanceController.js
      └── routes/maintenanceRoutes.js
```

## 📊 Modelo de Datos

### Tabla: `mantenimientos`

```sql
CREATE TABLE mantenimientos (
    id_mantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_placa VARCHAR(10) NOT NULL,
    tipo_mantenimiento VARCHAR(100) NOT NULL,
    fecha_realizado DATE NOT NULL,
    fecha_proxima DATE,
    kilometraje INT,
    costo DECIMAL(12,2),
    descripcion TEXT,
    informacion_adicional TEXT,
    
    CONSTRAINT fk_mantenimiento_vehiculo
        FOREIGN KEY (id_placa)
        REFERENCES vehiculos(id_placa)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

### Campos Calculados en Respuestas JSON

- `diasDesdeMantenimiento`: Días transcurridos desde la fecha de realización
- `diasHastaProximo`: Días hasta el próximo mantenimiento (null si no hay fecha próxima)
- `estado`: Estado del mantenimiento
  - `"vencido"`: La fecha próxima ya pasó
  - `"proximo"`: Falta menos de 30 días
  - `"al_dia"`: Todo está bien
  - `"sin_fecha"`: No hay fecha próxima programada

## 🔌 Endpoints Disponibles

### Base URL: `http://localhost:3000/api/maintenances`

---

## 1️⃣ Obtener Todos los Mantenimientos

**GET** `/api/maintenances`

Obtiene todos los mantenimientos con filtros opcionales.

### Query Parameters (Opcionales)

| Parámetro | Tipo   | Descripción                               |
|-----------|--------|-------------------------------------------|
| placa     | string | Filtrar por placa del vehículo           |
| tipo      | string | Filtrar por tipo de mantenimiento        |
| year      | number | Filtrar por año (YYYY)                   |
| month     | number | Filtrar por mes (1-12, requiere year)    |

### Ejemplos

```powershell
# Todos los mantenimientos
curl http://localhost:3000/api/maintenances

# Por vehículo
curl "http://localhost:3000/api/maintenances?placa=ABC-123"

# Por tipo
curl "http://localhost:3000/api/maintenances?tipo=oil_change"

# Por fecha (año)
curl "http://localhost:3000/api/maintenances?year=2026"

# Por fecha (mes específico)
curl "http://localhost:3000/api/maintenances?year=2026&month=2"
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "placa": "ABC-123",
      "tipo": "oil_change",
      "fechaRealizado": "2026-01-15T05:00:00.000Z",
      "fechaProxima": "2026-07-15T05:00:00.000Z",
      "kilometraje": 45000,
      "costo": 180000,
      "descripcion": "Cambio de aceite y filtro",
      "informacionAdicional": null,
      "diasDesdeMantenimiento": 40,
      "diasHastaProximo": 142,
      "estado": "al_dia"
    }
  ],
  "count": 1
}
```

---

## 2️⃣ Obtener Mantenimiento por ID

**GET** `/api/maintenances/:id`

Obtiene un mantenimiento específico por su ID.

### Ejemplo

```powershell
curl http://localhost:3000/api/maintenances/5
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 5,
    "placa": "DEF-456",
    "tipo": "filters",
    "fechaRealizado": "2026-02-01T05:00:00.000Z",
    "fechaProxima": "2026-08-01T05:00:00.000Z",
    "kilometraje": 28000,
    "costo": 95000,
    "descripcion": "Cambio de filtros de aire y combustible",
    "informacionAdicional": null,
    "diasDesdeMantenimiento": 23,
    "diasHastaProximo": 159,
    "estado": "al_dia"
  }
}
```

### Respuesta de Error (404 Not Found)

```json
{
  "success": false,
  "message": "Mantenimiento no encontrado"
}
```

---

## 3️⃣ Obtener Estadísticas

**GET** `/api/maintenances/stats`

Obtiene estadísticas de costos y conteo por tipo de mantenimiento.

### Query Parameters (Opcionales)

| Parámetro    | Tipo   | Descripción                        |
|--------------|--------|------------------------------------|
| placa        | string | Filtrar por placa                  |
| tipo         | string | Filtrar por tipo                   |
| fechaInicio  | date   | Fecha inicio (YYYY-MM-DD)          |
| fechaFin     | date   | Fecha fin (YYYY-MM-DD)             |

### Ejemplo

```powershell
# Estadísticas generales
curl http://localhost:3000/api/maintenances/stats

# Estadísticas de un vehículo
curl "http://localhost:3000/api/maintenances/stats?placa=ABC-123"
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "costos": {
      "totalMantenimientos": 14,
      "costoTotal": 4800000,
      "costoPromedio": 342857.142857,
      "costoMinimo": 95000,
      "costoMaximo": 1200000,
      "sinCosto": 0
    },
    "porTipo": {
      "oil_change": {
        "cantidad": 7,
        "costoTotal": 1225000
      },
      "tire_change": {
        "cantidad": 1,
        "costoTotal": 850000
      },
      "brake_fluid": {
        "cantidad": 1,
        "costoTotal": 120000
      }
    }
  }
}
```

---

## 4️⃣ Obtener Alertas

**GET** `/api/maintenances/alerts`

Obtiene mantenimientos vencidos y próximos a vencer (30 días).

### Ejemplo

```powershell
curl http://localhost:3000/api/maintenances/alerts
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "vencidos": [
      {
        "id": 13,
        "placa": "STU-901",
        "tipo": "oil_change",
        "fechaRealizado": "2025-07-20T05:00:00.000Z",
        "fechaProxima": "2026-01-20T05:00:00.000Z",
        "kilometraje": 110000,
        "costo": 160000,
        "descripcion": "Cambio de aceite",
        "informacionAdicional": null,
        "diasDesdeMantenimiento": 219,
        "diasHastaProximo": -34,
        "estado": "vencido"
      }
    ],
    "proximos": [],
    "totalVencidos": 2,
    "totalProximos": 0
  }
}
```

---

## 5️⃣ Obtener Mantenimientos Próximos

**GET** `/api/maintenances/upcoming`

Obtiene mantenimientos próximos a vencer.

### Query Parameters

| Parámetro | Tipo   | Default | Descripción                        |
|-----------|--------|---------|-------------------------------------|
| dias      | number | 30      | Días de anticipación               |

### Ejemplo

```powershell
# Próximos 30 días
curl http://localhost:3000/api/maintenances/upcoming

# Próximos 15 días
curl "http://localhost:3000/api/maintenances/upcoming?dias=15"
```

---

## 6️⃣ Obtener Mantenimientos Vencidos

**GET** `/api/maintenances/overdue`

Obtiene mantenimientos con fecha próxima ya vencida.

### Ejemplo

```powershell
curl http://localhost:3000/api/maintenances/overdue
```

---

## 7️⃣ Último Mantenimiento de un Vehículo

**GET** `/api/maintenances/vehicle/:placa/last`

Obtiene el último mantenimiento realizado a un vehículo específico.

### Ejemplo

```powershell
curl http://localhost:3000/api/maintenances/vehicle/ABC-123/last
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "placa": "ABC-123",
    "tipo": "oil_change",
    "fechaRealizado": "2026-01-15T05:00:00.000Z",
    "fechaProxima": "2026-07-15T05:00:00.000Z",
    "kilometraje": 45000,
    "costo": 180000,
    "descripcion": "Cambio de aceite y filtro",
    "informacionAdicional": null,
    "diasDesdeMantenimiento": 40,
    "diasHastaProximo": 142,
    "estado": "al_dia"
  }
}
```

---

## 8️⃣ Crear Mantenimiento

**POST** `/api/maintenances`

Registra un nuevo mantenimiento para un vehículo.

### Request Body (Campos Requeridos)

```json
{
  "placa": "ABC-123",
  "tipo": "Cambio de aceite",
  "fechaRealizado": "2026-02-23"
}
```

### Request Body (Campos Opcionales)

```json
{
  "fechaProxima": "2026-08-23",
  "kilometraje": 46000,
  "costo": 200000.00,
  "descripcion": "Cambio de aceite sintético 5W-30",
  "informacionAdicional": "Se revisó filtro de aire"
}
```

### Ejemplo Completo

```powershell
$body = @{
    placa = 'ABC-123'
    tipo = 'Cambio de aceite'
    fechaRealizado = '2026-02-23'
    fechaProxima = '2026-08-23'
    kilometraje = 46000
    costo = 200000.00
    descripcion = 'Cambio de aceite sintético 5W-30'
} | ConvertTo-Json

curl -Method POST `
     -Uri http://localhost:3000/api/maintenances `
     -Body $body `
     -ContentType 'application/json'
```

### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Mantenimiento registrado exitosamente",
  "data": {
    "id": 15,
    "placa": "ABC-123",
    "tipo": "Cambio de aceite",
    "fechaRealizado": "2026-02-23T05:00:00.000Z",
    "fechaProxima": "2026-08-23T05:00:00.000Z",
    "kilometraje": 46000,
    "costo": 200000,
    "descripcion": "Cambio de aceite sintético 5W-30",
    "informacionAdicional": null,
    "diasDesdeMantenimiento": 1,
    "diasHastaProximo": 181,
    "estado": "al_dia"
  }
}
```

### Respuestas de Error

#### 400 Bad Request - Campos Faltantes

```json
{
  "success": false,
  "message": "Faltan campos requeridos",
  "required": ["placa", "tipo", "fechaRealizado"]
}
```

#### 400 Bad Request - Validación Fallida

```json
{
  "success": false,
  "message": "Datos inválidos: La placa debe tener el formato XXX-XXX (ej: ABC-123), La fecha de realización no puede ser futura"
}
```

#### 404 Not Found - Vehículo No Existe

```json
{
  "success": false,
  "message": "El vehículo especificado no existe"
}
```

---

## 9️⃣ Actualizar Mantenimiento

**PUT** `/api/maintenances/:id`

Actualiza un mantenimiento existente. Solo se actualizan los campos enviados.

### Request Body (Todos Opcionales)

```json
{
  "placa": "ABC-123",
  "tipo": "Cambio de aceite y filtros",
  "fechaRealizado": "2026-02-23",
  "fechaProxima": "2026-08-23",
  "kilometraje": 47000,
  "costo": 250000.00,
  "descripcion": "Cambio de aceite y filtros completos",
  "informacionAdicional": "Se detectó fuga menor en tapa de aceite"
}
```

### Ejemplo

```powershell
$body = @{
    costo = 300000.00
    descripcion = 'Cambio de aceite y filtros - ACTUALIZADO'
} | ConvertTo-Json

curl -Method PUT `
     -Uri http://localhost:3000/api/maintenances/15 `
     -Body $body `
     -ContentType 'application/json'
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Mantenimiento actualizado exitosamente",
  "data": {
    "id": 15,
    "placa": "ABC-123",
    "tipo": "Cambio de aceite",
    "fechaRealizado": "2026-02-23T05:00:00.000Z",
    "fechaProxima": "2026-08-23T05:00:00.000Z",
    "kilometraje": 46000,
    "costo": 300000,
    "descripcion": "Cambio de aceite y filtros - ACTUALIZADO",
    "informacionAdicional": null,
    "diasDesdeMantenimiento": 1,
    "diasHastaProximo": 181,
    "estado": "al_dia"
  }
}
```

### Respuestas de Error

#### 404 Not Found

```json
{
  "success": false,
  "message": "Mantenimiento no encontrado"
}
```

#### 400 Bad Request - Validación Fallida

```json
{
  "success": false,
  "message": "Datos inválidos: El costo debe ser un número positivo"
}
```

---

## 🔟 Eliminar Mantenimiento

**DELETE** `/api/maintenances/:id`

Elimina un mantenimiento del sistema.

### Ejemplo

```powershell
curl -Method DELETE http://localhost:3000/api/maintenances/15
```

### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Mantenimiento eliminado exitosamente"
}
```

### Respuesta de Error (404 Not Found)

```json
{
  "success": false,
  "message": "Mantenimiento no encontrado"
}
```

---

## 📋 Validaciones Implementadas

### En la Entidad `Maintenance`

- **Placa**:
  - Obligatoria
  - Formato: `XXX-XXX` (ej: ABC-123)
  - Se convierte automáticamente a mayúsculas

- **Tipo de Mantenimiento**:
  - Obligatorio
  - Mínimo 3 caracteres
  - Máximo 100 caracteres

- **Fecha Realizado**:
  - Obligatoria
  - No puede ser futura

- **Fecha Próxima** (opcional):
  - Debe ser posterior a la fecha de realización
  - Si no se proporciona, el estado será "sin_fecha"

- **Kilometraje** (opcional):
  - Número positivo
  - Máximo: 9,999,999 km

- **Costo** (opcional):
  - Número positivo
  - Máximo: 9,999,999,999.99

- **Descripción** (opcional):
  - Máximo 1000 caracteres

- **Información Adicional** (opcional):
  - Máximo 1000 caracteres

---

## 🔍 Tipos de Mantenimiento Comunes

Basados en el frontend:

- `oil_change` - Cambio de Aceite
- `tire_change` - Cambio de Llantas
- `brake_fluid` - Cambio de Líquido de Frenos
- `drive_kit` - Cambio de Kit de Arrastre
- `filters` - Cambio de Filtros
- `battery` - Cambio de Batería
- `brakes` - Mantenimiento de Frenos
- `suspension` - Mantenimiento de Suspensión
- `engine` - Mantenimiento de Motor
- `transmission` - Mantenimiento de Transmisión
- `other` - Otro

---

## 📊 Datos de Prueba Actuales

En la base de datos hay **14 mantenimientos** distribuidos así:

- **oil_change**: 7 (costo total: $1,225,000)
- **transmission**: 1 (costo total: $1,200,000)
- **tire_change**: 1 (costo total: $850,000)
- **suspension**: 1 (costo total: $650,000)
- **brakes**: 1 (costo total: $380,000)
- **battery**: 1 (costo total: $280,000)
- **brake_fluid**: 1 (costo total: $120,000)
- **filters**: 1 (costo total: $95,000)

**Total invertido en mantenimientos**: $4,800,000

---

## 🎯 Casos de Uso Comunes

### 1. Ver historial completo de un vehículo

```powershell
curl "http://localhost:3000/api/maintenances?placa=ABC-123"
```

### 2. Revisar qué mantenimientos están vencidos

```powershell
curl http://localhost:3000/api/maintenances/overdue
```

### 3. Ver el último mantenimiento de un vehículo

```powershell
curl http://localhost:3000/api/maintenances/vehicle/ABC-123/last
```

### 4. Obtener costos de mantenimientos del mes actual

```powershell
curl "http://localhost:3000/api/maintenances/stats?fechaInicio=2026-02-01&fechaFin=2026-02-28"
```

### 5. Ver todos los cambios de aceite

```powershell
curl "http://localhost:3000/api/maintenances?tipo=oil_change"
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado                                      |
|--------|--------------------------------------------------|
| 200    | Operación exitosa                                |
| 201    | Recurso creado exitosamente                      |
| 400    | Datos inválidos o campos faltantes               |
| 404    | Recurso no encontrado                            |
| 500    | Error interno del servidor                       |

### Formato de Respuestas de Error

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## 🔄 Integración con Frontend

### Ejemplo de Uso en `MaintenanceForm.jsx`

```javascript
// Registrar nuevo mantenimiento
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/maintenances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        placa: formData.vehicleId,
        tipo: formData.maintenanceType,
        fechaRealizado: formData.date,
        fechaProxima: formData.nextMaintenanceDate,
        kilometraje: formData.mileage,
        costo: formData.cost,
        descripcion: formData.description
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Mantenimiento registrado:', result.data);
      // Actualizar UI
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};
```

### Cargar Historial de Mantenimientos

```javascript
const loadMaintenanceHistory = async (placa) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/maintenances?placa=${placa}`
    );
    const result = await response.json();
    
    if (result.success) {
      setMaintenances(result.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📈 Próximas Mejoras

- [ ] Integración con JWT para autenticación
- [ ] Middleware de validación con express-validator
- [ ] Exportar reportes en PDF
- [ ] Subir fotos/documentos de mantenimientos
- [ ] Notificaciones automáticas de alertas
- [ ] Dashboard de costos por vehículo
- [ ] Predicción de próximos mantenimientos basado en kilometraje

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, contacta al equipo de desarrollo.

---

**API de Control Vehicular Acueducto v1.0.0**  
Última actualización: 23 de Febrero de 2026
