# 🚀 Guía de Deployment - VPS Ubuntu 24.04 LTS

Esta guía te lleva paso a paso para desplegar tu proyecto en tu VPS de Hostinger.

**Specs de tu VPS:**
- 2 núcleos CPU
- 8 GB RAM
- 100 GB NVMe
- 8 TB bandwidth
- Ubuntu 24.04 LTS

---

## 📋 Prerequisitos

- ✅ Acceso SSH a tu VPS
- ✅ Usuario con permisos sudo
- ✅ (Opcional) Dominio apuntando a la IP de tu VPS

---

## 🔐 PASO 1: Conectar a tu VPS

### Desde tu PC Windows:

**Opción A: PowerShell**
```powershell
ssh root@TU_IP_VPS
# O si tienes usuario no-root:
ssh tu_usuario@TU_IP_VPS
```

**Opción B: PuTTY**
- Descarga PuTTY: https://www.putty.org/
- Ingresa la IP de tu VPS
- Puerto: 22
- Usuario: root (o el que te dio Hostinger)

---

## 🛠️ PASO 2: Preparar el servidor (Primera vez)

### 2.1 Actualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Instalar Docker
```bash
# Descargar script de instalación oficial
curl -fsSL https://get.docker.com -o get-docker.sh

# Ejecutar instalación
sudo sh get-docker.sh

# Agregar tu usuario al grupo docker (para no usar sudo siempre)
sudo usermod -aG docker $USER

# Aplicar cambios (cierra sesión y vuelve a conectar)
exit
# Vuelve a conectar por SSH
```

**Verificar instalación:**
```bash
docker --version
docker compose version
```

Deberías ver:
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

### 2.3 Instalar Git
```bash
sudo apt install git -y
git --version
```

### 2.4 Configurar firewall
```bash
# Permitir SSH (IMPORTANTE: hazlo ANTES de habilitar el firewall)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

Deberías ver:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## 📦 PASO 3: Subir el proyecto

### 3.1 Opción A: Desde GitHub (Recomendado)

**En tu PC (Windows):**
```powershell
# Si aún no has subido el proyecto a GitHub:
cd C:\Users\G1lber\Documents\GitHub\Control-Vehicular-Acueducto

# Agregar .env.production al .gitignore (seguridad)
echo ".env.production" >> .gitignore

# Commit y push
git add .
git commit -m "Add Docker production configuration"
git push origin main
```

**En tu VPS:**
```bash
# Clonar el repositorio
cd ~
git clone https://github.com/TU_USUARIO/Control-Vehicular-Acueducto.git
cd Control-Vehicular-Acueducto
```

### 3.2 Opción B: Subir con SCP (Si no usas GitHub)

**En tu PC (PowerShell):**
```powershell
# Comprimir proyecto (excluye node_modules)
cd C:\Users\G1lber\Documents\GitHub

# Crear archivo comprimido (requiere 7-Zip o similar)
# Excluye: node_modules, .git, dist, etc.

# Subir a VPS
scp Control-Vehicular-Acueducto.zip root@TU_IP_VPS:~/

# En el VPS, descomprimir:
unzip Control-Vehicular-Acueducto.zip
```

---

## ⚙️ PASO 4: Configurar variables de entorno

```bash
cd ~/Control-Vehicular-Acueducto

# Copiar ejemplo de variables
cp .env.production.example .env.production

# Editar con nano
nano .env.production
```

**Genera contraseñas seguras:**
```bash
# Generar contraseña MySQL root
openssl rand -base64 32

# Generar contraseña MySQL user
openssl rand -base64 32

