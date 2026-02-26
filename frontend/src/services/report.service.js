/**
 * Report Service - Servicio para interactuar con la API de reportes
 */

const API_URL = import.meta.env.VITE_API_URL;

const reportService = {
  /**
   * Obtener campos disponibles para un tipo de reporte
   */
  getAvailableFields: async (reportType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/fields/${reportType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener campos disponibles');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en getAvailableFields:', error);
      throw error;
    }
  },

  /**
   * Obtener tipos de mantenimiento disponibles
   */
  getMaintenanceTypes: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/maintenance-types`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener tipos de mantenimiento');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en getMaintenanceTypes:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de reportes
   */
  getStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error en getStats:', error);
      throw error;
    }
  },

  /**
   * Generar y descargar reporte
   */
  generateReport: async (reportConfig) => {
    try {
      const token = localStorage.getItem('token');
      
      // Construir query string
      const params = new URLSearchParams();
      params.append('reportType', reportConfig.reportType);
      
      if (reportConfig.startDate) {
        params.append('startDate', reportConfig.startDate);
      }
      if (reportConfig.endDate) {
        params.append('endDate', reportConfig.endDate);
      }
      if (reportConfig.role) {
        params.append('role', reportConfig.role);
      }
      if (reportConfig.maintenanceType) {
        params.append('maintenanceType', reportConfig.maintenanceType);
      }
      if (reportConfig.fields && reportConfig.fields.length > 0) {
        params.append('fields', reportConfig.fields.join(','));
      }

      const response = await fetch(`${API_URL}/reports/generate?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }

      // Descargar archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reporte_${reportConfig.reportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error en generateReport:', error);
      throw error;
    }
  }
};

export default reportService;
