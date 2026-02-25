// Página Users - Gestión de usuarios (Conductores y Supervisores)
import { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import AddUserModal from '../components/AddUserModal';
import UserDetailsModal from '../components/UserDetailsModal';
import userService from '../services/user.service';
import { useAlert } from '../context/AlertContext';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  UserPlusIcon,
  UsersIcon,
  TruckIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Users = () => {
  // Estados para datos del backend
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [surveyData, setSurveyData] = useState({});
  const { success, error } = useAlert();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fijo en 6 items por página

  // ==========================================
  // CARGAR DATOS DEL BACKEND
  // ==========================================

  useEffect(() => {
    // Solo cargar datos si hay token
    const token = localStorage.getItem('token');
    if (token) {
      loadUsers();
      loadStats();
    } else {
      setLoading(false);
      setErrorState('No hay sesión activa. Por favor inicia sesión.');
    }
  }, []);

  // Cargar usuarios desde el backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      setErrorState(null);
      const response = await userService.getAllUsers();
      
      if (response.success) {
        // Mapear los datos del backend al formato del frontend
        const mappedUsers = response.data.map(user => ({
          id: user.cedula,  // Backend retorna 'cedula'
          name: user.name,  // Backend ya retorna 'name'
          cedula: user.cedula,
          phone: user.phone || 'No registrado',  // Backend retorna 'phone'
          area: user.area || 'No asignada',
          role: user.role,  // Backend ya retorna 'role' (nombre del rol)
          createdAt: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A'
        }));
        setUsers(mappedUsers);
      } else {
        setErrorState('Error al cargar usuarios');
        error('Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setErrorState('No se pudieron cargar los usuarios');
      error('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas desde el backend
  const loadStats = async () => {
    try {
      const response = await userService.getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Cargar cuestionario de un usuario específico
  const loadUserSurvey = async (cedula) => {
    try {
      const survey = await userService.getUserSurvey(cedula);
      setSurveyData(prev => ({
        ...prev,
        [cedula]: survey || null
      }));
      return survey || null;
    } catch (error) {
      console.error(`Error al cargar cuestionario del usuario ${cedula}:`, error);
      return null;
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cedula.includes(searchTerm) ||
      user.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambia la búsqueda o filtro
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterRole(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Contar usuarios por rol (desde datos locales o stats del backend)
  const conductoresCount = stats?.Conductor || users.filter(u => u.role === 'Conductor').length;
  const supervisoresCount = stats?.Supervisor || users.filter(u => u.role === 'Supervisor').length;

  // Manejar creación de usuario
  const handleAddUser = async (userData) => {
    try {
      // Mapear el formato del frontend al formato del backend
      const userPayload = {
        cedula: userData.cedula,
        nombre: userData.name,
        id_rol: userData.role === 'Conductor' ? 1 : (userData.role === 'Supervisor' ? 2 : 3),
        area: userData.area || null,
        celular: userData.phone || null
      };

      // Solo incluir password si existe (Supervisores/Administradores)
      if (userData.password) {
        userPayload.password = userData.password;
      }

      const response = await userService.createUser(userPayload);
      
      if (response.success) {
        success('Usuario creado exitosamente');
        // Recargar la lista de usuarios
        await loadUsers();
        await loadStats();
        setIsAddUserModalOpen(false);
      } else {
        error(response.message || 'Error al crear usuario');
      }
    } catch (err) {
      console.error('Error al crear usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear usuario';
      error(errorMessage);
    }
  };

  // Manejar vista de detalles del usuario
  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    
    // Cargar el cuestionario si no está en caché ANTES de abrir el modal
    if (!surveyData[user.cedula]) {
      const loadedSurvey = await loadUserSurvey(user.cedula);
      // Actualizar surveyData inmediatamente con el resultado
      setSurveyData(prev => ({
        ...prev,
        [user.cedula]: loadedSurvey
      }));
    }
    
    // Pequeño delay para asegurar que el estado se haya actualizado
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Abrir el modal después de cargar los datos
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Usuarios</h1>
          <p className="text-primary-light font-semibold">
            Gestión de Conductores y Supervisores
          </p>
        </div>
        
        <button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-secondary text-lg font-semibold">Cargando usuarios...</p>
        </div>
      )}

      {/* Error State */}
      {errorState && !loading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-bold">Error al cargar datos</p>
          </div>
          <p className="text-red-600 mb-4">{errorState}</p>
          <button
            onClick={() => {
              loadUsers();
              loadStats();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !errorState && (
        <>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-primary/20 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-semibold mb-1">Total Usuarios</p>
              <p className="text-4xl font-bold text-primary">{users.length}</p>
            </div>
            <UsersIcon className="w-16 h-16 text-primary" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-semibold mb-1">Conductores</p>
              <p className="text-4xl font-bold text-blue-800">{conductoresCount}</p>
            </div>
            <TruckIcon className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-semibold mb-1">Supervisores</p>
              <p className="text-4xl font-bold text-green-800">{supervisoresCount}</p>
            </div>
            <BriefcaseIcon className="w-16 h-16 text-green-600" />
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o área..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Filtro por rol */}
          <div>
            <div className="relative">
              <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filterRole}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors appearance-none"
              >
                <option value="all">Todos los roles</option>
                <option value="Conductor">Conductores</option>
                <option value="Supervisor">Supervisores</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados de búsqueda */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 text-sm text-secondary">
            Mostrando <span className="font-bold text-primary">{startIndex + 1}</span> - <span className="font-bold text-primary">{Math.min(endIndex, filteredUsers.length)}</span> de <span className="font-bold text-primary">{filteredUsers.length}</span> usuarios
          </div>
        )}
      </div>

      {/* Grid de usuarios */}
      {filteredUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentUsers.map(user => (
              <UserCard 
                key={user.id} 
                user={user}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Botón anterior */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-light'
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  Anterior
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Mostrar solo páginas cercanas a la actual
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-primary hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="text-gray-400 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Botón siguiente */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-light'
                  }`}
                >
                  Siguiente
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MagnifyingGlassIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <p className="text-secondary text-lg font-semibold">
            No se encontraron usuarios que coincidan con tu búsqueda.
          </p>
          {(searchTerm || filterRole !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setCurrentPage(1);
              }}
              className="mt-4 text-primary hover:text-primary-light font-semibold underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
        </>
      )}

      {/* Modal de Agregar Usuario */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* Modal de Detalles del Usuario */}
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        surveyData={selectedUser ? surveyData[selectedUser.cedula] : null}
        onUpdate={async () => {
          // Recargar datos después de actualizar
          await loadUsers();
          await loadStats();
          // Recargar encuesta del usuario específico
          if (selectedUser) {
            await loadUserSurvey(selectedUser.cedula);
          }
        }}
      />
    </div>
  );
};

export default Users;
