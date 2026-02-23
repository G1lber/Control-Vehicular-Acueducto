// =====================================================
// APPLICATION LAYER - VEHICLE USE CASES
// =====================================================
// Esta capa orquesta las operaciones de dominio
// Los casos de uso coordinan el flujo de datos entre capas

import { Vehicle } from '../../domain/entities/Vehicle.js';

/**
 * Casos de uso para la gestión de vehículos
 * Cada método representa una acción que el usuario puede realizar
 */
export class VehicleUseCases {
  /**
   * @param {VehicleRepository} vehicleRepository - Repositorio de vehículos
   */
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  /**
   * Obtener todos los vehículos
   * @returns {Promise<Object[]>}
   */
  async getAllVehicles() {
    try {
      const vehicles = await this.vehicleRepository.findAll();
      return vehicles.map(v => v.toJSON());
    } catch (error) {
      throw new Error(`Error al obtener vehículos: ${error.message}`);
    }
  }

  /**
   * Obtener un vehículo por su placa
   * @param {string} id_placa - Placa del vehículo
   * @returns {Promise<Object|null>}
   */
  async getVehicleById(id_placa) {
    try {
      const vehicle = await this.vehicleRepository.findById(id_placa);
      return vehicle ? vehicle.toJSON() : null;
    } catch (error) {
      throw new Error(`Error al obtener vehículo: ${error.message}`);
    }
  }

  /**
   * Obtener vehículos por estado (vencido, por_vencer, vigente)
   * @param {string} status - Estado del vehículo
   * @returns {Promise<Object[]>}
   */
  async getVehiclesByStatus(status) {
    try {
      const validStatuses = ['vencido', 'por_vencer', 'vigente'];
      if (!validStatuses.includes(status)) {
        throw new Error('Estado no válido');
      }

      const vehicles = await this.vehicleRepository.findByStatus(status);
      return vehicles.map(v => v.toJSON());
    } catch (error) {
      throw new Error(`Error al filtrar vehículos: ${error.message}`);
    }
  }

  /**
   * Obtener vehículos de un conductor
   * @param {number} id_usuario - ID del conductor
   * @returns {Promise<Object[]>}
   */
  async getVehiclesByDriver(id_usuario) {
    try {
      const vehicles = await this.vehicleRepository.findByDriver(id_usuario);
      return vehicles.map(v => v.toJSON());
    } catch (error) {
      throw new Error(`Error al obtener vehículos del conductor: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo vehículo
   * @param {Object} data - Datos del vehículo
   * @returns {Promise<Object>}
   */
  async createVehicle(data) {
    try {
      // Crear entidad de dominio
      const vehicle = new Vehicle({
        id_placa: data.id_placa?.toUpperCase(), // Normalizar placa
        modelo: data.modelo,
        marca: data.marca,
        anio: data.anio,
        color: data.color,
        tipo_combustible: data.tipo_combustible,
        kilometraje_actual: data.kilometraje_actual || null,
        ultimo_mantenimiento: data.ultimo_mantenimiento || null,
        id_usuario: data.id_usuario,
        soat: data.soat || null,
        tecno: data.tecno || null
      });

      // Validar
      const validation = vehicle.validate();
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Guardar
      const createdVehicle = await this.vehicleRepository.create(vehicle);
      return createdVehicle.toJSON();
    } catch (error) {
      throw new Error(`Error al crear vehículo: ${error.message}`);
    }
  }

  /**
   * Actualizar un vehículo
   * @param {string} id_placa - Placa del vehículo
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>}
   */
  async updateVehicle(id_placa, data) {
    try {
      // Normalizar placa si se proporciona
      if (data.id_placa) {
        data.id_placa = data.id_placa.toUpperCase();
      }

      const updatedVehicle = await this.vehicleRepository.update(id_placa, data);
      return updatedVehicle ? updatedVehicle.toJSON() : null;
    } catch (error) {
      throw new Error(`Error al actualizar vehículo: ${error.message}`);
    }
  }

  /**
   * Eliminar un vehículo
   * @param {string} id_placa - Placa del vehículo
   * @returns {Promise<boolean>}
   */
  async deleteVehicle(id_placa) {
    try {
      return await this.vehicleRepository.delete(id_placa);
    } catch (error) {
      throw new Error(`Error al eliminar vehículo: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de vehículos
   * @returns {Promise<Object>}
   */
  async getVehicleStats() {
    try {
      const allVehicles = await this.vehicleRepository.findAll();
      
      const stats = {
        total: allVehicles.length,
        vencidos: 0,
        por_vencer: 0,
        vigentes: 0
      };

      allVehicles.forEach(vehicle => {
        const status = vehicle.getStatus();
        if (status === 'vencido') stats.vencidos++;
        else if (status === 'por_vencer') stats.por_vencer++;
        else stats.vigentes++;
      });

      return stats;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}
