# Control-Vehicular-Acueducto

Sistema de control interno de vehículos para el Acueducto y Alcantarillado de la ciudad de Popayán.

## 🌟 Descripción

Plataforma web completa para la gestión y control de la flota vehicular, incluyendo:

-   Gestión de vehículos con alertas de vencimiento
-   Control de conductores y supervisores
-   Historial de mantenimientos
-   Cuestionario de seguridad vial (PESV - Ley 1581)
-   Sistema de reportes y estadísticas
-   Alertas automáticas

## 🏗️ Arquitectura del Proyecto

**Stack Tecnológico: MyERN** (MySQL, Express, React, Node.js)

```
Control-Vehicular-Acueducto/├── frontend/          # Aplicación React con Vite ✅├── backend/           # API REST Node.js + Express (en desarrollo)└── db.sql            # Schema de base de datos MySQL
```

## ✨ Características Implementadas

### ✅ Frontend (Completado)

-   **Dashboard Interactivo** - Estadísticas en tiempo real
-   **Gestión de Vehículos** - CRUD completo con alertas de SOAT y Tecno  
-   **Gestión de Usuarios** - Conductores y Supervisores con perfiles completos
-   **Cuestionario PESV** - 54 campos según normativa colombiana (Ley 1581)
-   **Sistema de Mantenimientos** - Historial con filtros y proyección
-   **Reportes Dinámicos** - 5 tipos de reportes con exportación a Excel
-   **Sistema de Alertas** - Notificaciones toast inteligentes
-   **Paginación** - Navegación optimizada en listas
-   **Diseño Responsive** - Mobile, tablet, desktop y 4K
-   **Generación de PDF** - Hoja de vida de conductores

### ✅ Backend (Completado)

-   ✅ Express.js con Arquitectura Hexagonal
-   ✅ API RESTful completa (Vehículos, Usuarios, Mantenimientos, Cuestionarios, Reportes)
-   ✅ MySQL 8 con pool de conexiones
-   ✅ Estructura Domain-Application-Infrastructure
-   ✅ Autenticación dual (Administrador y Conductor)
-   ✅ Generación de reportes Excel con ExcelJS
-   ✅ Generación de PDF con PDFKit (Hoja de vida conductor)
-   ✅ Sistema de validación con express-validator
-   ✅ Rate limiting para seguridad
-   ✅ Sistema de alertas automáticas (SOAT, Tecno, Licencias, Mantenimientos)

## 📦 Base de Datos

**MySQL 8** con las siguientes tablas:

-   **`roles`** - Tipos de usuario (Conductor, Supervisor, Admin)
-   **`usuarios`** - Información de usuarios (cédula, nombre, área, rol)
-   **`informacion_adicional`** - Cuestionario PESV (42 columnas + 4 JSON fields)
-   **`vehiculos`** - Datos de vehículos (placa, marca, SOAT, tecno, conductor)
-   **`mantenimientos`** - Historial de mantenimientos por vehículo

Ver schema completo en [`db.sql`](db.sql)

## 🚀 Inicio Rápido

### Prerrequisitos

-   Node.js 18+
-   MySQL 8
-   npm o yarn

### Frontend

```bash
# Navegar a la carpeta frontendcd frontend# Instalar dependenciasnpm install# Iniciar servidor de desarrollonpm run dev
```

