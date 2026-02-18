// Componente de ejemplo - Layout Principal con Tailwind CSS
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

            {/* Menú de navegación */}
            <nav className="hidden md:flex gap-4">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className={`font-semibold py-2 px-4 rounded-lg transition-all ${
                  currentPage === 'home'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-primary hover:text-primary-light hover:bg-primary/5'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => onNavigate && onNavigate('vehicles')}
                className={`font-semibold py-2 px-4 rounded-lg transition-all ${
                  currentPage === 'vehicles'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-primary hover:text-primary-light hover:bg-primary/5'
                }`}
              >
                Vehículos
              </button>
            </nav>
            
            {/* Botón de cerrar sesión */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold py-2 px-4 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
