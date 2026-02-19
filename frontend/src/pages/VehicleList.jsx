// Página VehicleList - Lista de vehículos con grid layout
import { useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import AddVehicleModal from '../components/AddVehicleModal';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const VehicleList = ({ onNavigate }) => {
  // Datos de conductores - estos vendrán del backend
  const [drivers] = useState([
    {
      id: 1,
      name: 'Carlos Andrés López',
      cedula: '1234567890',
      phone: '3001234567',
      area: 'Operaciones',
      role: 'Conductor'
    },
    {
      id: 3,
      name: 'José Luis Martínez',
      cedula: '5555555555',
      phone: '3205555555',
      area: 'Operaciones',
      role: 'Conductor'
    },
  ]);

  // Datos de ejemplo - estos vendrán del backend
  const [vehicles] = useState([
    {
      id: 1,
      plate: 'ABC-123',
      brand: 'Toyota',
      model: 'Hilux',
      year: 2022,
      color: 'Blanco',
      fuelType: 'Diesel',
      soatExpiry: '2026-06-15',
      techReviewExpiry: '2026-08-20',
      lastMaintenance: '2026-01-10',
      mileage: '45000',
      driverId: 1
    },
    {
      id: 2,
      plate: 'DEF-456',
      brand: 'Chevrolet',
      model: 'D-Max',
      year: 2021,
      color: 'Azul',
      fuelType: 'Diesel',
      soatExpiry: '2026-03-10',
      techReviewExpiry: '2026-02-28',
      lastMaintenance: '2026-01-05',
      mileage: '68000',
      driverId: 3
    },
    {
      id: 3,
      plate: 'GHI-789',
      brand: 'Nissan',
      model: 'Frontier',
      year: 2023,
      color: 'Gris',
      fuelType: 'Gasolina',
      soatExpiry: '2026-1-20',
      techReviewExpiry: '2027-01-15',
      lastMaintenance: '2026-02-01',
      mileage: '32000',
      driverId: 1
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fijo en 6 items por página

  // Filtrar vehículos
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aquí puedes agregar más filtros según el estado (SOAT vencido, etc.)
    return matchesSearch;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambia la búsqueda o filtro
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleMaintenanceClick = (vehicle) => {
    // Navegar a la página de mantenimiento con los datos del vehículo
    onNavigate('maintenance', vehicle);
  };

  const handleAddVehicle = (vehicleData) => {
    console.log('Vehículo agregado:', vehicleData);
    // Aquí se enviará al backend cuando esté disponible
  };

  const handleDetailsClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const handleVehicleUpdate = (updatedVehicle) => {
    console.log('Vehículo actualizado:', updatedVehicle);
    // Aquí se enviará al backend cuando esté disponible
    // Por ahora, actualizamos el estado local si fuera necesario
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Vehículos</h1>
          <p className="text-primary-light font-semibold">
            Total de vehículos: {filteredVehicles.length}
          </p>
        </div>
        
        <button 
          onClick={() => setIsAddVehicleModalOpen(true)}
          className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          + Agregar Vehículo
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Buscar por placa, marca o modelo..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="expiring">Por vencer</option>
              <option value="expired">Vencidos</option>
            </select>
          </div>
        </div>

        {/* Información de resultados */}
        {filteredVehicles.length > 0 && (
          <div className="mt-4 text-sm text-secondary">
            Mostrando <span className="font-bold text-primary">{startIndex + 1}</span> - <span className="font-bold text-primary">{Math.min(endIndex, filteredVehicles.length)}</span> de <span className="font-bold text-primary">{filteredVehicles.length}</span> vehículos
          </div>
        )}
      </div>

      {/* Grid de vehículos */}
      {filteredVehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentVehicles.map(vehicle => {
              const driver = drivers.find(d => d.id === vehicle.driverId);
              return (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle}
                  driver={driver}
                  onMaintenanceClick={handleMaintenanceClick}
                  onDetailsClick={handleDetailsClick}
                />
              );
            })}
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
          <p className="text-secondary text-lg">
            No se encontraron vehículos que coincidan con tu búsqueda.
          </p>
        </div>
      )}

      {/* Modal de Agregar Vehículo */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onSubmit={handleAddVehicle}
        drivers={drivers}
      />

      {/* Modal de Detalles del Vehículo */}
      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={selectedVehicle}
        onUpdate={handleVehicleUpdate}
        drivers={drivers}
      />
    </div>
  );
};

export default VehicleList;
