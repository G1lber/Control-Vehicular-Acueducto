// =====================================================
// INFRASTRUCTURE LAYER - VEHICLE HTTP ROUTES
// =====================================================
// Define las rutas HTTP para vehículos

import express from 'express';

/**
 * Crea el router de vehículos
 * @param {VehicleController} vehicleController - Controlador de vehículos
 * @returns {express.Router}
 */
export const createVehicleRouter = (vehicleController) => {
  const router = express.Router();

  // GET /api/vehicles/stats - Estadísticas (debe ir antes de /:id)
  router.get('/stats', vehicleController.getVehicleStats);

  // GET /api/vehicles/driver/:id_usuario - Vehículos por conductor
  router.get('/driver/:id_usuario', vehicleController.getVehiclesByDriver);

  // GET /api/vehicles - Listar todos (con filtro opcional ?status=...)
  router.get('/', vehicleController.getAllVehicles);

  // GET /api/vehicles/:id - Obtener uno por placa
  router.get('/:id', vehicleController.getVehicleById);

  // POST /api/vehicles - Crear nuevo
  router.post('/', vehicleController.createVehicle);

  // PUT /api/vehicles/:id - Actualizar
  router.put('/:id', vehicleController.updateVehicle);

  // DELETE /api/vehicles/:id - Eliminar
  router.delete('/:id', vehicleController.deleteVehicle);

  return router;
};
