#!/bin/bash

# ==================================
# Script de Deployment Automático
# Control Vehicular Acueducto
# ==================================

set -e  # Detener en caso de error

echo "🚀 Iniciando deployment..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en la carpeta correcta
if [ ! -f "docker-compose.production.yml" ]; then
    echo -e "${RED}❌ Error: No se encontró docker-compose.production.yml${NC}"
    echo "Asegúrate de estar en la carpeta raíz del proyecto"
    exit 1
fi

# Verificar que existe .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: No se encontró .env.production${NC}"
    echo "Crea el archivo .env.production con tus variables de entorno"
    exit 1
fi

echo -e "${YELLOW}📥 Descargando últimos cambios...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Cargando variables de entorno...${NC}"
export $(cat .env.production | xargs)

echo -e "${YELLOW}🔨 Construyendo imágenes Docker...${NC}"
docker compose -f docker-compose.production.yml build

echo -e "${YELLOW}🔄 Reiniciando contenedores...${NC}"
docker compose -f docker-compose.production.yml up -d

echo -e "${YELLOW}🧹 Limpiando imágenes antiguas...${NC}"
docker image prune -f

echo -e "${GREEN}✅ Deployment completado exitosamente!${NC}"
echo ""
echo "📊 Estado de los contenedores:"
docker compose -f docker-compose.production.yml ps
echo ""
echo "📝 Ver logs en tiempo real:"
echo "   docker compose -f docker-compose.production.yml logs -f"
echo ""
echo "🌐 Tu aplicación está disponible en:"
echo "   http://$(curl -s ifconfig.me)"
