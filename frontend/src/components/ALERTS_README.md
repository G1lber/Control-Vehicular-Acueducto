# Sistema de Alertas Reutilizable

Sistema de notificaciones toast para toda la aplicación con 4 tipos de alertas: success, error, warning e info.

## 📦 Componentes

### 1. AlertContext
Contexto global que gestiona el estado de todas las alertas.

### 2. Alert
Componente visual individual de alerta con iconos de Heroicons.

### 3. AlertContainer
Contenedor que renderiza todas las alertas activas en la esquina superior derecha.

## 🚀 Uso

### Importar el hook

```jsx
import { useAlert } from '../context/AlertContext';

function MiComponente() {
  const { success, error, warning, info } = useAlert();
  
  // ...
}
```

### Métodos disponibles

#### `success(message, duration?)`
Muestra una alerta de éxito (verde).

```jsx
const { success } = useAlert();

const handleSubmit = () => {
  // ... código
  success('Operación exitosa');
  // O con duración personalizada (en milisegundos)
  success('Guardado correctamente', 3000);
};
```

#### `error(message, duration?)`
Muestra una alerta de error (rojo).

```jsx
const { error } = useAlert();

const handleDelete = async () => {
  try {
    await deleteItem(id);
  } catch (err) {
    error('No se pudo eliminar el elemento');
  }
};
```

#### `warning(message, duration?)`
Muestra una alerta de advertencia (amarillo).

```jsx
const { warning } = useAlert();

const validateForm = () => {
  if (!formData.email) {
    warning('El email es requerido');
    return false;
  }
  return true;
};
```

#### `info(message, duration?)`
Muestra una alerta informativa (azul).

```jsx
const { info } = useAlert();

const handleLogout = () => {
  logout();
  info('Sesión cerrada correctamente');
};
```

### Múltiples alertas

Puedes mostrar varias alertas al mismo tiempo:

```jsx
const { success, warning } = useAlert();

const handleBulkUpdate = () => {
  success('5 registros actualizados');
  warning('2 registros requieren revisión');
};
```

## 🎨 Características

- ✅ **4 tipos de alertas**: Success, Error, Warning, Info
- ✅ **Auto-cierre configurable**: Por defecto 5 segundos
- ✅ **Cierre manual**: Botón X en cada alerta
- ✅ **Animación de entrada**: Slide-in desde la derecha
- ✅ **Iconos Heroicons**: CheckCircle, XCircle, ExclamationTriangle, InformationCircle
- ✅ **Responsive**: Se adapta a móviles y tablets
- ✅ **Múltiples alertas**: Stack vertical en la esquina superior derecha
- ✅ **Colores personalizados**: Usa los colores del sistema (#1779BC)

## 🎯 Ejemplos de uso en el proyecto

### Login exitoso
```jsx
// App.jsx
const handleLogin = () => {
  setIsAuthenticated(true);
  success('Bienvenido al Sistema de Control Vehicular');
};
```

### Registro de mantenimiento
```jsx
// App.jsx
const handleMaintenanceSubmit = (formData) => {
  // ... guardar datos
  success('Mantenimiento registrado exitosamente');
};
```

### Generar reporte
```jsx
// Reports.jsx
const handleGenerateReport = (type) => {
  // ... generar reporte
  success(`Reporte "${reportName}" generado exitosamente`);
};
```

### Error en petición
```jsx
// ExampleService
try {
  const response = await api.get('/vehicles');
  return response.data;
} catch (err) {
  error('Error al cargar los vehículos');
  throw err;
}
```

## ⚙️ Configuración

### Duración por defecto
La duración por defecto es **5000ms** (5 segundos). Se puede cambiar en cada llamada:

```jsx
success('Mensaje rápido', 2000);  // 2 segundos
warning('Mensaje normal', 5000);  // 5 segundos (default)
info('Mensaje persistente', 10000); // 10 segundos
```

### Sin auto-cierre
Para alertas que requieren cierre manual:

```jsx
error('Error crítico: requiere atención', 0); // No se cierra automáticamente
```

## 📱 Posición y estilo

Las alertas aparecen:
- **Posición**: Esquina superior derecha (fixed)
- **z-index**: 50 (sobre todo el contenido)
- **Ancho máximo**: 400px
- **Responsive**: En móviles ocupa el ancho completo con márgenes

## 🔧 Personalización

### Cambiar colores
Editar [Alert.jsx](../components/Alert.jsx):

```jsx
const alertStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    // ...
  },
  // ...
};
```

### Cambiar posición
Editar [AlertContainer.jsx](../components/AlertContainer.jsx):

```jsx
// Superior derecha (actual)
<div className="fixed top-4 right-4 z-50">

// Superior izquierda
<div className="fixed top-4 left-4 z-50">

// Inferior derecha
<div className="fixed bottom-4 right-4 z-50">

// Centro superior
<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
```

### Cambiar animación
Editar [index.css](../index.css):

```css
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

## 📚 Estructura de archivos

```
src/
├── components/
│   ├── Alert.jsx           # Componente visual de alerta
│   └── AlertContainer.jsx  # Contenedor de alertas
├── context/
│   └── AlertContext.jsx    # Contexto y hook useAlert
└── index.css               # Animaciones CSS
```

## 🔍 Debugging

Para ver todas las alertas activas en consola:

```jsx
const { alerts } = useAlert();
console.log('Alertas activas:', alerts);
```

Cada alerta tiene:
- `id`: Timestamp único
- `message`: Texto del mensaje
- `type`: 'success' | 'error' | 'warning' | 'info'
- `duration`: Milisegundos antes de auto-cerrar
