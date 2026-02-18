import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import VehicleList from './pages/VehicleList'
import Reports from './pages/Reports'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Si no está autenticado, mostrar Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Renderizar página según el estado
  const renderPage = () => {
    switch (currentPage) {
      case 'vehicles':
        return <VehicleList onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  // Si está autenticado, mostrar el Layout con la página actual
  return (
    <Layout onLogout={handleLogout} onNavigate={handleNavigate} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App
