// Componente VehicleCard - Tarjeta de información de vehículo
// Uso: Muestra información general del vehículo con SOAT y revisión técnico-mecánica
import { UserIcon } from '@heroicons/react/24/outline';

const VehicleCard = ({ vehicle, driver, onMaintenanceClick, onDetailsClick }) => {
  // Ejemplo de datos del vehículo:
  // {
  //   id: 1,
  //   plate: "ABC-123",
  //   brand: "Toyota",
  //   model: "Hilux",
  //   year: 2022,
  //   soatExpiry: "2026-06-15",
  //   techReviewExpiry: "2026-08-20",
  //   lastMaintenance: "2026-01-10",
  //   driverId: 1
  // }
  // driver: { id: 1, name: "Carlos López", ... }

  // Función para verificar si una fecha está próxima a vencer (30 días)
  const isExpiringSoon = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  // Función para verificar si una fecha ya expiró
  const isExpired = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
  };

  const getStatusColor = (dateString) => {
    if (isExpired(dateString)) return 'text-red-600';
    if (isExpiringSoon(dateString)) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header con color primary */}
      <div className="bg-primary p-4">
        <h3 className="text-white font-bold text-xl">{vehicle.plate}</h3>
        <p className="text-white/90 text-sm">{vehicle.brand} {vehicle.model}</p>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Conductor Asignado - Siempre mostrar */}
        <div className={`rounded-lg p-3 border-2 ${driver ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <UserIcon className={`w-5 h-5 ${driver ? 'text-primary' : 'text-gray-400'}`} />
            <div>
              <p className="text-xs text-secondary font-semibold">Conductor Asignado</p>
              <p className={`text-sm font-bold ${driver ? 'text-primary' : 'text-gray-500'}`}>
                {driver ? driver.name : 'Sin asignar'}
              </p>
            </div>
          </div>
        </div>

        {/* Información básica */}
        <div>
          <p className="text-secondary text-sm font-semibold mb-2">Año: {vehicle.year}</p>
        </div>

        {/* SOAT */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-light font-semibold text-sm">SOAT</p>
              <p className={`text-sm font-medium ${getStatusColor(vehicle.soatExpiry)}`}>
                Vence: {new Date(vehicle.soatExpiry).toLocaleDateString('es-CO')}
              </p>
            </div>
            {isExpired(vehicle.soatExpiry) && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                Vencido
              </span>
            )}
            {isExpiringSoon(vehicle.soatExpiry) && !isExpired(vehicle.soatExpiry) && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                Por vencer
              </span>
            )}
          </div>
        </div>

        {/* Revisión Técnico-Mecánica */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-light font-semibold text-sm">Revisión Técnico-Mecánica</p>
              <p className={`text-sm font-medium ${getStatusColor(vehicle.techReviewExpiry)}`}>
                Vence: {new Date(vehicle.techReviewExpiry).toLocaleDateString('es-CO')}
              </p>
            </div>
            {isExpired(vehicle.techReviewExpiry) && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                Vencido
              </span>
            )}
            {isExpiringSoon(vehicle.techReviewExpiry) && !isExpired(vehicle.techReviewExpiry) && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                Por vencer
              </span>
            )}
          </div>
        </div>

        {/* Último mantenimiento */}
        <div className="border-t pt-3">
          <p className="text-secondary text-xs">
            Último mantenimiento: {vehicle.lastMaintenance 
              ? new Date(vehicle.lastMaintenance).toLocaleDateString('es-CO')
              : 'Sin registros'}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => onDetailsClick && onDetailsClick(vehicle)}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            Ver Detalles
          </button>
          <button 
            onClick={() => onMaintenanceClick && onMaintenanceClick(vehicle)}
            className="flex-1 bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold py-2 px-4 rounded transition-colors text-sm"
          >
            Mantenimiento
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
