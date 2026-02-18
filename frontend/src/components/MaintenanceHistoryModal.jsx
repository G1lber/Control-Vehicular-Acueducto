// Componente MaintenanceHistoryModal - Modal para mostrar historial de mantenimientos
import { useState, useMemo } from 'react';
import Modal from './Modal';
import { 
  Cog6ToothIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const MaintenanceHistoryModal = ({ isOpen, onClose, maintenances, vehicles }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' o 'custom'

  // Función para obtener datos del vehículo por ID
  const getVehicleById = (vehicleId) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  // Función para formatear el tipo de mantenimiento
  const formatMaintenanceType = (type) => {
    const types = {
      oil_change: 'Cambio de Aceite',
      tire_change: 'Cambio de Llantas',
      brake_fluid: 'Líquido de Frenos',
      drive_kit: 'Kit de Arrastre',
      filters: 'Cambio de Filtros',
      battery: 'Cambio de Batería',
      brakes: 'Mantenimiento de Frenos',
      suspension: 'Mantenimiento de Suspensión',
      engine: 'Mantenimiento de Motor',
      transmission: 'Mantenimiento de Transmisión',
      other: 'Otro'
    };
    return types[type] || type;
  };

  // Función para obtener color según el tipo de mantenimiento
  const getMaintenanceColor = (type) => {
    const colors = {
      oil_change: 'bg-amber-50 border-amber-200 text-amber-700',
      tire_change: 'bg-gray-50 border-gray-300 text-gray-700',
      brake_fluid: 'bg-red-50 border-red-200 text-red-700',
      drive_kit: 'bg-purple-50 border-purple-200 text-purple-700',
      filters: 'bg-green-50 border-green-200 text-green-700',
      battery: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      brakes: 'bg-red-50 border-red-200 text-red-700',
      suspension: 'bg-blue-50 border-blue-200 text-blue-700',
      engine: 'bg-orange-50 border-orange-200 text-orange-700',
      transmission: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      other: 'bg-gray-50 border-gray-300 text-gray-700'
    };
    return colors[type] || colors.other;
  };

  // Filtrar mantenimientos según el mes seleccionado
  const filteredMaintenances = useMemo(() => {
    if (filterMode === 'all' || !selectedMonth) {
      return maintenances;
    }
    
    const [year, month] = selectedMonth.split('-').map(Number);
    return maintenances.filter(m => {
      const date = new Date(m.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  }, [maintenances, selectedMonth, filterMode]);

  // Ordenar mantenimientos por fecha (más reciente primero)
  const sortedMaintenances = [...filteredMaintenances].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Calcular estadísticas del período seleccionado
  const totalCost = filteredMaintenances.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
  const maintenanceCount = filteredMaintenances.length;

  // Formatear el mes para mostrar
  const formatMonthLabel = (monthYear) => {
    if (!monthYear) return 'Todos los meses';
    const [year, month] = monthYear.split('-');
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Manejar cambio en el input de mes
  const handleMonthChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    setFilterMode(value ? 'custom' : 'all');
  };

  // Limpiar filtro
  const clearFilter = () => {
    setSelectedMonth('');
    setFilterMode('all');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historial de Mantenimientos" size="lg">
      {maintenances.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Cog6ToothIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            Sin mantenimientos registrados
          </h3>
          <p className="text-secondary">
            Aún no hay mantenimientos en el historial
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selector de mes */}
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1">
                <label htmlFor="month-input" className="text-sm font-semibold text-primary mb-2 block">
                  Filtrar por mes y año
                </label>
                <div className="flex gap-2">
                  <input
                    id="month-input"
                    type="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="flex-1 px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary font-semibold"
                    placeholder="Selecciona mes y año"
                  />
                  {selectedMonth && (
                    <button
                      onClick={clearFilter}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg transition-colors flex items-center gap-2 text-red-600 font-semibold"
                      title="Limpiar filtro"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </button>
                  )}
                </div>
                {selectedMonth && (
                  <p className="text-xs text-primary-light mt-2 font-semibold">
                    📅 Mostrando: {formatMonthLabel(selectedMonth)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Estadísticas del período seleccionado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <Cog6ToothIcon className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">
                    {filterMode === 'all' ? 'Total Mantenimientos' : 'Mantenimientos'}
                  </p>
                  <p className="text-2xl font-bold">{maintenanceCount}</p>
                  {filterMode === 'custom' && selectedMonth && (
                    <p className="text-xs opacity-75 mt-1">{formatMonthLabel(selectedMonth)}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-semibold">
                    {filterMode === 'all' ? 'Costo Total' : 'Costo del Período'}
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    ${totalCost.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de mantenimientos */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-primary">
              {filterMode === 'all' 
                ? 'Todos los Mantenimientos' 
                : `Mantenimientos de ${formatMonthLabel(selectedMonth)}`}
            </h4>
            
            {sortedMaintenances.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-secondary font-semibold">
                  {filterMode === 'custom' 
                    ? `No hay mantenimientos en ${formatMonthLabel(selectedMonth)}`
                    : 'No hay mantenimientos registrados'}
                </p>
                {filterMode === 'custom' && (
                  <button
                    onClick={clearFilter}
                    className="mt-3 text-primary hover:text-primary-light font-semibold underline"
                  >
                    Ver todos los mantenimientos
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {sortedMaintenances.map((maintenance) => {
                const vehicle = getVehicleById(maintenance.vehicleId);
                const colorClass = getMaintenanceColor(maintenance.maintenanceType);

                return (
                  <div
                    key={maintenance.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <WrenchScrewdriverIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-bold text-primary text-lg">
                            {formatMaintenanceType(maintenance.maintenanceType)}
                          </h5>
                          {vehicle && (
                            <div className="flex items-center gap-2 text-sm text-secondary">
                              <TruckIcon className="w-4 h-4" />
                              <span className="font-semibold">
                                {vehicle.plate} - {vehicle.brand} {vehicle.model}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                        {formatMaintenanceType(maintenance.maintenanceType)}
                      </span>
                    </div>

                    {/* Detalles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary-light" />
                        <div>
                          <p className="text-xs text-secondary">Fecha</p>
                          <p className="text-sm font-semibold text-primary">
                            {new Date(maintenance.date).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      </div>
                      {maintenance.cost && (
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-secondary">Costo</p>
                            <p className="text-sm font-semibold text-green-700">
                              ${parseFloat(maintenance.cost).toLocaleString('es-CO')}
                            </p>
                          </div>
                        </div>
                      )}
                      {maintenance.mileage && (
                        <div>
                          <p className="text-xs text-secondary">Kilometraje</p>
                          <p className="text-sm font-semibold text-primary">
                            {parseFloat(maintenance.mileage).toLocaleString('es-CO')} km
                          </p>
                        </div>
                      )}
                      {maintenance.nextMaintenanceDate && (
                        <div>
                          <p className="text-xs text-secondary">Próximo</p>
                          <p className="text-sm font-semibold text-yellow-600">
                            {new Date(maintenance.nextMaintenanceDate).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    {maintenance.description && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-secondary">Descripción:</span> {maintenance.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4">
            <p className="text-sm text-primary">
              💡 <strong>Consejo:</strong> Mantén un registro actualizado de todos los mantenimientos para prolongar la vida útil de tus vehículos y evitar gastos mayores.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MaintenanceHistoryModal;
