// UserDetailsModal - Modal para ver y editar información completa del usuario
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAlert } from '../context/AlertContext';
import userService from '../services/user.service';
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
  LockClosedIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const UserDetailsModal = ({ isOpen, onClose, user, surveyData = null, onUpdate }) => {
  const { success, error } = useAlert();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingSurvey, setIsEditingSurvey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Opciones de la encuesta (deben coincidir exactamente con SurveyTalentoHumano.jsx)
  const surveyOptions = {
    edad: ['Menor de 18', '18-27', '28-37', '38-47', '48 o mas'],
    tipo_contratacion: ['Termino fijo', 'Termino indefinido', 'Obra o labor', 'Prestacion servicio', 'Honorarios', 'Aprendizaje'],
    grupo: ['Administrativo', 'Comercial', 'Tecnico', 'Operativo', 'Otro'],
    medio_transporte_desplazamiento: ['Transporte empresa', 'Transporte publico', 'A pie', 'Vehiculo propio'],
    clase_vehiculo: ['Carro', 'Moto', 'Bicicleta', 'Patines', 'Otro'],
    categoria_licencia: ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
    experiencia: ['1-4', '5-10', 'Mas de 10'],
    cantidad_accidentes: ['1', '1-5', 'Mas de 5', 'Ninguno'],
    rol_accidente: ['Peaton', 'Conductor vehiculo', 'Conductor moto', 'Pasajero'],
    frecuencia_vehiculo_propio: ['Diario', 'Semanal', 'Bimestral', 'Trimestral', 'Semestral', 'No uso'],
    tipo_vehiculo_propio: ['Moto', 'Carro', 'Bicicleta', 'No uso', 'Otro'],
    tipo_vehiculo_empresa: ['Moto', 'Carro', 'Bicicleta', 'Otro'],
    frecuencia_chequeo: ['Diario', 'Semanal', 'Mensual', 'Anual', 'No realiza']
  };
  
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

  // Datos del cuestionario - Estado inicial
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);

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
        // Convertir datos del backend (camelCase) al formato del modal (snake_case)
        const mappedSurveyData = {
          // CONSENTIMIENTO Y DATOS BÁSICOS
          consentimiento: surveyData.consentimiento || '',
          ciudad: surveyData.ciudad || '',
          sitio_labor: surveyData.sitioLabor || '',
          cargo: surveyData.cargo || '',
          
          // DATOS PERSONALES
          edad: surveyData.edad || '',  // Ya viene como string del backend (ej: "18-27")
          tipo_contratacion: surveyData.tipoContratacion || '',
          genero: surveyData.genero || '',
          grupo: surveyData.grupo || '',
          grupo_otro: surveyData.grupoOtro || '',
          
          // TRANSPORTE Y MOVILIDAD
          medio_desplazamiento: surveyData.medioDesplazamiento || [],
          medio_transporte_desplazamiento: surveyData.medioTransporteDesplazamiento || '',
          clase_vehiculo: surveyData.claseVehiculo || '',
          clase_vehiculo_otro: surveyData.claseVehiculoOtro || '',
          
          // LICENCIA DE CONDUCCIÓN
          licencia: surveyData.licencia || '',
          vigencia_licencia_dia: surveyData.vigenciaLicencia ? new Date(surveyData.vigenciaLicencia).getDate().toString() : '',
          vigencia_licencia_mes: surveyData.vigenciaLicencia ? (new Date(surveyData.vigenciaLicencia).getMonth() + 1).toString() : '',
          vigencia_licencia_anio: surveyData.vigenciaLicencia ? new Date(surveyData.vigenciaLicencia).getFullYear().toString() : '',
          categoria_licencia: surveyData.categoriaLicencia || '',
          experiencia: surveyData.experiencia || '',  // Ya viene como string del backend (ej: "1-4")
          
          // ACCIDENTES E INCIDENTES
          accidente_5_anios: surveyData.accidente5Anios || '',
          accidente_laboral: surveyData.accidenteLaboral || '',
          cantidad_accidentes: surveyData.cantidadAccidentes || '',  // Ya viene como string (ej: "1-5")
          cantidad_accidentes_laborales: surveyData.cantidadAccidentesLaborales || '',  // Ya viene como string (ej: "1-5")
          rol_accidente: surveyData.rolAccidente || '',
          incidente: surveyData.incidente || '',
          
          // DESPLAZAMIENTOS LABORALES - VEHÍCULO PROPIO
          vias_publicas: surveyData.viasPublicas || '',
          frecuencia_vehiculo_propio: surveyData.frecuenciaVehiculoPropio || '',
          tipo_vehiculo_propio: surveyData.tipoVehiculoPropio || '',
          tipo_vehiculo_propio_otro: surveyData.tipoVehiculoPropioOtro || '',
          empresa_paga_rodamiento: surveyData.empresaPagaRodamiento || '',
          realiza_inspeccion_propio: surveyData.realizaInspeccionPropio || '',
          frecuencia_chequeo_propio: surveyData.frecuenciaChequeoPropio || '',
          
          // DESPLAZAMIENTOS LABORALES - VEHÍCULO EMPRESA
          usa_vehiculo_empresa: surveyData.usaVehiculoEmpresa || '',
          tipo_vehiculo_empresa: surveyData.tipoVehiculoEmpresa || '',
          tipo_vehiculo_empresa_otro: surveyData.tipoVehiculoEmpresaOtro || '',
          realiza_inspeccion_empresa: surveyData.realizaInspeccionEmpresa || '',
          frecuencia_chequeo_empresa: surveyData.frecuenciaChequeoEmpresa || '',
          
          // PLANIFICACIÓN
          planificacion: surveyData.planificacion || '',
          antelacion: surveyData.antelacion || '',
          km_mensuales: surveyData.kmMensuales || '',  // Campo numérico
          
          // FACTORES DE RIESGO
          riesgos: surveyData.riesgos || [],
          riesgo_otro: surveyData.riesgoOtro || '',
          causas: surveyData.causas || [],
          causa_otra: surveyData.causaOtra || '',
          
          // COMPARENDOS
          tiene_comparendos: surveyData.tieneComparendos || '',
          causas_comparendo: surveyData.causasComparendo || [],
          causa_comparendo_otra: surveyData.causaComparendoOtra || '',
          
          // INFORMACIÓN ADICIONAL
          informacion_adicional: surveyData.informacionAdicional || ''
        };

        setFormData({
          ...initialFormData,
          ...mappedSurveyData
        });
      } else {
        // Si no hay cuestionario, resetear a valores iniciales
        setFormData(initialFormData);
      }
    }
    
    // Resetear estados de edición cuando se cierra el modal
    if (!isOpen) {
      setIsEditingBasic(false);
      setIsEditingSurvey(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowDeleteConfirm(false);
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
  const handleSaveBasic = async () => {
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

    try {
      setIsSaving(true);
      
      // Mapear rol a id_rol
      const roleMap = {
        'Conductor': 1,
        'Supervisor': 2,
        'Administrador': 3
      };

      // Preparar datos para enviar al backend
      const updateData = {
        nombre: basicData.nombre,
        celular: basicData.celular,
        area: basicData.area,
        id_rol: roleMap[basicData.role] || 1
      };

      // Solo incluir password si se proporcionó uno nuevo
      if (basicData.password && basicData.password.trim() !== '') {
        updateData.password = basicData.password;
      }

      // Llamar al servicio para actualizar
      const response = await userService.updateUser(basicData.cedula, updateData);
      
      if (response.success) {
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

        // Llamar callback para recargar datos en la página principal
        if (onUpdate) {
          onUpdate();
        }
        
        // Cerrar modal después de guardar
        onClose();
      } else {
        error(response.message || 'Error al actualizar datos');
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar el usuario';
      error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar datos del cuestionario
  const handleSaveSurvey = async () => {
    try {
      setIsSaving(true);
      console.log('Guardando datos del cuestionario:', formData);
      
      // Mapear datos de snake_case (frontend) a camelCase (backend)
      const surveyData = {
        idUsuario: user.cedula,
        consentimiento: formData.consentimiento,
        ciudad: formData.ciudad,
        sitioLabor: formData.sitio_labor,
        cargo: formData.cargo,
        edad: formData.edad || null,
        tipoContratacion: formData.tipo_contratacion,
        genero: formData.genero,
        grupo: formData.grupo,
        medioTransporteDesplazamiento: formData.medio_transporte_desplazamiento,
        claseVehiculo: formData.clase_vehiculo,
        licencia: formData.licencia,
        vigenciaLicencia: formData.vigencia_licencia_anio && formData.vigencia_licencia_mes && formData.vigencia_licencia_dia
          ? `${formData.vigencia_licencia_anio}-${formData.vigencia_licencia_mes.padStart(2, '0')}-${formData.vigencia_licencia_dia.padStart(2, '0')}`
          : null,
        categoriaLicencia: formData.categoria_licencia,
        experiencia: formData.experiencia || null,
        accidente5Anios: formData.accidente_5_anios,
        accidenteLaboral: formData.accidente_laboral,
        cantidadAccidentes: formData.cantidad_accidentes || null,
        cantidadAccidentesLaborales: formData.cantidad_accidentes_laborales || null,
        rolAccidente: formData.rol_accidente,
        incidente: formData.incidente,
        viasPublicas: formData.vias_publicas,
        frecuenciaVehiculoPropio: formData.frecuencia_vehiculo_propio,
        usaVehiculoEmpresa: formData.usa_vehiculo_empresa,
        planificacion: formData.planificacion,
        antelacion: formData.antelacion,
        kmMensuales: formData.km_mensuales ? parseInt(formData.km_mensuales) : null,
        tieneComparendos: formData.tiene_comparendos,
        medioDesplazamiento: formData.medio_desplazamiento || [],
        riesgos: formData.riesgos || [],
        causas: formData.causas || [],
        causasComparendo: formData.causas_comparendo || [],
        causaComparendoOtra: formData.causa_comparendo_otra || null
      };

      console.log('📤 Datos mapeados a enviar al backend:', surveyData);

      // Enviar al backend
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(surveyData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Mostrar errores detallados de validación
        if (result.errors && result.errors.length > 0) {
          console.error('❌ Errores de validación:', result.errors);
          const errorMessages = result.errors.map(e => `${e.campo}: ${e.mensaje}`).join('\n');
          error(`Errores de validación:\n${errorMessages}`);
        }
        throw new Error(result.message || 'Error al actualizar el cuestionario');
      }

      success('Información del cuestionario actualizada correctamente');
      setIsEditingSurvey(false);
      
      // Recargar los datos de la encuesta para mostrar los cambios guardados
      try {
        const surveyResponse = await fetch(`${API_URL}/survey/user/${user.cedula}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (surveyResponse.ok) {
          const surveyResult = await surveyResponse.json();
          const updatedSurveyData = surveyResult.data;
          
          // Actualizar formData con los datos frescos del backend
          const mappedSurveyData = {
            consentimiento: updatedSurveyData.consentimiento || '',
            ciudad: updatedSurveyData.ciudad || '',
            sitio_labor: updatedSurveyData.sitioLabor || '',
            cargo: updatedSurveyData.cargo || '',
            edad: updatedSurveyData.edad || '',
            tipo_contratacion: updatedSurveyData.tipoContratacion || '',
            genero: updatedSurveyData.genero || '',
            grupo: updatedSurveyData.grupo || '',
            medio_desplazamiento: updatedSurveyData.medioDesplazamiento || [],
            medio_transporte_desplazamiento: updatedSurveyData.medioTransporteDesplazamiento || '',
            clase_vehiculo: updatedSurveyData.claseVehiculo || '',
            licencia: updatedSurveyData.licencia || '',
            vigencia_licencia_dia: updatedSurveyData.vigenciaLicencia ? new Date(updatedSurveyData.vigenciaLicencia).getDate().toString() : '',
            vigencia_licencia_mes: updatedSurveyData.vigenciaLicencia ? (new Date(updatedSurveyData.vigenciaLicencia).getMonth() + 1).toString() : '',
            vigencia_licencia_anio: updatedSurveyData.vigenciaLicencia ? new Date(updatedSurveyData.vigenciaLicencia).getFullYear().toString() : '',
            categoria_licencia: updatedSurveyData.categoriaLicencia || '',
            experiencia: updatedSurveyData.experiencia || '',
            accidente_5_anios: updatedSurveyData.accidente5Anios || '',
            accidente_laboral: updatedSurveyData.accidenteLaboral || '',
            cantidad_accidentes: updatedSurveyData.cantidadAccidentes || '',
            cantidad_accidentes_laborales: updatedSurveyData.cantidadAccidentesLaborales || '',
            rol_accidente: updatedSurveyData.rolAccidente || '',
            incidente: updatedSurveyData.incidente || '',
            vias_publicas: updatedSurveyData.viasPublicas || '',
            frecuencia_vehiculo_propio: updatedSurveyData.frecuenciaVehiculoPropio || '',
            usa_vehiculo_empresa: updatedSurveyData.usaVehiculoEmpresa || '',
            planificacion: updatedSurveyData.planificacion || '',
            antelacion: updatedSurveyData.antelacion || '',
            km_mensuales: updatedSurveyData.kmMensuales || '',
            riesgos: updatedSurveyData.riesgos || [],
            causas: updatedSurveyData.causas || [],
            tiene_comparendos: updatedSurveyData.tieneComparendos || '',
            causas_comparendo: updatedSurveyData.causasComparendo || [],
            causa_comparendo_otra: updatedSurveyData.causaComparendoOtra || ''
          };
          
          setFormData(prev => ({
            ...prev,
            ...mappedSurveyData
          }));
          
          console.log('✅ Datos del cuestionario recargados desde el backend');
        }
      } catch (reloadErr) {
        console.error('Error al recargar datos de la encuesta:', reloadErr);
        // No mostrar error al usuario, los datos se verán al reabrir el modal
      }
      
      // Actualizar la lista de usuarios si existe el callback
      if (onUpdate) {
        onUpdate();
      }
      
      // Cerrar modal después de guardar
      onClose();
    } catch (err) {
      console.error('Error al guardar cuestionario:', err);
      if (!err.message.includes('Errores de validación:')) {
        error(err.message || 'Error al actualizar el cuestionario. Por favor intenta nuevamente.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const response = await userService.deleteUser(user.cedula);

      if (response.success) {
        success('Usuario eliminado correctamente');
        setShowDeleteConfirm(false);
        
        // Cerrar el modal y recargar datos
        onClose();
        if (onUpdate) {
          onUpdate();
        }
      } else {
        error(response.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar el usuario';
      error(errorMessage);
    } finally {
      setIsSaving(false);
    }
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
                    disabled={isSaving}
                    className={`flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg ${
                      isSaving 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Guardar
                      </>
                    )}
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
                    disabled={isSaving}
                    className={`flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg ${
                      isSaving 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
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
                    {renderField('Edad', formData.edad, 'edad', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.edad)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Tipo de Contratación</label>
                    {renderField('Tipo de Contratación', formData.tipo_contratacion, 'tipo_contratacion', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.tipo_contratacion)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Género</label>
                    {renderField('Género', formData.genero, 'genero', isEditingSurvey, handleSurveyChange, 'select', ['Femenino', 'Masculino'])}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Grupo de trabajo</label>
                    {renderField('Grupo', formData.grupo, 'grupo', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.grupo)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Medio de transporte</label>
                    {renderField('Medio transporte', formData.medio_transporte_desplazamiento, 'medio_transporte_desplazamiento', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.medio_transporte_desplazamiento)}
                  </div>
                  <div>
                    <label className="text-sm text-secondary font-semibold mb-1 block">Clase de vehículo</label>
                    {renderField('Clase vehículo', formData.clase_vehiculo, 'clase_vehiculo', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.clase_vehiculo)}
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
                        {renderField('Categoría', formData.categoria_licencia, 'categoria_licencia', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.categoria_licencia)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Experiencia</label>
                        {renderField('Experiencia', formData.experiencia, 'experiencia', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.experiencia)}
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
                        {renderField('Cantidad', formData.cantidad_accidentes, 'cantidad_accidentes', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.cantidad_accidentes)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Cantidad accidentes laborales</label>
                        {renderField('Cantidad laboral', formData.cantidad_accidentes_laborales, 'cantidad_accidentes_laborales', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.cantidad_accidentes)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Rol en accidente</label>
                        {renderField('Rol', formData.rol_accidente, 'rol_accidente', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.rol_accidente)}
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
                        {renderField('Frecuencia', formData.frecuencia_vehiculo_propio, 'frecuencia_vehiculo_propio', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.frecuencia_vehiculo_propio)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Tipo de vehículo propio</label>
                        {renderField('Tipo', formData.tipo_vehiculo_propio, 'tipo_vehiculo_propio', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.tipo_vehiculo_propio)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Tipo de vehículo empresa</label>
                        {renderField('Tipo empresa', formData.tipo_vehiculo_empresa, 'tipo_vehiculo_empresa', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.tipo_vehiculo_empresa)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Frecuencia chequeo propio</label>
                        {renderField('Frecuencia chequeo', formData.frecuencia_chequeo_propio, 'frecuencia_chequeo_propio', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.frecuencia_chequeo)}
                      </div>
                      <div>
                        <label className="text-sm text-secondary font-semibold mb-1 block">Frecuencia chequeo empresa</label>
                        {renderField('Frecuencia chequeo empresa', formData.frecuencia_chequeo_empresa, 'frecuencia_chequeo_empresa', isEditingSurvey, handleSurveyChange, 'select', surveyOptions.frecuencia_chequeo)}
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

                {/* Causas de comparendo - Solo si tiene_comparendos === 'SI' */}
                {formData.tiene_comparendos === 'SI' && (
                  <div className="mt-4">
                    <label className="text-sm text-secondary font-semibold mb-2 block">
                      Causas del comparendo
                    </label>
                    {isEditingSurvey ? (
                      <div className="space-y-2 bg-white p-4 rounded-lg">
                        {[
                          { value: 'Sin licencia', label: 'Por conducir sin portar licencia' },
                          { value: 'Estacionamiento', label: 'Por estacionar en sitios no permitidos' },
                          { value: 'Cinturon', label: 'Por no utilizar el cinturón de seguridad' },
                          { value: 'Velocidad', label: 'Por velocidad superior a la máxima' },
                          { value: 'SOAT', label: 'Por no portar el SOAT' },
                          { value: 'Tecnomecanica', label: 'Por no realizar la revisión técnico-mecánica' },
                          { value: 'Celular', label: 'Por usar celular al volante' },
                          { value: 'Contravia', label: 'Por transitar en contra vía' },
                          { value: 'Semaforo', label: 'Por no detenerse en luz roja' },
                          { value: 'Embriaguez', label: 'Conducir en estado de embriaguez' },
                          { value: 'Otra', label: 'Otra' }
                        ].map((causa) => (
                          <label key={causa.value} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              name="causas_comparendo"
                              value={causa.value}
                              checked={(formData.causas_comparendo || []).includes(causa.value)}
                              onChange={handleSurveyChange}
                              className="w-4 h-4 text-primary focus:ring-primary rounded mt-1 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-700">{causa.label}</span>
                          </label>
                        ))}

                        {/* Campo de texto para "Otra" */}
                        {(formData.causas_comparendo || []).includes('Otra') && (
                          <div className="mt-3">
                            <label className="text-sm text-secondary font-semibold mb-1 block">Especifique otra causa:</label>
                            <input
                              type="text"
                              name="causa_comparendo_otra"
                              value={formData.causa_comparendo_otra || ''}
                              onChange={handleSurveyChange}
                              className="w-full px-3 py-2 border-2 border-primary/30 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
                              placeholder="Especifique la causa..."
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-lg">
                        {formData.causas_comparendo && formData.causas_comparendo.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {formData.causas_comparendo.map((causa, idx) => (
                              <li key={idx} className="text-primary font-semibold">
                                {causa}
                                {causa === 'Otra' && formData.causa_comparendo_otra && (
                                  <span className="text-gray-600 ml-2">({formData.causa_comparendo_otra})</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No especificado</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
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

        {/* Botón de Eliminar Usuario (Zona Peligrosa) */}
        <div className="mt-6 pt-6 border-t-2 border-red-200">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-red-800 font-bold">Zona Peligrosa</p>
                  <p className="text-red-600 text-sm">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isEditingBasic || isEditingSurvey}
                className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors shadow-md ${
                  isEditingBasic || isEditingSurvey
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
                }`}
              >
                <TrashIcon className="w-5 h-5" />
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
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
                <h3 className="text-xl font-bold text-gray-900">¿Eliminar Usuario?</h3>
                <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold mb-2">Se eliminará:</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Nombre: <span className="font-bold">{basicData.nombre}</span></li>
                <li>• Cédula: <span className="font-bold">{basicData.cedula}</span></li>
                <li>• Rol: <span className="font-bold">{basicData.role}</span></li>
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
                onClick={handleDeleteUser}
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

export default UserDetailsModal;
