/**
 * MaintenanceRepository - Interface del repositorio de Mantenimientos
 * 
 * Parte del DOMAIN (Capa de Dominio - Arquitectura Hexagonal)
 * Este es un PORT - Define el contrato que debe implementar cualquier adaptador
 * 
 * La implementación concreta estará en: infrastructure/database/MySQLMaintenanceRepository.js
 */

class MaintenanceRepository {
  /**
   * Obtener todos los mantenimientos
   * @returns {Promise<Array<Maintenance>>}
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Obtener un mantenimiento por ID
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<Maintenance|null>}
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Obtener todos los mantenimientos de un vehículo
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Array<Maintenance>>}
   */
  async findByVehicle(placa) {
    throw new Error('Method findByVehicle() must be implemented');
  }

  /**
   * Obtener mantenimientos por tipo
   * @param {string} tipo - Tipo de mantenimiento
   * @returns {Promise<Array<Maintenance>>}
   */
  async findByType(tipo) {
    throw new Error('Method findByType() must be implemented');
  }

  /**
   * Obtener mantenimientos en un rango de fechas
   * @param {Date} fechaInicio - Fecha inicial
   * @param {Date} fechaFin - Fecha final
   * @returns {Promise<Array<Maintenance>>}
   */
  async findByDateRange(fechaInicio, fechaFin) {
    throw new Error('Method findByDateRange() must be implemented');
  }

  /**
   * Obtener mantenimientos próximos a vencer
   * @param {number} dias - Días de anticipación (default: 30)
   * @returns {Promise<Array<Maintenance>>}
   */
  async findUpcoming(dias) {
    throw new Error('Method findUpcoming() must be implemented');
  }

  /**
   * Obtener mantenimientos vencidos
   * @returns {Promise<Array<Maintenance>>}
   */
  async findOverdue() {
    throw new Error('Method findOverdue() must be implemented');
  }

  /**
   * Crear un nuevo mantenimiento
   * @param {Maintenance} maintenance - Entidad de mantenimiento
   * @returns {Promise<Maintenance>} El mantenimiento creado con su ID
   */
  async create(maintenance) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Actualizar un mantenimiento existente
   * @param {number} id - ID del mantenimiento
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Maintenance>} El mantenimiento actualizado
   */
  async update(id, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Eliminar un mantenimiento
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Obtener estadísticas de costos de mantenimientos
   * @param {Object} filters - Filtros opcionales (placa, tipo, fechas)
   * @returns {Promise<Object>} Estadísticas de costos
   */
  async getCostStats(filters) {
    throw new Error('Method getCostStats() must be implemented');
  }

  /**
   * Contar mantenimientos por tipo
   * @returns {Promise<Object>} Conteo por tipo de mantenimiento
   */
  async countByType() {
    throw new Error('Method countByType() must be implemented');
  }

  /**
   * Obtener el último mantenimiento de un vehículo
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Maintenance|null>}
   */
  async getLastMaintenanceByVehicle(placa) {
    throw new Error('Method getLastMaintenanceByVehicle() must be implemented');
  }

  /**
   * Verificar si existe un mantenimiento
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('Method exists() must be implemented');
  }
}

export default MaintenanceRepository;
