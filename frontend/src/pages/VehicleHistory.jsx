import { useEffect, useState } from 'react';
import maintenanceService from '../services/maintenance.service';
import MaintenanceForm from '../components/MaintenanceForm';
import { useAlert } from '../context/AlertContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const maintenanceTypes = [
  { value: '', label: 'Todos' },
  { value: 'Cambio de aceite', label: 'Cambio de Aceite' },
  { value: 'Cambio de llantas', label: 'Cambio de Llantas' },
  { value: 'Líquido de frenos', label: 'Líquido de Frenos' },
  { value: 'Kit de arrastre', label: 'Kit de Arrastre' },
  { value: 'Cambio de filtros', label: 'Cambio de Filtros' },
  { value: 'Cambio de batería', label: 'Cambio de Batería' },
  { value: 'Mantenimiento de frenos', label: 'Mantenimiento de Frenos' },
  { value: 'Mantenimiento de suspensión', label: 'Mantenimiento de Suspensión' },
  { value: 'Mantenimiento de motor', label: 'Mantenimiento de Motor' },
  { value: 'Mantenimiento de transmisión', label: 'Mantenimiento de Transmisión' },
  { value: 'Otro', label: 'Otro' }
];

const VehicleHistory = ({ vehicle, onNavigate }) => {
  const { success, error } = useAlert();
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (vehicle) {
      loadMaintenances();
    }
  }, [vehicle]);

  useEffect(() => {
    if (vehicle) {
      setCurrentPage(1);
    }
  }, [vehicle, filterType, filterYear]);

  const loadMaintenances = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getAllMaintenances({ placa: vehicle.plate });
      if (response.success) {
        setMaintenances(response.data || []);
      }
    } catch (err) {
      console.error('Error al cargar mantenimientos:', err);
      error('No se pudieron cargar los mantenimientos');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaintenances = maintenances.filter(maintenance => {
    const maintenanceType = String(maintenance.tipo || maintenance.tipo_mantenimiento || '').toLowerCase();
    const selectedType = String(filterType || '').toLowerCase();
    const matchesType = !selectedType || maintenanceType.includes(selectedType);

    const dateValue = maintenance.fechaRealizado || maintenance.fecha_realizado;
    const matchesYear = !filterYear || (
      dateValue && String(new Date(String(dateValue).slice(0, 10)).getFullYear()) === String(filterYear)
    );

    return matchesType && matchesYear;
  });

  const availableYears = Array.from(new Set(maintenances.map(m => {
    const d = m.fechaRealizado || m.fecha_realizado || null;
    if (!d) return null;
    return new Date(d).getFullYear();
  }).filter(Boolean))).sort((a, b) => b - a);

  const totalPages = Math.ceil(filteredMaintenances.length / itemsPerPage);
  const paginatedMaintenances = filteredMaintenances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenModal = (maintenance = null) => {
    setSelectedMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaintenance(null);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    setSelectedMaintenance(null);
    setTimeout(async () => {
      await loadMaintenances();
    }, 300);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));
  };

  const handleDeleteMaintenance = async (maintenance) => {
    setMaintenanceToDelete(maintenance);
  };

  const cancelDeleteMaintenance = () => {
    setMaintenanceToDelete(null);
  };

  const confirmDeleteMaintenance = async () => {
    const maintenance = maintenanceToDelete;
    const maintenanceId = maintenance?.id_mantenimiento || maintenance?.id;
    if (!maintenanceId) {
      error('No se pudo identificar el mantenimiento');
      setMaintenanceToDelete(null);
      return;
    }

    try {
      const response = await maintenanceService.deleteMaintenance(maintenanceId);
      if (response.success) {
        success('Mantenimiento eliminado exitosamente');
        await loadMaintenances();
      } else {
        error(response.message || 'Error al eliminar mantenimiento');
      }
    } catch (err) {
      console.error('Error al eliminar mantenimiento:', err);
      error(err.response?.data?.message || 'Error al eliminar el mantenimiento');
    } finally {
      setMaintenanceToDelete(null);
    }
  };

  const getDescriptionPreview = (description) => {
    if (!description) return '-';
    const text = String(description).trim();
    return text.length > 90 ? `${text.slice(0, 90)}...` : text;
  };

  return (
    <div className="py-8">
      <button onClick={() => onNavigate('vehicles')} className="mb-6 text-primary hover:text-primary-light font-semibold">
        ← Volver a Vehículos
      </button>

      <div className="mb-6 bg-primary/10 border-l-4 border-primary rounded-lg p-4">
        <h3 className="text-lg font-bold text-primary">Hoja de vida: {vehicle?.plate}</h3>
        <p className="text-primary-light">{vehicle?.brand} {vehicle?.model} ({vehicle?.year})</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col lg:flex-row gap-4 lg:items-end">
        <div>
          <label className="block text-sm font-semibold mb-1">Tipo</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 border rounded"
          >
            {maintenanceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Año</label>
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 border rounded"
          >
            <option value="">Todos</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="lg:ml-auto w-full sm:w-auto">
          <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded">
            Agregar Mantenimiento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : maintenances.length === 0 ? (
          <p className="text-center text-secondary">No hay registros de mantenimiento para este vehículo.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] table-fixed">
                <thead>
                  <tr className="text-left text-sm text-secondary">
                    <th className="p-2 w-28">Fecha</th>
                    <th className="p-2 w-32">Tipo</th>
                    <th className="p-2 w-28">Kilometraje</th>
                    <th className="p-2 w-32">Costo</th>
                    <th className="p-2 w-[38%]">Descripción</th>
                    <th className="p-2 w-44">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMaintenances.map(m => (
                    <tr key={m.id_mantenimiento || m.id} className="border-t align-top">
                      <td className="p-2">{(m.fechaRealizado || m.fecha_realizado || '').slice(0, 10)}</td>
                      <td className="p-2">{m.tipo}</td>
                      <td className="p-2">{m.kilometraje || m.kilometraje_actual || '-'}</td>
                      <td className="p-2">
                        {m.costo ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(m.costo) : '-'}
                      </td>
                      <td className="p-2 align-top">
                        <div className="max-h-20 overflow-hidden whitespace-normal break-words leading-5 text-sm text-secondary">
                          {getDescriptionPreview(m.descripcion)}
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        <div className="flex flex-wrap gap-2 justify-start">
                          <button
                            onClick={() => handleOpenModal(m)}
                            className="rounded border border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteMaintenance(m)}
                            className="rounded border border-red-500 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-secondary">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, maintenances.length)} de {maintenances.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-semibold text-primary">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 px-3 py-4 sm:px-4 flex items-center justify-center">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b px-4 py-4 md:px-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold">
                  {selectedMaintenance ? 'Editar mantenimiento' : 'Agregar mantenimiento'} - {vehicle?.plate}
                </h3>
                <p className="text-sm text-secondary">
                  Completa el formulario y guarda el registro en la hoja de vida.
                </p>
              </div>
              <button onClick={handleCloseModal} className="rounded px-3 py-2 text-gray-600 hover:bg-gray-100">
                Cerrar
              </button>
            </div>
            <div className="p-4 md:p-6">
              <MaintenanceForm
                vehicleId={vehicle?.plate}
                initialData={selectedMaintenance}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}

      {maintenanceToDelete && (
        <div className="fixed inset-0 z-[60] bg-black/50 px-4 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-yellow-200">
            <div className="bg-yellow-50 border-b border-yellow-200 px-5 py-4 flex items-start gap-3">
              <ExclamationTriangleIcon className="w-7 h-7 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-yellow-800">Confirmar eliminación</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  ¿Seguro que deseas eliminar este mantenimiento? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="px-5 py-4 space-y-2 text-sm text-secondary">
              <p><span className="font-semibold text-primary">Fecha:</span> {(maintenanceToDelete.fechaRealizado || maintenanceToDelete.fecha_realizado || '').slice(0, 10)}</p>
              <p><span className="font-semibold text-primary">Tipo:</span> {maintenanceToDelete.tipo}</p>
              <p><span className="font-semibold text-primary">Descripción:</span> {getDescriptionPreview(maintenanceToDelete.descripcion)}</p>
            </div>

            <div className="px-5 py-4 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={cancelDeleteMaintenance}
                className="w-full sm:w-auto rounded-lg border-2 border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/5"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteMaintenance}
                className="w-full sm:w-auto rounded-lg border-2 border-red-500 bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleHistory;
