// =====================================================
// INFRASTRUCTURE LAYER - VEHICLE HTTP CONTROLLER
// =====================================================
// Controlador que maneja peticiones HTTP de Express
// Usa los casos de uso para ejecutar lógica de negocio

/**
 * Controlador de vehículos
 * Maneja peticiones HTTP y delega a casos de uso
 */
export class VehicleController {
  /**
   * @param {VehicleUseCases} vehicleUseCases - Casos de uso de vehículos
   */
  constructor(vehicleUseCases) {
    this.vehicleUseCases = vehicleUseCases;
  }

  /**
   * GET /api/vehicles
   * Obtener todos los vehículos o filtrar por estado
   */
  getAllVehicles = async (req, res) => {
    try {
      const { status } = req.query;

      let vehicles;
      if (status) {
        vehicles = await this.vehicleUseCases.getVehiclesByStatus(status);
      } else {
        vehicles = await this.vehicleUseCases.getAllVehicles();
      }

      res.json({
        success: true,
        data: vehicles,
        count: vehicles.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * GET /api/vehicles/:id
   * Obtener un vehículo por placa
   */
  getVehicleById = async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await this.vehicleUseCases.getVehicleById(id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * GET /api/vehicles/driver/:id_usuario
   * Obtener vehículos de un conductor
   */
  getVehiclesByDriver = async (req, res) => {
    try {
      const { id_usuario } = req.params;
      const vehicles = await this.vehicleUseCases.getVehiclesByDriver(Number(id_usuario));

      res.json({
        success: true,
        data: vehicles,
        count: vehicles.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * GET /api/vehicles/stats
   * Obtener estadísticas de vehículos
   */
  getVehicleStats = async (req, res) => {
    try {
      const stats = await this.vehicleUseCases.getVehicleStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * POST /api/vehicles
   * Crear un nuevo vehículo
   */
  createVehicle = async (req, res) => {
    try {
      const vehicle = await this.vehicleUseCases.createVehicle(req.body);

      res.status(201).json({
        success: true,
        message: 'Vehículo creado correctamente',
        data: vehicle
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * PUT /api/vehicles/:id
   * Actualizar un vehículo
   */
  updateVehicle = async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await this.vehicleUseCases.updateVehicle(id, req.body);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Vehículo actualizado correctamente',
        data: vehicle
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * DELETE /api/vehicles/:id
   * Eliminar un vehículo
   */
  deleteVehicle = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.vehicleUseCases.deleteVehicle(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Vehículo eliminado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}
