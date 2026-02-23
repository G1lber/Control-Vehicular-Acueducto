# 🚀 Guía Rápida - Probar el Backend

## 1️⃣ Configurar Base de Datos

Asegúrate de que MySQL esté corriendo y que hayas ejecutado el archivo `db.sql`:

```bash
# En MySQL
mysql -u root -p
source c:/Users/G1lber/Documents/GitHub/Control-Vehicular-Acueducto/db.sql
```

## 2️⃣ Configurar Variables de Entorno

Edita el archivo `backend/.env` con tu contraseña de MySQL:

```env
DB_PASSWORD=tu_contraseña_de_mysql
```

## 3️⃣ Iniciar el Servidor

```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Conexión a MySQL exitosa
✅ Servidor corriendo en: http://localhost:3000
```

## 4️⃣ Probar la API

### Con el navegador:

Abre: http://localhost:3000/api/health

Deberías ver:
```json
{
  "success": true,
  "message": "API Control Vehicular funcionando correctamente",
  "timestamp": "2026-02-23T..."
}
```

### Con curl (PowerShell):

```powershell
# Salud del servidor
curl http://localhost:3000/api/health

# Listar vehículos
curl http://localhost:3000/api/vehicles

# Estadísticas
curl http://localhost:3000/api/vehicles/stats

# Crear un vehículo de prueba (necesitas un usuario existente)
$body = @{
    id_placa = "TEST-123"
    marca = "Toyota"
    modelo = "Corolla"
    anio = 2024
    color = "Blanco"
    tipo_combustible = "Gasolina"
    id_usuario = 123456789
    soat = "2026-12-31"
    tecno = "2026-06-30"
} | ConvertTo-Json

curl -Method POST `
  -Uri "http://localhost:3000/api/vehicles" `
  -ContentType "application/json" `
  -Body $body
```

## 5️⃣ Endpoints Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/vehicles` | Listar todos los vehículos |
| GET | `/api/vehicles?status=vencido` | Filtrar por estado |
| GET | `/api/vehicles/stats` | Estadísticas |
| GET | `/api/vehicles/:id` | Obtener vehículo por placa |
| GET | `/api/vehicles/driver/:id` | Vehículos de un conductor |
| POST | `/api/vehicles` | Crear vehículo |
| PUT | `/api/vehicles/:id` | Actualizar vehículo |
| DELETE | `/api/vehicles/:id` | Eliminar vehículo |

## 📊 Estructura de Respuestas

### Éxito:
```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

### Error:
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos exista

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env`: `PORT=3001`

### Error: "Module not found"
- Asegúrate de estar en la carpeta `backend/`
- Ejecuta `npm install` nuevamente

## 📚 Siguiente Paso

Lee el [README.md](README.md) completo para entender la arquitectura hexagonal en profundidad.
