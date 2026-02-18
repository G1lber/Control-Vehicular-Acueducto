// Página de ejemplo - Home con Tailwind CSS
import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ChevronRightIcon, 
  Cog6ToothIcon, 
  ExclamationTriangleIcon, 
  PlusIcon, 
  DocumentChartBarIcon 
} from '@heroicons/react/24/outline';
// import { exampleService } from '../services/example.service';

export const Home = ({ onNavigate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Mantenimientos</p>
              <p className="text-3xl font-bold text-primary-light">48</p>
            </div>
            <div className="bg-primary-light/20 p-3 rounded-full">
              <Cog6ToothIcon className="w-8 h-8 text-primary-light" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Alertas</p>
              <p className="text-3xl font-bold text-yellow-600">5</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Menú de acceso rápido */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-primary mb-4">Acceso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate && onNavigate('vehicles')}
            className="bg-primary hover:bg-primary-light text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <ChartBarIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Ver Vehículos</span>
            <span className="text-sm opacity-90">Gestionar flota vehicular</span>
          </button>

          <button
            className="bg-primary-light hover:bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <PlusIcon className="w-12 h-12" />
            <span className="font-bold text-lg">Nuevo Vehículo</span>
            <span className="text-sm opacity-90">Registrar vehículo nuevo</span>
          </button>

          <button
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

      {/* Componentes de ejemplo disponibles */}
      <div className="bg-primary-light/10 border-2 border-primary-light rounded-lg p-6">
        <h3 className="text-xl font-bold text-primary mb-4">
          🎨 Componentes Disponibles
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ <span className="font-semibold text-primary">VehicleCard</span> - Tarjeta de vehículo con SOAT y revisión TM</li>
          <li>✅ <span className="font-semibold text-primary">MaintenanceForm</span> - Formulario de registro de mantenimientos</li>
          <li>✅ <span className="font-semibold text-primary">VehicleList</span> - Lista de vehículos con búsqueda y filtros</li>
          <li>✅ <span className="font-semibold text-primary">Reports</span> - Generación de reportes del sistema</li>
          <li>✅ <span className="font-semibold text-primary">Login</span> - Página de inicio de sesión</li>
          <li>✅ <span className="font-semibold text-primary">Layout</span> - Layout principal con header y footer</li>
        </ul>
        <p className="text-primary-light font-semibold mt-4">
          Revisa la carpeta <code className="bg-white px-2 py-1 rounded">src/components/</code> y <code className="bg-white px-2 py-1 rounded">src/pages/</code>
        </p>
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
    </div>
  );
};

export default Home;
