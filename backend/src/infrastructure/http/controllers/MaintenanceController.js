/**
 * MaintenanceController - Controlador HTTP para Mantenimientos
 * 
 * Parte de INFRASTRUCTURE/HTTP (Capa de Infraestructura - Arquitectura Hexagonal)
 * Maneja las peticiones HTTP y delega la lógica a los casos de uso
 */

class MaintenanceController {
  constructor(maintenanceUseCases) {
    this.maintenanceUseCases = maintenanceUseCases;
  }

  /**
   * GET /api/maintenances
   * Obtener todos los mantenimientos con filtros opcionales
   */
  getAllMaintenances = async (req, res) => {
    try {
      const { placa, tipo, year, month } = req.query;

      let maintenances;

      // Filtrar por vehículo
      if (placa) {
        maintenances = await this.maintenanceUseCases.getMaintenancesByVehicle(placa);
      }
      // Filtrar por tipo
      else if (tipo) {
        maintenances = await this.maintenanceUseCases.getMaintenancesByType(tipo);
      }
      // Filtrar por fecha
      else if (year) {
        maintenances = await this.maintenanceUseCases.getMaintenancesByDate(year, month);
      }
      // Sin filtros: todos
      else {
        maintenances = await this.maintenanceUseCases.getAllMaintenances();
      }

      res.json({
        success: true,
        data: maintenances,
        count: maintenances.length
      });
    } catch (error) {
      console.error('Error en getAllMaintenances:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mantenimientos',
        error: error.message
      });
    }
  };

  /**
   * GET /api/maintenances/stats
   * Obtener estadísticas de mantenimientos
   */
  getMaintenanceStats = async (req, res) => {
    try {
      const { placa, tipo, fechaInicio, fechaFin } = req.query;

      const filters = {};
      if (placa) filters.placa = placa;
      if (tipo) filters.tipo = tipo;
      if (fechaInicio) filters.fechaInicio = fechaInicio;
      if (fechaFin) filters.fechaFin = fechaFin;

      const [costStats, countByType] = await Promise.all([
        this.maintenanceUseCases.getCostStatistics(filters),
        this.maintenanceUseCases.getMaintenanceCountByType()
      ]);

      res.json({
        success: true,
        data: {
          costos: costStats,
          porTipo: countByType
        }
      });
    } catch (error) {
      console.error('Error en getMaintenanceStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  };

  /**
   * GET /api/maintenances/alerts
   * Obtener alertas de mantenimientos (vencidos y próximos)
   */
  getMaintenanceAlerts = async (req, res) => {
    try {
      const alerts = await this.maintenanceUseCases.getMaintenanceAlerts();

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error en getMaintenanceAlerts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener alertas',
        error: error.message
      });
    }
  };

  /**
   * GET /api/maintenances/upcoming
   * Obtener mantenimientos próximos a vencer
   */
  getUpcomingMaintenances = async (req, res) => {
    try {
      const dias = parseInt(req.query.dias) || 30;
      const maintenances = await this.maintenanceUseCases.getUpcomingMaintenances(dias);

      res.json({
        success: true,
        data: maintenances,
        count: maintenances.length
      });
    } catch (error) {
      console.error('Error en getUpcomingMaintenances:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mantenimientos próximos',
        error: error.message
      });
    }
  };

  /**
   * GET /api/maintenances/overdue
   * Obtener mantenimientos vencidos
   */
  getOverdueMaintenances = async (req, res) => {
    try {
      const maintenances = await this.maintenanceUseCases.getOverdueMaintenances();

      res.json({
        success: true,
        data: maintenances,
        count: maintenances.length
      });
    } catch (error) {
      console.error('Error en getOverdueMaintenances:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mantenimientos vencidos',
        error: error.message
      });
    }
  };

  /**
   * GET /api/maintenances/vehicle/:placa/last
   * Obtener el último mantenimiento de un vehículo
   */
  getLastMaintenanceByVehicle = async (req, res) => {
    try {
      const { placa } = req.params;
      const maintenance = await this.maintenanceUseCases.getLastMaintenanceByVehicle(placa);

      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron mantenimientos para este vehículo'
        });
      }

      res.json({
        success: true,
        data: maintenance
      });
    } catch (error) {
      console.error('Error en getLastMaintenanceByVehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener último mantenimiento',
        error: error.message
      });
    }
  };

  /**
   * GET /api/maintenances/:id
   * Obtener un mantenimiento por ID
   */
  getMaintenanceById = async (req, res) => {
    try {
      const { id } = req.params;
      const maintenance = await this.maintenanceUseCases.getMaintenanceById(parseInt(id));

      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado'
        });
      }

      res.json({
        success: true,
        data: maintenance
      });
    } catch (error) {
      console.error('Error en getMaintenanceById:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mantenimiento',
        error: error.message
      });
    }
  };

  /**
   * POST /api/maintenances
   * Crear un nuevo mantenimiento
   */
  createMaintenance = async (req, res) => {
    try {
      const {
        placa,
        tipo,
        fechaRealizado,
        fechaProxima,
        kilometraje,
        costo,
        descripcion,
        informacionAdicional
      } = req.body;

      // Validar campos requeridos
      if (!placa || !tipo || !fechaRealizado) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
          required: ['placa', 'tipo', 'fechaRealizado']
        });
      }

      // Crear el mantenimiento
      const maintenanceData = {
        id_placa: placa,
        tipo_mantenimiento: tipo,
        fecha_realizado: fechaRealizado,
        fecha_proxima: fechaProxima || null,
        kilometraje: kilometraje || null,
        costo: costo || null,
        descripcion: descripcion || null,
        informacion_adicional: informacionAdicional || null
      };

      const maintenance = await this.maintenanceUseCases.createMaintenance(maintenanceData);

      res.status(201).json({
        success: true,
        message: 'Mantenimiento registrado exitosamente',
        data: maintenance
      });
    } catch (error) {
      console.error('Error en createMaintenance:', error);

      if (error.message.includes('Datos inválidos')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('vehículo especificado no existe')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear mantenimiento',
        error: error.message
      });
    }
  };

  /**
   * PUT /api/maintenances/:id
   * Actualizar un mantenimiento
   */
  updateMaintenance = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        placa,
        tipo,
        fechaRealizado,
        fechaProxima,
        kilometraje,
        costo,
        descripcion,
        informacionAdicional
      } = req.body;

      const updateData = {};
      if (placa !== undefined) updateData.id_placa = placa;
      if (tipo !== undefined) updateData.tipo_mantenimiento = tipo;
      if (fechaRealizado !== undefined) updateData.fecha_realizado = fechaRealizado;
      if (fechaProxima !== undefined) updateData.fecha_proxima = fechaProxima;
      if (kilometraje !== undefined) updateData.kilometraje = kilometraje;
      if (costo !== undefined) updateData.costo = costo;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (informacionAdicional !== undefined) updateData.informacion_adicional = informacionAdicional;

      const maintenance = await this.maintenanceUseCases.updateMaintenance(parseInt(id), updateData);

      res.json({
        success: true,
        message: 'Mantenimiento actualizado exitosamente',
        data: maintenance
      });
    } catch (error) {
      console.error('Error en updateMaintenance:', error);

      if (error.message === 'Mantenimiento no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Datos inválidos')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar mantenimiento',
        error: error.message
      });
    }
  };

  /**
   * DELETE /api/maintenances/:id
   * Eliminar un mantenimiento
   */
  deleteMaintenance = async (req, res) => {
    try {
      const { id } = req.params;
      await this.maintenanceUseCases.deleteMaintenance(parseInt(id));

      res.json({
        success: true,
        message: 'Mantenimiento eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en deleteMaintenance:', error);

      if (error.message === 'Mantenimiento no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al eliminar mantenimiento',
        error: error.message
      });
    }
  };
}

export default MaintenanceController;
