/**
 * ReportController - Controlador HTTP para reportes
 * 
 * INFRASTRUCTURE LAYER (Arquitectura Hexagonal)
 * Maneja las peticiones HTTP y genera archivos Excel
 */

import ExcelJS from 'exceljs';

class ReportController {
  constructor(reportUseCases) {
    this.reportUseCases = reportUseCases;
  }

  /**
   * GET /api/reports/generate
   * Generar reporte según tipo y descargarlo como Excel
   */
  generateReport = async (req, res) => {
    try {
      const { 
        reportType, 
        startDate, 
        endDate, 
        role, 
        maintenanceType,
        fields 
      } = req.query;

      if (!reportType) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de reporte es obligatorio'
        });
      }

      // Parsear campos seleccionados
      const selectedFields = fields ? fields.split(',') : [];

      // Preparar filtros
      const filters = {
        startDate: startDate || null,
        endDate: endDate || null,
        role: role || null,
        maintenanceType: maintenanceType || null
      };

      // Generar reporte según tipo
      let reportData;
      
      switch (reportType) {
        case 'vehicles':
          reportData = await this.reportUseCases.generateVehiclesReport(filters, selectedFields);
          break;
        case 'users':
          reportData = await this.reportUseCases.generateUsersReport(filters, selectedFields);
          break;
        case 'maintenances':
          reportData = await this.reportUseCases.generateMaintenancesReport(filters, selectedFields);
          break;
        case 'vehicles_maintenance':
          reportData = await this.reportUseCases.generateVehiclesWithMaintenanceReport(filters, selectedFields);
          break;
        case 'drivers_vehicles':
          reportData = await this.reportUseCases.generateDriversWithVehiclesReport(filters, selectedFields);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Tipo de reporte no válido'
          });
      }

      // Generar archivo Excel
      const workbook = await this._generateExcelFile(reportData);

      // Configurar headers para descarga
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=Reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`
      );

      // Enviar archivo
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('❌ Error en generateReport:', error);
      console.error('Stack trace:', error.stack);
      console.error('Error message:', error.message);
      
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Error al generar el reporte',
          error: error.message,
          details: error.stack
        });
      }
    }
  };

  /**
   * GET /api/reports/fields/:reportType
   * Obtener campos disponibles para un tipo de reporte
   */
  getAvailableFields = async (req, res) => {
    try {
      const { reportType } = req.params;
      
      const fields = this.reportUseCases.getAvailableFields(reportType);

      res.json({
        success: true,
        data: fields
      });
    } catch (error) {
      console.error('Error en getAvailableFields:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener campos disponibles',
        error: error.message
      });
    }
  };

  /**
   * GET /api/reports/maintenance-types
   * Obtener tipos de mantenimiento para filtros
   */
  getMaintenanceTypes = async (req, res) => {
    try {
      const types = await this.reportUseCases.getMaintenanceTypes();

      res.json({
        success: true,
        data: types
      });
    } catch (error) {
      console.error('Error en getMaintenanceTypes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener tipos de mantenimiento',
        error: error.message
      });
    }
  };

  /**
   * GET /api/reports/stats
   * Obtener estadísticas para la vista de reportes
   */
  getStats = async (req, res) => {
    try {
      const stats = await this.reportUseCases.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error en getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  };

  /**
   * Helper: Generar archivo Excel con formato
   * @private
   */
  async _generateExcelFile(reportData) {
    const workbook = new ExcelJS.Workbook();
    
    // Metadata del archivo
    workbook.creator = 'Sistema Control Vehicular';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(reportData.title, {
      properties: { tabColor: { argb: '1779BC' } },
      pageSetup: {
        orientation: 'landscape',
        fitToPage: true
      }
    });

    // Si no hay datos, crear hoja vacía con mensaje
    if (!reportData.data || reportData.data.length === 0) {
      worksheet.addRow(['No se encontraron datos para este reporte']);
      worksheet.getCell('A1').font = { bold: true, size: 14, color: { argb: '1779BC' } };
      return workbook;
    }

    // Obtener columnas de los datos
    const columns = Object.keys(reportData.data[0]).map(key => ({
      header: this._formatHeader(key),
      key: key,
      width: 20
    }));

    worksheet.columns = columns;

    // Estilo del header
    worksheet.getRow(1).font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1779BC' }
    };
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    worksheet.getRow(1).height = 25;

    // Agregar datos
    reportData.data.forEach(row => {
      const newRow = worksheet.addRow(row);
      
      // Alternar colores de filas
      if (newRow.number % 2 === 0) {
        newRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F0F0F0' }
        };
      }

      // Formatear celdas según tipo de dato
      Object.keys(row).forEach((key, index) => {
        const cell = newRow.getCell(index + 1);
        const value = row[key];

        // Formatear fechas
        if (value instanceof Date || this._isDateString(value)) {
          cell.numFmt = 'dd/mm/yyyy';
        }

        // Formatear moneda
        if (key.toLowerCase().includes('costo') || key.toLowerCase().includes('total')) {
          cell.numFmt = '$#,##0.00';
        }

        // Alineación
        cell.alignment = { 
          vertical: 'middle',
          horizontal: typeof value === 'number' ? 'right' : 'left'
        };
      });
    });

    // Agregar bordes a todas las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'CCCCCC' } },
          left: { style: 'thin', color: { argb: 'CCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
          right: { style: 'thin', color: { argb: 'CCCCCC' } }
        };
      });
    });

    // Agregar hoja de información del reporte
    const infoSheet = workbook.addWorksheet('Información del Reporte');
    
    infoSheet.addRow(['INFORMACIÓN DEL REPORTE']);
    infoSheet.addRow([]);
    infoSheet.addRow(['Título:', reportData.title]);
    infoSheet.addRow(['Tipo:', reportData.type]);
    infoSheet.addRow(['Generado:', new Date(reportData.generatedAt).toLocaleString('es-CO')]);
    infoSheet.addRow(['Total de Registros:', reportData.totalRecords]);
    
    if (reportData.filters) {
      infoSheet.addRow([]);
      infoSheet.addRow(['FILTROS APLICADOS']);
      if (reportData.filters.startDate) {
        infoSheet.addRow(['Fecha Inicial:', reportData.filters.startDate]);
      }
      if (reportData.filters.endDate) {
        infoSheet.addRow(['Fecha Final:', reportData.filters.endDate]);
      }
      if (reportData.filters.role) {
        infoSheet.addRow(['Rol:', reportData.filters.role]);
      }
      if (reportData.filters.maintenanceType) {
        infoSheet.addRow(['Tipo Mantenimiento:', reportData.filters.maintenanceType]);
      }
    }

    if (reportData.statistics) {
      infoSheet.addRow([]);
      infoSheet.addRow(['ESTADÍSTICAS']);
      Object.entries(reportData.statistics).forEach(([key, value]) => {
        infoSheet.addRow([this._formatHeader(key) + ':', value]);
      });
    }

    // Estilo de la hoja de información
    infoSheet.getCell('A1').font = { bold: true, size: 14, color: { argb: '1779BC' } };
    infoSheet.getColumn(1).width = 30;
    infoSheet.getColumn(2).width = 40;

    return workbook;
  }

  /**
   * Helper: Formatear nombres de headers
   * @private
   */
  _formatHeader(str) {
    // Diccionario de traducciones y casos especiales
    const specialCases = {
      'soat': 'SOAT',
      'tecno': 'Tecnomecánica',
      'cedula': 'Cédula',
      'vehiculo': 'Vehículo',
      'ano': 'Año',
      'anio': 'Año',
      'anios': 'Años',
      'año': 'Año',
      'años': 'Años',
      'area': 'Área',
      'categoria': 'Categoría',
      'genero': 'Género',
      'ciudad': 'Ciudad',
      'vigencia': 'Vigencia',
      'comparendos': 'Comparendos',
      'accidentes': 'Accidentes',
      'accidente': 'Accidente',
      'mantenimientos': 'Mantenimientos',
      'mantenimiento': 'Mantenimiento',
      'kilometraje': 'Kilometraje',
      'proximo': 'Próximo',
      'ultimo': 'Último',
      'descripcion': 'Descripción',
      'informacion': 'Información',
      'adicional': 'Adicional',
      'realizacion': 'Realización',
      'prox': 'Próximo',
      'ult': 'Último'
    };

    // Quitar prefijos ID_ o id_
    let cleaned = str.replace(/^id_?/i, '');
    
    // Reemplazar guiones bajos con espacios
    cleaned = cleaned.replace(/_/g, ' ');
    
    // Convertir camelCase a palabras separadas
    cleaned = cleaned.replace(/([A-Z])/g, ' $1');
    
    // Separar palabras compuestas y limpiar espacios múltiples
    cleaned = cleaned.trim().replace(/\s+/g, ' ');
    
    // Convertir a minúsculas para procesar
    const words = cleaned.toLowerCase().split(' ');
    
    // Procesar cada palabra
    const formatted = words.map(word => {
      // Si la palabra está en casos especiales, usar esa versión
      if (specialCases[word]) {
        return specialCases[word];
      }
      // De lo contrario, capitalizar primera letra
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    
    return formatted;
  }

  /**
   * Helper: Verificar si un string es una fecha
   * @private
   */
  _isDateString(value) {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  }
}

export default ReportController;
