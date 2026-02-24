/**
 * User Service - Servicio para gestión de usuarios
 * 
 * Conecta el frontend con los endpoints de la API de usuarios del backend
 * Todos los métodos manejan automáticamente el token JWT mediante el interceptor de apiService
 */

import { apiService } from './api.service';

const userService = {
  /**
   * Obtener todos los usuarios
   * @param {Object} filters - Filtros opcionales
   * @param {string} filters.role - Filtrar por rol (conductor, supervisor, administrador)
   * @param {string} filters.area - Filtrar por área
   * @param {string} filters.search - Buscar por nombre
   * @returns {Promise} Lista de usuarios
   */
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.area) params.append('area', filters.area);
      if (filters.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const url = queryString ? `/users?${queryString}` : '/users';
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise} Estadísticas por rol
   */
  getUserStats: async () => {
    try {
      const response = await apiService.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener un usuario por cédula
   * @param {string} cedula - Cédula del usuario
   * @returns {Promise} Datos del usuario
   */
  getUserByCedula: async (cedula) => {
    try {
      const response = await apiService.get(`/users/${cedula}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario ${cedula}:`, error);
      throw error;
    }
  },

  /**
   * Obtener usuarios por rol
   * @param {string} role - Rol (conductor, supervisor, administrador)
   * @returns {Promise} Lista de usuarios del rol
   */
  getUsersByRole: async (role) => {
    try {
      const response = await apiService.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuarios con rol ${role}:`, error);
      throw error;
    }
  },

  /**
   * Verificar si existe un usuario
   * @param {string} cedula - Cédula a verificar
   * @returns {Promise} { exists: boolean }
   */
  checkUserExists: async (cedula) => {
    try {
      const response = await apiService.get(`/users/exists/${cedula}`);
      return response.data;
    } catch (error) {
      console.error(`Error al verificar existencia del usuario ${cedula}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.id_cedula - Cédula (obligatorio)
   * @param {string} userData.nombre - Nombre completo (obligatorio)
   * @param {number} userData.id_rol - ID del rol: 1=Conductor, 2=Supervisor, 3=Admin (obligatorio)
   * @param {string} userData.area - Área de trabajo (opcional)
   * @param {string} userData.celular - Número de celular (opcional)
   * @param {string} userData.password - Contraseña (opcional, se genera automática si no se proporciona)
   * @returns {Promise} Usuario creado
   */
  createUser: async (userData) => {
    try {
      const response = await apiService.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario existente
   * @param {string} cedula - Cédula del usuario a actualizar
   * @param {Object} userData - Datos a actualizar (todos opcionales)
   * @returns {Promise} Usuario actualizado
   */
  updateUser: async (cedula, userData) => {
    try {
      const response = await apiService.put(`/users/${cedula}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario ${cedula}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario
   * @param {string} cedula - Cédula del usuario a eliminar
   * @returns {Promise} Confirmación de eliminación
   */
  deleteUser: async (cedula) => {
    try {
      const response = await apiService.delete(`/users/${cedula}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario ${cedula}:`, error);
      throw error;
    }
  },

  /**
   * Obtener el cuestionario de un usuario
   * @param {string} cedula - Cédula del usuario
   * @returns {Promise} Datos del cuestionario o null
   */
  getUserSurvey: async (cedula) => {
    try {
      const response = await apiService.get(`/survey/user/${cedula}`);
      return response.data;
    } catch (error) {
      // Si no existe cuestionario, retornar null en lugar de error
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`Error al obtener cuestionario del usuario ${cedula}:`, error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas del cuestionario
   * @returns {Promise} Estadísticas generales y por categorías
   */
  getSurveyStats: async () => {
    try {
      const response = await apiService.get('/survey/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del cuestionario:', error);
      throw error;
    }
  }
};

export default userService;
