// =====================================================
// INFRASTRUCTURE LAYER - VEHICLE HTTP CONTROLLER
// =====================================================
// Controlador que maneja peticiones HTTP de Express
// Usa los casos de uso para ejecutar lógica de negocio

import path from 'path';
import { fileURLToPath } from 'url';
import { getFilePath, fileExists, deleteFile } from '../../config/multer.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  /**
   * POST /api/vehicles/:placa/documents
   * Subir documento de SOAT o Tecnomecánica
   * Requiere multipart/form-data con archivo y docType (soat|tecno)
   */
  uploadDocument = async (req, res) => {
    try {
      const { placa } = req.params;
      const { docType } = req.body;

      // Validar que el vehículo existe
      const vehicle = await this.vehicleUseCases.getVehicleById(placa);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }

      // Validar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se recibió ningún archivo'
        });
      }

      // Validar tipo de documento
      if (!['soat', 'tecno'].includes(docType)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de documento inválido (debe ser soat o tecno)'
        });
      }

      // Nombre del archivo guardado
      const filename = req.file.filename;

      // Actualizar el vehículo con el nombre del documento
      const updateData = {};
      updateData[`${docType}_documento`] = filename;

      // Eliminar documento anterior si existe
      const oldFilename = vehicle[`${docType}_documento`];
      if (oldFilename) {
        const oldPath = getFilePath(placa, oldFilename);
        try {
          await deleteFile(oldPath);
        } catch (err) {
          console.warn('No se pudo eliminar archivo anterior:', err.message);
        }
      }

      const updated = await this.vehicleUseCases.updateVehicle(placa, updateData);

      res.json({
        success: true,
        message: `Documento de ${docType.toUpperCase()} subido correctamente`,
        data: {
          placa: updated.id_placa,
          docType,
          filename,
          url: `/api/vehicles/${placa}/documents/${docType}`
        }
      });
    } catch (error) {
      console.error('Error en uploadDocument:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * GET /api/vehicles/:placa/documents/:docType
   * Descargar documento de SOAT o Tecnomecánica
   */
  downloadDocument = async (req, res) => {
    try {
      const { placa, docType } = req.params;

      // Validar tipo de documento
      if (!['soat', 'tecno'].includes(docType)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de documento inválido (debe ser soat o tecno)'
        });
      }

      // Obtener vehículo
      const vehicle = await this.vehicleUseCases.getVehicleById(placa);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }

      // Obtener nombre del archivo
      const filename = vehicle[`${docType}_documento`];
      if (!filename) {
        return res.status(404).json({
          success: false,
          message: `No hay documento de ${docType.toUpperCase()} para este vehículo`
        });
      }

      // Ruta completa del archivo
      const filePath = getFilePath(placa, filename);

      // Verificar que el archivo existe
      if (!fileExists(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Archivo no encontrado en el servidor'
        });
      }

      // Enviar archivo
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('Error al enviar archivo:', err);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: 'Error al descargar archivo'
            });
          }
        }
      });
    } catch (error) {
      console.error('Error en downloadDocument:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  /**
   * DELETE /api/vehicles/:placa/documents/:docType
   * Eliminar documento de SOAT o Tecnomecánica
   */
  deleteDocument = async (req, res) => {
    try {
      const { placa, docType } = req.params;

      // Validar tipo de documento
      if (!['soat', 'tecno'].includes(docType)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de documento inválido (debe ser soat o tecno)'
        });
      }

      // Obtener vehículo
      const vehicle = await this.vehicleUseCases.getVehicleById(placa);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehículo no encontrado'
        });
      }

      // Obtener nombre del archivo
      const filename = vehicle[`${docType}_documento`];
      if (!filename) {
        return res.status(404).json({
          success: false,
          message: `No hay documento de ${docType.toUpperCase()} para este vehículo`
        });
      }

      // Eliminar archivo del sistema de archivos
      const filePath = getFilePath(placa, filename);
      try {
        await deleteFile(filePath);
      } catch (err) {
        console.warn('No se pudo eliminar archivo físico:', err.message);
      }

      // Actualizar el vehículo (poner el campo en null)
      const updateData = {};
      updateData[`${docType}_documento`] = null;
      await this.vehicleUseCases.updateVehicle(placa, updateData);

      res.json({
        success: true,
        message: `Documento de ${docType.toUpperCase()} eliminado correctamente`
      });
    } catch (error) {
      console.error('Error en deleteDocument:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}
