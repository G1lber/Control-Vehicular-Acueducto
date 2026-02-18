// Componente AlertsModal - Modal para mostrar vehículos con alertas de vencimiento
import Modal from './Modal';
import { 
  ExclamationTriangleIcon, 
  ClipboardDocumentCheckIcon, 
  CheckBadgeIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const AlertsModal = ({ isOpen, onClose, vehicles }) => {
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

  // Calcular días restantes
  const getDaysRemaining = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    return Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
  };

  // Filtrar vehículos con alertas
  const vehiclesWithAlerts = vehicles.filter(vehicle => {
    const soatAlert = isExpiringSoon(vehicle.soatExpiry) || isExpired(vehicle.soatExpiry);
    const techAlert = isExpiringSoon(vehicle.techReviewExpiry) || isExpired(vehicle.techReviewExpiry);
    return soatAlert || techAlert;
  });

  // Ordenar: primero los vencidos (urgentes), luego los próximos a vencer
  const sortedVehicles = [...vehiclesWithAlerts].sort((a, b) => {
    const aHasExpired = isExpired(a.soatExpiry) || isExpired(a.techReviewExpiry);
    const bHasExpired = isExpired(b.soatExpiry) || isExpired(b.techReviewExpiry);
    
    // Si uno tiene vencido y el otro no, el vencido va primero
    if (aHasExpired && !bHasExpired) return -1;
    if (!aHasExpired && bHasExpired) return 1;
    
    // Si ambos tienen o no tienen vencidos, ordenar por la fecha más próxima
    const aMinDate = Math.min(
      new Date(a.soatExpiry).getTime(),
      new Date(a.techReviewExpiry).getTime()
    );
    const bMinDate = Math.min(
      new Date(b.soatExpiry).getTime(),
      new Date(b.techReviewExpiry).getTime()
    );
    
    return aMinDate - bMinDate;
  });

  // Agrupar alertas por severidad
  const expiredAlerts = vehiclesWithAlerts.filter(v => 
    isExpired(v.soatExpiry) || isExpired(v.techReviewExpiry)
  );
  
  const expiringSoonAlerts = vehiclesWithAlerts.filter(v => 
    !isExpired(v.soatExpiry) && !isExpired(v.techReviewExpiry) &&
    (isExpiringSoon(v.soatExpiry) || isExpiringSoon(v.techReviewExpiry))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alertas de Vencimientos" size="lg">
      {vehiclesWithAlerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckBadgeIcon className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            ¡Todo en orden!
          </h3>
          <p className="text-secondary">
            No hay vehículos con documentos próximos a vencer
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-red-600 font-semibold">Vencidos</p>
                  <p className="text-2xl font-bold text-red-700">{expiredAlerts.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-yellow-600 font-semibold">Por vencer</p>
                  <p className="text-2xl font-bold text-yellow-700">{expiringSoonAlerts.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de vehículos con alertas */}
          <div className="space-y-4">
            {sortedVehicles.map(vehicle => {
              const soatExpired = isExpired(vehicle.soatExpiry);
              const soatExpiring = !soatExpired && isExpiringSoon(vehicle.soatExpiry);
              const techExpired = isExpired(vehicle.techReviewExpiry);
              const techExpiring = !techExpired && isExpiringSoon(vehicle.techReviewExpiry);

              return (
                <div 
                  key={vehicle.id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  {/* Header del vehículo */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-primary">{vehicle.plate}</h4>
                      <p className="text-secondary font-semibold">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </p>
                    </div>
                    {(soatExpired || techExpired) && (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                        URGENTE
                      </span>
                    )}
                  </div>

                  {/* Alertas */}
                  <div className="space-y-3">
                    {/* SOAT Alert */}
                    {(soatExpired || soatExpiring) && (
                      <div className={`flex items-start gap-3 p-3 rounded-lg ${
                        soatExpired ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <ClipboardDocumentCheckIcon className={`w-6 h-6 flex-shrink-0 ${
                          soatExpired ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${
                            soatExpired ? 'text-red-700' : 'text-yellow-700'
                          }`}>
                            SOAT {soatExpired ? 'VENCIDO' : 'por vencer'}
                          </p>
                          <p className={`text-sm ${
                            soatExpired ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            Vence: {new Date(vehicle.soatExpiry).toLocaleDateString('es-CO')}
                            {!soatExpired && ` (${getDaysRemaining(vehicle.soatExpiry)} días)`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tech Review Alert */}
                    {(techExpired || techExpiring) && (
                      <div className={`flex items-start gap-3 p-3 rounded-lg ${
                        techExpired ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <CheckBadgeIcon className={`w-6 h-6 flex-shrink-0 ${
                          techExpired ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className={`font-bold text-sm ${
                            techExpired ? 'text-red-700' : 'text-yellow-700'
                          }`}>
                            Revisión Técnico-Mecánica {techExpired ? 'VENCIDA' : 'por vencer'}
                          </p>
                          <p className={`text-sm ${
                            techExpired ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            Vence: {new Date(vehicle.techReviewExpiry).toLocaleDateString('es-CO')}
                            {!techExpired && ` (${getDaysRemaining(vehicle.techReviewExpiry)} días)`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4">
            <p className="text-sm text-primary font-semibold">
              💡 <strong>Importante:</strong> Recuerda renovar los documentos antes de su vencimiento para evitar multas y problemas legales.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AlertsModal;
