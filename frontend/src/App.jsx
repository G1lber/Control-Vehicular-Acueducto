import { useState, useEffect } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import LoginSurvey from './pages/LoginSurvey'
import VehicleList from './pages/VehicleList'
import VehicleHistory from './pages/VehicleHistory'
import Reports from './pages/Reports'
import Users from './pages/Users'
import SurveyTalentoHumano from './pages/SurveyTalentoHumano'
import MaintenanceForm from './components/MaintenanceForm'
import AlertContainer from './components/AlertContainer'
import { useAlert } from './context/AlertContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessType, setAccessType] = useState(null); // 'full' o 'survey_only'
  const [loginMode, setLoginMode] = useState('main'); // 'main' o 'survey'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { success, error, info } = useAlert();

  const syncBrowserHistory = (page, vehicleData = null, replace = false) => {
    const historyState = {
      currentPage: page,
      selectedVehicle: vehicleData || null
    };

    if (replace) {
      window.history.replaceState(historyState, '', window.location.pathname);
    } else {
      window.history.pushState(historyState, '', window.location.pathname);
    }
  };

  const applyHistoryState = (state) => {
    if (!state) return;
    if (state.currentPage) setCurrentPage(state.currentPage);
    setSelectedVehicle(state.selectedVehicle || null);
  };

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
          syncBrowserHistory('surveyTalentoHumano', null, true);
        } else {
          syncBrowserHistory('home', null, true);
        }
      } catch (err) {
        console.error('Error al restaurar sesión:', err);
        localStorage.clear();
      }
    }
    
    // Marcar que ya se verificó la autenticación
    setIsCheckingAuth(false);
  }, []);

  // Mantener la navegación interna dentro del historial del navegador
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;

      if (!state) {
        return;
      }

      applyHistoryState(state);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Escuchar evento de sesión expirada
  useEffect(() => {
    const handleAuthExpired = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAccessType(null);
      setCurrentPage('home');
      error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, [error]);

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
      syncBrowserHistory('surveyTalentoHumano', null, true);
    } else {
      setCurrentPage('home');
      syncBrowserHistory('home', null, true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAccessType(null);
    setCurrentPage('home');
    setSelectedVehicle(null);
    window.history.replaceState({ currentPage: 'home', selectedVehicle: null }, '', window.location.pathname);
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
    } else {
      setSelectedVehicle(null);
    }

    syncBrowserHistory(page, vehicleData, false);
  };

  const handleMaintenanceSubmit = (formData) => {
    console.log('Mantenimiento registrado:', formData);
    success('Mantenimiento registrado exitosamente');
    setCurrentPage('vehicles');
    setSelectedVehicle(null);
  };

  // Mostrar loader mientras se verifica la autenticación
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-4 md:px-6 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div>
                <h1 className="text-lg md:text-xl font-bold">Cuestionario PESV</h1>
                <p className="text-xs md:text-sm text-white/90">
                  {currentUser?.nombre} - {currentUser?.area}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto py-6 px-4">
            <SurveyTalentoHumano 
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              currentUser={currentUser}
              accessType={accessType}
            />
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
      case 'vehicleHistory':
        return (
          <VehicleHistory
            vehicle={selectedVehicle}
            onNavigate={handleNavigate}
          />
        );
      case 'users':
        return <Users onNavigate={handleNavigate} currentUser={currentUser} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} />;
      case 'surveyTalentoHumano':
        return <SurveyTalentoHumano 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          currentUser={currentUser}
          accessType={accessType}
        />;
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
