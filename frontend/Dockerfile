# ==================================
# Dockerfile - Frontend React + Vite (PRODUCCIÓN)
# ==================================

# Etapa 1: Build
FROM node:22-alpine AS builder

# Argumento para la URL del API (se pasa desde docker-compose)
ARG VITE_API_URL=/api

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# Establecer variable de entorno para el build
ENV VITE_API_URL=$VITE_API_URL

# Build de producción - Genera carpeta dist/
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]
