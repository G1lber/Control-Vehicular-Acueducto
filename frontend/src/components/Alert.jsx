// Componente Alert - Alertas reutilizables con diseño personalizado
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Alert = ({ type = 'info', message, onClose, autoClose = true, duration = 5000 }) => {
  // Auto-cerrar después de la duración especificada
  if (autoClose && onClose) {
    setTimeout(() => {
      onClose();
    }, duration);
  }

  const alertStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: XCircleIcon,
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-primary',
      text: 'text-primary',
      icon: InformationCircleIcon,
      iconColor: 'text-primary'
    }
  };

  const style = alertStyles[type] || alertStyles.info;
  const IconComponent = style.icon;

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded-lg shadow-md mb-4 animate-slide-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`h-6 w-6 ${style.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-semibold ${style.text}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${style.text} hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.border} transition-colors`}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
