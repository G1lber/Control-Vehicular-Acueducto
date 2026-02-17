// Componente de ejemplo - Layout Principal con Tailwind CSS
export const Layout = ({ children, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Control Vehicular Acueducto</h1>
              <nav className="mt-2">
                {/* Aquí irá el menú de navegación */}
              </nav>
            </div>
            
            {/* Botón de cerrar sesión */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
