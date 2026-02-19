// Página Users - Gestión de usuarios (Conductores y Supervisores)
import { useState } from 'react';
import UserCard from '../components/UserCard';
import AddUserModal from '../components/AddUserModal';
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
  // Datos de ejemplo - estos vendrán del backend
  const [users] = useState([
    {
      id: 1,
      name: 'Carlos Andrés López',
      cedula: '1234567890',
      phone: '3001234567',
      area: 'Operaciones',
      role: 'Conductor',
      createdAt: '2026-01-15'
    },
    {
      id: 2,
      name: 'María Fernanda García',
      cedula: '9876543210',
      phone: '3109876543',
      area: 'Mantenimiento',
      role: 'Supervisor',
      createdAt: '2026-01-20'
    },
    {
      id: 3,
      name: 'José Luis Martínez',
      cedula: '5555555555',
      phone: '3205555555',
      area: 'Operaciones',
      role: 'Conductor',
      createdAt: '2026-02-01'
    },
    {
      id: 4,
      name: 'Ana Patricia Rodríguez',
      cedula: '7777777777',
      phone: '3157777777',
      area: 'Administración',
      role: 'Supervisor',
      createdAt: '2026-02-05'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fijo en 6 items por página

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

  // Contar usuarios por rol
  const conductoresCount = users.filter(u => u.role === 'Conductor').length;
  const supervisoresCount = users.filter(u => u.role === 'Supervisor').length;

  const handleAddUser = (userData) => {
    console.log('Usuario agregado:', userData);
    // Aquí se enviará al backend cuando esté disponible
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
              <UserCard key={user.id} user={user} />
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

      {/* Modal de Agregar Usuario */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users;
