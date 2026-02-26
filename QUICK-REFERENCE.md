# 🚀 Comandos Rápidos de Referencia

Guía rápida de comandos para administrar tu aplicación en producción.

## 📦 Deployment

```bash
# Deployment completo (automático)
cd ~/Control-Vehicular-Acueducto
bash deploy.sh

# Deployment manual
git pull origin main
export $(cat .env.production | xargs)
docker compose -f docker-compose.production.yml up -d --build

# Primer deployment
docker compose -f docker-compose.production.yml up -d --build
```

## 🔍 Monitoreo

```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluye detenidos)
docker ps -a

# Ver logs de todos los servicios
docker compose -f docker-compose.production.yml logs -f

# Ver logs de un servicio específico
docker compose -f docker-compose.production.yml logs -f backend
docker compose -f docker-compose.production.yml logs -f frontend
docker compose -f docker-compose.production.yml logs -f db

# Ver últimas 100 líneas de logs
docker compose -f docker-compose.production.yml logs --tail=100 backend

# Ver uso de recursos (CPU, RAM, Red)
docker stats

# Ver espacio en disco
df -h
```

## 🔄 Control de servicios

```bash
# Reiniciar todos los servicios
docker compose -f docker-compose.production.yml restart

# Reiniciar un servicio específico
docker compose -f docker-compose.production.yml restart backend
docker compose -f docker-compose.production.yml restart frontend
docker compose -f docker-compose.production.yml restart db

# Detener todos los servicios
docker compose -f docker-compose.production.yml stop

# Iniciar servicios detenidos
docker compose -f docker-compose.production.yml start

# Detener y eliminar contenedores
docker compose -f docker-compose.production.yml down

# Detener y eliminar TODO (incluye volúmenes - CUIDADO)
docker compose -f docker-compose.production.yml down -v
```

## 🐛 Debugging

```bash
# Entrar a un contenedor (shell interactivo)
docker exec -it acueducto-backend-prod sh
docker exec -it acueducto-frontend-prod sh
docker exec -it acueducto-db-prod sh

# Ejecutar comando en un contenedor
docker exec acueducto-backend-prod ls -la
docker exec acueducto-backend-prod env

# Ver variables de entorno del backend
docker exec acueducto-backend-prod env | grep DB

# Probar endpoint del backend
curl http://localhost/api/health

# Ver configuración de Nginx
docker exec acueducto-frontend-prod cat /etc/nginx/conf.d/default.conf
```

## 💾 Base de datos

```bash
# Conectar a MySQL dentro del contenedor
docker exec -it acueducto-db-prod mysql -u root -p
# Ingresa tu MYSQL_ROOT_PASSWORD

# Conectar como usuario de aplicación
docker exec -it acueducto-db-prod mysql -u acueducto_prod -p control_vehicular
# Ingresa tu MYSQL_PASSWORD

# Backup de base de datos
docker exec acueducto-db-prod mysqldump -u root -p control_vehicular > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i acueducto-db-prod mysql -u root -p control_vehicular < backup_20260226_120000.sql

# Ver bases de datos
docker exec -it acueducto-db-prod mysql -u root -p -e "SHOW DATABASES;"

# Ver tamaño de la base de datos
docker exec -it acueducto-db-prod mysql -u root -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'control_vehicular';"
```

## 🧹 Limpieza

```bash
# Limpiar imágenes no usadas
docker image prune -f

# Limpiar contenedores detenidos
docker container prune -f

# Limpiar todo (imágenes, contenedores, redes, volúmenes)
docker system prune -a --volumes
# CUIDADO: Esto borra TODO, incluida la base de datos

# Ver espacio usado por Docker
docker system df
```

## 🔐 Seguridad

```bash
# Generar contraseñas seguras
openssl rand -base64 32

# Generar JWT Secret
openssl rand -base64 48

# Ver intentos fallidos de login SSH (Fail2ban)
sudo fail2ban-client status sshd

# Ver firewall
sudo ufw status

# Actualizar sistema
sudo apt update && sudo apt upgrade -y
```

## 📊 Información del sistema

```bash
# Ver IP pública del servidor
curl ifconfig.me

# Ver CPU y memoria
top
htop  # Más visual (instalar: sudo apt install htop)

# Ver procesos de Docker
ps aux | grep docker

# Ver versiones
docker --version
docker compose version
node --version
mysql --version
```

## 🌐 Nginx y SSL

```bash
# Renovar certificado SSL
sudo certbot renew

# Probar renovación SSL (simulación)
sudo certbot renew --dry-run

# Ver certificados instalados
sudo certbot certificates

# Ver configuración de Nginx
docker exec acueducto-frontend-prod nginx -t

# Recargar configuración de Nginx
docker exec acueducto-frontend-prod nginx -s reload
```

## 🔄 Git

```bash
# Ver estado del repositorio
git status

# Ver últimos commits
git log --oneline -10

# Descartar cambios locales
git reset --hard origin/main

# Ver rama actual
git branch

# Ver repositorio remoto
git remote -v
```

## 🎯 Comandos útiles combinados

```bash
# Ver logs de backend en tiempo real con filtro de errores
docker compose -f docker-compose.production.yml logs -f backend | grep -i error

# Backup automático con compresión
docker exec acueducto-db-prod mysqldump -u root -p control_vehicular | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Reiniciar todo y ver logs
docker compose -f docker-compose.production.yml restart && docker compose -f docker-compose.production.yml logs -f

# Ver contenedores con formato personalizado
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## 🆘 Emergencias

```bash
# Detener TODOS los contenedores Docker del servidor
docker stop $(docker ps -aq)

# Eliminar TODOS los contenedores
docker rm $(docker ps -aq)

# Reiniciar Docker daemon
sudo systemctl restart docker

# Ver logs de Docker daemon
sudo journalctl -u docker -f

# Liberar puerto 80 si está ocupado
sudo lsof -ti:80 | xargs sudo kill -9

# Liberar puerto 443
sudo lsof -ti:443 | xargs sudo kill -9
```

---

**Tip:** Guarda esta referencia en favoritos o imprime para tener a mano.

Ver guías completas:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deployment completa
- [DOCKER.md](DOCKER.md) - Guía de Docker para desarrollo
