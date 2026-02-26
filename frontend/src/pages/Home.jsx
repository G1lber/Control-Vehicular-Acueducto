// Página de ejemplo - Home con Tailwind CSS
import { useState, useEffect } from 'react';
import { 
  TruckIcon, 
  ChevronRightIcon, 
  Cog6ToothIcon, 
  ExclamationTriangleIcon, 
  DocumentChartBarIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import AlertsModal from '../components/AlertsModal';
import MaintenanceHistoryModal from '../components/MaintenanceHistoryModal';
import vehicleService from '../services/vehicle.service';
import userService from '../services/user.service';
import maintenanceService from '../services/maintenance.service';

export const Home = ({ onNavigate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isMaintenanceHistoryOpen, setIsMaintenanceHistoryOpen] = useState(false);

  // Datos del backend
  const [drivers, setDrivers] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [maintenances, setMaintenances] = useState([]);

  // Calcular alertas reales
  const calculateAlerts = () => {
    const isExpiringSoon = (dateString) => {
      const expiryDate = new Date(dateString);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    };

    const isExpired = (dateString) => {
      const expiryDate = new Date(dateString);
      const today = new Date();
      return expiryDate < today;
    };

    const alertsCount = vehicles.filter(vehicle => {
      const soatAlert = isExpiringSoon(vehicle.soatExpiry) || isExpired(vehicle.soatExpiry);
      const techAlert = isExpiringSoon(vehicle.techReviewExpiry) || isExpired(vehicle.techReviewExpiry);
      return soatAlert || techAlert;
    }).length;

    return alertsCount;
  };

  // Calcular mantenimientos del año actual
  const calculateCurrentYearMaintenances = () => {
    const currentYear = new Date().getFullYear();
    return maintenances.filter(m => {
      const date = new Date(m.date);
      return date.getFullYear() === currentYear;
    }).length;
  };

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar vehículos
        const vehiclesResponse = await vehicleService.getAllVehicles();
        if (vehiclesResponse.success) {
          const mappedVehicles = vehiclesResponse.data.map(v => ({
            id: v.id_placa,
            plate: v.id_placa,
            brand: v.marca || 'N/A',
            model: v.modelo || 'N/A',
            year: v.anio || '',
            color: v.color || 'N/A',
            fuelType: v.tipo_combustible || 'N/A',
            soatExpiry: v.soat || null,
            techReviewExpiry: v.tecno || null,
            lastMaintenance: v.ultimo_mantenimiento || null,
            mileage: v.kilometraje_actual || '0',
            driverId: v.id_usuario || null
          }));
          setVehicles(mappedVehicles);
        }

        // Cargar conductores
        const driversResponse = await userService.getUsersByRole('conductor');
        if (driversResponse.success) {
          const mappedDrivers = driversResponse.data.map(u => ({
            id: u.cedula,
            cedula: u.cedula,
            name: u.name,
            phone: u.phone || '',
            area: u.area || '',
            role: u.role
          }));
          setDrivers(mappedDrivers);
        }

        // Cargar mantenimientos
        const maintenancesResponse = await maintenanceService.getAllMaintenances();
        if (maintenancesResponse.success) {
          const mappedMaintenances = maintenancesResponse.data.map(m => ({
            id: m.id_mantenimiento,
            vehicleId: m.id_placa,
            maintenanceType: m.tipo_mantenimiento,
            date: m.fecha_realizado || m.fechaRealizado,
            cost: m.costo?.toString() || '',
            mileage: m.kilometraje?.toString() || '',
            nextMaintenanceDate: m.fecha_proxima || m.fechaProxima || null,
            description: m.descripcion || ''
          }));
          setMaintenances(mappedMaintenances);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-primary mb-6">
        Bienvenido al Sistema de Control Vehicular
      </h2>
      
      {loading && (
        <p className="text-primary-light text-lg">Cargando...</p>
      )}
      
      
      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => onNavigate && onNavigate('vehicles')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Total Vehículos</p>
              <p className="text-3xl font-bold text-primary">{vehicles.length}</p>
            </div>
            <div className="bg-primary-light/20 p-3 rounded-full">
              <TruckIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <p className="text-primary-light text-sm font-semibold mt-3 flex items-center gap-1">
            Ver lista completa
            <ChevronRightIcon className="w-4 h-4" />
          </p>
        </button>

        <button
          onClick={() => setIsMaintenanceHistoryOpen(true)}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Mantenimientos {new Date().getFullYear()}</p>
              <p className="text-3xl font-bold text-primary-light">{calculateCurrentYearMaintenances()}</p>
            </div>
            <div className="bg-primary-light/20 p-3 rounded-full">
              <Cog6ToothIcon className="w-8 h-8 text-primary-light" />
            </div>
          </div>
          <p className="text-primary-light text-sm font-semibold mt-3 flex items-center gap-1">
            Ver historial
            <ChevronRightIcon className="w-4 h-4" />
          </p>
        </button>

        <button
          onClick={() => setIsAlertsModalOpen(true)}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Alertas</p>
              <p className="text-3xl font-bold text-yellow-600">{calculateAlerts()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <p className="text-yellow-600 text-sm font-semibold mt-3 flex items-center gap-1">
            Ver detalles
            <ChevronRightIcon className="w-4 h-4" />
          </p>
        </button>
      </div>

      {/* Menú de acceso rápido */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-primary mb-4">Acceso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <button
            onClick={() => onNavigate && onNavigate('vehicles')}
            className="bg-primary hover:bg-primary-light text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <TruckIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Ver Vehículos</span>
            <span className="text-sm opacity-90">Gestionar flota vehicular</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('users')}
            className="bg-primary hover:bg-primary-light text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <UsersIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Ver Usuarios</span>
            <span className="text-sm opacity-90">Conductores y supervisores</span>
          </button>

          {/* <button
            onClick={() => setIsMaintenanceHistoryOpen(true)}
            className="bg-primary-light hover:bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <Cog6ToothIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Mantenimientos</span>
            <span className="text-sm opacity-90">Historial y registros</span>
          </button> */}

          <button
            onClick={() => onNavigate && onNavigate('reports')}
            className="bg-gradient-to-br from-primary to-primary-light hover:from-primary-light hover:to-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <DocumentChartBarIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Reportes</span>
            <span className="text-sm opacity-90">Generar informes</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('surveyTalentoHumano')}
            className="bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <ClipboardDocumentCheckIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Cuestionario</span>
            <span className="text-sm opacity-90">Talento humano</span>
          </button>
        </div>
      </div>

      
      
      {/* Ejemplo de cómo mostrar datos del backend */}
      {data.length > 0 && (
        <ul className="mt-6 space-y-2">
          {data.map((item) => (
            <li key={item.id} className="text-gray-600 hover:text-primary transition-colors">
              {item.name}
            </li>
          ))}
        </ul>
      )}

      {/* Modal de Alertas */}
      <AlertsModal 
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        vehicles={vehicles}
      />

      {/* Modal de Historial de Mantenimientos */}
      <MaintenanceHistoryModal
        isOpen={isMaintenanceHistoryOpen}
        onClose={() => setIsMaintenanceHistoryOpen(false)}
        maintenances={maintenances}
        vehicles={vehicles}
      />
    </div>
  );
};

export default Home;
