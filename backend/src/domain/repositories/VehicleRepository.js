// =====================================================
// DOMAIN LAYER - VEHICLE REPOSITORY (PORT/INTERFACE)
// =====================================================
// Este es un PORT (interfaz/contrato) en arquitectura hexagonal
// Define QUÉ operaciones existen, pero NO cómo se implementan
// La implementación real estará en Infrastructure

/**
 * Interfaz del repositorio de vehículos
 * Define el contrato que debe cumplir cualquier implementación
 */
export class VehicleRepository {
  /**
   * Obtiene todos los vehículos
   * @returns {Promise<Vehicle[]>}
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Obtiene un vehículo por su placa
   * @param {string} id_placa - Placa del vehículo
   * @returns {Promise<Vehicle|null>}
   */
  async findById(id_placa) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Obtiene vehículos por conductor
   * @param {number} id_usuario - ID del conductor
   * @returns {Promise<Vehicle[]>}
   */
  async findByDriver(id_usuario) {
    throw new Error('Method findByDriver() must be implemented');
  }

  /**
   * Obtiene vehículos por estado (vencido, por_vencer, vigente)
   * @param {string} status - Estado del vehículo
   * @returns {Promise<Vehicle[]>}
   */
  async findByStatus(status) {
    throw new Error('Method findByStatus() must be implemented');
  }

  /**
   * Crea un nuevo vehículo
   * @param {Vehicle} vehicle - Entidad del vehículo
   * @returns {Promise<Vehicle>}
   */
  async create(vehicle) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Actualiza un vehículo existente
   * @param {string} id_placa - Placa del vehículo
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Vehicle|null>}
   */
  async update(id_placa, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Elimina un vehículo
   * @param {string} id_placa - Placa del vehículo
   * @returns {Promise<boolean>}
   */
  async delete(id_placa) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Cuenta el total de vehículos
   * @returns {Promise<number>}
   */
  async count() {
    throw new Error('Method count() must be implemented');
  }
}
