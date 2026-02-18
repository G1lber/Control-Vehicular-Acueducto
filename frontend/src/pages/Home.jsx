// Página de ejemplo - Home con Tailwind CSS
import { useState, useEffect } from 'react';
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
      
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <p className="text-gray-700 leading-relaxed mb-4">
          Este es un proyecto de maquetado con React y Tailwind CSS.
        </p>
        <p className="text-primary-light font-semibold leading-relaxed">
          Aquí puedes empezar a crear tus componentes y páginas para gestionar vehículos,
          mantenimientos, SOAT y revisiones técnico-mecánicas.
        </p>
      </div>

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
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-primary-light text-sm font-semibold mt-3 flex items-center gap-1">
            Ver lista completa
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </p>
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Mantenimientos</p>
              <p className="text-3xl font-bold text-primary-light">48</p>
            </div>
            <div className="bg-primary-light/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
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
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-bold text-lg">Ver Vehículos</span>
            <span className="text-sm opacity-90">Gestionar flota vehicular</span>
          </button>

          <button
            className="bg-primary-light hover:bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-bold text-lg">Nuevo Vehículo</span>
            <span className="text-sm opacity-90">Registrar vehículo nuevo</span>
          </button>

          <button
            className="bg-primary-light hover:bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-bold text-lg">Mantenimientos</span>
            <span className="text-sm opacity-90">Historial y registros</span>
          </button>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-bold text-lg">Alertas</span>
            <span className="text-sm opacity-90">SOAT y revisiones</span>
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
