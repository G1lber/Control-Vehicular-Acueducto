// AlertContext - Contexto global para gestionar alertas en toda la aplicación
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Agregar una nueva alerta
  const showAlert = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newAlert = { id, message, type, duration };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto-remover después de la duración
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  };

  // Remover una alerta específica
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Métodos de conveniencia
  const success = (message, duration) => showAlert(message, 'success', duration);
  const error = (message, duration) => showAlert(message, 'error', duration);
  const warning = (message, duration) => showAlert(message, 'warning', duration);
  const info = (message, duration) => showAlert(message, 'info', duration);

  const value = {
    alerts,
    showAlert,
    removeAlert,
    success,
    error,
    warning,
    info
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};
