// Página VehicleList - Lista de vehículos con grid layout
import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import AddVehicleModal from '../components/AddVehicleModal';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import vehicleService from '../services/vehicle.service';
import userService from '../services/user.service';
import maintenanceService from '../services/maintenance.service';
import { useAlert } from '../context/AlertContext';

const VehicleList = ({ onNavigate }) => {
  const { success, error } = useAlert();
  
  // Estados
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fijo en 6 items por página

  // Cargar datos al montar el componente
  useEffect(() => {
    loadVehicles();
    loadDrivers();
  }, []);

  // Cargar vehículos del backend
  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAllVehicles();
      
      if (response.success) {
        // Mapear los datos del backend al formato del frontend
        const mappedVehicles = response.data.map(v => ({
          id: v.id_placa,
          plate: v.id_placa,
          brand: v.marca || 'N/A',
          model: v.modelo || 'N/A',
          year: v.anio || '',
          color: v.color || 'N/A',
          fuelType: v.tipo_combustible || '',
          soatExpiry: v.soat || null,
          techReviewExpiry: v.tecno || null,
          lastMaintenance: v.ultimo_mantenimiento || null,
          mileage: v.kilometraje_actual || '0',
          driverId: v.id_usuario || null,
          soatDocumento: v.soat_documento || null,
          tecnoDocumento: v.tecno_documento || null
        }));
        
        // Cargar el último mantenimiento de cada vehículo en paralelo
        const vehiclesWithMaintenance = await Promise.all(
          mappedVehicles.map(async (vehicle) => {
            try {
              const maintenanceResponse = await maintenanceService.getLastMaintenanceByVehicle(vehicle.plate);
              if (maintenanceResponse.success && maintenanceResponse.data) {
                return {
                  ...vehicle,
                  lastMaintenance: maintenanceResponse.data.fechaRealizado || maintenanceResponse.data.fecha_realizado
                };
              }
            } catch (err) {
              console.log(`No hay mantenimientos para ${vehicle.plate}`);
            }
            return vehicle;
          })
        );
        
        console.log('Vehículos con último mantenimiento:', vehiclesWithMaintenance);
        setVehicles(vehiclesWithMaintenance);
      }
    } catch (err) {
      console.error('Error al cargar vehículos:', err);
      error('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar conductores del backend
  const loadDrivers = async () => {
    try {
      const response = await userService.getUsersByRole('conductor'); // Rol como texto
      
      if (response.success) {
        // Mapear los datos del backend al formato del frontend
        const mappedDrivers = response.data.map(u => ({
          id: u.cedula,
          cedula: u.cedula,
          name: u.name,
          phone: u.phone || '',
          area: u.area || '',
          role: u.role
        }));
        
        console.log('Conductores cargados:', mappedDrivers); // Debug
        setDrivers(mappedDrivers);
      }
    } catch (err) {
      console.error('Error al cargar conductores:', err);
      // No mostramos error porque no es crítico
    }
  };

  // Filtrar vehículos
  const filteredVehicles = vehicles.filter(vehicle => {
    // Normalizar placas removiendo guiones para búsqueda flexible (ABC123 o ABC-123)
    const normalizedPlate = vehicle.plate.toLowerCase().replace(/-/g, '');
    const normalizedSearch = searchTerm.toLowerCase().replace(/-/g, '');
    
    const matchesSearch = normalizedPlate.includes(normalizedSearch) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambia la búsqueda
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleMaintenanceClick = (vehicle) => {
    // Navegar a la página de mantenimiento con los datos del vehículo
    onNavigate('maintenance', vehicle);
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      console.log('🆕 Datos recibidos del formulario:', vehicleData);
      
      // Validar que la placa exista
      if (!vehicleData.plate || vehicleData.plate.trim() === '') {
        error('La placa del vehículo es obligatoria');
        return;
      }
      
      // Función helper para limpiar valores vacíos
      const cleanValue = (value) => {
        if (value === null || value === undefined || value === '') return null;
        return value;
      };
      
      // Función para convertir fechas a formato YYYY-MM-DD
      const formatDateForBackend = (dateValue) => {
        if (!dateValue) return null;
        
        // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return dateValue;
        }
        
        // Si es un objeto Date o una fecha ISO, convertir a YYYY-MM-DD en UTC
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) return null;
          
          // Usar UTC para evitar problemas de zona horaria
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const day = String(date.getUTCDate()).padStart(2, '0');
          
          return `${year}-${month}-${day}`;
        } catch (e) {
          return null;
        }
      };
      
      // Convertir placa a mayúsculas
      const plateUpperCase = vehicleData.plate.trim().toUpperCase();
      
      // Mapear el formato del frontend al formato del backend
      const vehiclePayload = {
        placa: plateUpperCase,     // Para el validador
        id_placa: plateUpperCase,  // Para el use case (backend inconsistencia)
        marca: cleanValue(vehicleData.brand),
        modelo: cleanValue(vehicleData.model),
        anio: vehicleData.year ? parseInt(vehicleData.year) : null,
        color: cleanValue(vehicleData.color),
        tipo_combustible: cleanValue(vehicleData.fuelType),
        soat: formatDateForBackend(vehicleData.soatExpiry),
        tecno: formatDateForBackend(vehicleData.techReviewExpiry),
        kilometraje_actual: vehicleData.mileage ? parseInt(vehicleData.mileage) : null,
        id_usuario: vehicleData.driverId ? String(vehicleData.driverId) : null
      };

      // Remover campos que sean null (excepto placa e id_placa que son requeridos)
      Object.keys(vehiclePayload).forEach(key => {
        if (key !== 'placa' && key !== 'id_placa' && vehiclePayload[key] === null) {
          delete vehiclePayload[key];
        }
      });

      console.log('📤 Payload limpio para crear:', vehiclePayload);

      const response = await vehicleService.createVehicle(vehiclePayload);
      
      if (response.success) {
        success('Vehículo creado exitosamente');
        await loadVehicles();
        setIsAddVehicleModalOpen(false);
      } else {
        error(response.message || 'Error al crear vehículo');
      }
    } catch (err) {
      console.error('Error al crear vehículo:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear el vehículo';
      error(errorMessage);
    }
  };

  const handleDetailsClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const handleVehicleUpdate = async (updatedVehicle) => {
    try {
      console.log('🔍 Vehículo recibido para actualizar:', updatedVehicle);
      
      // Función helper para limpiar valores vacíos
      const cleanValue = (value) => {
        if (value === null || value === undefined || value === '') return null;
        return value;
      };
      
      // Función para convertir fechas a formato YYYY-MM-DD
      const formatDateForBackend = (dateValue) => {
        if (!dateValue) return null;
        
        // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return dateValue;
        }
        
        // Si es un objeto Date o una fecha ISO, convertir a YYYY-MM-DD en UTC
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) return null;
          
          // Usar UTC para evitar problemas de zona horaria
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const day = String(date.getUTCDate()).padStart(2, '0');
          
          return `${year}-${month}-${day}`;
        } catch (e) {
          return null;
        }
      };
      
      // Mapear el formato del frontend al formato del backend
      const vehiclePayload = {
        marca: cleanValue(updatedVehicle.brand),
        modelo: cleanValue(updatedVehicle.model),
        anio: updatedVehicle.year ? parseInt(updatedVehicle.year) : null,
        color: cleanValue(updatedVehicle.color),
        tipo_combustible: cleanValue(updatedVehicle.fuelType),
        soat: formatDateForBackend(updatedVehicle.soatExpiry),
        tecno: formatDateForBackend(updatedVehicle.techReviewExpiry),
        kilometraje_actual: updatedVehicle.mileage ? parseInt(updatedVehicle.mileage) : null,
        id_usuario: updatedVehicle.driverId ? String(updatedVehicle.driverId) : null
      };

      // Remover campos que sean null para que el backend no los valide
      Object.keys(vehiclePayload).forEach(key => {
        if (vehiclePayload[key] === null) {
          delete vehiclePayload[key];
        }
      });

      console.log('📤 Payload limpio enviado al backend:', vehiclePayload);

      const response = await vehicleService.updateVehicle(updatedVehicle.plate, vehiclePayload);
      
      if (response.success) {
        success('Vehículo actualizado exitosamente');
        
        // Recargar todos los vehículos usando la función optimizada
        await loadVehicles();
        
        // Buscar el vehículo actualizado en la lista recién cargada
        // Esperamos un pequeño momento para que se complete la primera carga
        setTimeout(() => {
          setVehicles(prevVehicles => {
            const updatedFromBackend = prevVehicles.find(v => v.plate === updatedVehicle.plate);
            if (updatedFromBackend) {
              setSelectedVehicle(updatedFromBackend);
            }
            return prevVehicles;
          });
        }, 100);
      } else {
        error(response.message || 'Error al actualizar vehículo');
      }
    } catch (err) {
      console.error('Error al actualizar vehículo:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar el vehículo';
      error(errorMessage);
    }
  };

  // Manejar eliminación de vehículo
  const handleVehicleDelete = async (placa) => {
    try {
      // El servicio ya maneja la eliminación, aquí solo actualizamos la lista
      await loadVehicles();
      
      // Cerrar el modal si estaba abierto
      setIsDetailsModalOpen(false);
      setSelectedVehicle(null);
    } catch (err) {
      console.error('Error al eliminar vehículo:', err);
    }
  };

  return (
    <div className="py-8">
      {/* Botón Volver - visible especialmente en móvil */}
      <button
        onClick={() => onNavigate('home')}
        className="mb-4 flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Volver
      </button>

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

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
        />

        {/* Información de resultados */}
        {filteredVehicles.length > 0 && (
          <div className="mt-4 text-sm text-secondary">
            Mostrando <span className="font-bold text-primary">{startIndex + 1}</span> - <span className="font-bold text-primary">{Math.min(endIndex, filteredVehicles.length)}</span> de <span className="font-bold text-primary">{filteredVehicles.length}</span> vehículos
          </div>
        )}
      </div>

      {/* Grid de vehículos */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      ) : filteredVehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentVehicles.map(vehicle => {
              const driver = drivers.find(d => String(d.id) === String(vehicle.driverId));
              console.log(`Vehículo ${vehicle.plate} - driverId: ${vehicle.driverId}, driver encontrado:`, driver); // Debug
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
        onDelete={handleVehicleDelete}
        drivers={drivers}
      />
    </div>
  );
};

export default VehicleList;
