// Componente AddVehicleModal - Modal con formulario para agregar vehículos
import { useState } from 'react';
import Modal from './Modal';
import { TruckIcon } from '@heroicons/react/24/outline';
import { useAlert } from '../context/AlertContext';

const AddVehicleModal = ({ isOpen, onClose, onSubmit }) => {
  const { success, error } = useAlert();
  
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    soatExpiry: '',
    techReviewExpiry: '',
    lastMaintenance: '',
    color: '',
    fuelType: 'gasoline',
    mileage: ''
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plate.trim()) {
      newErrors.plate = 'La placa es requerida';
    } else if (!/^[A-Z]{3}-\d{3}$/.test(formData.plate.toUpperCase())) {
      newErrors.plate = 'Formato de placa inválido (Ej: ABC-123)';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Por favor, corrige los errores del formulario');
      return;
    }

    // Formatear la placa a mayúsculas
    const vehicleData = {
      ...formData,
      plate: formData.plate.toUpperCase(),
      id: Date.now() // ID temporal - el backend generará el real
    };

    if (onSubmit) {
      onSubmit(vehicleData);
    }

    success(`Vehículo ${vehicleData.plate} agregado exitosamente`);
    handleClose();
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
      fuelType: 'gasoline',
      mileage: ''
    });
    setErrors({});
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
              placeholder="ABC-123"
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
              <option value="gasoline">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="electric">Eléctrico</option>
              <option value="hybrid">Híbrido</option>
              <option value="gas">Gas</option>
            </select>
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
