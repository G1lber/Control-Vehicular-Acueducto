// Componente de ejemplo - Layout Principal con Tailwind CSS
export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">Control Vehicular Acueducto</h1>
          <nav className="mt-2">
            {/* Aquí irá el menú de navegación */}
          </nav>
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
