/**
 * Servicio para gestión de vehículos
 * Conecta con los endpoints /api/vehicles del backend
 */

import apiService from './api.service';

const vehicleService = {
  /**
   * Obtener todos los vehículos
   * @param {Object} filters - Filtros opcionales { status, search }
   * @returns {Promise<Object>} Lista de vehículos
   */
  async getAllVehicles(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      const url = `/vehicles${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de vehículos
   * @returns {Promise<Object>} Estadísticas
   */
  async getVehicleStats() {
    try {
      const response = await apiService.get('/vehicles/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener un vehículo por placa
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Object>} Datos del vehículo
   */
  async getVehicleByPlaca(placa) {
    try {
      const response = await apiService.get(`/vehicles/${placa}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw error;
    }
  },

  /**
   * Obtener vehículos por conductor
   * @param {string} idUsuario - ID del usuario conductor
   * @returns {Promise<Object>} Lista de vehículos
   */
  async getVehiclesByDriver(idUsuario) {
    try {
      const response = await apiService.get(`/vehicles/driver/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos del conductor:', error);
      throw error;
    }
  },

  /**
   * Crear nuevo vehículo
   * @param {Object} vehicleData - Datos del vehículo
   * @returns {Promise<Object>} Vehículo creado
   */
  async createVehicle(vehicleData) {
    try {
      console.log('🆕 [vehicle.service] Creando nuevo vehículo');
      console.log('📦 [vehicle.service] Payload completo:', JSON.stringify(vehicleData, null, 2));
      
      const response = await apiService.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      console.error('❌ [vehicle.service] Error al crear vehículo:', error);
      console.error('📋 [vehicle.service] Response data:', error.response?.data);
      console.error('🔴 [vehicle.service] Mensaje de error:', error.response?.data?.message);
      console.error('⚠️ [vehicle.service] Detalles:', error.response?.data?.errors);
      throw error;
    }
  },

  /**
   * Actualizar vehículo existente
   * @param {string} placa - Placa del vehículo
   * @param {Object} vehicleData - Datos a actualizar
   * @returns {Promise<Object>} Vehículo actualizado
   */
  async updateVehicle(placa, vehicleData) {
    try {
      console.log('🚗 [vehicle.service] Actualizando vehículo:', placa);
      console.log('📦 [vehicle.service] Payload completo:', JSON.stringify(vehicleData, null, 2));
      
      const response = await apiService.put(`/vehicles/${placa}`, vehicleData);
      return response.data;
    } catch (error) {
      console.error('❌ [vehicle.service] Error al actualizar vehículo:', error);
      console.error('📋 [vehicle.service] Response data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Eliminar vehículo
   * @param {string} placa - Placa del vehículo
   * @returns {Promise<Object>} Confirmación
   */
  async deleteVehicle(placa) {
    try {
      const response = await apiService.delete(`/vehicles/${placa}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      throw error;
    }
  }
};

export default vehicleService;
