// =====================================================
// SERVER - PUNTO DE ENTRADA DE LA APLICACIÓN
// =====================================================
// Aquí se ensambla toda la arquitectura hexagonal

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Importar componentes de la arquitectura
import { MySQLVehicleRepository } from './infrastructure/database/MySQLVehicleRepository.js';
import { VehicleUseCases } from './application/use-cases/VehicleUseCases.js';
import { VehicleController } from './infrastructure/http/controllers/VehicleController.js';
import { createVehicleRouter } from './infrastructure/http/routes/vehicleRoutes.js';

import MySQLUserRepository from './infrastructure/database/MySQLUserRepository.js';
import UserUseCases from './application/use-cases/UserUseCases.js';
import UserController from './infrastructure/http/controllers/UserController.js';
import createUserRoutes from './infrastructure/http/routes/userRoutes.js';

import MySQLMaintenanceRepository from './infrastructure/database/MySQLMaintenanceRepository.js';
import MaintenanceUseCases from './application/use-cases/MaintenanceUseCases.js';
import MaintenanceController from './infrastructure/http/controllers/MaintenanceController.js';
import { createMaintenanceRoutes } from './infrastructure/http/routes/maintenanceRoutes.js';

import MySQLAdditionalInfoRepository from './infrastructure/database/MySQLAdditionalInfoRepository.js';
import AdditionalInfoUseCases from './application/use-cases/AdditionalInfoUseCases.js';
import AdditionalInfoController from './infrastructure/http/controllers/AdditionalInfoController.js';
import { createSurveyRoutes } from './infrastructure/http/routes/surveyRoutes.js';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES GLOBALES
// =====================================================
app.use(cors()); // Permitir peticiones del frontend
app.use(express.json()); // Parsear JSON en body
app.use(express.urlencoded({ extended: true })); // Parsear form data

// Logger simple de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// =====================================================
// DEPENDENCY INJECTION - COMPOSICIÓN DE LA ARQUITECTURA
// =====================================================
// Aquí es donde conectamos las capas de la arquitectura hexagonal
// Siguiendo el principio de Inversión de Dependencias

// === VEHICLES API ===
// 1. Infrastructure: Crear el repositorio (implementación concreta)
const vehicleRepository = new MySQLVehicleRepository();

// 2. Application: Crear casos de uso inyectando el repositorio
const vehicleUseCases = new VehicleUseCases(vehicleRepository);

// 3. Infrastructure/HTTP: Crear controlador inyectando casos de uso
const vehicleController = new VehicleController(vehicleUseCases);

// 4. Infrastructure/HTTP: Crear rutas inyectando el controlador
const vehicleRouter = createVehicleRouter(vehicleController);

// === USERS API ===
// Seguir el mismo patrón de inyección de dependencias
const userRepository = new MySQLUserRepository();
const userUseCases = new UserUseCases(userRepository);
const userController = new UserController(userUseCases);
const userRouter = createUserRoutes(userController);

// === MAINTENANCES API ===
// Patrón de inyección de dependencias para mantenimientos
const maintenanceRepository = new MySQLMaintenanceRepository();
const maintenanceUseCases = new MaintenanceUseCases(maintenanceRepository);
const maintenanceController = new MaintenanceController(maintenanceUseCases);
const maintenanceRouter = createMaintenanceRoutes(maintenanceController);

// === SURVEY API (Cuestionario PESV) ===
// Patrón de inyección de dependencias para información adicional
const surveyRepository = new MySQLAdditionalInfoRepository();
const surveyUseCases = new AdditionalInfoUseCases(surveyRepository);
const surveyController = new AdditionalInfoController(surveyUseCases);
const surveyRouter = createSurveyRoutes(surveyController);

// =====================================================
// RUTAS DE LA API
// =====================================================
app.use('/api/vehicles', vehicleRouter);
app.use('/api/users', userRouter);
app.use('/api/maintenances', maintenanceRouter);
app.use('/api/survey', surveyRouter);

// Ruta de prueba de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Control Vehicular funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'API Control Vehicular Acueducto',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// =====================================================
// MANEJO GLOBAL DE ERRORES
// =====================================================
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.error('Verifica tu archivo .env y que MySQL esté corriendo');
      process.exit(1);
    }

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚗 API Control Vehicular Acueducto');
      console.log('='.repeat(50));
      console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`✅ Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Base de datos: ${process.env.DB_NAME}`);
      console.log('\n📍 Rutas disponibles:');
      console.log(`   GET    http://localhost:${PORT}/api/health`);
      console.log('\n🚗 Vehículos:');
      console.log(`   GET    http://localhost:${PORT}/api/vehicles`);
      console.log(`   GET    http://localhost:${PORT}/api/vehicles/stats`);
      console.log(`   GET    http://localhost:${PORT}/api/vehicles/:id`);
      console.log(`   POST   http://localhost:${PORT}/api/vehicles`);
      console.log(`   PUT    http://localhost:${PORT}/api/vehicles/:id`);
      console.log(`   DELETE http://localhost:${PORT}/api/vehicles/:id`);
      console.log('\n👥 Usuarios:');
      console.log(`   GET    http://localhost:${PORT}/api/users`);
      console.log(`   GET    http://localhost:${PORT}/api/users/stats`);
      console.log(`   GET    http://localhost:${PORT}/api/users/:cedula`);
      console.log(`   POST   http://localhost:${PORT}/api/users`);
      console.log(`   PUT    http://localhost:${PORT}/api/users/:cedula`);
      console.log(`   DELETE http://localhost:${PORT}/api/users/:cedula`);
      console.log('\n🔧 Mantenimientos:');
      console.log(`   GET    http://localhost:${PORT}/api/maintenances`);
      console.log(`   GET    http://localhost:${PORT}/api/maintenances/stats`);
      console.log(`   GET    http://localhost:${PORT}/api/maintenances/alerts`);
      console.log(`   GET    http://localhost:${PORT}/api/maintenances/:id`);
      console.log(`   POST   http://localhost:${PORT}/api/maintenances`);
      console.log(`   PUT    http://localhost:${PORT}/api/maintenances/:id`);
      console.log(`   DELETE http://localhost:${PORT}/api/maintenances/:id`);
      console.log('\n📋 Cuestionario PESV:');
      console.log(`   GET    http://localhost:${PORT}/api/survey`);
      console.log(`   GET    http://localhost:${PORT}/api/survey/stats`);
      console.log(`   GET    http://localhost:${PORT}/api/survey/alerts`);
      console.log(`   GET    http://localhost:${PORT}/api/survey/user/:cedula`);
      console.log(`   POST   http://localhost:${PORT}/api/survey`);
      console.log(`   PUT    http://localhost:${PORT}/api/survey/:id`);
      console.log(`   DELETE http://localhost:${PORT}/api/survey/:id`);
      console.log('\n' + '='.repeat(50) + '\n');
    });

  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar
startServer();
