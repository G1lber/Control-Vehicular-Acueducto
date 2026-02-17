import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Si no está autenticado, mostrar Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está autenticado, mostrar el Layout con Home
  return (
    <Layout onLogout={handleLogout}>
      <Home />
    </Layout>
  );
}

export default App
