import { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAlert } from '../context/AlertContext';

const API_URL = import.meta.env.VITE_API_URL;

export const SurveyTalentoHumano = ({ onNavigate, currentUser, accessType }) => {
  const { success, error, warning, info } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    consentimiento: '',
    identificacion: '',
    nombre: '',
    ciudad: '',
    sitio_labor: '',
    area: '',
    cargo: '',
    edad: '',
    tipo_contratacion: '',
    genero: '',
    grupo: '',
    grupo_otro: '',
    medio_transporte_desplazamiento: '',
    clase_vehiculo: '',
    clase_vehiculo_otro: '',
    licencia: '',
    vigencia_licencia_dia: '',
    vigencia_licencia_mes: '',
    vigencia_licencia_anio: '',
    categoria_licencia: '',
    experiencia: '',
    accidente_5_anios: '',
    accidente_laboral: '',
    cantidad_accidentes: '',
    cantidad_accidentes_laborales: '',
    rol_accidente: '',
    incidente: '',
    vias_publicas: '',
    medio_desplazamiento: [],
    frecuencia_vehiculo_propio: '',
    tipo_vehiculo_propio: '',
    tipo_vehiculo_propio_otro: '',
    empresa_paga_rodamiento: '',
    realiza_inspeccion_propio: '',
    usa_vehiculo_empresa: '',
    frecuencia_chequeo_propio: '',
    tipo_vehiculo_empresa: '',
    tipo_vehiculo_empresa_otro: '',
    planificacion: '',
    antelacion: '',
    km_mensuales: '',
    realiza_inspeccion_empresa: '',
    frecuencia_chequeo_empresa: '',
    riesgos: [],
    riesgo_otro: '',
    causas: [],
    causa_otra: '',
    tiene_comparendos: '',
    causas_comparendo: [],
    causa_comparendo_otra: ''
  });

  // Cargar datos del usuario y encuesta previa al montar el componente
  useEffect(() => {
    const loadUserDataAndSurvey = async () => {
      setIsLoading(true);
      
      try {
        // Autocompletar datos básicos del usuario logueado
        if (currentUser) {
          setFormData(prev => ({
            ...prev,
            identificacion: currentUser.cedula || '',
            nombre: currentUser.nombre || currentUser.name || '',
            area: currentUser.area || ''
          }));

          // Intentar cargar encuesta previa del usuario
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/survey/user/${currentUser.cedula}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data) {
                const survey = result.data;
                
                // Mapear datos de la encuesta a formData
                setFormData(prev => ({
                  ...prev,
                  consentimiento: survey.consentimiento || '',
                  ciudad: survey.ciudad || '',
                  sitio_labor: survey.sitioLabor || '',
                  cargo: survey.cargo || '',
                  edad: survey.edad || '',  // Ya viene como string desde backend (ej: "18-27")
                  tipo_contratacion: survey.tipoContratacion || '',
                  genero: survey.genero || '',
                  grupo: survey.grupo || '',
                  medio_transporte_desplazamiento: survey.medioTransporteDesplazamiento || '',
                  clase_vehiculo: survey.claseVehiculo || '',
                  licencia: survey.licencia || '',
                  vigencia_licencia_dia: survey.vigenciaLicencia ? new Date(survey.vigenciaLicencia).getDate().toString() : '',
                  vigencia_licencia_mes: survey.vigenciaLicencia ? (new Date(survey.vigenciaLicencia).getMonth() + 1).toString() : '',
                  vigencia_licencia_anio: survey.vigenciaLicencia ? new Date(survey.vigenciaLicencia).getFullYear().toString() : '',
                  categoria_licencia: survey.categoriaLicencia || '',
                  experiencia: survey.experiencia || '',  // Ya viene como string desde backend (ej: "1-4")
                  accidente_5_anios: survey.accidente5Anios || '',
                  accidente_laboral: survey.accidenteLaboral || '',
                  cantidad_accidentes: survey.cantidadAccidentes || '',  // Ya viene como string desde backend (ej: "1-5")
                  vias_publicas: survey.viasPublicas || '',
                  medio_desplazamiento: survey.medioDesplazamiento || [],
                  frecuencia_vehiculo_propio: survey.frecuenciaVehiculoPropio || '',
                  usa_vehiculo_empresa: survey.usaVehiculoEmpresa || '',
                  planificacion: survey.planificacion || '',
                  km_mensuales: survey.kmMensuales?.toString() || '',  // Este SÍ es número, se convierte a string para el input
                  tiene_comparendos: survey.tieneComparendos || '',
                  riesgos: survey.riesgos || [],
                  causas: survey.causas || [],
                  causas_comparendo: survey.causasComparendo || []
                }));

                info('Tus datos previos han sido cargados. Puedes actualizarlos si es necesario.');
              }
            }
          } catch (err) {
            console.log('No hay encuesta previa o error al cargar:', err.message);
            // No mostrar error, es normal que no haya datos previos
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDataAndSurvey();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [name]: [...prev[name], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Mostrar alerta cuando rechace el consentimiento
      if (name === 'consentimiento') {
        if (value === 'NO') {
          warning('No se puede continuar sin autorización para el tratamiento de datos personales', 8000);
        } else if (value === 'SI') {
          success('¡Gracias por su autorización! Puede continuar con el cuestionario');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que ha dado consentimiento
    if (formData.consentimiento !== 'SI') {
      error('Debe autorizar el tratamiento de datos personales para continuar');
      return;
    }

    // Validar campos obligatorios básicos
    if (!formData.identificacion || !formData.nombre || !formData.ciudad) {
      warning('Por favor complete los campos obligatorios: Documento, Nombre y Ciudad');
      return;
    }

    try {
      // Preparar datos para enviar al backend
      const surveyData = {
        idUsuario: formData.identificacion,
        consentimiento: formData.consentimiento,
        ciudad: formData.ciudad,
        sitioLabor: formData.sitio_labor,
        cargo: formData.cargo,
        edad: formData.edad || null,  // String con rango (ej: "18-27", "28-37")
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
        experiencia: formData.experiencia || null,  // String con rango (ej: "1-4", "5-10")
        accidente5Anios: formData.accidente_5_anios,
        accidenteLaboral: formData.accidente_laboral,
        cantidadAccidentes: formData.cantidad_accidentes || null,  // String con rango (ej: "1", "1-5")
        viasPublicas: formData.vias_publicas,
        frecuenciaVehiculoPropio: formData.frecuencia_vehiculo_propio,
        usaVehiculoEmpresa: formData.usa_vehiculo_empresa,
        planificacion: formData.planificacion,
        kmMensuales: formData.km_mensuales ? parseInt(formData.km_mensuales) : null,  // Este SÍ es número
        tieneComparendos: formData.tiene_comparendos,
        medioDesplazamiento: formData.medio_desplazamiento || [],
        riesgos: formData.riesgos || [],
        causas: formData.causas || [],
        causasComparendo: formData.causas_comparendo || []
      };

      // Debug: Mostrar datos que se van a enviar
      console.log('📤 Datos a enviar al backend:', surveyData);

      // Enviar al backend
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
        throw new Error(result.message || 'Error al enviar el cuestionario');
      }

      success('¡Cuestionario enviado exitosamente! Gracias por su participación', 6000);
      
      // Redirigir después de un delay
      setTimeout(() => {
        info('Redirigiendo...');
        setTimeout(() => {
          onNavigate && onNavigate('home');
        }, 1500);
      }, 2000);
    } catch (err) {
      console.error('Error al enviar cuestionario:', err);
      if (!err.message.includes('Errores de validación:')) {
        error(err.message || 'Error al enviar el cuestionario. Por favor intenta nuevamente.');
      }
    }
  };

  return (
    <div className="py-4 md:py-8 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Botón volver solo para usuarios con acceso completo */}
      {accessType !== 'survey_only' && (
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="mb-4 md:mb-6 flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver al Inicio
        </button>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg className="animate-spin h-10 w-10 md:h-12 md:w-12 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600 font-semibold">Cargando tus datos...</p>
          </div>
        </div>
      )}

      {!isLoading && (
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6 text-center">
          ENCUESTA DE SEGURIDAD VIAL
        </h2>

        {/* Mostrar información del usuario */}
        {currentUser && (
          <div className="mb-4 md:mb-6 bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded">
            <p className="text-blue-800 font-semibold text-sm md:text-base">
                Encuesta para: <span className="text-blue-900">{currentUser.nombre || currentUser.name}</span>
            </p>
            <p className="text-blue-700 text-xs md:text-sm mt-1">
              Documento: {currentUser.cedula} • Área: {currentUser.area}
            </p>
          </div>
        )}

        <div className="mb-6 bg-blue-50 border-l-4 border-primary p-4 rounded">
          <p className="text-primary font-semibold text-sm">
            <span className="text-red-500">*</span> Los campos marcados con asterisco son obligatorios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* CONSENTIMIENTO INFORMADO */}
          <div className="border-b pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">CONSENTIMIENTO INFORMADO</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="bg-blue-50 border-l-4 border-primary p-3 md:p-4 rounded mb-3 md:mb-4">
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                  De acuerdo con la <strong>Ley Estatutaria 1581 de 2012 de Protección de Datos</strong> y normas concordantes, 
                  autorizo con el diligenciamiento y envío de la encuesta de seguridad vial para que mis datos personales 
                  registrados en la encuesta sean incorporados en una base de datos responsabilidad de <strong>NOMBRE DE LA EMPRESA</strong> para 
                  que sean tratados con la finalidad de realizar gestión administrativa, gestión de estadísticas internas 
                  y realizar la actualización del plan estratégico de seguridad vial.
                </p>
              </div>
              <p className="text-gray-700 font-semibold mb-2 md:mb-3 text-sm md:text-base">Consentimiento de tratamiento de datos</p>
              <div className="flex flex-wrap gap-4 md:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="consentimiento"
                    value="SI"
                    checked={formData.consentimiento === 'SI'}
                    onChange={handleInputChange}
                    required
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">SI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="consentimiento"
                    value="NO"
                    checked={formData.consentimiento === 'NO'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">NO</span>
                </label>
              </div>
              {formData.consentimiento === 'NO' && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 font-semibold">
                    Lo sentimos, no podemos continuar sin su consentimiento para el tratamiento de datos personales.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mostrar el resto del formulario solo si ha dado consentimiento */}
          {formData.consentimiento === 'SI' && (
            <>
          {/* DATOS GENERALES */}
          <div className="border-b pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">DATOS GENERALES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Número de Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Campo autocompletado</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Campo autocompletado</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Sitio de labor</label>
                <input
                  type="text"
                  name="sitio_labor"
                  value={formData.sitio_labor}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Área</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Cargo</label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Edad</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    { value: 'Menor de 18', label: 'A. Menor de 18 años' },
                    { value: '18-27', label: 'B. 18-27 años' },
                    { value: '28-37', label: 'C. 28-37 años' },
                    { value: '38-47', label: 'D. 38-47 años' },
                    { value: '48 o mas', label: 'E. 48 años o más' }
                  ].map((edad) => (
                    <label key={edad.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edad"
                        value={edad.value}
                        checked={formData.edad === edad.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm md:text-base">{edad.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Tipo de contratación <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { value: 'Termino fijo', label: 'A. Contrato a término fijo' },
                    { value: 'Termino indefinido', label: 'B. Contrato a término indefinido' },
                    { value: 'Obra o labor', label: 'C. Contrato por obra o labor' },
                    { value: 'Prestacion servicio', label: 'D. Contrato de prestación de servicio' },
                    { value: 'Honorarios', label: 'E. Honorarios/servicios profesionales' },
                    { value: 'Aprendizaje', label: 'F. Contrato de aprendizaje' }
                  ].map((tipo) => (
                    <label key={tipo.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tipo_contratacion"
                        value={tipo.value}
                        checked={formData.tipo_contratacion === tipo.value}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm md:text-base">{tipo.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Género <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="genero"
                      value="Femenino"
                      checked={formData.genero === 'Femenino'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 text-sm md:text-base">A. Femenino</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="genero"
                      value="Masculino"
                      checked={formData.genero === 'Masculino'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 text-sm md:text-base">B. Masculino</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Grupo de trabajo al que pertenece <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'Administrativo', label: 'A. Administrativo' },
                    { value: 'Comercial', label: 'B. Comercial' },
                    { value: 'Tecnico', label: 'C. Técnico' },
                    { value: 'Operativo', label: 'D. Operativo' },
                    { value: 'Otro', label: 'E. Otro' }
                  ].map((grupo) => (
                    <label key={grupo.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="grupo"
                        value={grupo.value}
                        checked={formData.grupo === grupo.value}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm md:text-base">{grupo.label}</span>
                    </label>
                  ))}
                </div>
                {formData.grupo === 'Otro' && (
                  <div className="mt-3">
                    <label className="block text-gray-700 mb-2 text-sm md:text-base">¿Cuál?</label>
                    <input
                      type="text"
                      name="grupo_otro"
                      value={formData.grupo_otro}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Medio de transporte que usa para el desplazamiento <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'Transporte empresa', label: 'A. Transporte que proporciona la empresa' },
                    { value: 'Transporte publico', label: 'B. Transporte público' },
                    { value: 'A pie', label: 'C. A pie' },
                    { value: 'Vehiculo propio', label: 'D. Vehículo propio' }
                  ].map((medio) => (
                    <label key={medio.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="medio_transporte_desplazamiento"
                        value={medio.value}
                        checked={formData.medio_transporte_desplazamiento === medio.value}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm md:text-base">{medio.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  ¿Qué clase de vehículo usa para su desplazamiento? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'Carro', label: 'A. Carro' },
                    { value: 'Moto', label: 'B. Moto' },
                    { value: 'Bicicleta', label: 'C. Bicicleta' },
                    { value: 'Patines', label: 'D. Patines' },
                    { value: 'Otro', label: 'E. Otro' }
                  ].map((clase) => (
                    <label key={clase.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="clase_vehiculo"
                        value={clase.value}
                        checked={formData.clase_vehiculo === clase.value}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm md:text-base">{clase.label}</span>
                    </label>
                  ))}
                </div>
                {formData.clase_vehiculo === 'Otro' && (
                  <div className="mt-3">
                    <label className="block text-gray-700 mb-2 text-sm md:text-base">¿Cuál?</label>
                    <input
                      type="text"
                      name="clase_vehiculo_otro"
                      value={formData.clase_vehiculo_otro}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LICENCIA DE CONDUCCIÓN */}
          <div className="border-b pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">LICENCIA DE CONDUCCIÓN</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 md:p-4 rounded mb-3 md:mb-4">
              <p className="text-yellow-800 text-sm font-semibold">
                Si cuenta con licencia de conducción y usa vehículo automotor, responda el siguiente bloque de preguntas
              </p>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  ¿Posee licencia de conducción? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="licencia"
                      value="SI"
                      checked={formData.licencia === 'SI'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 text-sm md:text-base">SI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="licencia"
                      value="NO"
                      checked={formData.licencia === 'NO'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 text-sm md:text-base">NO</span>
                  </label>
                </div>
              </div>

              {formData.licencia === 'SI' && (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Mencione fecha de vigencia de la licencia</label>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <div>
                        <label className="block text-gray-600 text-xs md:text-sm mb-1">Día</label>
                        <input
                          type="number"
                          name="vigencia_licencia_dia"
                          value={formData.vigencia_licencia_dia}
                          onChange={handleInputChange}
                          min="1"
                          max="31"
                          placeholder="DD"
                          className="w-full px-2 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 text-sm mb-1">Mes</label>
                        <input
                          type="number"
                          name="vigencia_licencia_mes"
                          value={formData.vigencia_licencia_mes}
                          onChange={handleInputChange}
                          min="1"
                          max="12"
                          placeholder="MM"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 text-sm mb-1">Año</label>
                        <input
                          type="number"
                          name="vigencia_licencia_anio"
                          value={formData.vigencia_licencia_anio}
                          onChange={handleInputChange}
                          min="2024"
                          max="2050"
                          placeholder="AAAA"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Mencione la categoría de licencia</label>
                    <div className="space-y-2">
                      {[
                        { value: 'A1', label: 'A. A1 - Motocicletas de menos de 125 centímetros cúbicos' },
                        { value: 'A2', label: 'B. A2 - Motocicletas de más de 125 centímetros cúbicos' },
                        { value: 'B1', label: 'C. B1 - Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses' },
                        { value: 'B2', label: 'D. B2 - Camiones rígidos, busetas y buses' },
                        { value: 'B3', label: 'E. B3 - Vehículos articulados y tractocamiones de servicio particular' },
                        { value: 'C1', label: 'F. C1 (Antes categoría 4) - Especializados en automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses de servicio público' },
                        { value: 'C2', label: 'G. C2 (Antes categoría 5) - Para conducir camiones rígidos, buses y busetas de servicio público' },
                        { value: 'C3', label: 'H. C3 (Antes categoría 6 público) - Para vehículos articulados de servicio público' }
                      ].map((cat) => (
                        <label key={cat.value} className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="categoria_licencia"
                            value={cat.value}
                            checked={formData.categoria_licencia === cat.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary focus:ring-primary mt-1 flex-shrink-0"
                          />
                          <span className="text-gray-700 text-xs md:text-sm">{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">Experiencia en la conducción</label>
                    <div className="space-y-2">
                      {[
                        { value: '1-4', label: 'A. De 1 a 4 años' },
                        { value: '5-10', label: 'B. De 5 a 10 años' },
                        { value: 'Mas de 10', label: 'C. Más de 10 años' }
                      ].map((exp) => (
                        <label key={exp.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="experiencia"
                            value={exp.value}
                            checked={formData.experiencia === exp.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                          />
                          <span className="text-gray-700 text-sm md:text-base">{exp.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">¿Ha tenido en los últimos cinco años algún accidente de tránsito?</label>
                    <div className="flex flex-wrap gap-3 md:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accidente_5_anios"
                          value="SI"
                          checked={formData.accidente_5_anios === 'SI'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">SI</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accidente_5_anios"
                          value="NO"
                          checked={formData.accidente_5_anios === 'NO'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">NO</span>
                      </label>
                    </div>
                  </div>

                  {formData.accidente_5_anios === 'SI' && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                          Este accidente de tránsito fue durante el desarrollo de las actividades misionales de la compañía?
                        </label>
                        <div className="flex flex-wrap gap-3 md:gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="accidente_laboral"
                              value="SI"
                              checked={formData.accidente_laboral === 'SI'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">SI</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="accidente_laboral"
                              value="NO"
                              checked={formData.accidente_laboral === 'NO'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">NO</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          ¿Cuántos accidentes de tránsito ha tenido en los últimos 5 años?
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: '1', label: 'A. 1' },
                            { value: '1-5', label: 'B. Entre 1 y 5' },
                            { value: 'Mas de 5', label: 'C. Más de 5' },
                            { value: 'Ninguno', label: 'D. Ninguno' }
                          ].map((cant) => (
                            <label key={cant.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="cantidad_accidentes"
                                value={cant.value}
                                checked={formData.cantidad_accidentes === cant.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-gray-700">{cant.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          ¿Cuántos de estos accidentes fueron realizando labores misionales de la compañía?
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: '1', label: 'A. 1' },
                            { value: '1-5', label: 'B. Entre 1 y 5' },
                            { value: 'Mas de 5', label: 'C. Más de 5' },
                            { value: 'Ninguno', label: 'D. Ninguno' }
                          ].map((cant) => (
                            <label key={cant.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="cantidad_accidentes_laborales"
                                value={cant.value}
                                checked={formData.cantidad_accidentes_laborales === cant.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-gray-700">{cant.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">¿Qué rol desempeñó en el accidente?</label>
                        <div className="space-y-2">
                          {[
                            { value: 'Peaton', label: 'A. Peatón' },
                            { value: 'Conductor vehiculo', label: 'B. Conductor de vehículo' },
                            { value: 'Conductor moto', label: 'C. Conductor de motocicleta' },
                            { value: 'Pasajero', label: 'D. Pasajero' }
                          ].map((rol) => (
                            <label key={rol.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="rol_accidente"
                                value={rol.value}
                                checked={formData.rol_accidente === rol.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-gray-700">{rol.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                      ¿Ha tenido en los últimos 5 años algún incidente de tránsito produciendo daños materiales, pero no personales?
                    </label>
                    <div className="flex flex-wrap gap-3 md:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="incidente"
                          value="SI"
                          checked={formData.incidente === 'SI'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">SI</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="incidente"
                          value="NO"
                          checked={formData.incidente === 'NO'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">NO</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DESPLAZAMIENTOS LABORALES */}
          <div className="border-b pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">DESPLAZAMIENTOS LABORALES</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  ¿Para el cumplimiento de sus funciones debe salir a vías públicas en horarios laborales? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vias_publicas"
                      value="SI"
                      checked={formData.vias_publicas === 'SI'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">SI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vias_publicas"
                      value="NO"
                      checked={formData.vias_publicas === 'NO'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">NO</span>
                  </label>
                </div>
              </div>

              {formData.vias_publicas === 'SI' && (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                      ¿Comúnmente cómo realiza estos desplazamientos? (Indique los diferentes medios de transporte que utiliza)
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'Conduciendo propio', label: 'A. Conduciendo vehículo propio' },
                        { value: 'Servicio publico', label: 'B. Pasajero servicio público' },
                        { value: 'Peaton', label: 'C. Peatón' },
                        { value: 'Vehiculo empresa', label: 'D. Vehículo asignado por la empresa' }
                      ].map((medio) => (
                        <label key={medio.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="medio_desplazamiento"
                            value={medio.value}
                            checked={formData.medio_desplazamiento.includes(medio.value)}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary focus:ring-primary rounded flex-shrink-0"
                          />
                          <span className="text-gray-700 text-sm md:text-base">{medio.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      ¿Con qué frecuencia realiza desplazamientos en misiones o propias de la compañía en vehículo propio?
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'Diario', label: 'A. A diario' },
                        { value: 'Semanal', label: 'B. Una o dos veces a la semana' },
                        { value: 'Bimestral', label: 'C. Una o dos veces de manera bimestral' },
                        { value: 'Trimestral', label: 'D. Una o dos veces de manera trimestral' },
                        { value: 'Semestral', label: 'E. Una o dos veces de manera semestral' },
                        { value: 'No uso', label: 'F. No uso mi vehículo para labores de la compañía' }
                      ].map((freq) => (
                        <label key={freq.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="frecuencia_vehiculo_propio"
                            value={freq.value}
                            checked={formData.frecuencia_vehiculo_propio === freq.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-gray-700">{freq.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.frecuencia_vehiculo_propio && formData.frecuencia_vehiculo_propio !== 'No uso' && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          ¿Qué vehículo automotor propio usa para realizar labores misionales o propias de la compañía?
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'Moto', label: 'A. Moto' },
                            { value: 'Carro', label: 'B. Carro' },
                            { value: 'Bicicleta', label: 'C. Bicicleta' },
                            { value: 'No uso', label: 'D. No uso mi vehículo para labores de la compañía' },
                            { value: 'Otro', label: 'E. Otro' }
                          ].map((tipo) => (
                            <label key={tipo.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tipo_vehiculo_propio"
                                value={tipo.value}
                                checked={formData.tipo_vehiculo_propio === tipo.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-gray-700">{tipo.label}</span>
                            </label>
                          ))}
                        </div>
                        {formData.tipo_vehiculo_propio === 'Otro' && (
                          <div className="mt-3">
                            <label className="block text-gray-700 mb-2">¿Cuál?</label>
                            <input
                              type="text"
                              name="tipo_vehiculo_propio_otro"
                              value={formData.tipo_vehiculo_propio_otro}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                          Si usa vehículo propio para labores misionales, ¿La empresa paga rodamiento?
                        </label>
                        <div className="flex flex-wrap gap-3 md:gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="empresa_paga_rodamiento"
                              value="SI"
                              checked={formData.empresa_paga_rodamiento === 'SI'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">SI</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="empresa_paga_rodamiento"
                              value="NO"
                              checked={formData.empresa_paga_rodamiento === 'NO'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">NO</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                          Antes de usar su vehículo para labores de la compañía, ¿Realiza la lista de inspección al vehículo?
                        </label>
                        <div className="flex flex-wrap gap-3 md:gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="realiza_inspeccion_propio"
                              value="SI"
                              checked={formData.realiza_inspeccion_propio === 'SI'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">SI</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="realiza_inspeccion_propio"
                              value="NO"
                              checked={formData.realiza_inspeccion_propio === 'NO'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">NO</span>
                          </label>
                        </div>
                      </div>

                      {formData.realiza_inspeccion_propio === 'SI' && (
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Con qué frecuencia realiza la lista de chequeo a su vehículo
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'Diario', label: 'A. Diario' },
                              { value: 'Semanal', label: 'B. Semanal' },
                              { value: 'Mensual', label: 'C. Mensual' },
                              { value: 'Anual', label: 'D. Anual' },
                              { value: 'No realiza', label: 'E. No realiza inspección al vehículo' }
                            ].map((freq) => (
                              <label key={freq.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="frecuencia_chequeo_propio"
                                  value={freq.value}
                                  checked={formData.frecuencia_chequeo_propio === freq.value}
                                  onChange={handleInputChange}
                                  className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-700">{freq.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                      ¿Usa vehículo asignado por la compañía para realizar labores misionales?
                    </label>
                    <div className="flex flex-wrap gap-3 md:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="usa_vehiculo_empresa"
                          value="SI"
                          checked={formData.usa_vehiculo_empresa === 'SI'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">SI</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="usa_vehiculo_empresa"
                          value="NO"
                          checked={formData.usa_vehiculo_empresa === 'NO'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">NO</span>
                      </label>
                    </div>
                  </div>

                  {formData.usa_vehiculo_empresa === 'SI' && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          ¿Qué vehículo automotor le fue asignado para realizar labores misionales o propias de la compañía?
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'Moto', label: 'A. Moto' },
                            { value: 'Carro', label: 'B. Carro' },
                            { value: 'Bicicleta', label: 'C. Bicicleta' },
                            { value: 'Otro', label: 'D. Otro' }
                          ].map((tipo) => (
                            <label key={tipo.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tipo_vehiculo_empresa"
                                value={tipo.value}
                                checked={formData.tipo_vehiculo_empresa === tipo.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-gray-700">{tipo.label}</span>
                            </label>
                          ))}
                        </div>
                        {formData.tipo_vehiculo_empresa === 'Otro' && (
                          <div className="mt-3">
                            <label className="block text-gray-700 mb-2">¿Cuál?</label>
                            <input
                              type="text"
                              name="tipo_vehiculo_empresa_otro"
                              value={formData.tipo_vehiculo_empresa_otro}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                          Antes de usar el vehículo que le fue asignado para labores propias de la compañía, ¿Realiza la lista de inspecciones al vehículo?
                        </label>
                        <div className="flex flex-wrap gap-3 md:gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="realiza_inspeccion_empresa"
                              value="SI"
                              checked={formData.realiza_inspeccion_empresa === 'SI'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">SI</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="realiza_inspeccion_empresa"
                              value="NO"
                              checked={formData.realiza_inspeccion_empresa === 'NO'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-gray-700">NO</span>
                          </label>
                        </div>
                      </div>

                      {formData.realiza_inspeccion_empresa === 'SI' && (
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Con qué frecuencia realiza la lista de chequeo al vehículo que le fue asignado
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: 'Diario', label: 'A. Diario' },
                              { value: 'Semanal', label: 'B. Semanal' },
                              { value: 'Mensual', label: 'C. Mensual' },
                              { value: 'Anual', label: 'D. Anual' },
                              { value: 'No realiza', label: 'E. No realiza inspección al vehículo' }
                            ].map((freq) => (
                              <label key={freq.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="frecuencia_chequeo_empresa"
                                  value={freq.value}
                                  checked={formData.frecuencia_chequeo_empresa === freq.value}
                                  onChange={handleInputChange}
                                  className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-700">{freq.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* PLANIFICACIÓN */}
          <div className="border-b pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">PLANIFICACIÓN</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Mis desplazamientos en misiones son, en general, planificados por <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planificacion"
                      value="Yo"
                      checked={formData.planificacion === 'Yo'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">A. Yo los planifico</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="planificacion"
                      value="Empresa"
                      checked={formData.planificacion === 'Empresa'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">B. La empresa los planifica</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Con cuánto tiempo de antelación se suelen prever las labores y recorridos <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: '1 dia', label: 'A. 1 día antes' },
                    { value: '1 semana', label: 'B. 1 semana antes' },
                    { value: '1 mes', label: 'C. 1 mes antes' },
                    { value: 'No programa', label: 'D. No hay programa' }
                  ].map((ant) => (
                    <label key={ant.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="antelacion"
                        value={ant.value}
                        checked={formData.antelacion === ant.value}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">{ant.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Número de kilómetros mensuales recorridos en la labor misional <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="km_mensuales"
                    value={formData.km_mensuales}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    required
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-gray-700 font-semibold text-sm md:text-base whitespace-nowrap">KM</span>
                </div>
              </div>
            </div>
          </div>

          {/* FACTORES DE RIESGO */}
          <div className="border-b pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">FACTORES DE RIESGO</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Principales factores de riesgo con los que se encuentra (Tanto en los trayectos ida-vuelta del domicilio a los desplazamientos en misión)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'Infraestructura', label: 'A. Estado de la infraestructura/vía mi vehículo' },
                    { value: 'Organizacion', label: 'B. La organización del trabajo' },
                    { value: 'Conduccion', label: 'C. Mi propia conducción' },
                    { value: 'Otra', label: 'D. Otra' }
                  ].map((riesgo) => (
                    <label key={riesgo.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="riesgos"
                        value={riesgo.value}
                        checked={formData.riesgos.includes(riesgo.value)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                      />
                      <span className="text-gray-700">{riesgo.label}</span>
                    </label>
                  ))}
                </div>
                {formData.riesgos.includes('Otra') && (
                  <div className="mt-3">
                    <label className="block text-gray-700 mb-2 text-sm md:text-base">¿Cuál?</label>
                    <input
                      type="text"
                      name="riesgo_otro"
                      value={formData.riesgo_otro}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Causas que motivan el riesgo (Indique todos los que considera adecuados, en su caso)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'Trafico', label: 'A. Condiciones de tráfico' },
                    { value: 'Clima', label: 'B. Condiciones climatológicas' },
                    { value: 'Vehiculo', label: 'C. Tipo de vehículo o sus características estado del vehículo' },
                    { value: 'Laborales', label: 'D. Condiciones laborales (agenda, reuniones, tiempo de entrega, etc)' },
                    { value: 'Otros conductores', label: 'E. Otros conductores' },
                    { value: 'Infraestructura', label: 'F. Estado de infraestructura/vía' },
                    { value: 'Falta formacion', label: 'G. Falta de información o formación en seguridad vial' },
                    { value: 'Propia conduccion', label: 'H. Su propia conducción' },
                    { value: 'Otra', label: 'I. Otra' }
                  ].map((causa) => (
                    <label key={causa.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="causas"
                        value={causa.value}
                        checked={formData.causas.includes(causa.value)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary focus:ring-primary rounded"
                      />
                      <span className="text-gray-700">{causa.label}</span>
                    </label>
                  ))}
                </div>
                {formData.causas.includes('Otra') && (
                  <div className="mt-3">
                    <label className="block text-gray-700 mb-2 text-sm md:text-base">¿Cuál?</label>
                    <input
                      type="text"
                      name="causa_otra"
                      value={formData.causa_otra}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COMPARENDOS */}
          <div className="pb-4 md:pb-6">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">COMPARENDOS</h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  A la fecha tiene comparendos <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tiene_comparendos"
                      value="SI"
                      checked={formData.tiene_comparendos === 'SI'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 text-sm md:text-base">SI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tiene_comparendos"
                      value="NO"
                      checked={formData.tiene_comparendos === 'NO'}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-primary focus:ring-primary flex-shrink-0"
                    />
                    <span className="text-gray-700 text-sm md:text-base">NO</span>
                  </label>
                </div>
              </div>

              {formData.tiene_comparendos === 'SI' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                    Si mencionó que sí, informe la causa del comparendo
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'Sin licencia', label: 'A. Por conducir en vehículo sin portar licencia de conducción' },
                      { value: 'Estacionamiento', label: 'B. Por estacionar un vehículo en sitios no permitidos' },
                      { value: 'Cinturon', label: 'C. Por no utilizar el cinturón de seguridad' },
                      { value: 'Velocidad', label: 'D. Por conducir un vehículo a velocidad superior a la máxima' },
                      { value: 'SOAT', label: 'E. Por no portar el SOAT' },
                      { value: 'Tecnomecanica', label: 'F. Por no realizar la revisión técnico-mecánica del vehículo' },
                      { value: 'Celular', label: 'G. Por utilizar sistemas móviles de comunicación o teléfonos al volante' },
                      { value: 'Contravia', label: 'H. Por transitar en contra vía' },
                      { value: 'Semaforo', label: 'I. Por no detenerse ante la luz roja del semáforo o una señal de tránsito' },
                      { value: 'Embriaguez', label: 'J. Conducir en estado de embriaguez' },
                      { value: 'Otra', label: 'K. Otra' }
                    ].map((causa) => (
                      <label key={causa.value} className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="causas_comparendo"
                          value={causa.value}
                          checked={formData.causas_comparendo.includes(causa.value)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary rounded mt-1 flex-shrink-0"
                        />
                        <span className="text-gray-700 text-xs md:text-sm">{causa.label}</span>
                      </label>
                    ))}
                  </div>
                  {formData.causas_comparendo.includes('Otra') && (
                    <div className="mt-3">
                      <label className="block text-gray-700 mb-2 text-sm md:text-base">¿Cuál?</label>
                      <input
                        type="text"
                        name="causa_comparendo_otra"
                        value={formData.causa_comparendo_otra}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </>
          )}

          {/* Botón de envío - Solo visible si ha dado consentimiento */}
          {formData.consentimiento === 'SI' && (
          <div className="flex flex-col items-center gap-3 md:gap-4 pt-4 md:pt-6">
            <button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 md:px-12 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-sm md:text-base"
            >
              Enviar Encuesta
            </button>
            <p className="text-gray-600 text-center text-xs md:text-sm px-4">Gracias por su participación en esta encuesta de seguridad vial</p>
          </div>
          )}
        </form>
      </div>
      )}
    </div>
  );
};

export default SurveyTalentoHumano;
