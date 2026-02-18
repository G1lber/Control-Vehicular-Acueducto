import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import VehicleList from './pages/VehicleList'
import Reports from './pages/Reports'
import MaintenanceForm from './components/MaintenanceForm'
import AlertContainer from './components/AlertContainer'
import { useAlert } from './context/AlertContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { success, error, info } = useAlert();

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
    success('Bienvenido al Sistema de Control Vehicular');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
    info('Sesión cerrada correctamente');
  };

  const handleNavigate = (page, vehicleData = null) => {
    setCurrentPage(page);
    if (vehicleData) {
      setSelectedVehicle(vehicleData);
    }
  };

  const handleMaintenanceSubmit = (formData) => {
    console.log('Mantenimiento registrado:', formData);
    success('Mantenimiento registrado exitosamente');
    // Volver a la lista de vehículos
    setCurrentPage('vehicles');
    setSelectedVehicle(null);
  };

  // Si no está autenticado, mostrar Login
  if (!isAuthenticated) {
    return (
      <>
        <AlertContainer />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Renderizar página según el estado
  const renderPage = () => {
    switch (currentPage) {
      case 'vehicles':
        return <VehicleList onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} />;
      case 'maintenance':
        return (
          <div className="py-8">
            <button
              onClick={() => handleNavigate('vehicles')}
              className="mb-6 text-primary hover:text-primary-light font-semibold flex items-center gap-2 transition-colors"
            >
              ← Volver a Vehículos
            </button>
            {selectedVehicle && (
              <div className="mb-6 bg-primary/10 border-l-4 border-primary rounded-lg p-4">
                <h3 className="text-lg font-bold text-primary">
                  Mantenimiento para: {selectedVehicle.plate}
                </h3>
                <p className="text-primary-light font-semibold">
                  {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                </p>
              </div>
            )}
            <MaintenanceForm
              vehicleId={selectedVehicle?.id}
              onSubmit={handleMaintenanceSubmit}
              onCancel={() => handleNavigate('vehicles')}
            />
          </div>
        );
      case 'home':
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  // Si está autenticado, mostrar el Layout con la página actual
  return (
    <>
      <AlertContainer />
      <Layout onLogout={handleLogout} onNavigate={handleNavigate} currentPage={currentPage}>
        {renderPage()}
      </Layout>
    </>
  );
}

export default App
