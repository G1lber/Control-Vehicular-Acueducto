# Sistema de Documentos SOAT y Tecnomecánica

## Descripción
Este feature permite subir, descargar y gestionar documentos PDF/imágenes de SOAT y Tecnomecánica para cada vehículo del sistema.

## Cambios Realizados

### Base de Datos
- **Tabla `vehiculos`**: Agregados campos `soat_documento` y `tecno_documento` (VARCHAR 255, opcionales)
- Los documentos NO son obligatorios

### Backend

#### Nuevos Archivos
- `backend/src/infrastructure/config/multer.config.js`: Configuración de multer para uploads
- `backend/SOAT_Tecno/`: Directorio base para almacenar documentos (ignorado en git)

#### Archivos Modificados
- `backend/src/domain/entities/Vehicle.js`: Agregados campos `soat_documento` y `tecno_documento`
- `backend/src/infrastructure/database/MySQLVehicleRepository.js`: Actualizadas queries para incluir los nuevos campos
- `backend/src/infrastructure/http/controllers/VehicleController.js`: Agregados métodos:
  - `uploadDocument()` - POST /api/vehicles/:placa/documents
  - `downloadDocument()` - GET /api/vehicles/:placa/documents/:docType
  - `deleteDocument()` - DELETE /api/vehicles/:placa/documents/:docType
- `backend/src/infrastructure/http/routes/vehicleRoutes.js`: Agregadas rutas para documentos
- `backend/package.json`: Agregada dependencia `multer`

#### Estructura de Carpetas de Documentos
```
backend/
  SOAT_Tecno/
    ABC-123/
      soat_1234567890.pdf
      tecno_1234567890.pdf
    DEF-456/
      soat_9876543210.jpg
      tecno_9876543210.png
```

### Frontend

#### Archivos Modificados
- `frontend/src/services/vehicle.service.js`: Agregados métodos:
  - `uploadDocument(placa, file, docType)`
  - `downloadDocument(placa, docType)`
  - `deleteDocument(placa, docType)`
- `frontend/src/components/VehicleDetailsModal.jsx`: Agregada UI para subir/descargar/eliminar documentos
- `frontend/src/components/VehicleCard.jsx`: Agregado icono para indicar si tiene documentos cargados
- `frontend/src/pages/VehicleList.jsx`: Actualizado mapeo de datos para incluir documentos

## Uso

### Subir Documento
1. Abrir modal de detalles del vehículo
2. En la sección de SOAT o Tecnomecánica, hacer clic en "Examinar" para seleccionar archivo
3. Archivos permitidos: PDF, JPG, JPEG, PNG (máx. 5MB)
4. El archivo se sube automáticamente al seleccionarlo

### Descargar Documento
1. Si el vehículo tiene documento cargado, aparecerá un botón "Descargar"
2. Hacer clic en el botón para descargar el archivo

### Eliminar Documento
1. Si el vehículo tiene documento cargado, aparecerá un botón "Eliminar"
2. Hacer clic en el botón y confirmar
3. El archivo se elimina del servidor y de la base de datos

## API Endpoints

### POST /api/vehicles/:placa/documents
Subir documento
- **Autenticación**: Token JWT
- **Permisos**: Supervisor o Administrador
- **Body** (multipart/form-data):
  - `file`: Archivo (PDF, JPG, JPEG, PNG - máx 5MB)
  - `docType`: "soat" o "tecno"
  - `placa`: Placa del vehículo

### GET /api/vehicles/:placa/documents/:docType
Descargar documento
- **Autenticación**: Token JWT
- **Parámetros**:
  - `placa`: Placa del vehículo
  - `docType`: "soat" o "tecno"

### DELETE /api/vehicles/:placa/documents/:docType
Eliminar documento
- **Autenticación**: Token JWT
- **Permisos**: Supervisor o Administrador
- **Parámetros**:
  - `placa`: Placa del vehículo
  - `docType`: "soat" o "tecno"

## Despliegue a Producción

### 1. Base de Datos
Ejecutar las siguientes migraciones en MySQL:

```sql
USE control_vehicular_acueducto;

ALTER TABLE vehiculos 
ADD COLUMN soat_documento VARCHAR(255) NULL COMMENT 'Ruta del documento SOAT',
ADD COLUMN tecno_documento VARCHAR(255) NULL COMMENT 'Ruta del documento Tecnomecánica';
```

### 2. Backend
```bash
# Instalar dependencias
cd backend
npm install multer

# Crear directorio para documentos (si no existe)
mkdir -p SOAT_Tecno

# Dar permisos de escritura (Linux/VPS)
chmod 755 SOAT_Tecno
```

### 3. Frontend
No requiere cambios adicionales, los archivos ya están actualizados.

### 4. Docker (Producción)
Asegurarse de que el volumen persiste los documentos en `docker-compose.production.yml`:

```yaml
backend:
  volumes:
    - ./SOAT_Tecno:/app/SOAT_Tecno
```

### 5. Verificación
1. Crear/actualizar un vehículo
2. Subir documento de SOAT
3. Verificar que aparece el icono en la tarjeta del vehículo
4. Descargar el documento
5. Eliminar el documento

## Seguridad

- Los documentos solo pueden ser subidos por Supervisores y Administradores
- Los documentos pueden ser descargados por cualquier usuario autenticado
- Los archivos se almacenan con nombres únicos (timestamp) para evitar colisiones
- Se valida el tipo de archivo en backend (solo PDF, JPG, JPEG, PNG)
- Se valida el tamaño máximo (5MB)
- La carpeta SOAT_Tecno está ignorada en git para no subir documentos al repositorio

## Mantenimiento

### Backup de Documentos
```bash
# Crear backup de todos los documentos
cd backend
tar -czf SOAT_Tecno_backup_$(date +%Y%m%d).tar.gz SOAT_Tecno/
```

### Limpieza de Documentos Huérfanos
Si se elimina un vehículo, los documentos pueden quedar en el servidor. Para limpiarlos:

```bash
# Listar carpetas de vehículos que ya no existen en la BD
cd backend/SOAT_Tecno
# Eliminar manualmente las carpetas de vehículos eliminados
```

## Troubleshooting

### Error: File too large
- Verificar que el archivo no supere 5MB
- Comprimir el PDF si es necesario

### Error: Invalid file type  
- Solo se permiten: PDF, JPG, JPEG, PNG
- Convertir el archivo al formato correcto

### Error: Permission denied
- Verificar permisos de la carpeta SOAT_Tecno
- En Linux: `chmod 755 SOAT_Tecno`

### Documento no se descarga
- Verificar que el archivo existe en el servidor
- Revisar logs del backend para errores
- Verificar que el campo en BD apunta al archivo correcto
