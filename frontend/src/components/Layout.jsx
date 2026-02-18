// Componente de ejemplo - Layout Principal con Tailwind CSS
import { 
  HomeIcon, 
  BuildingOffice2Icon, 
  DocumentChartBarIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export const Layout = ({ children, onLogout, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-lg border-b-2 border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y Título juntos */}
            <div className="flex items-center gap-4">
              <img 
                src="/src/assets/logo_acueducto_individual.png" 
                alt="Logo Acueducto" 
                className="h-12 w-12 object-contain"
              />
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                Control Vehicular Acueducto
              </h1>
            </div>

            {/* Menú de navegación mejorado con iconos */}
            <nav className="hidden md:flex gap-2">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className={`flex items-center gap-2 font-semibold py-2.5 px-5 rounded-lg transition-all ${
                  currentPage === 'home'
                    ? 'bg-primary text-white shadow-md transform scale-105'
                    : 'text-primary hover:text-white hover:bg-primary-light'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                Inicio
              </button>
              <button
                onClick={() => onNavigate && onNavigate('vehicles')}
                className={`flex items-center gap-2 font-semibold py-2.5 px-5 rounded-lg transition-all ${
                  currentPage === 'vehicles'
                    ? 'bg-primary text-white shadow-md transform scale-105'
                    : 'text-primary hover:text-white hover:bg-primary-light'
                }`}
              >
                <BuildingOffice2Icon className="w-5 h-5" />
                Vehículos
              </button>
              <button
                onClick={() => onNavigate && onNavigate('reports')}
                className={`flex items-center gap-2 font-semibold py-2.5 px-5 rounded-lg transition-all ${
                  currentPage === 'reports'
                    ? 'bg-primary text-white shadow-md transform scale-105'
                    : 'text-primary hover:text-white hover:bg-primary-light'
                }`}
              >
                <DocumentChartBarIcon className="w-5 h-5" />
                Reportes
              </button>
            </nav>
            
            {/* Botón de cerrar sesión */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold py-2 px-4 rounded-lg transition-all"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary">
          <p>&copy; 2026 Control Vehicular Acueducto</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
