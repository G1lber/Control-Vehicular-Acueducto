// Página de Reportes - Generación de reportes del sistema
import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ArrowDownTrayIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentCheckIcon, 
  CheckBadgeIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon, 
  LightBulbIcon, 
  ChartBarIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAlert } from '../context/AlertContext';
import reportService from '../services/report.service';

const Reports = ({ onNavigate }) => {
  const { success, error, info } = useAlert();
  
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    maintenanceType: ''
  });
  const [stats, setStats] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  const reportTypes = [
    { 
      value: 'vehicles', 
      label: 'Vehículos', 
      icon: TruckIcon, 
      description: 'Estado general de la flota vehicular',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      value: 'users', 
      label: 'Personal', 
      icon: UserGroupIcon, 
      description: 'Información de conductores y supervisores',
      color: 'from-green-500 to-green-600'
    },
    { 
      value: 'maintenances', 
      label: 'Mantenimientos', 
      icon: WrenchScrewdriverIcon, 
      description: 'Historial de mantenimientos realizados',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      value: 'vehicles_maintenance', 
      label: 'Vehículos + Mantenimientos', 
      icon: ClipboardDocumentCheckIcon, 
      description: 'Reporte combinado de vehículos con sus mantenimientos',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      value: 'drivers_vehicles', 
      label: 'Conductores + Vehículos', 
      icon: CheckBadgeIcon, 
      description: 'Conductores con vehículos asignados y datos de seguridad',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  // Cargar campos disponibles cuando se selecciona un tipo de reporte
  useEffect(() => {
    if (selectedReport) {
      loadAvailableFields(selectedReport);
      setShowFieldSelector(true);
    } else {
      setShowFieldSelector(false);
      setAvailableFields([]);
      setSelectedFields([]);
    }
  }, [selectedReport]);

  // Cargar tipos de mantenimiento
  useEffect(() => {
    loadMaintenanceTypes();
  }, []);

  const loadStats = async () => {
    try {
      const data = await reportService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const loadAvailableFields = async (reportType) => {
    try {
      const fields = await reportService.getAvailableFields(reportType);
      setAvailableFields(fields);
      // Por defecto, seleccionar todos los campos
      setSelectedFields(fields.map(f => f.key));
    } catch (err) {
      console.error('Error al cargar campos:', err);
      error('Error al cargar campos disponibles');
    }
  };

  const loadMaintenanceTypes = async () => {
    try {
      const types = await reportService.getMaintenanceTypes();
      setMaintenanceTypes(types);
    } catch (err) {
      console.error('Error al cargar tipos de mantenimiento:', err);
    }
  };

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldKey)) {
        return prev.filter(f => f !== fieldKey);
      } else {
        return [...prev, fieldKey];
      }
    });
  };

  const handleSelectAllFields = () => {
    setSelectedFields(availableFields.map(f => f.key));
  };

  const handleDeselectAllFields = () => {
    setSelectedFields([]);
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      error('Selecciona un tipo de reporte');
      return;
    }

    if (selectedFields.length === 0) {
      error('Selecciona al menos un campo para incluir en el reporte');
      return;
    }

    // Validar fechas
    if (dateRange.startDate && dateRange.endDate) {
      if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
        error('La fecha inicial no puede ser mayor a la fecha final');
        return;
      }
    }

    try {
      setIsGenerating(true);
      
      const reportConfig = {
        reportType: selectedReport,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        fields: selectedFields,
        ...filters
      };

      await reportService.generateReport(reportConfig);
      
      const reportName = reportTypes.find(r => r.value === selectedReport)?.label;
      success(`Reporte "${reportName}" generado y descargado exitosamente`);
      
      // Limpiar selección después de generar
      setSelectedReport(null);
      setDateRange({ startDate: '', endDate: '' });
      setFilters({ role: '', maintenanceType: '' });
    } catch (err) {
      console.error('Error al generar reporte:', err);
      error('Error al generar el reporte. Por favor intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Sistema de Reportes</h1>
        <p className="text-primary-light font-semibold">
          Genera reportes personalizados en formato Excel
        </p>
      </div>

      {/* Estadísticas rápidas */}
      {stats && (
        <div className="mb-8 bg-gradient-to-r from-primary to-primary-light rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-7 h-7" />
            Estadísticas Generales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Total Vehículos</p>
              <p className="text-3xl font-bold">{stats.totalVehicles}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Total Conductores</p>
              <p className="text-3xl font-bold">{stats.totalDrivers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Mantenimientos Realizados</p>
              <p className="text-3xl font-bold">{stats.totalMaintenances}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Costo Total</p>
              <p className="text-2xl font-bold">${stats.totalCosts.toLocaleString('es-CO')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selección de tipo de reporte */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Paso 1: Selecciona el Tipo de Reporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.value}
              onClick={() => setSelectedReport(report.value)}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                selectedReport === report.value
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-gray-200 hover:border-primary-light hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${report.color}`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-primary">{report.label}</h3>
                </div>
                {selectedReport === report.value && (
                  <CheckIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-sm text-secondary">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Paso 2: Configurar Filtros
        </h2>
        
        {/* Rango de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="startDate">
              Fecha Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="endDate">
              Fecha Final
            </label>
            <input
              type="date"
              id="endDate"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Filtros específicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro de rol (solo para reportes de usuarios) */}
          {(selectedReport === 'users' || selectedReport === 'drivers_vehicles') && (
            <div>
              <label className="block text-primary-light font-semibold mb-2">
                Filtrar por Rol
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
              >
                <option value="">Todos los roles</option>
                <option value="Conductor">Conductor</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          )}

          {/* Filtro de tipo de mantenimiento */}
          {selectedReport === 'maintenances' && (
            <div>
              <label className="block text-primary-light font-semibold mb-2">
                Tipo de Mantenimiento
              </label>
              <select
                value={filters.maintenanceType}
                onChange={(e) => setFilters({ ...filters, maintenanceType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
              >
                <option value="">Todos los tipos</option>
                {maintenanceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Selector de campos */}
      {showFieldSelector && availableFields.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Cog6ToothIcon className="w-6 h-6" />
              Paso 3: Selecciona los Campos a Incluir
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAllFields}
                className="px-4 py-2 bg-primary-light/20 text-primary rounded-lg font-semibold hover:bg-primary-light/30 transition-colors text-sm"
              >
                Seleccionar Todos
              </button>
              <button
                onClick={handleDeselectAllFields}
                className="px-4 py-2 bg-gray-100 text-secondary rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                Deseleccionar Todos
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableFields.map(field => (
              <label
                key={field.key}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFields.includes(field.key)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary-light'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.key)}
                  onChange={() => handleFieldToggle(field.key)}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-primary text-sm">{field.label}</p>
                  <p className="text-xs text-secondary">{field.type}</p>
                </div>
                {selectedFields.includes(field.key) && (
                  <CheckIcon className="w-5 h-5 text-primary" />
                )}
              </label>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-primary-light">
            <p className="text-sm text-primary">
              <strong>Campos seleccionados:</strong> {selectedFields.length} de {availableFields.length}
            </p>
          </div>
        </div>
      )}

      {/* Botón de generación */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateReport}
          disabled={!selectedReport || isGenerating || selectedFields.length === 0}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg ${
            selectedReport && !isGenerating && selectedFields.length > 0
              ? 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-xl transform hover:-translate-y-1'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Generando Reporte...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-6 h-6" />
              Generar y Descargar Reporte Excel
            </>
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border-2 border-primary-light rounded-lg p-6">
        <div className="flex items-start gap-4">
          <LightBulbIcon className="w-10 h-10 text-primary-light flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Consejos para reportes efectivos</h3>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span>Selecciona solo los campos que necesitas para obtener reportes más claros</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span>Usa filtros de fecha para analizar periodos específicos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span>Los reportes combinados te permiten ver relaciones entre datos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span>Los archivos Excel se pueden editar y compartir fácilmente</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

