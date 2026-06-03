// Componente MaintenanceForm - Formulario para registrar o editar mantenimientos

import { useEffect, useState } from 'react';
import maintenanceService from '../services/maintenance.service';
import { useAlert } from '../context/AlertContext';

const maintenanceTypes = [
  { value: 'oil_change', label: 'Cambio de Aceite' },
  { value: 'tire_change', label: 'Cambio de Llantas' },
  { value: 'brake_fluid', label: 'Cambio de Líquido de Frenos' },
  { value: 'drive_kit', label: 'Cambio de Kit de Arrastre' },
  { value: 'filters', label: 'Cambio de Filtros' },
  { value: 'battery', label: 'Cambio de Batería' },
  { value: 'brakes', label: 'Mantenimiento de Frenos' },
  { value: 'suspension', label: 'Mantenimiento de Suspensión' },
  { value: 'engine', label: 'Mantenimiento de Motor' },
  { value: 'transmission', label: 'Mantenimiento de Transmisión' },
  { value: 'other', label: 'Otro' },
];

const typeMapping = {
  oil_change: 'Cambio de aceite',
  tire_change: 'Cambio de llantas',
  brake_fluid: 'Líquido de frenos',
  drive_kit: 'Kit de arrastre',
  filters: 'Cambio de filtros',
  battery: 'Cambio de batería',
  brakes: 'Mantenimiento de frenos',
  suspension: 'Mantenimiento de suspensión',
  engine: 'Mantenimiento de motor',
  transmission: 'Mantenimiento de transmisión',
  other: 'Otro'
};

const reverseTypeMapping = Object.fromEntries(
  Object.entries(typeMapping).map(([key, value]) => [value.toLowerCase(), key])
);

const getMaintenanceId = (data) => data?.id ?? data?.id_mantenimiento ?? null;

const MaintenanceForm = ({ vehicleId, onSubmit, onCancel, initialData = null }) => {
  const { success, error } = useAlert();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: vehicleId || '',
    maintenanceType: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    mileage: '',
    nextMaintenanceDate: '',
    parts: [],
  });

  useEffect(() => {
    if (!initialData) {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicleId || ''
      }));
      return;
    }

    const backendType = String(initialData.tipo || initialData.maintenanceType || '').toLowerCase();
    const mappedType = reverseTypeMapping[backendType] || initialData.maintenanceType || '';
    const dateValue = initialData.fechaRealizado || initialData.fecha_realizado || initialData.date || '';

    setFormData({
      vehicleId: initialData.placa || vehicleId || '',
      maintenanceType: mappedType,
      description: initialData.descripcion || '',
      date: dateValue ? String(dateValue).slice(0, 10) : new Date().toISOString().split('T')[0],
      cost: initialData.costo ?? '',
      mileage: initialData.kilometraje ?? initialData.kilometraje_actual ?? '',
      nextMaintenanceDate: initialData.fechaProxima ? String(initialData.fechaProxima).slice(0, 10) : '',
      parts: [],
    });
  }, [initialData, vehicleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const maintenancePayload = {
        placa: formData.vehicleId,
        tipo: typeMapping[formData.maintenanceType] || formData.maintenanceType,
        fechaRealizado: formData.date,
        descripcion: formData.description,
      };

      if (formData.cost) {
        maintenancePayload.costo = parseFloat(formData.cost);
      }
      if (formData.mileage) {
        maintenancePayload.kilometraje = parseInt(formData.mileage);
      }
      if (formData.nextMaintenanceDate) {
        maintenancePayload.fechaProxima = formData.nextMaintenanceDate;
      }

      const maintenanceId = getMaintenanceId(initialData);

      if (initialData && !maintenanceId) {
        error('No se pudo identificar el mantenimiento a editar');
        return;
      }

      const response = maintenanceId
        ? await maintenanceService.updateMaintenance(maintenanceId, maintenancePayload)
        : await maintenanceService.createMaintenance(maintenancePayload);

      if (response.success) {
        success(initialData ? 'Mantenimiento actualizado exitosamente' : 'Mantenimiento registrado exitosamente');
        if (onSubmit) {
          onSubmit(formData, response);
        }
      } else {
        error(response.message || (initialData ? 'Error al actualizar mantenimiento' : 'Error al registrar mantenimiento'));
      }
    } catch (err) {
      console.error('Error al guardar mantenimiento:', err);
      const errorMessage = err.response?.data?.message || (initialData ? 'Error al actualizar el mantenimiento' : 'Error al registrar el mantenimiento');
      error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {initialData ? 'Editar Mantenimiento' : 'Registrar Mantenimiento'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-primary-light font-semibold mb-2" htmlFor="maintenanceType">
            Tipo de Mantenimiento *
          </label>
          <select
            id="maintenanceType"
            name="maintenanceType"
            value={formData.maintenanceType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
          >
            <option value="">Seleccione un tipo</option>
            {maintenanceTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="date">
              Fecha de Realización *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="nextMaintenanceDate">
              Próximo Mantenimiento
            </label>
            <input
              type="date"
              id="nextMaintenanceDate"
              name="nextMaintenanceDate"
              value={formData.nextMaintenanceDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Ej: 50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-primary-light font-semibold mb-2" htmlFor="cost">
              Costo (COP)
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Ej: 150000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-primary-light font-semibold mb-2" htmlFor="description">
            Descripción del Mantenimiento *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describa los detalles del mantenimiento realizado..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              initialData ? 'Guardar cambios' : 'Registrar Mantenimiento'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;