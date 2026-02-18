// Página de Reportes - Generación de reportes del sistema
import { useState } from 'react';
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
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { useAlert } from '../context/AlertContext';

const Reports = ({ onNavigate }) => {
  const { success, info } = useAlert();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('');

  const reportTypes = [
    { value: 'vehicles', label: 'Reporte de Vehículos', icon: TruckIcon, description: 'Estado general de la flota vehicular' },
    { value: 'maintenance', label: 'Mantenimientos Realizados', icon: WrenchScrewdriverIcon, description: 'Historial de mantenimientos preventivos y correctivos' },
    { value: 'soat', label: 'Vigencia de SOAT', icon: ClipboardDocumentCheckIcon, description: 'Vehículos con SOAT vigente, por vencer o vencido' },
    { value: 'techReview', label: 'Revisiones Técnico-Mecánicas', icon: CheckBadgeIcon, description: 'Estado de las revisiones técnico-mecánicas' },
    { value: 'costs', label: 'Costos de Mantenimiento', icon: CurrencyDollarIcon, description: 'Análisis de costos por vehículo y tipo de mantenimiento' },
    { value: 'alerts', label: 'Alertas y Vencimientos', icon: ExclamationTriangleIcon, description: 'Alertas de documentos y mantenimientos próximos a vencer' }
  ];

  const handleGenerateReport = (type) => {
    // Aquí se generaría el reporte cuando el backend esté disponible
    console.log('Generando reporte:', type, dateRange);
    const reportName = reportTypes.find(r => r.value === type)?.label;
    success(`Reporte "${reportName}" generado exitosamente`);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Reportes del Sistema</h1>
        <p className="text-primary-light font-semibold">
          Genera reportes detallados sobre vehículos, mantenimientos y más
        </p>
      </div>

      {/* Filtros de fecha */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Rango de Fechas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Grid de tipos de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div
            key={report.value}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-primary-light"
          >
            <div className="flex items-start justify-between mb-4">
              <report.icon className="w-12 h-12 text-primary" />
              <button
                onClick={() => handleGenerateReport(report.value)}
                className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Generar
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-primary mb-2">
              {report.label}
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              {report.description}
            </p>

            {/* Opciones adicionales */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                className="text-primary-light hover:text-primary text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-8 bg-gradient-to-r from-primary to-primary-light rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ChartBarIcon className="w-7 h-7" />
          Estadísticas Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Reportes generados hoy</p>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Total este mes</p>
            <p className="text-3xl font-bold">47</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Más solicitado</p>
            <p className="text-lg font-bold">Mantenimientos</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Último reporte</p>
            <p className="text-lg font-bold">Hace 2 horas</p>
          </div>
        </div>
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
                <span>Selecciona un rango de fechas específico para obtener datos más precisos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span>Los reportes se generan en formato PDF listo para imprimir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-light">•</span>
                <span>Puedes exportar los datos a Excel para análisis adicionales</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
