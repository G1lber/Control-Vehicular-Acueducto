# ✅ Checklist Pre-Deployment

Usa este checklist antes de hacer deployment en tu VPS.

## 📋 En tu PC (Antes de subir)

- [ ] **Revisar código**
  - [ ] No hay `console.log()` con información sensible
  - [ ] No hay credenciales hardcodeadas en el código
  - [ ] Todas las funcionalidades probadas localmente

- [ ] **Git**
  - [ ] Todos los cambios están en commits
  - [ ] `.gitignore` incluye `.env.production`
  - [ ] Push a GitHub: `git push origin main`

- [ ] **Variables de entorno**
  - [ ] `.env.production.example` está actualizado
  - [ ] NO subiste `.env.production` a GitHub (debe estar en .gitignore)

## 🖥️ En el VPS (Primera vez)

- [ ] **Acceso**
  - [ ] Puedes conectar por SSH: `ssh root@TU_IP_VPS`
  - [ ] Usuario tiene permisos sudo

- [ ] **Software instalado**
  - [ ] Docker: `docker --version`
  - [ ] Docker Compose: `docker compose version`
  - [ ] Git: `git --version`

- [ ] **Firewall configurado**
  - [ ] Puerto 22 (SSH): `sudo ufw allow 22/tcp`
  - [ ] Puerto 80 (HTTP): `sudo ufw allow 80/tcp`
  - [ ] Puerto 443 (HTTPS): `sudo ufw allow 443/tcp`
  - [ ] Firewall activo: `sudo ufw enable`

- [ ] **Proyecto clonado**
  - [ ] `git clone` exitoso
  - [ ] Estás en la carpeta: `cd ~/Control-Vehicular-Acueducto`

- [ ] **Variables de entorno configuradas**
  - [ ] Copiaste ejemplo: `cp .env.production.example .env.production`
  - [ ] Editaste `.env.production` con contraseñas seguras
  - [ ] Generaste JWT_SECRET: `openssl rand -base64 48`
  - [ ] Generaste MYSQL_ROOT_PASSWORD: `openssl rand -base64 32`
  - [ ] Generaste MYSQL_PASSWORD: `openssl rand -base64 32`

## 🚀 Deployment

- [ ] **Build inicial**
  - [ ] Cargar variables: `export $(cat .env.production | xargs)`
  - [ ] Build y levantar: `docker compose -f docker-compose.production.yml up -d --build`
  - [ ] Esperar 2-3 minutos para que MySQL inicialice

- [ ] **Verificación**
  - [ ] 3 contenedores corriendo: `docker ps`
  - [ ] MySQL healthy (sin "starting")
  - [ ] Backend sin errores: `docker compose -f docker-compose.production.yml logs backend`
  - [ ] Frontend sin errores: `docker compose -f docker-compose.production.yml logs frontend`

- [ ] **Acceso**
  - [ ] App carga en `http://TU_IP_VPS`
  - [ ] Login funciona
  - [ ] API responde: `curl http://TU_IP_VPS/api/health`

## 🔒 SSL/HTTPS (Opcional pero recomendado)

- [ ] **Dominio configurado**
  - [ ] Dominio apunta a IP de VPS (DNS A record)
  - [ ] Esperar propagación DNS (5-30 minutos)
  - [ ] Verificar: `nslookup tu-dominio.com`

- [ ] **Certbot**
  - [ ] Instalado: `sudo apt install certbot -y`
  - [ ] Obtener certificado: `sudo certbot certonly --standalone -d tu-dominio.com`
  - [ ] Certificados en `/etc/letsencrypt/live/tu-dominio.com/`

- [ ] **Nginx SSL configurado**
  - [ ] `nginx-ssl.conf` creado y editado con tu dominio
  - [ ] Reiniciar: `docker compose -f docker-compose.production.yml restart frontend`
  - [ ] HTTPS funciona: `https://tu-dominio.com`

## 🔄 Deployments futuros

- [ ] **Proceso de actualización**
  - [ ] En tu PC: `git push origin main`
  - [ ] En VPS: `cd ~/Control-Vehicular-Acueducto`
  - [ ] Ejecutar script: `bash deploy.sh`
  - [ ] O manual: `git pull && docker compose -f docker-compose.production.yml up -d --build`

## 🔐 Seguridad

- [ ] **Básico**
  - [ ] Cambiar contraseña de root si es temporal
  - [ ] Deshabilitar login root por SSH (usar usuario sudo)
  - [ ] Fail2ban instalado: `sudo apt install fail2ban -y`

- [ ] **Avanzado** (Opcional)
  - [ ] Cambiar puerto SSH de 22 a otro
  - [ ] Configurar SSH con claves (deshabilitar password)
  - [ ] Configurar backups automáticos de MySQL

## 📊 Monitoreo

- [ ] **Revisar periódicamente**
  - [ ] Logs: `docker compose -f docker-compose.production.yml logs -f`
  - [ ] Recursos: `docker stats`
  - [ ] Espacio en disco: `df -h`
  - [ ] Certificado SSL válido (renueva cada 90 días)

---

**Nota:** Guarda este checklist y úsalo cada vez que hagas deployment.

Ver guía completa: [DEPLOYMENT.md](DEPLOYMENT.md)