📱 Aplicación disponible en: [http://localhost:5173](http://localhost:5173)

Ver documentación completa en [frontend/README.md](frontend/README.md)

### Base de Datos

```bash
# Conectar a MySQLmysql -u root -p# Ejecutar el scriptsource db.sql
```

### Backend

```bash
# Navegar a la carpeta backendcd backend# Instalar dependenciasnpm install# Configurar variables de entorno# Editar backend/.env con tus credenciales de MySQL# Iniciar servidor de desarrollonpm run dev
```

🚀 API disponible en: [http://localhost:3000](http://localhost:3000)

Ver documentación completa en [backend/README.md](backend/README.md)

## 🛠️ Tecnologías

### Frontend

-   **React 19.2** - Biblioteca de UI
-   **Vite 7.3** - Build tool ultrarrápido
-   **Tailwind CSS** - Framework CSS utilitario
-   **Heroicons** - Iconos oficiales de Tailwind
-   **Axios** - Cliente HTTP

### Backend

-   **Node.js 22** - Runtime JavaScript
-   **Express.js 4.18** - Framework webminimalista
-   **MySQL 8** - Base de datos relacional
-   **mysql2** - Cliente MySQL con Promises
-   **bcrypt** - Hash de contraseñas
-   **jsonwebtoken** - Autenticación JWT
-   **express-validator** - Validación de datos
-   **express-rate-limit** - Limitación de peticiones
-   **ExcelJS** - Generación de archivos Excel
-   **PDFKit** - Generación de archivos PDF
-   **Arquitectura Hexagonal** - Clean Architecture

### Base de Datos

-   **MySQL 8** - InnoDB engine
-   **JSON Fields** - Para datos complejos (arrays, objetos)
-   **ENUM Types** - Integridad de datos
-   **Indexes** - Optimización de consultas

## 📊 Estado del Proyecto

Módulo

Estado

Progreso

Frontend

✅ Completado

100%

Base de Datos

✅ Completado

100%

Backend - Vehículos

✅ Completado

100%

Backend - Usuarios

✅ Completado

100%

Backend - Mantenimientos

✅ Completado

100%

Autenticación JWT

✅ Completado

100%

Integración Frontend-Backend

✅ Completado

100%

## 📁 Estructura del Proyecto

```
Control-Vehicular-Acueducto/│├── frontend/│   ├── src/│   │   ├── components/     # Componentes reutilizables (Modales, Cards)│   │   ├── pages/         # Páginas (Home, Users, Vehicles, Reports)│   │   ├── context/       # Contextos (AlertContext)│   │   ├── services/      # Servicios API│   │   ├── config/        # Configuración│   │   └── assets/        # Recursos estáticos│   ├── public/│   └── README.md          # Documentación técnica del frontend│├── db.sql                 # Schema de base de datos MySQL├── promp-prototipot.txt   # Documentación de requerimientos└── README.md             # Este archivo
```

## 🎯 Funcionalidades Clave

### Gestión de Vehículos

-   Registro completo (placa, marca, modelo, año, color, combustible)
-   Asignación de conductor
-   Alertas automáticas de vencimiento (SOAT, Revisión Técnico-Mecánica)
-   Historial de mantenimientos
-   Búsqueda y filtros avanzados
-   Paginación (6 vehículos por página)

### Gestión de Usuarios

-   Perfiles de Conductores y Supervisores
-   Datos de contacto y área de trabajo
-   Cuestionario de seguridad vial integrado
-   Visualización completa de información
-   Edición de datos básicos y cuestionario
-   Descarga de hoja de vida (próximamente)

### Cuestionario PESV (Plan Estratégico de Seguridad Vial)

-   7 secciones completas según Ley 1581
-   54 campos de datos estructurados
-   Lógica condicional avanzada
-   Validación en tiempo real
-   Almacenamiento en MySQL con JSON fields
-   Diseño completamente responsive

### Sistema de Mantenimientos

-   Registro de 11 tipos de mantenimiento
-   Historial completo por vehículo
-   Filtros por mes y año
-   Estadísticas de costos
-   Proyección de próximos mantenimientos

## 📝 Próximos Pasos

-   ✅ ~~Implementar backend con Express.js~~
-   ✅ ~~Crear APIs RESTful para todas las entidades~~
-   ✅ ~~Implementar autenticación JWT~~
-   ✅ ~~Conectar frontend con backend~~
-   ✅ ~~Sistema de roles y permisos~~
-   ✅ ~~Generación de PDF para hoja de vida~~
-   ✅ ~~Exportación de reportes a Excel/PDF~~
-   [ ] Notificaciones por email para alertas
-   [ ] Dashboard avanzado con gráficas (Chart.js)
-   [ ] Respaldo automático de base de datos
-   [ ] Panel de administración avanzado
-   [ ] Historial de cambios (audit log)
-   [ ] App móvil con React Native

## 👥 Equipo

Este proyecto está siendo desarrollado para el **Acueducto y Alcantarillado de Popayán**.

## 📄 Licencia

Este proyecto es propiedad del Acueducto y Alcantarillado de Popayán.

---

📚 **Documentación Técnica:** Ver [frontend/README.md](frontend/README.md) para detalles de implementación, componentes y guías de desarrollo.