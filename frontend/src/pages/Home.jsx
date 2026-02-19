// Página de ejemplo - Home con Tailwind CSS
import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ChevronRightIcon, 
  Cog6ToothIcon, 
  ExclamationTriangleIcon, 
  PlusIcon, 
  DocumentChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import AlertsModal from '../components/AlertsModal';
import AddVehicleModal from '../components/AddVehicleModal';
import MaintenanceHistoryModal from '../components/MaintenanceHistoryModal';
// import { exampleService } from '../services/example.service';

export const Home = ({ onNavigate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isMaintenanceHistoryOpen, setIsMaintenanceHistoryOpen] = useState(false);

  // Datos de conductores - estos vendrán del backend
  const [drivers] = useState([
    {
      id: 1,
      name: 'Carlos Andrés López',
      cedula: '1234567890',
      phone: '3001234567',
      area: 'Operaciones',
      role: 'Conductor'
    },
    {
      id: 3,
      name: 'José Luis Martínez',
      cedula: '5555555555',
      phone: '3205555555',
      area: 'Operaciones',
      role: 'Conductor'
    },
  ]);

  // Datos de ejemplo de vehículos - estos vendrán del backend
  const [vehicles] = useState([
    {
      id: 1,
      plate: 'ABC-123',
      brand: 'Toyota',
      model: 'Hilux',
      year: 2022,
      color: 'Blanco',
      fuelType: 'Diesel',
      soatExpiry: '2026-06-15',
      techReviewExpiry: '2026-08-20',
      lastMaintenance: '2026-01-10',
      mileage: '45000',
      driverId: 1
    },
    {
      id: 2,
      plate: 'DEF-456',
      brand: 'Chevrolet',
      model: 'D-Max',
      year: 2021,
      color: 'Azul',
      fuelType: 'Diesel',
      soatExpiry: '2026-03-10',
      techReviewExpiry: '2026-02-28',
      lastMaintenance: '2026-01-05',
      mileage: '68000',
      driverId: 3
    },
    {
      id: 3,
      plate: 'GHI-789',
      brand: 'Nissan',
      model: 'Frontier',
      year: 2023,
      color: 'Gris',
      fuelType: 'Gasolina',
      soatExpiry: '2026-01-20',
      techReviewExpiry: '2027-01-15',
      lastMaintenance: '2026-02-01',
      mileage: '32000',
      driverId: 1
    },
  ]);

  // Datos de ejemplo de mantenimientos - estos vendrán del backend
  const [maintenances] = useState([
    {
      id: 1,
      vehicleId: 1,
      maintenanceType: 'oil_change',
      date: '2026-01-10',
      cost: '150000',
      mileage: '45000',
      nextMaintenanceDate: '2026-07-10',
      description: 'Cambio de aceite y filtro de aceite. Se utilizó aceite sintético 5W-30.'
    },
    {
      id: 2,
      vehicleId: 2,
      maintenanceType: 'tire_change',
      date: '2026-01-05',
      cost: '800000',
      mileage: '60000',
      description: 'Cambio completo de llantas. Se instalaron llantas nuevas Michelin LTX Force.'
    },
    {
      id: 3,
      vehicleId: 1,
      maintenanceType: 'filters',
      date: '2025-12-15',
      cost: '120000',
      mileage: '44500',
      description: 'Cambio de filtro de aire y filtro de combustible.'
    },
    {
      id: 4,
      vehicleId: 3,
      maintenanceType: 'brakes',
      date: '2026-02-01',
      cost: '350000',
      mileage: '35000',
      nextMaintenanceDate: '2027-02-01',
      description: 'Cambio de pastillas de freno delanteras y rectificación de discos.'
    },
    {
      id: 5,
      vehicleId: 2,
      maintenanceType: 'brake_fluid',
      date: '2025-11-20',
      cost: '80000',
      mileage: '58000',
      description: 'Cambio de líquido de frenos. Se utilizó líquido DOT 4.'
    },
    {
      id: 6,
      vehicleId: 1,
      maintenanceType: 'engine',
      date: '2025-10-05',
      cost: '450000',
      mileage: '42000',
      nextMaintenanceDate: '2026-10-05',
      description: 'Mantenimiento general del motor. Limpieza de inyectores, cambio de bujías.'
    },
  ]);

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

  const handleAddVehicle = (vehicleData) => {
    console.log('Vehículo agregado:', vehicleData);
    // Aquí se enviará al backend cuando esté disponible
  };

  // Ejemplo de cómo usar los servicios
  useEffect(() => {
    // Descomentar cuando el backend esté disponible
    /*
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await exampleService.getAll();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    */
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
              <p className="text-3xl font-bold text-primary">24</p>
            </div>
            <div className="bg-primary-light/20 p-3 rounded-full">
              <ChartBarIcon className="w-8 h-8 text-primary" />
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
              <p className="text-secondary text-sm font-semibold mb-1">Mantenimientos</p>
              <p className="text-3xl font-bold text-primary-light">{maintenances.length}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => onNavigate && onNavigate('vehicles')}
            className="bg-primary hover:bg-primary-light text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <ChartBarIcon className="w-12 h-12" />
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

          <button
            onClick={() => setIsAddVehicleModalOpen(true)}
            className="bg-primary-light hover:bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <PlusIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Nuevo Vehículo</span>
            <span className="text-sm opacity-90">Registrar vehículo nuevo</span>
          </button>

          <button
            onClick={() => setIsMaintenanceHistoryOpen(true)}
            className="bg-primary-light hover:bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <Cog6ToothIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Mantenimientos</span>
            <span className="text-sm opacity-90">Historial y registros</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('reports')}
            className="bg-gradient-to-br from-primary to-primary-light hover:from-primary-light hover:to-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <DocumentChartBarIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Reportes</span>
            <span className="text-sm opacity-90">Generar informes</span>
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

      {/* Modal de Agregar Vehículo */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onSubmit={handleAddVehicle}
        drivers={drivers}
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
