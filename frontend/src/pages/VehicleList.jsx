// Página VehicleList - Lista de vehículos con grid layout
import { useState } from 'react';
import VehicleCard from '../components/VehicleCard';

const VehicleList = ({ onNavigate }) => {
  // Datos de ejemplo - estos vendrán del backend
  const [vehicles] = useState([
    {
      id: 1,
      plate: 'ABC-123',
      brand: 'Toyota',
      model: 'Hilux',
      year: 2022,
      soatExpiry: '2026-06-15',
      techReviewExpiry: '2026-08-20',
      lastMaintenance: '2026-01-10'
    },
    {
      id: 2,
      plate: 'DEF-456',
      brand: 'Chevrolet',
      model: 'D-Max',
      year: 2021,
      soatExpiry: '2026-03-10',
      techReviewExpiry: '2026-02-28',
      lastMaintenance: '2026-01-05'
    },
    {
      id: 3,
      plate: 'GHI-789',
      brand: 'Nissan',
      model: 'Frontier',
      year: 2023,
      soatExpiry: '2026-12-20',
      techReviewExpiry: '2027-01-15',
      lastMaintenance: '2026-02-01'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filtrar vehículos
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aquí puedes agregar más filtros según el estado (SOAT vencido, etc.)
    return matchesSearch;
  });

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
        
        <button className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="expiring">Por vencer</option>
              <option value="expired">Vencidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de vehículos */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-secondary text-lg">
            No se encontraron vehículos que coincidan con tu búsqueda.
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
