# ==================================
# Dockerfile - Backend Node.js (PRODUCCIÓN)
# ==================================
FROM node:22-alpine

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar todo el código del backend
COPY --chown=nodejs:nodejs . .

# Cambiar a usuario no-root
USER nodejs

# Exponer el puerto 3000
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production

# Healthcheck para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para manejar señales
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar el servidor
CMD ["node", "src/server.js"]
