# Frontend - Control Vehicular Acueducto

Documentación técnica del frontend desarrollado con React y Vite.

> 📖 Para información general del proyecto, ver [README principal](../README.md)

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Sistema de Diseño](#-sistema-de-diseño)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Páginas Disponibles](#-páginas-disponibles)
- [Configuración](#️-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Conexión con Backend](#-conexión-con-el-backend)
- [Desarrollo](#-desarrollo)

## 📊 Componentes Implementados

### Modales
- **Modal** - Componente base reutilizable con 4 tamaños
- **AddVehicleModal** - Agregar vehículos con validación completa
- **VehicleDetailsModal** - Ver/editar detalles de vehículo (dual edit)
- **AddUserModal** - Agregar usuarios (Conductores/Supervisores)
- **UserDetailsModal** - Ver/editar perfil completo + cuestionario PESV
- **MaintenanceForm** - Registrar mantenimientos
- **MaintenanceHistoryModal** - Historial con filtros temporales
- **AlertsModal** - Gestión de alertas del sistema

### Cards (Tarjetas)
- **VehicleCard** - Tarjeta de vehículo con alertas de vencimiento
- **UserCard** - Tarjeta de usuario con rol y acciones

### Páginas
- **Home** - Dashboard con estadísticas y accesos rápidos
- **VehicleList** - Gestión de vehículos con paginación
- **Users** - Gestión de usuarios con paginación
- **Reports** - Generación de 5 tipos de reportes con Excel
- **Login** - Autenticación dual (Admin + Conductor)
- **LoginSurvey** - Login específico para cuestionario
- **SurveyTalentoHumano** - Cuestionario PESV (54 campos)

### Contextos y Servicios
- **AlertContext** - Sistema de notificaciones toast
- **api.service.js** - Cliente HTTP con interceptores
- **example.service.js** - Plantilla para servicios CRUD

## 🚀 Tecnologías

- **React 19.2** - Biblioteca de UI
- **Vite 7.3** - Build tool y dev server
- **Tailwind CSS** - Framework de utilidades CSS
- **Axios** - Cliente HTTP para conectar con el backend

## 🎨 Sistema de Diseño

### Colores Personalizados

```css
/* Colores del sistema configurados en Tailwind */
Primary:       #1779BC  -> Hovers, Títulos navbar o footer
Primary Light: #67aed4  -> Subtítulos e información a resaltar
Secondary:     #778191  -> Utilizarlo mínimamente
Background:    #ffffff  -> Body
```

**Uso en Tailwind:**
```jsx
<div className="bg-primary text-white">Título</div>
<h2 className="text-primary-light font-semibold">Subtítulo</h2>
<p className="text-secondary">Texto secundario</p>
```

### Fuente Personalizada

```
Fuente: Nunito (Google Fonts)
Pesos: 300, 400, 500, 600, 700, 800
```

**Uso en Tailwind:**
```jsx
<p className="font-normal">Texto normal (400)</p>
<p className="font-semibold">Texto semibold (600)</p>
<p className="font-bold">Texto bold (700)</p>
```

### Variables CSS Disponibles

También puedes usar variables CSS directamente:
```css
var(--color-primary)
var(--color-primary-light)
var(--color-secondary)
var(--color-background)
```

### Iconos con Heroicons

El proyecto utiliza **Heroicons** para todos los iconos del sistema. Heroicons es la biblioteca de iconos oficial recomendada por Tailwind CSS.

**Importar iconos:**
```jsx
import { HomeIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

// Para iconos sólidos:
import { HomeIcon, UserIcon } from '@heroicons/react/24/solid';
```

**Uso en componentes:**
```jsx
<HomeIcon className="w-6 h-6 text-primary" />
<UserIcon className="w-5 h-5" />
```

**Iconos disponibles comunes:**
- `HomeIcon` - Inicio
- `BuildingOffice2Icon` - Vehículos
- `DocumentChartBarIcon` - Reportes
- `Cog6ToothIcon` - Configuración/Mantenimientos
- `ExclamationTriangleIcon` - Alertas
- `CalendarIcon` - Fechas
- `EnvelopeIcon` - Email
- `LockClosedIcon` - Contraseña
- `EyeIcon` / `EyeSlashIcon` - Mostrar/ocultar
- `ArrowDownTrayIcon` - Descargar
- `PlusIcon` - Agregar
- `ChevronRightIcon` - Flecha derecha

📚 **Catálogo completo:** https://heroicons.com

### Componentes Reutilizables

#### Modal
Componente de ventana emergente reutilizable con soporte para diferentes tamaños y cierre con ESC.

**Uso básico:**
```jsx
import Modal from './components/Modal';
import { useState } from 'react';

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Título del Modal"
        size="md" // sm, md, lg, xl
      >
        <p>Contenido del modal aquí</p>
      </Modal>
    </>
  );
}
```

**Características:**
- ✅ Cierre con tecla ESC
- ✅ Cierre al hacer click en el overlay
- ✅ 4 tamaños: sm, md, lg, xl
- ✅ Previene scroll del body cuando está abierto
- ✅ Animación de entrada suave

#### Sistema de Alertas
Sistema de notificaciones toast para toda la aplicación. Ver [ALERTS_README.md](src/components/ALERTS_README.md) para documentación completa.

**Uso básico:**
```jsx
import { useAlert } from '../context/AlertContext';

function MiComponente() {
  const { success, error, warning, info } = useAlert();
  
  const handleClick = () => {
    success('¡Operación exitosa!');
  };
}
```

#### Formularios en Modal

**AddVehicleModal** - Formulario para agregar vehículos nuevos con validación completa.

**Uso básico:**
```jsx
import AddVehicleModal from './components/AddVehicleModal';
import { useState } from 'react';

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Lista de conductores disponibles
  const drivers = [
    { id: 1, name: 'Carlos López', cedula: '1234567890', role: 'Conductor' },
    { id: 2, name: 'José Martínez', cedula: '5555555555', role: 'Conductor' }
  ];

  const handleAddVehicle = (vehicleData) => {
    console.log('Vehículo agregado:', vehicleData);
    // Enviar al backend
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Agregar Vehículo</button>
      
      <AddVehicleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleAddVehicle}
        drivers={drivers}
      />
    </>
  );
}
```

**Campos del formulario:**
- ✅ Placa (validación formato ABC-123)
- ✅ Marca y Modelo
- ✅ Año
- ✅ Color
- ✅ Tipo de combustible
- ✅ Conductor asignado (obligatorio)
- ✅ Vencimiento SOAT
- ✅ Vencimiento Revisión Técnico-Mecánica
- ✅ Último mantenimiento (opcional)
- ✅ Kilometraje actual (opcional)

**Características:**
- ✅ Validación en tiempo real
- ✅ Mensajes de error claros
- ✅ Formato automático de placa a mayúsculas
- ✅ Selector de conductor con nombre y cédula
- ✅ Alertas de éxito/error con useAlert
- ✅ Responsive design

**MaintenanceHistoryModal** - Modal para visualizar el historial de mantenimientos con filtros por mes.

**Uso básico:**
```jsx
import MaintenanceHistoryModal from './components/MaintenanceHistoryModal';
import { useState } from 'react';

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Datos de ejemplo
  const maintenances = [
    {
      id: 1,
      vehicleId: 1,
      maintenanceType: 'oil_change',
      date: '2026-01-10',
      cost: '150000',
      mileage: '45000',
      nextMaintenanceDate: '2026-07-10',
      description: 'Cambio de aceite y filtro'
    },
    // más mantenimientos...
  ];

  const vehicles = [
    { id: 1, plate: 'ABC-123', brand: 'Toyota', model: 'Hilux' },
    // más vehículos...
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ver Historial</button>
      
      <MaintenanceHistoryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maintenances={maintenances}
        vehicles={vehicles}
      />
    </>
  );
}
```

**Características:**
- ✅ Filtro personalizable: selecciona cualquier mes y año manualmente
- ✅ Botón para limpiar filtro y ver todos los mantenimientos
- ✅ Estadísticas en tiempo real (cantidad y costo total del período)
- ✅ Tarjetas detalladas con información completa de cada mantenimiento
- ✅ Ordenamiento por fecha (más reciente primero)
- ✅ Colores distintivos por tipo de mantenimiento
- ✅ Información del vehículo asociado
- ✅ Scroll vertical para listas largas
- ✅ Mensaje cuando no hay mantenimientos en el período seleccionado

**Tipos de mantenimiento soportados:**
- oil_change, tire_change, brake_fluid, drive_kit, filters, battery, brakes, suspension, engine, transmission, other

**VehicleDetailsModal** - Modal para visualizar y actualizar información detallada del vehículo.

**Uso básico:**
```jsx
import VehicleDetailsModal from './components/VehicleDetailsModal';
import { useState } from 'react';

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const vehicle = {
    id: 1,
    plate: 'ABC-123',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2022,
    color: 'Blanco',
    fuelType: 'Diesel',
    soatExpiry: '2026-06-15',
    techReviewExpiry: '2026-08-20',
    lastMaintenance: '2026-01-10',
    mileage: '45000',
    driverId: 1
  };
  
  const drivers = [
    { id: 1, name: 'Carlos López', cedula: '1234567890', role: 'Conductor' }
  ];

  const handleUpdate = (updatedVehicle) => {
    console.log('Vehículo actualizado:', updatedVehicle);
    // Enviar al backend
  };

  return (
    <>
      <button onClick={() => { 
        setSelectedVehicle(vehicle);
        setIsOpen(true);
      }}>
        Ver Detalles
      </button>
      
      <VehicleDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicle={selectedVehicle}
        onUpdate={handleUpdate}
        drivers={drivers}
      />
    </>
  );
}
```

**Características:**
- ✅ Vista completa de información del vehículo
- ✅ **Dos modos de edición independientes:**
  - **Editar Información:** Actualizar placa, marca, modelo, año, color, tipo de combustible, kilometraje, último mantenimiento y **conductor asignado**
  - **Editar Fechas:** Actualizar fechas de SOAT y revisión técnico-mecánica
- ✅ Indicadores visuales de estado (vencido, por vencer, vigente)
- ✅ Contador de días restantes para cada documento
- ✅ Visualización del conductor asignado con icono
- ✅ Validación completa de campos:
  - Formato de placa (ABC-123)
  - Rango de año válido
  - Conductor obligatorio
  - Campos obligatorios vs opcionales
- ✅ Integración con sistema de alertas
- ✅ Diseño responsive y profesional
- ✅ Botones de acción claros (Editar, Guardar, Cancelar)
- ✅ Los dos modos de edición no pueden estar activos simultáneamente

**AddUserModal** - Modal para agregar usuarios (Conductores y Supervisores).

**Uso básico:**
```jsx
import AddUserModal from './components/AddUserModal';
import { useState } from 'react';

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddUser = (userData) => {
    console.log('Usuario agregado:', userData);
    // Enviar al backend
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Agregar Usuario</button>
      
      <AddUserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleAddUser}
      />
    </>
  );
}
```

**Campos del formulario:**
- ✅ **Nombre Completo** * (mínimo 3 caracteres)
- ✅ **Número de Cédula** * (6-10 dígitos)
- ✅ **Número de Celular** * (10 dígitos)
- ✅ **Área** * (texto libre)
- ✅ **Cargo/Rol** * (dropdown: Conductor o Supervisor)

**Características:**
- ✅ Validación completa en tiempo real
- ✅ Mensajes de error específicos para cada campo
- ✅ Solo dos roles disponibles: Conductor y Supervisor
- ✅ Integración con sistema de alertas
- ✅ Diseño responsive con iconos de Heroicons
- ✅ Reseteo automático del formulario al cerrar

#### UserDetailsModal
Modal completo para visualizar y editar toda la información del usuario, incluyendo datos del cuestionario de seguridad vial.

**Uso básico:**
```jsx
import UserDetailsModal from './components/UserDetailsModal';
import { useState } from 'react';

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [surveyData, setSurveyData] = useState(null);

  return (
    <>
      <button onClick={() => {
        setSelectedUser(user);
        setIsOpen(true);
      }}>
        Ver Detalles
      </button>
      
      <UserDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={selectedUser}
        surveyData={surveyData}
      />
    </>
  );
}
```

**Secciones del modal:**
- ✅ **Header con degradado**: Muestra nombre, rol y cédula del usuario
- ✅ **Datos Básicos**: Nombre, cédula, celular, área, rol (editable)
- ✅ **Cuestionario de Seguridad Vial** (si está completado):
  - 🔵 Datos Generales (ciudad, sitio labor, cargo, edad, etc.)
  - 🟢 Licencia de Conducción (categoría, vigencia, experiencia)
  - 🔴 Accidentes e Incidentes (últimos 5 años)
  - 🟡 Desplazamientos Laborales (vehículo propio y empresa)
  - 🟣 Planificación (KM mensuales, antelación)
  - 🟠 Comparendos
  - ⚫ Información Adicional

**Características:**
- ✅ Dos modos de edición independientes (datos básicos y cuestionario)
- ✅ Diseño con degradados y bordes de colores por sección
- ✅ Scroll único optimizado
- ✅ Validación de campos
- ✅ Integración con sistema de alertas
- ✅ Mensaje claro cuando el usuario no ha completado el cuestionario
- ✅ Diseño responsive y profesional


## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables de UI
├── pages/         # Páginas/vistas de la aplicación
├── services/      # Servicios para llamadas a la API
│   ├── api.service.js       # Cliente HTTP configurado
│   └── example.service.js   # Ejemplo de servicio CRUD
├── config/        # Archivos de configuración
│   └── api.config.js        # Configuración de la API
├── utils/         # Funciones utilitarias
└── assets/        # Recursos estáticos (imágenes, etc.)
```

## 🛠️ Configuración

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y ajusta la URL del backend:

```bash
VITE_API_URL=http://localhost:3000/api
```

### Instalación

```bash
# Instalar dependencias
npm install
```

## 📦 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo (puerto 5173)
npm run dev

# Compilar para producción
npm run build

# Vista previa de la compilación
npm run preview

# Ejecutar linter
npm run lint
```

## 🔌 Conexión con el Backend

El frontend está preparado para conectarse con un backend Express.js + MySQL.

### Configuración del Proxy

El servidor Vite está configurado para proxear peticiones `/api/*` al backend en `http://localhost:3000`, evitando problemas de CORS durante el desarrollo.

**Configuración en `vite.config.js`:**
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

### Servicios API

El cliente HTTP está en `src/services/api.service.js` con interceptores configurados para:
- Agregar automáticamente token JWT desde `localStorage`
- Redirigir a `/login` si la sesión expira (401)
- Manejar errores de forma centralizada

**Ejemplo de uso:**

```javascript
import { apiService } from './services/api.service';

// GET request
const response = await apiService.get('/vehicles');

// POST request  
await apiService.post('/vehicles', vehicleData);

// PUT request
await apiService.put(`/vehicles/${id}`, updatedData);

// DELETE request
await apiService.delete(`/vehicles/${id}`);
```

**Crear un servicio específico:**

```javascript
// src/services/vehicle.service.js
import { apiService } from './api.service';

export const vehicleService = {
  getAll: () => apiService.get('/vehicles'),
  getById: (id) => apiService.get(`/vehicles/${id}`),
  create: (data) => apiService.post('/vehicles', data),
  update: (id, data) => apiService.put(`/vehicles/${id}`, data),
  delete: (id) => apiService.delete(`/vehicles/${id}`)
};
```

### Estado de Integración

⚠️ **Backend en desarrollo** - Las llamadas API actuales usan datos de ejemplo (mock data).

Para conectar con el backend real:
1. Asegúrate de que el backend esté corriendo en `http://localhost:3000`
2. Reemplaza los datos mock en las páginas por llamadas a los servicios
3. Maneja los estados de carga y error apropiadamente

## 📄 Páginas Disponibles

### Home (Dashboard)
- **Ruta**: `/` (página por defecto)
- **Descripción**: Panel principal con estadísticas y acceso rápido
- **Características**:
  - 3 cards de estadísticas (Vehículos, Mantenimientos, Alertas)
  - 6 botones de acceso rápido:
    - Vehículos, Usuarios, Nuevo Vehículo
    - Mantenimientos, Reportes
    - **Cuestionario de Seguridad Vial** (nuevo)
  - Integración con modales de alertas y mantenimientos
  - Grid responsive adaptable

### VehicleList (Gestión de Vehículos)
- **Ruta**: `/vehicles`
- **Descripción**: Lista completa de vehículos con búsqueda y filtros
- **Características**:
  - Búsqueda por placa, marca o modelo
  - Filtro por estado (Activos, Por vencer, Vencidos)
  - Grid responsive de tarjetas de vehículos
  - **Paginación estática (6 vehículos por página)**:
    - Botones de navegación (Anterior/Siguiente)
    - Números de página con indicador de página actual
    - Contador de resultados (mostrando X-Y de Z vehículos)
    - Reseteo automático a página 1 al cambiar búsqueda o filtros
  - Modal para agregar nuevos vehículos
  - Modal de detalles con edición de información
  - Visualización del conductor asignado en cada tarjeta

### Users (Gestión de Usuarios)
- **Ruta**: `/users`
- **Descripción**: Gestión completa de Conductores y Supervisores
- **Características**:
  - 3 cards de estadísticas (Total, Conductores, Supervisores)
  - Búsqueda por nombre, cédula o área
  - Filtro por rol (Todos, Conductores, Supervisores)
  - Grid responsive de tarjetas de usuarios
  - **Paginación estática (6 usuarios por página)**:
    - Botones de navegación (Anterior/Siguiente)
    - Números de página con indicador de página actual
    - Contador de resultados (mostrando X-Y de Z usuarios)
    - Reseteo automático a página 1 al cambiar búsqueda o filtros
  - Modal para agregar nuevos usuarios con validación completa
  - **Modal de Detalles del Usuario** (UserDetailsModal):
    - Visualización completa de datos básicos
    - Visualización de cuestionario de seguridad vial (si existe)
    - Edición de datos básicos (nombre, celular, área, rol)
    - Edición de información del cuestionario
    - Header con degradado mostrando nombre, rol y cédula
    - Scroll optimizado con secciones por colores
  - **Botón de Descargar Hoja de Vida** en cada tarjeta
  - Diferenciación visual por rol (Conductor/Supervisor)

### SurveyTalentoHumano (Cuestionario de Seguridad Vial)
- **Ruta**: `/surveyTalentoHumano`
- **Descripción**: Cuestionario de Seguridad Vial según normativa colombiana (Ley 1581)
- **Acceso**: Card en el Home (no aparece en menú)
- **Características**:
  - ✅ Formulario de consentimiento informado
  - ✅ 7 secciones completas:
    1. **DATOS GENERALES** - Información personal y laboral
    2. **LICENCIA DE CONDUCCIÓN** - Categoría, vigencia, experiencia
    3. **DESPLAZAMIENTOS LABORALES** - Uso de vehículos (propio/empresa)
    4. **PLANIFICACIÓN** - Organización de desplazamientos
    5. **FACTORES DE RIESGO** - Identificación de riesgos
    6. **COMPARENDOS** - Infracciones de tránsito
    7. **INFORMACIÓN ADICIONAL** - Observaciones
  - ✅ Lógica condicional avanzada (preguntas que aparecen según respuestas previas)
  - ✅ Validación completa de campos obligatorios
  - ✅ Diseño completamente responsive (mobile a 4K)
  - ✅ Integración con AlertContext
  - ✅ 54 campos de datos estructurados
  - ✅ Integrado con base de datos MySQL (tabla `informacion_adicional`)

### Reports (Reportes)
- **Ruta**: `/reports`
- **Descripción**: Generación de reportes del sistema con exportación a Excel
- **Características**:
  - **5 tipos de reportes disponibles**:
    1. **Vehículos** - Información completa de la flota
    2. **Usuarios** - Conductores y supervisores
    3. **Mantenimientos** - Historial de mantenimientos
    4. **Vehículos + Mantenimientos** - Reporte combinado con estadísticas
    5. **Conductores + Vehículos** - Reporte combinado de asignaciones
  - **Selector de campos personalizable** - Elige qué columnas incluir
  - **Filtros avanzados**:
    - Rango de fechas
    - Tipo de mantenimiento
    - Rol de usuario
  - **Exportación a Excel (ExcelJS)**:
    - Headers en español profesionales
    - Formato automático de columnas
    - Estilos aplicados (colores, bordes,negrita)
  - **Vista previa de campos** - Antes de generar el reporte
  - **Tipos de mantenimiento en español** - Sin códigos técnicos
  - **Integración completa con backend** - Descarga directa del archivo

### Login
- **Ruta**: `/login` (cuando no está autenticado)
- **Descripción**: Página de inicio de sesión para administradores y supervisores
- **Características**:
  - Formulario con cédula y contraseña
  - Mostrar/ocultar contraseña
  - Validación de credenciales
  - Integración con logo del acueducto
  - Redirección automática según rol

### LoginSurvey
- **Ruta**: `/login-survey`
- **Descripción**: Página de inicio de sesión específica para conductores (cuestionario)
- **Características**:
  - Login solo con cédula (sin contraseña)
  - Acceso directo al cuestionario PESV
  - Validación de que el usuario sea conductor
  - Flujo simplificado para encuestas

## 📝 Desarrollo

### Componentes de Ejemplo

Revisa [src/utils/tailwind-examples.jsx](src/utils/tailwind-examples.jsx) para ver ejemplos completos de:

- ✅ Botones con estilos personalizados
- ✅ Cards de vehículos
- ✅ Secciones con títulos
- ✅ Badges/Etiquetas
- ✅ Inputs personalizados
- ✅ Navbar
- ✅ Tablas

### Clases de Tailwind Más Usadas

```jsx
// Colores
className="bg-primary text-white"
className="text-primary-light"
className="border-primary"

// Espaciado
className="p-4 m-2"           // padding y margin
className="px-6 py-3"         // padding horizontal y vertical
className="space-y-4"         // espacio entre elementos verticales

// Tipografía
className="text-xl font-bold"
className="text-primary-light font-semibold"

// Layout
className="flex items-center justify-between"
className="grid grid-cols-1 md:grid-cols-3 gap-4"

// Efectos
className="shadow-lg rounded-lg"
className="hover:bg-primary transition-colors"
className="focus:ring-2 focus:ring-primary-light"
```

### Crear Nuevos Componentes

1. Crea el archivo en `src/components/` o `src/pages/`
2. Usa los componentes reutilizables (Modal, Cards)
3. Aplica el sistema de diseño (colores, fuentes, iconos)
4. Integra con AlertContext para notificaciones
5. Usa servicios API para llamadas al backend

**Ejemplo:**

```jsx
// src/components/MiComponente.jsx
import { useAlert } from '../context/AlertContext';
import { UserIcon } from '@heroicons/react/24/outline';

export const MiComponente = () => {
  const { success, error } = useAlert();

  const handleAction = () => {
    try {
      // Lógica aquí
      success('¡Operación exitosa!');
    } catch (err) {
      error('Ocurrió un error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <UserIcon className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">Título</h2>
      </div>
      <button
        onClick={handleAction}
        className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Acción
      </button>
    </div>
  );
};
```

---

## 📚 Recursos Adicionales

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Heroicons**: https://heroicons.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

## 🔗 Enlaces

- [README Principal](../README.md) - Información general del proyecto
- [Schema de Base de Datos](../db.sql) - Estructura de la base de datos
- [ALERTS_README](src/components/ALERTS_README.md) - Documentación del sistema de alertas