# Generar JWT Secret
openssl rand -base64 48
```

**Pega los valores en `.env.production`:**
```env
MYSQL_ROOT_PASSWORD=aB3xK9mP2... (pega lo que generaste)
MYSQL_DATABASE=control_vehicular
MYSQL_USER=acueducto_prod
MYSQL_PASSWORD=wQ7zM5nL8... (pega lo que generaste)
JWT_SECRET=pR4tY6kJ9... (pega lo que generaste)
DOMAIN=tu-dominio.com  # O tu IP si no tienes dominio
```

**Guardar:** `Ctrl + O`, `Enter`, `Ctrl + X`

---

## 🚀 PASO 5: Levantar el proyecto

### 5.1 Build e iniciar contenedores
```bash
# En la carpeta del proyecto
cd ~/Control-Vehicular-Acueducto

# Cargar variables de entorno
export $(cat .env.production | xargs)

# Build y levantar en segundo plano
docker compose -f docker-compose.production.yml up -d --build
```

**Esto hará:**
1. Build del backend (Node.js optimizado)
2. Build del frontend (React → archivos estáticos)
3. Descarga imagen MySQL 8
4. Inicia los 3 contenedores
5. Ejecuta `db.sql` para crear las tablas

⏱️ **Tiempo estimado:** 5-10 minutos (primera vez)

### 5.2 Verificar que todo está corriendo
```bash
docker ps
```

Deberías ver 3 contenedores:
```
CONTAINER ID   IMAGE                    STATUS        PORTS
abc123         acueducto-frontend       Up 2 min      0.0.0.0:80->80/tcp
def456         acueducto-backend        Up 2 min
ghi789         mysql:8.0                Up 2 min (healthy)
```

### 5.3 Ver logs
```bash
# Todos los servicios
docker compose -f docker-compose.production.yml logs -f

# Solo backend
docker compose -f docker-compose.production.yml logs -f backend

# Solo frontend
docker compose -f docker-compose.production.yml logs -f frontend

# Solo MySQL
docker compose -f docker-compose.production.yml logs -f db
```

---

## 🌐 PASO 6: Acceder a tu aplicación

### Si usas la IP directamente:
```
http://TU_IP_VPS
```

Ejemplo: `http://123.45.67.89`

### Si tienes dominio:
```
http://tu-dominio.com
```

**¡Deberías ver tu aplicación corriendo!** 🎉

---

## 🔒 PASO 7: Configurar SSL (HTTPS) [OPCIONAL pero RECOMENDADO]

### 7.1 Instalar Certbot

**Si tienes dominio:**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL (REEMPLAZA con tu dominio)
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com

# Sigue las instrucciones:
# - Ingresa tu email
# - Acepta términos
# - Elige si compartir email
```

Certbot guardará certificados en:
```
/etc/letsencrypt/live/tu-dominio.com/fullchain.pem
/etc/letsencrypt/live/tu-dominio.com/privkey.pem
```

### 7.2 Configurar Nginx para SSL

```bash
# Crear configuración SSL
nano ~/Control-Vehicular-Acueducto/nginx-ssl.conf
```

**Pega esto (REEMPLAZA `tu-dominio.com`):**
```nginx
server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # SSL optimizado
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html;
    index index.html;

    # Compresión
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;

    # Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

**Guardar:** `Ctrl + O`, `Enter`, `Ctrl + X`

### 7.3 Reiniciar contenedores
```bash
cd ~/Control-Vehicular-Acueducto
docker compose -f docker-compose.production.yml restart frontend
```

### 7.4 Renovación automática de SSL
```bash
# Certbot renueva automáticamente, pero puedes probarlo
sudo certbot renew --dry-run
```

**Ahora tu app está en HTTPS** 🔒
```
https://tu-dominio.com
```

---

## 🔄 PASO 8: Actualizar el proyecto (Deploy de nuevos cambios)

### Desde tu PC:
```powershell
# Commit y push cambios
git add .
git commit -m "Nuevas funcionalidades"
git push origin main
```

### En el VPS:
```bash
cd ~/Control-Vehicular-Acueducto

# Descargar cambios
git pull origin main

# Reconstruir y reiniciar
export $(cat .env.production | xargs)
docker compose -f docker-compose.production.yml up -d --build

# Ver logs
docker compose -f docker-compose.production.yml logs -f
```

