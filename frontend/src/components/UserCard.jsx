// Componente UserCard - Tarjeta de información de usuario
import { 
  UserIcon, 
  IdentificationIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  ShieldCheckIcon,
  TruckIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const UserCard = ({ user }) => {
  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case 'Conductor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Supervisor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el icono del rol
  const getRoleIcon = (role) => {
    switch (role) {
      case 'Supervisor':
        return <BriefcaseIcon className="w-8 h-8 text-white" />;
      case 'Conductor':
        return <TruckIcon className="w-8 h-8 text-white" />;
      default:
        return <UserIcon className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header con rol */}
      <div className="bg-gradient-to-r from-primary to-primary-light p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{user.name}</h3>
              <p className="text-white/90 text-sm">{user.area}</p>
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            {getRoleIcon(user.role)}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Rol/Cargo */}
        <div className="flex items-center justify-center mb-2">
          <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${getRoleColor(user.role)}`}>
            <ShieldCheckIcon className="w-4 h-4" />
            {user.role}
          </span>
        </div>

        {/* Cédula */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <IdentificationIcon className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-secondary font-semibold">Cédula</p>
            <p className="text-sm font-bold text-primary">{user.cedula}</p>
          </div>
        </div>

        {/* Celular */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <PhoneIcon className="w-5 h-5 text-primary-light" />
          <div className="flex-1">
            <p className="text-xs text-secondary font-semibold">Celular</p>
            <p className="text-sm font-bold text-primary">{user.phone}</p>
          </div>
        </div>

        {/* Área */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <BuildingOfficeIcon className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-secondary font-semibold">Área</p>
            <p className="text-sm font-bold text-primary">{user.area}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-3">
          <button className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
            Ver Detalles
          </button>
          <button className="flex-1 bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold py-2 px-4 rounded transition-colors text-sm">
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
