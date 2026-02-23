import { useState, useEffect } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import LoginSurvey from './pages/LoginSurvey'
import VehicleList from './pages/VehicleList'
import Reports from './pages/Reports'
import Users from './pages/Users'
import SurveyTalentoHumano from './pages/SurveyTalentoHumano'
import MaintenanceForm from './components/MaintenanceForm'
import AlertContainer from './components/AlertContainer'
import { useAlert } from './context/AlertContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessType, setAccessType] = useState(null); // 'full' o 'survey_only'
  const [loginMode, setLoginMode] = useState('main'); // 'main' o 'survey'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { success, error, info } = useAlert();

  // Verificar si hay sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const savedAccessType = localStorage.getItem('access_type') || 'full';

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setAccessType(savedAccessType);
        setIsAuthenticated(true);
        
        // Si es acceso solo al cuestionario, ir directo allí
        if (savedAccessType === 'survey_only') {
          setCurrentPage('surveyTalentoHumano');
        }
      } catch (err) {
        console.error('Error al restaurar sesión:', err);
        localStorage.clear();
      }
    }
  }, []);

  // Detectar cambio de ruta para mostrar el login correcto
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/survey-login') {
      setLoginMode('survey');
    } else {
      setLoginMode('main');
    }
  }, []);

  const handleLogin = (user, access = 'full') => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAccessType(access);
    
    // Si es acceso solo al cuestionario, ir directo allí
    if (access === 'survey_only') {
      setCurrentPage('surveyTalentoHumano');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessType(null);
    setCurrentPage('home');
    info('Sesión cerrada correctamente');
  };

  const handleNavigate = (page, vehicleData = null) => {
    // Si es acceso solo al cuestionario, solo permitir página del cuestionario
    if (accessType === 'survey_only' && page !== 'surveyTalentoHumano') {
      error('Solo tienes acceso al cuestionario');
      return;
    }
    
    setCurrentPage(page);
    if (vehicleData) {
      setSelectedVehicle(vehicleData);
    }
  };

  const handleMaintenanceSubmit = (formData) => {
    console.log('Mantenimiento registrado:', formData);
    success('Mantenimiento registrado exitosamente');
    setCurrentPage('vehicles');
    setSelectedVehicle(null);
  };

  // Si no está autenticado, mostrar Login según el modo
  if (!isAuthenticated) {
    return (
      <>
        <AlertContainer />
        {loginMode === 'survey' ? (
          <LoginSurvey onLogin={handleLogin} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </>
    );
  }

  // Si es acceso solo al cuestionario, mostrar solo esa página
  if (accessType === 'survey_only') {
    return (
      <>
        <AlertContainer />
        <div className="min-h-screen bg-gray-50">
          {/* Header simple para cuestionario */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">Cuestionario PESV</h1>
                <p className="text-sm text-white/90">
                  {currentUser?.nombre} - {currentUser?.area}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto py-6 px-4">
            <SurveyTalentoHumano onNavigate={handleNavigate} currentUser={currentUser} />
          </div>
        </div>
      </>
    );
  }

  // Renderizar página según el estado
  const renderPage = () => {
    switch (currentPage) {
      case 'vehicles':
        return <VehicleList onNavigate={handleNavigate} />;
      case 'users':
        return <Users onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} />;
      case 'surveyTalentoHumano':
        return <SurveyTalentoHumano onNavigate={handleNavigate} />;
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
