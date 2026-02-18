# Frontend - Control Vehicular Acueducto

Frontend del sistema de Control Vehicular desarrollado con React y Vite.

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
- ✅ Vencimiento SOAT
- ✅ Vencimiento Revisión Técnico-Mecánica
- ✅ Último mantenimiento (opcional)
- ✅ Kilometraje actual (opcional)

**Características:**
- ✅ Validación en tiempo real
- ✅ Mensajes de error claros
- ✅ Formato automático de placa a mayúsculas
- ✅ Alertas de éxito/error con useAlert
- ✅ Responsive design


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

El proyecto está configurado para conectarse con un backend MERN (MongoDB, Express, React, Node.js) con arquitectura hexagonal.

### Configuración del Proxy

El servidor de desarrollo de Vite está configurado para hacer proxy de las peticiones `/api/*` al backend en `http://localhost:3000`. Esto evita problemas de CORS durante el desarrollo.

### Uso de los Servicios

**Ejemplo de uso del servicio API:**

```javascript
import { exampleService } from './services/example.service';

// Obtener todos los elementos
const items = await exampleService.getAll();

// Crear un nuevo elemento
const newItem = await exampleService.create({ name: 'Nuevo Item' });

// Actualizar
await exampleService.update(id, { name: 'Actualizado' });

// Eliminar
await exampleService.delete(id);
```

**Crear nuevos servicios:**

Crea archivos en `src/services/` siguiendo el patrón de `example.service.js`. Por ejemplo, para vehículos:

```javascript
// src/services/vehicle.service.js
import { apiService } from './api.service';

export const vehicleService = {
  getAll: async () => {
    const response = await apiService.get('/vehicles');
    return response.data;
  },
  // ... más métodos
};
```

### Autenticación

El servicio API está configurado para:
- Agregar automáticamente el token JWT desde `localStorage` a las peticiones
- Redirigir a `/login` si la sesión expira (401)
- Manejar errores de forma centralizada

## 🎨 Empezar a Maquetear

### Componentes de Ejemplo

Revisa [src/utils/tailwind-examples.jsx](src/utils/tailwind-examples.jsx) para ver ejemplos completos de:

- ✅ Botones con estilos personalizados
- ✅ Cards de vehículos
- ✅ Secciones con títulos
- ✅ Badges/Etiquetas
- ✅ Inputs personalizados
- ✅ Navbar
- ✅ Tablas

### Crear Componentes

1. Crea componentes en `src/components/`
2. Crea páginas en `src/pages/`
3. Usa las clases de Tailwind con los colores personalizados

**Ejemplo de componente para vehículos:**

```jsx
// src/components/VehicleCard.jsx
export const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-primary font-bold text-xl mb-2">
        {vehicle.plate}
      </h3>
      <p className="text-primary-light font-semibold">
        {vehicle.model}
      </p>
      <div className="mt-4 space-y-2">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">SOAT:</span> {vehicle.soatExpiry}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Revisión TM:</span> {vehicle.techReviewExpiry}
        </p>
      </div>
    </div>
  );
};
```

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

## 📝 Próximos Pasos

- [x] Configurar Tailwind CSS con colores personalizados
- [x] Configurar fuente Nunito
- [ ] Instalar React Router para navegación entre páginas
- [ ] Crear componentes para gestión de vehículos
- [ ] Crear formularios para mantenimientos
- [ ] Implementar sistema de autenticación
- [ ] Integrar con el backend cuando esté disponible

## 🔗 Backend

El backend utilizará:
- **MongoDB** - Base de datos
- **Express.js** - Framework web
- **Node.js** - Runtime
- **Arquitectura Hexagonal** - Patrón de diseño

Para desarrollo local, asegúrate de que el backend esté corriendo en `http://localhost:3000`.

