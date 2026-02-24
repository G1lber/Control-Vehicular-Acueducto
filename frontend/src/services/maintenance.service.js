/**
 * Servicio para gestión de mantenimientos
 * Conecta con los endpoints /api/maintenances del backend
 */

import apiService from './api.service';

const maintenanceService = {
  /**
   * Obtener todos los mantenimientos
   * @param {Object} filters - Filtros opcionales { placa, tipo, year, month }
   * @returns {Promise<Object>} Lista de mantenimientos
   */
  async getAllMaintenances(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.placa) params.append('placa', filters.placa);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.year) params.append('year', filters.year);
      if (filters.month) params.append('month', filters.month);
      
      const url = `/maintenances${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de mantenimientos
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>} Estadísticas
   */
  async getMaintenanceStats(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.placa) params.append('placa', filters.placa);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
      if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
      
      const url = `/maintenances/stats${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener alertas de mantenimientos (vencidos y próximos)
   * @returns {Promise<Object>} Alertas
   */
  async getMaintenanceAlerts() {
    try {
      const response = await apiService.get('/maintenances/alerts');
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      throw error;
    }
  },

  /**
   * Obtener mantenimientos próximos a vencer
   * @param {number} dias - Días hacia adelante (default: 30)
   * @returns {Promise<Object>} Mantenimientos próximos
   */
  async getUpcomingMaintenances(dias = 30) {
    try {
      const response = await apiService.get(`/maintenances/upcoming?dias=${dias}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mantenimientos próximos:', error);
      throw error;
    }
  },

  /**
   * Obtener mantenimientos vencidos
   * @returns {Promise<Object>} Mantenimientos vencidos
   */
  async getOverdueMaintenances() {
    try {
      const response = await apiService.get('/maintenances/overdue');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mantenimientos vencidos:', error);
      throw error;
    }
  },

  /**
   * Obtener un mantenimiento específico por ID
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<Object>} Datos del mantenimiento
   */
  async getMaintenanceById(id) {
    try {
      const response = await apiService.get(`/maintenances/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Obtener el último mantenimiento de un vehículo
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Object>} Último mantenimiento
   */
  async getLastMaintenanceByVehicle(placa) {
    try {
      const response = await apiService.get(`/maintenances/vehicle/${placa}/last`);
      return response.data;
    } catch (error) {
      // Si no hay mantenimientos, retornar null en lugar de error
      if (error.response?.status === 404) {
        return { success: true, data: null };
      }
      console.error('Error al obtener último mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo mantenimiento
   * @param {Object} maintenanceData - Datos del mantenimiento
   * @returns {Promise<Object>} Mantenimiento creado
   */
  async createMaintenance(maintenanceData) {
    try {
      const response = await apiService.post('/maintenances', maintenanceData);
      return response.data;
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Actualizar mantenimiento existente
   * @param {number} id - ID del mantenimiento
   * @param {Object} maintenanceData - Datos a actualizar
   * @returns {Promise<Object>} Mantenimiento actualizado
   */
  async updateMaintenance(id, maintenanceData) {
    try {
      const response = await apiService.put(`/maintenances/${id}`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar mantenimiento:', error);
      throw error;
    }
  },

  /**
   * Eliminar mantenimiento
   * @param {number} id - ID del mantenimiento
   * @returns {Promise<Object>} Confirmación
   */
  async deleteMaintenance(id) {
    try {
      const response = await apiService.delete(`/maintenances/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      throw error;
    }
  }
};

export default maintenanceService;
