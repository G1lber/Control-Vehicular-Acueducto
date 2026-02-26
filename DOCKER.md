# 🐳 Guía de Docker - Control Vehicular Acueducto

Esta guía te enseña a usar Docker para ejecutar todo el proyecto (frontend + backend + MySQL) con un solo comando.

## 📋 Prerequisitos

### 1. Instalar Docker Desktop

**Windows:**
1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop/
2. Ejecuta el instalador
3. Reinicia tu PC si es necesario
4. Abre Docker Desktop y espera a que diga "Docker Desktop is running"

**Verificar instalación:**
```powershell
docker --version
docker-compose --version
```

Deberías ver algo como:
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

---

## 🚀 Uso Básico

### Primera vez - Levantar todo el proyecto

```powershell
# En la raíz del proyecto (donde está docker-compose.yml)
docker-compose up
```

**¿Qué hace este comando?**
- ✅ Descarga la imagen de MySQL 8.0
- ✅ Construye la imagen del backend
- ✅ Construye la imagen del frontend
- ✅ Crea la base de datos con tu schema (db.sql)
- ✅ Conecta los 3 servicios en una red privada
- ✅ Levanta todo: MySQL → Backend → Frontend

**Tiempo estimado primera vez:** 3-5 minutos

**Verás logs de los 3 servicios en tiempo real:**
```
acueducto-db        | MySQL started
acueducto-backend   | Server running on port 3000
acueducto-frontend  | VITE ready in 450ms
```

### Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **MySQL:** localhost:3307 (puerto 3307 para no chocar con MySQL local)

### Detener los contenedores

Presiona `Ctrl + C` en la terminal donde ejecutaste `docker-compose up`

O en otra terminal:
```powershell
docker-compose down
```

---

## 🔧 Comandos Útiles

### Levantar en segundo plano (modo detached)
```powershell
docker-compose up -d
```

### Ver logs de todos los servicios
```powershell
docker-compose logs -f
```

### Ver logs de un solo servicio
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Detener y eliminar contenedores
```powershell
docker-compose down
```

### Detener y eliminar TODO (incluyendo volúmenes de MySQL)
```powershell
docker-compose down -v
```
⚠️ **CUIDADO:** Esto borra todos los datos de la base de datos.

### Reconstruir las imágenes (después de cambios en Dockerfile)
```powershell
docker-compose up --build
```

### Ver contenedores corriendo
```powershell
docker ps
```

### Entrar a un contenedor (modo interactivo)
```powershell
# Backend
docker exec -it acueducto-backend sh

# Frontend
docker exec -it acueducto-frontend sh

# MySQL
docker exec -it acueducto-db mysql -u acueducto -p
# Contraseña: acueducto123
```

### Reiniciar un servicio específico
```powershell
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

---

## 🗄️ Acceso a MySQL desde tu PC

Si quieres conectarte a MySQL con MySQL Workbench o HeidiSQL:

**Configuración:**
- Host: `localhost`
- Puerto: `3307` (no 3306)
- Usuario: `acueducto`
- Contraseña: `acueducto123`
- Base de datos: `control_vehicular`

**Root user:**
- Usuario: `root`
- Contraseña: `root123`

---

## 📁 Estructura de Archivos Docker

```
Control-Vehicular-Acueducto/
├── docker-compose.yml         # ← Orquestador maestro
├── db.sql                     # ← Schema inicial de MySQL
├── DOCKER.md                  # ← Esta guía
│
├── backend/
│   ├── Dockerfile             # ← Receta del contenedor backend
│   ├── .dockerignore          # ← Archivos a ignorar
│   ├── .env.docker            # ← Variables para Docker
│   └── ...
│
└── frontend/
    ├── Dockerfile             # ← Receta del contenedor frontend
    ├── .dockerignore          # ← Archivos a ignorar
    └── ...
```

---

## 🔄 Hot Reload (Cambios en tiempo real)

✅ **Los cambios en el código se reflejan automáticamente:**

- **Frontend:** Vite detecta cambios y recarga el navegador automáticamente
- **Backend:** Nodemon detecta cambios y reinicia el servidor automáticamente
- **MySQL:** Los datos se persisten en un volumen Docker

**Archivos montados:**
- `./backend` → `/app` (en el contenedor)
- `./frontend` → `/app` (en el contenedor)
- `./db.sql` → Se ejecuta solo en la primera creación de la BD

---

## 🐛 Solución de Problemas

### Error: "Port 3000 is already in use"
Tienes el backend corriendo localmente. Detén todos los procesos Node:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Error: "Port 3307 is already in use"
Cambia el puerto en `docker-compose.yml`:
```yaml
ports:
  - "3308:3306"  # Usa 3308 en lugar de 3307
```

### Error: "Cannot connect to MySQL"
Espera 10-15 segundos. MySQL tarda en inicializarse la primera vez.

Verifica que esté saludable:
```powershell
docker-compose ps
```
Deberías ver "healthy" en el servicio `db`.

### Frontend no carga / Error de red
Verifica que `VITE_API_URL` en tu `frontend/src/config/api.config.js` apunte a:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### Quiero empezar de cero
```powershell
# Detener todo y borrar volúmenes
docker-compose down -v

# Borrar imágenes construidas
docker rmi acueducto-backend acueducto-frontend

# Levantar de nuevo
docker-compose up --build
```

---

## 📊 Puertos Usados

| Servicio | Puerto Local | Puerto Contenedor | URL |
|----------|--------------|-------------------|-----|
| Frontend | 5173 | 5173 | http://localhost:5173 |
| Backend | 3000 | 3000 | http://localhost:3000 |
| MySQL | 3307 | 3306 | localhost:3307 |

---

## 🎯 Flujo de Trabajo Recomendado

### Desarrollo diario
```powershell
# Mañana - Levantar todo
docker-compose up -d

# Trabajar normalmente (cambios en código se reflejan automáticamente)

# Tarde - Detener todo
docker-compose down
```

### Después de cambios en package.json
```powershell
# Reconstruir contenedores
docker-compose up --build
```

### Ver qué está pasando
```powershell
# Ver logs en tiempo real
docker-compose logs -f
```

---

## 🚀 Ventajas de Docker

✅ **No necesitas instalar:**
- MySQL
- Node.js (aunque lo tienes, no lo usarías)
- Dependencias globales

✅ **Consistencia:**
- Funciona igual en Windows, Mac, Linux
- Mismo entorno para todo el equipo

✅ **Aislamiento:**
- No contamina tu sistema
- Puedes tener múltiples versiones de MySQL/Node

✅ **Fácil limpieza:**
- `docker-compose down -v` y todo desaparece

---

## 📚 Próximos Pasos

- [ ] Familiarízate con `docker-compose up` y `docker-compose down`
- [ ] Experimenta haciendo cambios en el código y viendo hot-reload
- [ ] Prueba conectarte a MySQL desde MySQL Workbench
- [ ] Cuando estés listo, pasa a configuración de producción

---

## 🆘 Ayuda

**Documentación oficial:**
- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

**Comandos de emergencia:**
```powershell
# Detener TODOS los contenedores Docker
docker stop $(docker ps -aq)

# Eliminar TODOS los contenedores
docker rm $(docker ps -aq)

# Eliminar TODAS las imágenes
docker rmi $(docker images -q)

# Limpiar todo (contenedores, redes, volúmenes)
docker system prune -a --volumes
```

---

**¡Listo! Ahora tienes Docker configurado para desarrollo local.** 🎉
