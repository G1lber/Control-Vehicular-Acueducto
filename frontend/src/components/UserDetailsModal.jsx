// UserDetailsModal - Modal para ver y editar información completa del usuario
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAlert } from '../context/AlertContext';
import { 
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  PencilIcon,
  CheckIcon,
  DocumentTextIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const UserDetailsModal = ({ isOpen, onClose, user, surveyData = null }) => {
  const { success, error } = useAlert();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingSurvey, setIsEditingSurvey] = useState(false);
  
  // Datos básicos del usuario
  const [basicData, setBasicData] = useState({
    nombre: '',
    cedula: '',
    celular: '',
    area: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Datos del cuestionario
  const [formData, setFormData] = useState({
    // CONSENTIMIENTO Y DATOS BÁSICOS
    consentimiento: '',
    ciudad: '',
    sitio_labor: '',
    cargo: '',
    
    // DATOS PERSONALES
    edad: '',
    tipo_contratacion: '',
    genero: '',
    grupo: '',
    grupo_otro: '',
    
    // TRANSPORTE Y MOVILIDAD
    medio_desplazamiento: [],
    medio_transporte_desplazamiento: '',
    clase_vehiculo: '',
    clase_vehiculo_otro: '',
    
    // LICENCIA DE CONDUCCIÓN
    licencia: '',
    vigencia_licencia_dia: '',
    vigencia_licencia_mes: '',
    vigencia_licencia_anio: '',
    categoria_licencia: '',
    experiencia: '',
    
    // ACCIDENTES E INCIDENTES
    accidente_5_anios: '',
    accidente_laboral: '',
    cantidad_accidentes: '',
    cantidad_accidentes_laborales: '',
    rol_accidente: '',
    incidente: '',
    
    // DESPLAZAMIENTOS LABORALES - VEHÍCULO PROPIO
    vias_publicas: '',
    frecuencia_vehiculo_propio: '',
    tipo_vehiculo_propio: '',
    tipo_vehiculo_propio_otro: '',
    empresa_paga_rodamiento: '',
    realiza_inspeccion_propio: '',
    frecuencia_chequeo_propio: '',
    
    // DESPLAZAMIENTOS LABORALES - VEHÍCULO EMPRESA
    usa_vehiculo_empresa: '',
    tipo_vehiculo_empresa: '',
    tipo_vehiculo_empresa_otro: '',
    realiza_inspeccion_empresa: '',
    frecuencia_chequeo_empresa: '',
    
    // PLANIFICACIÓN
    planificacion: '',
    antelacion: '',
    km_mensuales: '',
    
    // FACTORES DE RIESGO
    riesgos: [],
    riesgo_otro: '',
    causas: [],
    causa_otra: '',
    
    // COMPARENDOS
    tiene_comparendos: '',
    causas_comparendo: [],
    causa_comparendo_otra: '',
    
    // INFORMACIÓN ADICIONAL
    informacion_adicional: ''
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      setBasicData({
        nombre: user.name || '',
        cedula: user.cedula || '',
        celular: user.phone || '',
        area: user.area || '',
        role: user.role || '',
        password: '',
        confirmPassword: ''
      });

      // Si hay datos del cuestionario, cargarlos
      if (surveyData) {
        setFormData({
          ...formData,
          ...surveyData
        });
      }
    }
    
    // Resetear estados de edición cuando se cierra el modal
    if (!isOpen) {
      setIsEditingBasic(false);
      setIsEditingSurvey(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, user, surveyData]);

  // Manejar cambios en datos básicos
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en datos del cuestionario
  const handleSurveyChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Guardar datos básicos
  const handleSaveBasic = () => {
    // Validaciones básicas
    if (!basicData.nombre || !basicData.celular || !basicData.area) {
      error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar contraseña solo si es Supervisor y se proporcionó una nueva
    if (basicData.role === 'Supervisor' && basicData.password) {
      if (basicData.password.length < 6) {
        error('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (basicData.password !== basicData.confirmPassword) {
        error('Las contraseñas no coinciden');
        return;
      }
    }

    console.log('Guardando datos básicos:', basicData);
    // Aquí se enviará al backend
    success('Datos básicos actualizados correctamente');
    setIsEditingBasic(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Limpiar campos de contraseña después de guardar
    setBasicData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
  };

  // Guardar datos del cuestionario
  const handleSaveSurvey = () => {
    console.log('Guardando datos del cuestionario:', formData);
    // Aquí se enviará al backend
    success('Información del cuestionario actualizada correctamente');
    setIsEditingSurvey(false);
  };

  // Renderizar campo de vista/edición
  const renderField = (label, value, name, isEditing, onChange, type = 'text', options = null) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      }
      return (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
        />
      );
    }
    
    return <p className="text-primary font-semibold">{value || 'No especificado'}</p>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Información del Usuario">
      <div>
        {/* Header personalizado con degradado */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-lg p-6 mb-6 -mt-6 -mx-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{basicData.nombre || 'Usuario'}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                  {basicData.role || 'Sin rol'}
                </span>
                <span className="text-white/90 text-sm">
                  CC: {basicData.cedula}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          
          {/* ========== DATOS BÁSICOS ========== */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-primary/10">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <IdentificationIcon className="w-6 h-6" />
                Datos Básicos
              </h3>
              {!isEditingBasic ? (
                <button
                  onClick={() => setIsEditingBasic(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                >
                  <PencilIcon className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBasic}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBasic(false);
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setBasicData({
                        nombre: user.name || '',
                        cedula: user.cedula || '',
                        celular: user.phone || '',
                        area: user.area || '',
                        role: user.role || '',
                        password: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200">
              <div>
                <label className="text-sm text-secondary font-semibold mb-1 block">Nombre Completo *</label>
                {renderField('Nombre', basicData.nombre, 'nombre', isEditingBasic, handleBasicChange)}
              </div>
              
              <div>
                <label className="text-sm text-secondary font-semibold mb-1 block">Cédula</label>
                <p className="text-primary font-semibold">{basicData.cedula}</p>
              </div>
              
              <div>
                <label className="text-sm text-secondary font-semibold mb-1 block">Celular *</label>
                {renderField('Celular', basicData.celular, 'celular', isEditingBasic, handleBasicChange, 'tel')}
              </div>
              
              <div>
                <label className="text-sm text-secondary font-semibold mb-1 block">Área *</label>
                {renderField('Área', basicData.area, 'area', isEditingBasic, handleBasicChange)}
              </div>
              
              <div>
                <label className="text-sm text-secondary font-semibold mb-1 block">Rol *</label>
                {renderField('Rol', basicData.role, 'role', isEditingBasic, handleBasicChange, 'select', ['Conductor', 'Supervisor'])}
              </div>

              {/* Contraseña (solo para Supervisores en modo edición) */}
              {isEditingBasic && basicData.role === 'Supervisor' && (
                <>
                  <div className="col-span-full bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <LockClosedIcon className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        <strong>Cambiar Contraseña:</strong> Deja estos campos vacíos si no deseas cambiar la contraseña actual.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={basicData.password || ''}
                        onChange={handleBasicChange}
                        className="w-full px-3 py-2 pr-12 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={basicData.confirmPassword || ''}
                        onChange={handleBasicChange}
                        className="w-full px-3 py-2 pr-12 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                        placeholder="Repita la contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ========== INFORMACIÓN DEL CUESTIONARIO ========== */}
          {surveyData ? (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-primary/10">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <DocumentTextIcon className="w-6 h-6" />
                  Cuestionario de Seguridad Vial
                </h3>
                {!isEditingSurvey ? (
                  <button
                    onClick={() => setIsEditingSurvey(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveSurvey}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      onClick={() => setIsEditingSurvey(false)}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {/* Datos Generales */}
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-2 border-blue-200 shadow-sm">
                <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  Datos Generales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Ciudad</label>
                    {renderField('Ciudad', formData.ciudad, 'ciudad', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Sitio de Labor</label>
                    {renderField('Sitio de Labor', formData.sitio_labor, 'sitio_labor', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Cargo</label>
                    {renderField('Cargo', formData.cargo, 'cargo', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Edad</label>
                    {renderField('Edad', formData.edad, 'edad', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Tipo de Contratación</label>
                    {renderField('Tipo de Contratación', formData.tipo_contratacion, 'tipo_contratacion', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Género</label>
                    {renderField('Género', formData.genero, 'genero', isEditingSurvey, handleSurveyChange, 'select', ['Femenino', 'Masculino'])}
                  </div>
                </div>
              </div>

              {/* Licencia de Conducción */}
              <div className="mb-6 bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border-2 border-green-200 shadow-sm">
                <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                  <IdentificationIcon className="w-5 h-5" />
                  Licencia de Conducción
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">¿Tiene Licencia?</label>
                    {renderField('Licencia', formData.licencia, 'licencia', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                  </div>
                  
                  {formData.licencia === 'SI' && (
                    <>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Categoría</label>
                        {renderField('Categoría', formData.categoria_licencia, 'categoria_licencia', isEditingSurvey, handleSurveyChange)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Experiencia</label>
                        {renderField('Experiencia', formData.experiencia, 'experiencia', isEditingSurvey, handleSurveyChange)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Vigencia de Licencia</label>
                        {isEditingSurvey ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              name="vigencia_licencia_dia"
                              placeholder="Día"
                              value={formData.vigencia_licencia_dia}
                              onChange={handleSurveyChange}
                              min="1"
                              max="31"
                              className="w-1/3 px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                            />
                            <input
                              type="number"
                              name="vigencia_licencia_mes"
                              placeholder="Mes"
                              value={formData.vigencia_licencia_mes}
                              onChange={handleSurveyChange}
                              min="1"
                              max="12"
                              className="w-1/3 px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                            />
                            <input
                              type="number"
                              name="vigencia_licencia_anio"
                              placeholder="Año"
                              value={formData.vigencia_licencia_anio}
                              onChange={handleSurveyChange}
                              min="2024"
                              max="2050"
                              className="w-1/3 px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                            />
                          </div>
                        ) : (
                          <p className="text-primary font-semibold">
                            {formData.vigencia_licencia_dia && formData.vigencia_licencia_mes && formData.vigencia_licencia_anio
                              ? `${formData.vigencia_licencia_dia}/${formData.vigencia_licencia_mes}/${formData.vigencia_licencia_anio}`
                              : 'No especificado'}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Accidentes e Incidentes */}
              <div className="mb-6 bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border-2 border-red-200 shadow-sm">
                <h4 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Accidentes e Incidentes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Accidente en últimos 5 años</label>
                    {renderField('Accidente', formData.accidente_5_anios, 'accidente_5_anios', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                  </div>
                  
                  {formData.accidente_5_anios === 'SI' && (
                    <>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">¿Fue laboral?</label>
                        {renderField('Accidente laboral', formData.accidente_laboral, 'accidente_laboral', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Cantidad de accidentes</label>
                        {renderField('Cantidad', formData.cantidad_accidentes, 'cantidad_accidentes', isEditingSurvey, handleSurveyChange)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Rol en accidente</label>
                        {renderField('Rol', formData.rol_accidente, 'rol_accidente', isEditingSurvey, handleSurveyChange)}
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">¿Ha tenido incidentes?</label>
                    {renderField('Incidente', formData.incidente, 'incidente', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                  </div>
                </div>
              </div>

              {/* Desplazamientos Laborales */}
              <div className="mb-6 bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border-2 border-yellow-200 shadow-sm">
                <h4 className="text-lg font-bold text-yellow-700 mb-3 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  Desplazamientos Laborales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">¿Se desplaza por vías públicas?</label>
                    {renderField('Vías públicas', formData.vias_publicas, 'vias_publicas', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                  </div>
                  
                  {formData.vias_publicas === 'SI' && (
                    <>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Frecuencia vehículo propio</label>
                        {renderField('Frecuencia', formData.frecuencia_vehiculo_propio, 'frecuencia_vehiculo_propio', isEditingSurvey, handleSurveyChange)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Tipo de vehículo propio</label>
                        {renderField('Tipo', formData.tipo_vehiculo_propio, 'tipo_vehiculo_propio', isEditingSurvey, handleSurveyChange)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">¿Usa vehículo de la empresa?</label>
                        {renderField('Vehículo empresa', formData.usa_vehiculo_empresa, 'usa_vehiculo_empresa', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Planificación */}
              <div className="mb-6 bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-2 border-purple-200 shadow-sm">
                <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Planificación de Desplazamientos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">¿Planifica sus desplazamientos?</label>
                    {renderField('Planificación', formData.planificacion, 'planificacion', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Con cuánta antelación</label>
                    {renderField('Antelación', formData.antelacion, 'antelacion', isEditingSurvey, handleSurveyChange)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Kilómetros mensuales</label>
                    {renderField('KM mensuales', formData.km_mensuales, 'km_mensuales', isEditingSurvey, handleSurveyChange, 'number')}
                  </div>
                </div>
              </div>

              {/* Comparendos */}
              <div className="mb-6 bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg border-2 border-orange-200 shadow-sm">
                <h4 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Comparendos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">¿Tiene comparendos?</label>
                    {renderField('Comparendos', formData.tiene_comparendos, 'tiene_comparendos', isEditingSurvey, handleSurveyChange, 'select', ['SI', 'NO'])}
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              {formData.informacion_adicional && (
                <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border-2 border-gray-200 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-700 mb-3">Información Adicional</h4>
                  {isEditingSurvey ? (
                    <textarea
                      name="informacion_adicional"
                      value={formData.informacion_adicional}
                      onChange={handleSurveyChange}
                      rows="4"
                      className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                    />
                  ) : (
                    <p className="text-primary font-semibold whitespace-pre-wrap">{formData.informacion_adicional}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
              <DocumentTextIcon className="w-16 h-16 text-yellow-600 mx-auto mb-3" />
              <p className="text-yellow-800 font-semibold text-lg mb-2">
                Cuestionario no completado
              </p>
              <p className="text-yellow-700">
                Este usuario aún no ha completado el cuestionario de seguridad vial.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
