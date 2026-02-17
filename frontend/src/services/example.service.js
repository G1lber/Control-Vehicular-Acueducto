import { apiService } from './api.service';

// Ejemplo de servicio para una entidad específica
// Puedes crear servicios similares para otras entidades (usuarios, vehículos, etc.)

export const exampleService = {
  // Obtener todos los elementos
  getAll: async () => {
    try {
      const response = await apiService.get('/items');
      return response.data;
    } catch (error) {
      console.error('Error al obtener items:', error);
      throw error;
    }
  },

  // Obtener un elemento por ID
  getById: async (id) => {
    try {
      const response = await apiService.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener item ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo elemento
  create: async (data) => {
    try {
      const response = await apiService.post('/items', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear item:', error);
      throw error;
    }
  },

  // Actualizar un elemento
  update: async (id, data) => {
    try {
      const response = await apiService.put(`/items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar item ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un elemento
  delete: async (id) => {
    try {
      const response = await apiService.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar item ${id}:`, error);
      throw error;
    }
  }
};

export default exampleService;
