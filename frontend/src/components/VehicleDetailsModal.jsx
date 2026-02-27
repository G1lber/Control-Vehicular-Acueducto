// Componente VehicleDetailsModal - Modal para ver y actualizar detalles del vehículo
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAlert } from '../context/AlertContext';
import {
  TruckIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  UserIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import vehicleService from '../services/vehicle.service';

const VehicleDetailsModal = ({ isOpen, onClose, vehicle, onUpdate, onDelete, drivers = [] }) => {
  const { success, error } = useAlert();
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    soatExpiry: '',
    techReviewExpiry: '',
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    mileage: '',
    lastMaintenance: '',
    driverId: ''
  });

  // Función helper para convertir fechas al formato YYYY-MM-DD para inputs
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  // Inicializar el formulario cuando el vehículo cambie
  useEffect(() => {
    if (vehicle) {
      console.log('VehicleDetailsModal - Vehículo:', vehicle); // Debug
      console.log('VehicleDetailsModal - Conductores:', drivers); // Debug
      console.log('VehicleDetailsModal - driverId del vehículo:', vehicle.driverId); // Debug
      
      setFormData({
        soatExpiry: formatDateForInput(vehicle.soatExpiry),
        techReviewExpiry: formatDateForInput(vehicle.techReviewExpiry),
        plate: vehicle.plate || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        color: vehicle.color || '',
        fuelType: vehicle.fuelType || '',
        mileage: vehicle.mileage || '',
        lastMaintenance: vehicle.lastMaintenance || '',
        driverId: vehicle.driverId || ''
      });
    }
    setIsEditingDates(false);
    setIsEditingInfo(false);
  }, [vehicle, drivers]);

  if (!vehicle) return null;

  // Función para verificar si una fecha está próxima a vencer (30 días)
  const isExpiringSoon = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  // Función para verificar si una fecha ya expiró
  const isExpired = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
  };

  // Obtener días restantes
  const getDaysRemaining = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const daysRemaining = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const getStatusBadge = (dateString) => {
    if (isExpired(dateString)) {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <XCircleIcon className="w-4 h-4" />
          Vencido
        </span>
      );
    }
    if (isExpiringSoon(dateString)) {
      const days = getDaysRemaining(dateString);
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {days} días restantes
        </span>
      );
    }
    const days = getDaysRemaining(dateString);
    return (
      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
        <CheckCircleIcon className="w-4 h-4" />
        {days} días restantes
      </span>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDates = () => {
    // Validar que las fechas no estén vacías
    if (!formData.soatExpiry || !formData.techReviewExpiry) {
      error('Por favor completa todas las fechas');
      return;
    }

    // Validar que las fechas sean válidas
    const soatDate = new Date(formData.soatExpiry);
    const techDate = new Date(formData.techReviewExpiry);
    
    if (isNaN(soatDate.getTime()) || isNaN(techDate.getTime())) {
      error('Las fechas ingresadas no son válidas');
      return;
    }

    // Crear objeto actualizado
    const updatedVehicle = {
      ...vehicle,
      soatExpiry: formData.soatExpiry,
      techReviewExpiry: formData.techReviewExpiry
    };

    // Llamar al callback de actualización
    if (onUpdate) {
      onUpdate(updatedVehicle);
    }

    success('Fechas actualizadas correctamente');
    setIsEditingDates(false);
  };

  const handleCancelDates = () => {
    // Restaurar valores originales con formato correcto para inputs
    setFormData(prev => ({
      ...prev,
      soatExpiry: formatDateForInput(vehicle.soatExpiry),
      techReviewExpiry: formatDateForInput(vehicle.techReviewExpiry)
    }));
    setIsEditingDates(false);
  };

  const handleSaveInfo = () => {
    // Validar campos requeridos (conductor es opcional)
    if (!formData.plate || !formData.brand || !formData.model || !formData.year) {
      error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar formato de placa (ABC-123)
    const plateRegex = /^[A-Z]{3}-\d{3}$/;
    if (!plateRegex.test(formData.plate.toUpperCase())) {
      error('La placa debe tener el formato ABC-123');
      return;
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year);
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      error('El año del vehículo no es válido');
      return;
    }

    // Crear objeto actualizado
    const updatedVehicle = {
      ...vehicle,
      plate: formData.plate.toUpperCase(),
      brand: formData.brand,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : null,
      color: formData.color,
      fuelType: formData.fuelType,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      lastMaintenance: formData.lastMaintenance,
      driverId: formData.driverId || null
    };

    // Llamar al callback de actualización
    if (onUpdate) {
      onUpdate(updatedVehicle);
    }

    success('Información actualizada correctamente');
    setIsEditingInfo(false);
  };

  const handleCancelInfo = () => {
    // Restaurar valores originales
    setFormData(prev => ({
      ...prev,
      plate: vehicle.plate || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      color: vehicle.color || '',
      fuelType: vehicle.fuelType || '',
      mileage: vehicle.mileage || '',
      lastMaintenance: vehicle.lastMaintenance || '',
      driverId: vehicle.driverId || ''
    }));
    setIsEditingInfo(false);
  };

  // Mostrar modal de confirmación de eliminación
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Eliminar vehículo (confirmado)
  const handleConfirmDelete = async () => {
    if (!vehicle) return;

    try {
      setIsSaving(true);
      const response = await vehicleService.deleteVehicle(vehicle.plate);
      
      if (response.success) {
        success('Vehículo eliminado correctamente');
        setShowDeleteConfirm(false);
        
        // Cerrar el modal y recargar datos
        onClose();
        if (onDelete) {
          onDelete(vehicle.plate);
        }
      } else {
        error(response.message || 'Error al eliminar vehículo');
      }
    } catch (err) {
      console.error('Error al eliminar vehículo:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el vehículo';
      error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Vehículo" size="lg">
      <div className="space-y-6">
        {/* Header con información principal */}
        <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <TruckIcon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{vehicle.plate}</h2>
                <p className="text-lg opacity-90">
                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                </p>
              </div>
            </div>
            {!isEditingInfo && !isEditingDates && (
              <button
                onClick={() => setIsEditingInfo(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm"
              >
                <PencilIcon className="w-4 h-4" />
                Editar Información
              </button>
            )}
          </div>
        </div>

        {/* Información básica */}
        {isEditingInfo ? (
          <div className="bg-blue-50 border-2 border-primary rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">Editar Información del Vehículo</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveInfo}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={handleCancelInfo}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Placa */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Placa *
                </label>
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    handleInputChange({ target: { name: 'plate', value } });
                  }}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                  placeholder="ABC-123"
                  maxLength="7"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Toyota, Chevrolet, etc."
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Hilux, D-Max, etc."
                />
              </div>

              {/* Año */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Año *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="2022"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Blanco, Negro, etc."
                />
              </div>

              {/* Tipo de Combustible */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Tipo de Combustible
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Gas Natural">Gas Natural</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              {/* Kilometraje */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Kilometraje Actual
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="45000"
                  min="0"
                />
              </div>

              {/* Último Mantenimiento */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Último Mantenimiento
                </label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Conductor Asignado */}
              <div>
                <label className="text-sm text-primary font-semibold block mb-2">
                  Conductor Asignado (Opcional)
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  >
                    <option value="">Seleccione un conductor</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.cedula}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-xs text-secondary italic">* Campos obligatorios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{vehicle.color && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-xs text-secondary font-semibold mb-1">Color</p>
                <p className="text-lg font-bold text-primary">{vehicle.color}</p>
              </div>
            )}
            {vehicle.fuelType && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-xs text-secondary font-semibold mb-1">Tipo de Combustible</p>
                <p className="text-lg font-bold text-primary">{vehicle.fuelType}</p>
              </div>
            )}
            {vehicle.mileage && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-xs text-secondary font-semibold mb-1">Kilometraje</p>
                <p className="text-lg font-bold text-primary">
                  {parseFloat(vehicle.mileage).toLocaleString('es-CO')} km
                </p>
              </div>
            )}
            {vehicle.lastMaintenance && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary font-semibold mb-1">Último Mantenimiento</p>
                    <p className="text-lg font-bold text-primary">
                      {new Date(vehicle.lastMaintenance).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Conductor Asignado - Siempre mostrar */}
            <div className={`border-2 rounded-lg p-4 ${vehicle.driverId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-300'}`}>
              <div className="flex items-center gap-2">
                <UserIcon className={`w-5 h-5 ${vehicle.driverId ? 'text-primary' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className="text-xs text-secondary font-semibold mb-1">Conductor Asignado</p>
                  {vehicle.driverId ? (
                    <>
                      <p className="text-lg font-bold text-primary">
                        {drivers.find(d => String(d.id) === String(vehicle.driverId))?.name || `Cargando... (ID: ${vehicle.driverId})`}
                      </p>
                      {drivers.find(d => String(d.id) === String(vehicle.driverId))?.cedula && (
                        <p className="text-sm text-secondary">
                          CC: {drivers.find(d => String(d.id) === String(vehicle.driverId))?.cedula}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-500">Sin conductor asignado</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de documentos con edición */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">Documentos del Vehículo</h3>
            {!isEditingDates && !isEditingInfo ? (
              <button
                onClick={() => setIsEditingDates(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Editar Fechas
              </button>
            ) : isEditingDates ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveDates}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={handleCancelDates}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            ) : null}
          </div>

          {/* SOAT */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-primary font-bold text-lg mb-2">SOAT</p>
                {!isEditingDates ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary mb-1">Fecha de vencimiento:</p>
                      <p className="text-lg font-semibold text-primary">
                        {new Date(vehicle.soatExpiry).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(vehicle.soatExpiry)}
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-secondary font-semibold block mb-2">
                      Nueva fecha de vencimiento:
                    </label>
                    <input
                      type="date"
                      name="soatExpiry"
                      value={formData.soatExpiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Revisión Técnico-Mecánica */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary-light/10 p-2 rounded-lg">
                <CheckBadgeIcon className="w-6 h-6 text-primary-light" />
              </div>
              <div className="flex-1">
                <p className="text-primary-light font-bold text-lg mb-2">Revisión Técnico-Mecánica</p>
                {!isEditingDates ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary mb-1">Fecha de vencimiento:</p>
                      <p className="text-lg font-semibold text-primary">
                        {new Date(vehicle.techReviewExpiry).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(vehicle.techReviewExpiry)}
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-secondary font-semibold block mb-2">
                      Nueva fecha de vencimiento:
                    </label>
                    <input
                      type="date"
                      name="techReviewExpiry"
                      value={formData.techReviewExpiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de eliminar vehículo */}
        {!isEditingInfo && !isEditingDates && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-1">Zona de Peligro</h3>
                <p className="text-sm text-red-700 mb-3">
                  Una vez eliminado el vehículo, no podrás recuperar su información. 
                  Esta acción también eliminará todos los mantenimientos asociados.
                </p>
                <button
                  onClick={handleDeleteClick}
                  disabled={isEditingInfo || isEditingDates}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all shadow-md ${
                    isEditingInfo || isEditingDates
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <TrashIcon className="w-5 h-5" />
                  Eliminar Vehículo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {(isEditingDates || isEditingInfo) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
            <p className="text-sm text-yellow-800 flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Nota:</strong> Los cambios se guardarán localmente. Cuando el backend esté disponible, 
                se sincronizarán automáticamente con el servidor.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">¿Eliminar Vehículo?</h3>
                <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold mb-2">Se eliminará:</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Placa: <span className="font-bold">{vehicle.plate}</span></li>
                <li>• Marca: <span className="font-bold">{vehicle.brand} {vehicle.model}</span></li>
                <li>• Año: <span className="font-bold">{vehicle.year}</span></li>
                <li className="text-red-800 font-bold mt-2">• Todos los mantenimientos asociados</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSaving}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors ${
                  isSaving
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-5 h-5" />
                    Sí, Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VehicleDetailsModal;
