// AlertContainer - Contenedor para mostrar alertas en la UI
import { useAlert } from '../context/AlertContext';
import Alert from './Alert';

const AlertContainer = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md w-full">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
          duration={alert.duration}
        />
      ))}
    </div>
  );
};

export default AlertContainer;
