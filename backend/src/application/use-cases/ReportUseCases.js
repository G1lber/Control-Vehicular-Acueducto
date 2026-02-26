/**
 * ReportUseCases - Lógica de negocio para generación de reportes
 * 
 * APPLICATION LAYER (Arquitectura Hexagonal)
 * Contiene las reglas de negocio para reportes
 */

class ReportUseCases {
  constructor(reportRepository) {
    this.reportRepository = reportRepository;
  }

  /**
   * Generar reporte de vehículos
   */
  async generateVehiclesReport(filters = {}, selectedFields = []) {
    try {
      // Validar filtros de fecha
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        
        if (start > end) {
          throw new Error('La fecha inicial no puede ser mayor a la fecha final');
        }
      }

      const data = await this.reportRepository.getVehiclesReport(filters, selectedFields);

      return {
        type: 'vehicles',
        title: 'Reporte de Vehículos',
        data,
        filters,
        selectedFields,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length
      };
    } catch (error) {
      console.error('Error en generateVehiclesReport:', error);
      throw error;
    }
  }

  /**
   * Generar reporte de personal/usuarios
   */
  async generateUsersReport(filters = {}, selectedFields = []) {
    try {
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        
        if (start > end) {
          throw new Error('La fecha inicial no puede ser mayor a la fecha final');
        }
      }

      const data = await this.reportRepository.getUsersReport(filters, selectedFields);

      return {
        type: 'users',
        title: 'Reporte de Personal',
        data,
        filters,
        selectedFields,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length
      };
    } catch (error) {
      console.error('Error en generateUsersReport:', error);
      throw error;
    }
  }

  /**
   * Generar reporte de mantenimientos
   */
  async generateMaintenancesReport(filters = {}, selectedFields = []) {
    try {
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        
        if (start > end) {
          throw new Error('La fecha inicial no puede ser mayor a la fecha final');
        }
      }

      const data = await this.reportRepository.getMaintenancesReport(filters, selectedFields);

      // Calcular estadísticas del reporte
      const totalCost = data.reduce((sum, item) => sum + (parseFloat(item.costo) || 0), 0);
      const avgCost = data.length > 0 ? totalCost / data.length : 0;

      return {
        type: 'maintenances',
        title: 'Reporte de Mantenimientos',
        data,
        filters,
        selectedFields,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length,
        statistics: {
          totalCost,
          avgCost,
          totalMaintenances: data.length
        }
      };
    } catch (error) {
      console.error('Error en generateMaintenancesReport:', error);
      throw error;
    }
  }

  /**
   * Generar reporte combinado: Vehículos con Mantenimientos
   */
  async generateVehiclesWithMaintenanceReport(filters = {}, selectedFields = []) {
    try {
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        
        if (start > end) {
          throw new Error('La fecha inicial no puede ser mayor a la fecha final');
        }
      }

      const data = await this.reportRepository.getVehiclesWithMaintenanceReport(filters, selectedFields);

      // Estadísticas del reporte combinado
      const totalCost = data.reduce((sum, item) => sum + (parseFloat(item.costoTotal) || 0), 0);
      const totalMaintenances = data.reduce((sum, item) => sum + (parseInt(item.totalMantenimientos) || 0), 0);

      return {
        type: 'vehicles_maintenance',
        title: 'Reporte Combinado: Vehículos y Mantenimientos',
        data,
        filters,
        selectedFields,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length,
        statistics: {
          totalVehicles: data.length,
          totalMaintenances,
          totalCost
        }
      };
    } catch (error) {
      console.error('Error en generateVehiclesWithMaintenanceReport:', error);
      throw error;
    }
  }

  /**
   * Generar reporte combinado: Conductores con Vehículos
   */
  async generateDriversWithVehiclesReport(filters = {}, selectedFields = []) {
    try {
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        
        if (start > end) {
          throw new Error('La fecha inicial no puede ser mayor a la fecha final');
        }
      }

      const data = await this.reportRepository.getDriversWithVehiclesReport(filters, selectedFields);

      // Estadísticas
      const totalVehicles = data.reduce((sum, item) => sum + (parseInt(item.vehiculosAsignados) || 0), 0);
      const driversWithLicense = data.filter(d => d.licencia === 'SI').length;
      const driversWithAccidents = data.filter(d => d.accidentes === 'SI').length;

      return {
        type: 'drivers_vehicles',
        title: 'Reporte Combinado: Conductores y Vehículos',
        data,
        filters,
        selectedFields,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length,
        statistics: {
          totalDrivers: data.length,
          totalVehicles,
          driversWithLicense,
          driversWithAccidents,
          percentageWithLicense: data.length > 0 ? (driversWithLicense / data.length * 100).toFixed(2) : 0
        }
      };
    } catch (error) {
      console.error('Error en generateDriversWithVehiclesReport:', error);
      throw error;
    }
  }

  /**
   * Obtener campos disponibles para cada tipo de reporte
   */
  getAvailableFields(reportType) {
    const fieldsConfig = {
      vehicles: [
        { key: 'placa', label: 'Placa', type: 'string' },
        { key: 'modelo', label: 'Modelo', type: 'string' },
        { key: 'marca', label: 'Marca', type: 'string' },
        { key: 'anio', label: 'Año', type: 'number' },
        { key: 'color', label: 'Color', type: 'string' },
        { key: 'combustible', label: 'Tipo Combustible', type: 'string' },
        { key: 'kilometraje', label: 'Kilometraje Actual', type: 'number' },
        { key: 'ultimoMantenimiento', label: 'Último Mantenimiento', type: 'date' },
        { key: 'soat', label: 'Fecha SOAT', type: 'date' },
        { key: 'tecno', label: 'Fecha Tecno', type: 'date' },
        { key: 'conductor', label: 'Conductor', type: 'string' },
        { key: 'cedulaConductor', label: 'Cédula Conductor', type: 'string' },
        { key: 'area', label: 'Área', type: 'string' }
      ],
      users: [
        { key: 'cedula', label: 'Cédula', type: 'string' },
        { key: 'nombre', label: 'Nombre', type: 'string' },
        { key: 'rol', label: 'Rol', type: 'string' },
        { key: 'area', label: 'Área', type: 'string' },
        { key: 'celular', label: 'Celular', type: 'string' },
        { key: 'ciudad', label: 'Ciudad', type: 'string' },
        { key: 'sitioLabor', label: 'Sitio Labor', type: 'string' },
        { key: 'cargo', label: 'Cargo', type: 'string' },
        { key: 'edad', label: 'Edad', type: 'string' },
        { key: 'genero', label: 'Género', type: 'string' },
        { key: 'tipoContratacion', label: 'Tipo Contratación', type: 'string' },
        { key: 'licencia', label: 'Licencia', type: 'string' },
        { key: 'categoriaLicencia', label: 'Categoría Licencia', type: 'string' },
        { key: 'vigenciaLicencia', label: 'Vigencia Licencia', type: 'date' },
        { key: 'accidente5Anios', label: 'Accidentes 5 Años', type: 'string' },
        { key: 'tieneComparendos', label: 'Comparendos', type: 'string' },
        { key: 'fechaRegistroSurvey', label: 'Fecha Registro Survey', type: 'date' }
      ],
      maintenances: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'placa', label: 'Placa', type: 'string' },
        { key: 'vehiculo', label: 'Vehículo', type: 'string' },
        { key: 'tipo', label: 'Tipo Mantenimiento', type: 'string' },
        { key: 'fechaRealizado', label: 'Fecha Realizado', type: 'date' },
        { key: 'fechaProxima', label: 'Fecha Próxima', type: 'date' },
        { key: 'kilometraje', label: 'Kilometraje', type: 'number' },
        { key: 'costo', label: 'Costo', type: 'currency' },
        { key: 'descripcion', label: 'Descripción', type: 'string' },
        { key: 'infoAdicional', label: 'Info. Adicional', type: 'string' },
        { key: 'marca', label: 'Marca', type: 'string' },
        { key: 'modelo', label: 'Modelo', type: 'string' },
        { key: 'anio', label: 'Año', type: 'number' },
        { key: 'conductor', label: 'Conductor', type: 'string' },
        { key: 'area', label: 'Área', type: 'string' }
      ],
      vehicles_maintenance: [
        { key: 'placa', label: 'Placa', type: 'string' },
        { key: 'vehiculo', label: 'Vehículo', type: 'string' },
        { key: 'marca', label: 'Marca', type: 'string' },
        { key: 'modelo', label: 'Modelo', type: 'string' },
        { key: 'anio', label: 'Año', type: 'number' },
        { key: 'kilometraje', label: 'Kilometraje', type: 'number' },
        { key: 'conductor', label: 'Conductor', type: 'string' },
        { key: 'area', label: 'Área', type: 'string' },
        { key: 'totalMantenimientos', label: 'Total Mantenimientos', type: 'number' },
        { key: 'costoTotal', label: 'Costo Total', type: 'currency' },
        { key: 'ultimoMantenimiento', label: 'Último Mantenimiento', type: 'date' },
        { key: 'proximoMantenimiento', label: 'Próximo Mantenimiento', type: 'date' }
      ],
      drivers_vehicles: [
        { key: 'cedula', label: 'Cédula', type: 'string' },
        { key: 'nombre', label: 'Nombre', type: 'string' },
        { key: 'area', label: 'Área', type: 'string' },
        { key: 'celular', label: 'Celular', type: 'string' },
        { key: 'vehiculosAsignados', label: 'Vehículos Asignados', type: 'number' },
        { key: 'placas', label: 'Placas', type: 'string' },
        { key: 'licencia', label: 'Licencia', type: 'string' },
        { key: 'categoriaLicencia', label: 'Categoría Licencia', type: 'string' },
        { key: 'vigenciaLicencia', label: 'Vigencia Licencia', type: 'date' },
        { key: 'accidentes', label: 'Accidentes', type: 'string' },
        { key: 'comparendos', label: 'Comparendos', type: 'string' },
        { key: 'cargo', label: 'Cargo', type: 'string' },
        { key: 'ciudad', label: 'Ciudad', type: 'string' }
      ]
    };

    return fieldsConfig[reportType] || [];
  }

  /**
   * Obtener tipos de mantenimiento disponibles
   */
  async getMaintenanceTypes() {
    try {
      return await this.reportRepository.getMaintenanceTypes();
    } catch (error) {
      console.error('Error en getMaintenanceTypes:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas generales
   */
  async getStats() {
    try {
      return await this.reportRepository.getReportStats();
    } catch (error) {
      console.error('Error en getStats:', error);
      throw error;
    }
  }
}

export default ReportUseCases;
