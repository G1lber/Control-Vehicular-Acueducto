/**
 * MaintenanceUseCases - Casos de uso de Mantenimientos
 * 
 * Parte de APPLICATION (Capa de Aplicación - Arquitectura Hexagonal)
 * Orquesta las operaciones entre el dominio y la infraestructura
 */

import Maintenance from '../../domain/entities/Maintenance.js';

class MaintenanceUseCases {
  constructor(maintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository;
  }

  /**
   * Obtener todos los mantenimientos
   * @returns {Promise<Array>}
   */
  async getAllMaintenances() {
    const maintenances = await this.maintenanceRepository.findAll();
    return maintenances.map(m => m.toJSON());
  }

  /**
   * Obtener un mantenimiento por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getMaintenanceById(id) {
    const maintenance = await this.maintenanceRepository.findById(id);
    return maintenance ? maintenance.toJSON() : null;
  }

  /**
   * Obtener mantenimientos de un vehículo
   * @param {string} placa
   * @returns {Promise<Array>}
   */
  async getMaintenancesByVehicle(placa) {
    const maintenances = await this.maintenanceRepository.findByVehicle(placa);
    return maintenances.map(m => m.toJSON());
  }

  /**
   * Obtener mantenimientos por tipo
   * @param {string} tipo
   * @returns {Promise<Array>}
   */
  async getMaintenancesByType(tipo) {
    const maintenances = await this.maintenanceRepository.findByType(tipo);
    return maintenances.map(m => m.toJSON());
  }

  /**
   * Obtener mantenimientos en un rango de fechas
   * @param {string} year - Año (YYYY)
   * @param {string} month - Mes (1-12) opcional
   * @returns {Promise<Array>}
   */
  async getMaintenancesByDate(year, month = null) {
    let fechaInicio, fechaFin;

    if (month) {
      // Rango de un mes específico
      fechaInicio = new Date(year, month - 1, 1);
      fechaFin = new Date(year, month, 0); // Último día del mes
    } else {
      // Rango de todo el año
      fechaInicio = new Date(year, 0, 1);
      fechaFin = new Date(year, 11, 31);
    }

    const maintenances = await this.maintenanceRepository.findByDateRange(fechaInicio, fechaFin);
    return maintenances.map(m => m.toJSON());
  }

  /**
   * Obtener mantenimientos próximos a vencer
   * @param {number} dias - Días de anticipación
   * @returns {Promise<Array>}
   */
  async getUpcomingMaintenances(dias = 30) {
    const maintenances = await this.maintenanceRepository.findUpcoming(dias);
    return maintenances.map(m => m.toJSON());
  }

  /**
   * Obtener mantenimientos vencidos
   * @returns {Promise<Array>}
   */
  async getOverdueMaintenances() {
    const maintenances = await this.maintenanceRepository.findOverdue();
    return maintenances.map(m => m.toJSON());
  }

  /**
   * Crear un nuevo mantenimiento
   * @param {Object} data - Datos del mantenimiento
   * @returns {Promise<Object>}
   */
  async createMaintenance(data) {
    // Crear entidad
    const maintenance = new Maintenance(data);

    // Validar
    const validation = maintenance.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Guardar en BD
    const created = await this.maintenanceRepository.create(maintenance);
    return created.toJSON();
  }

  /**
   * Actualizar un mantenimiento
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateMaintenance(id, data) {
    // Verificar que exista
    const exists = await this.maintenanceRepository.exists(id);
    if (!exists) {
      throw new Error('Mantenimiento no encontrado');
    }

    // Crear entidad temporal para validar
    const currentMaintenance = await this.maintenanceRepository.findById(id);
    const updatedData = { ...currentMaintenance.toDB(), ...data };
    const maintenance = new Maintenance(updatedData);

    // Validar
    const validation = maintenance.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Actualizar en BD
    const updated = await this.maintenanceRepository.update(id, data);
    return updated.toJSON();
  }

  /**
   * Eliminar un mantenimiento
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async deleteMaintenance(id) {
    const exists = await this.maintenanceRepository.exists(id);
    if (!exists) {
      throw new Error('Mantenimiento no encontrado');
    }

    return await this.maintenanceRepository.delete(id);
  }

  /**
   * Obtener estadísticas de costos
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getCostStatistics(filters = {}) {
    return await this.maintenanceRepository.getCostStats(filters);
  }

  /**
   * Obtener conteo por tipo de mantenimiento
   * @returns {Promise<Object>}
   */
  async getMaintenanceCountByType() {
    return await this.maintenanceRepository.countByType();
  }

  /**
   * Obtener el último mantenimiento de un vehículo
   * @param {string} placa
   * @returns {Promise<Object|null>}
   */
  async getLastMaintenanceByVehicle(placa) {
    const maintenance = await this.maintenanceRepository.getLastMaintenanceByVehicle(placa);
    return maintenance ? maintenance.toJSON() : null;
  }

  /**
   * Obtener alertas de mantenimientos
   * @returns {Promise<Object>} Mantenimientos vencidos y próximos
   */
  async getMaintenanceAlerts() {
    const [overdue, upcoming] = await Promise.all([
      this.maintenanceRepository.findOverdue(),
      this.maintenanceRepository.findUpcoming(30)
    ]);

    return {
      vencidos: overdue.map(m => m.toJSON()),
      proximos: upcoming.map(m => m.toJSON()),
      totalVencidos: overdue.length,
      totalProximos: upcoming.length
    };
  }
}

export default MaintenanceUseCases;