⏱️ **Tiempo:** 2-5 minutos

---

## 🛠️ Comandos útiles

### Ver contenedores
```bash
docker ps
docker ps -a  # Incluye detenidos
```

### Ver logs
```bash
docker compose -f docker-compose.production.yml logs -f
docker compose -f docker-compose.production.yml logs -f backend
```

### Reiniciar servicios
```bash
docker compose -f docker-compose.production.yml restart
docker compose -f docker-compose.production.yml restart backend
```

### Detener todo
```bash
docker compose -f docker-compose.production.yml down
```

### Detener y eliminar volúmenes (CUIDADO: Borra BD)
```bash
docker compose -f docker-compose.production.yml down -v
```

### Acceso a MySQL
```bash
# Dentro del contenedor
docker exec -it acueducto-db-prod mysql -u acueducto_prod -p
# Ingresa la contraseña de MYSQL_PASSWORD

# Desde fuera (si exponiste puerto 3306)
mysql -h TU_IP_VPS -u acueducto_prod -p control_vehicular
```

### Ver uso de recursos
```bash
docker stats
```

### Limpiar imágenes no usadas
```bash
docker system prune -a
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to MySQL"
```bash
# Espera 30 segundos, MySQL tarda en inicializar
docker compose -f docker-compose.production.yml logs -f db

# Verifica que esté healthy
docker ps
```

### Error: "Port 80 already in use"
```bash
# Ver qué está usando el puerto
sudo lsof -i :80

# Si es Apache o Nginx instalado localmente
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Frontend muestra página en blanco
```bash
# Verifica logs
docker compose -f docker-compose.production.yml logs -f frontend

# Reconstruye frontend
docker compose -f docker-compose.production.yml up -d --build frontend
```

### Backend no responde
```bash
# Verifica variables de entorno
docker exec -it acueducto-backend-prod env | grep DB

# Verifica logs
docker compose -f docker-compose.production.yml logs -f backend
```

### Restaurar base de datos
```bash
# Backup
docker exec acueducto-db-prod mysqldump -u root -p control_vehicular > backup.sql

# Restaurar
docker exec -i acueducto-db-prod mysql -u root -p control_vehicular < backup.sql
```

---

## 📊 Monitoreo

### Ver recursos
```bash
# CPU, RAM, Red
docker stats

# Espacio en disco
df -h

# Logs de Docker
journalctl -u docker -f
```

### Logs de aplicación
```bash
# Backend
docker compose -f docker-compose.production.yml logs -f backend --tail=100

# Frontend (Nginx)
docker compose -f docker-compose.production.yml logs -f frontend --tail=100
```

---

## 🔐 Seguridad

### Cambiar puerto SSH (Recomendado)
```bash
sudo nano /etc/ssh/sshd_config
# Cambia: Port 22 → Port 2222
sudo systemctl restart sshd

# Actualiza firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### Fail2ban (Protección contra ataques de fuerza bruta)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Actualizaciones automáticas de seguridad
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📚 Recursos adicionales

- **Docker Docs:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Nginx:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/
- **Ubuntu Server Guide:** https://ubuntu.com/server/docs

---

## ✅ Checklist final

- [ ] VPS accesible por SSH
- [ ] Docker y Docker Compose instalados
- [ ] Firewall configurado (22, 80, 443)
- [ ] Proyecto clonado en `/root/Control-Vehicular-Acueducto`
- [ ] Variables en `.env.production` configuradas
- [ ] Contenedores corriendo (`docker ps`)
- [ ] App accesible en `http://TU_IP` o `http://tu-dominio.com`
- [ ] SSL configurado (opcional pero recomendado)
- [ ] Backups programados

---

**¡Tu aplicación está en producción!** 🚀

Para actualizaciones futuras: `git pull` → `docker compose up -d --build`
