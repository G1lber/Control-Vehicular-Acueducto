// Componente AddVehicleModal - Modal con formulario para agregar vehículos
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { TruckIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAlert } from '../context/AlertContext';
import vehicleService from '../services/vehicle.service';

const AddVehicleModal = ({ isOpen, onClose, onSubmit, drivers = [] }) => {
  const { success, error } = useAlert();
  
  // Debug: Mostrar conductores disponibles
  useEffect(() => {
    if (isOpen) {
      console.log('Conductores disponibles en modal:', drivers);
    }
  }, [isOpen, drivers]);
  
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    soatExpiry: '',
    techReviewExpiry: '',
    lastMaintenance: '',
    color: '',
    fuelType: '',
    mileage: '',
    driverId: ''
  });

  const [errors, setErrors] = useState({});
  const [soatFile, setSoatFile] = useState(null);
  const [tecnoFile, setTecnoFile] = useState(null);
  const [uploadingSoat, setUploadingSoat] = useState(false);
  const [uploadingTecno, setUploadingTecno] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      error('El archivo no debe superar los 5MB');
      e.target.value = '';
      return;
    }

    // Validar tipo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      error('Solo se permiten archivos PDF, JPG, JPEG o PNG');
      e.target.value = '';
      return;
    }

    if (docType === 'soat') {
      setSoatFile(file);
    } else {
      setTecnoFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plate.trim()) {
      newErrors.plate = 'La placa es requerida';
    } else if (!/^[A-Z0-9-]{5,10}$/.test(formData.plate.toUpperCase())) {
      newErrors.plate = 'La placa debe tener entre 5 y 10 caracteres alfanuméricos';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Año inválido';
    }

    if (!formData.soatExpiry) {
      newErrors.soatExpiry = 'La fecha de vencimiento del SOAT es requerida';
    }

    if (!formData.techReviewExpiry) {
      newErrors.techReviewExpiry = 'La fecha de vencimiento de la revisión técnico-mecánica es requerida';
    }
    
    // Conductor es opcional
    // if (!formData.driverId) {
    //   newErrors.driverId = 'Debe asignar un conductor al vehículo';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Por favor, corrige los errores del formulario');
      return;
    }

    try {
      // Formatear la placa a mayúsculas
      const vehicleData = {
        ...formData,
        plate: formData.plate.toUpperCase(),
        year: formData.year ? parseInt(formData.year) : null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        driverId: formData.driverId || null,
        id: Date.now() // ID temporal - el backend generará el real
      };

      if (onSubmit) {
        await onSubmit(vehicleData);
      }

      // Si se creó exitosamente y hay archivos, subirlos
      const plateUpperCase = formData.plate.trim().toUpperCase();
      
      if (soatFile) {
        try {
          setUploadingSoat(true);
          const response = await vehicleService.uploadDocument(plateUpperCase, soatFile, 'soat');
          if (response.success) {
            console.log('Documento SOAT subido exitosamente');
          }
        } catch (err) {
          console.error('Error al subir SOAT:', err);
          error('Vehículo creado, pero hubo un error al subir el documento SOAT');
        } finally {
          setUploadingSoat(false);
        }
      }
      
      if (tecnoFile) {
        try {
          setUploadingTecno(true);
          const response = await vehicleService.uploadDocument(plateUpperCase, tecnoFile, 'tecno');
          if (response.success) {
            console.log('Documento Tecnomecánica subido exitosamente');
          }
        } catch (err) {
          console.error('Error al subir Tecno:', err);
          error('Vehículo creado, pero hubo un error al subir el documento de Tecnomecánica');
        } finally {
          setUploadingTecno(false);
        }
      }

      success(`Vehículo ${vehicleData.plate} agregado exitosamente`);
      handleClose();
    } catch (err) {
      console.error('Error en handleSubmit:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      soatExpiry: '',
      techReviewExpiry: '',
      lastMaintenance: '',
      color: '',
      fuelType: '',
      mileage: '',
      driverId: ''
    });
    setErrors({});
    setSoatFile(null);
    setTecnoFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Nuevo Vehículo" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header con icono */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="bg-primary/10 p-3 rounded-full">
            <TruckIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary">Información del Vehículo</h4>
            <p className="text-sm text-secondary">Complete todos los campos requeridos</p>
          </div>
        </div>

        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Placa */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="plate">
              Placa *
            </label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              placeholder="ABC-123, ZUJ43D, MQ163A"
              maxLength="7"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors uppercase ${
                errors.plate 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
              }`}
            />
            {errors.plate && (
              <p className="text-red-600 text-sm mt-1">{errors.plate}</p>
            )}
          </div>

          {/* Año */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="year">
              Año *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.year 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
              }`}
            />
            {errors.year && (
              <p className="text-red-600 text-sm mt-1">{errors.year}</p>
            )}
          </div>

          {/* Marca */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="brand">
              Marca *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Toyota, Chevrolet, Nissan..."
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.brand 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
              }`}
            />
            {errors.brand && (
              <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
            )}
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="model">
              Modelo *
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Hilux, D-Max, Frontier..."
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.model 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
              }`}
            />
            {errors.model && (
              <p className="text-red-600 text-sm mt-1">{errors.model}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="color">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Blanco, Negro, Azul..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>

          {/* Tipo de combustible */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="fuelType">
              Tipo de Combustible
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            >
              <option value="">Seleccione un tipo</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Gas Natural">Gas Natural</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          {/* Conductor Asignado */}
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="driverId">
              Conductor Asignado (Opcional)
            </label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                id="driverId"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-colors appearance-none ${
                  errors.driverId 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
                }`}
              >
                <option value="">Seleccione un conductor</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} - {driver.cedula}
                  </option>
                ))}
              </select>
            </div>
            {errors.driverId && (
              <p className="text-red-600 text-sm mt-1">{errors.driverId}</p>
            )}
          </div>
        </div>

        {/* Documentación y Fechas */}
        <div className="pt-4 border-t border-gray-200">
          <h5 className="text-primary font-bold mb-4">Documentación</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vencimiento SOAT */}
            <div>
              <label className="block text-primary-light font-semibold mb-2" htmlFor="soatExpiry">
                Vencimiento SOAT *
              </label>
              <input
                type="date"
                id="soatExpiry"
                name="soatExpiry"
                value={formData.soatExpiry}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.soatExpiry 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
                }`}
              />
              {errors.soatExpiry && (
                <p className="text-red-600 text-sm mt-1">{errors.soatExpiry}</p>
              )}
              
              {/* Upload de documento SOAT (Opcional) */}
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-2.5">
                <label className="text-xs text-primary font-bold block mb-2 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Documento SOAT (Opcional)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-gray-600">PDF, JPG, PNG (máx. 5MB)</p>
                  <label className="cursor-pointer inline-block flex-shrink-0">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'soat')}
                      className="hidden"
                      id="soat-file-new"
                    />
                    <div className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                      {soatFile ? `✓ ${soatFile.name}` : 'Seleccionar archivo'}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Vencimiento Revisión Técnico-Mecánica */}
            <div>
              <label className="block text-primary-light font-semibold mb-2" htmlFor="techReviewExpiry">
                Vencimiento Revisión Técnico-Mecánica *
              </label>
              <input
                type="date"
                id="techReviewExpiry"
                name="techReviewExpiry"
                value={formData.techReviewExpiry}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.techReviewExpiry 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-light'
                }`}
              />
              {errors.techReviewExpiry && (
                <p className="text-red-600 text-sm mt-1">{errors.techReviewExpiry}</p>
              )}
              
              {/* Upload de documento Tecnomecánica (Opcional) */}
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-lg p-2.5">
                <label className="text-xs text-primary font-bold block mb-2 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Documento Tecnomecánica (Opcional)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-gray-600">PDF, JPG, PNG (máx. 5MB)</p>
                  <label className="cursor-pointer inline-block flex-shrink-0">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'tecno')}
                      className="hidden"
                      id="tecno-file-new"
                    />
                    <div className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                      {tecnoFile ? `✓ ${tecnoFile.name}` : 'Seleccionar archivo'}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Último Mantenimiento */}
            <div>
              <label className="block text-primary-light font-semibold mb-2" htmlFor="lastMaintenance">
                Último Mantenimiento
              </label>
              <input
                type="date"
                id="lastMaintenance"
                name="lastMaintenance"
                value={formData.lastMaintenance}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
              />
            </div>

            {/* Kilometraje */}
            <div>
              <label className="block text-primary-light font-semibold mb-2" htmlFor="mileage">
                Kilometraje Actual
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4">
          <p className="text-sm text-primary">
            <strong>Nota:</strong> Los campos marcados con * son obligatorios. Asegúrate de ingresar las fechas de vencimiento correctas para recibir alertas oportunas.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Agregar Vehículo
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVehicleModal;
