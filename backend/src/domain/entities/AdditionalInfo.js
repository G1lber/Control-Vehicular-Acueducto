/**
 * Entidad AdditionalInfo - Representa información adicional/cuestionario PESV de un usuario
 * 
 * Parte del DOMAIN (Capa de Dominio - Arquitectura Hexagonal)
 * Esta capa contiene las reglas de negocio puras para el cuestionario de seguridad vial
 */

class AdditionalInfo {
  constructor(data = {}) {
    // IDs y metadata
    this.id_adicional = data.id_adicional || null;
    this.id_usuario = data.id_usuario;
    this.fecha_registro = data.fecha_registro || new Date();

    // Consentimiento y datos básicos
    this.consentimiento = data.consentimiento;
    this.ciudad = data.ciudad || null;
    this.sitio_labor = data.sitio_labor || null;
    this.cargo = data.cargo || null;

    // Datos personales
    this.edad = data.edad || null;
    this.tipo_contratacion = data.tipo_contratacion || null;
    this.genero = data.genero || null;
    this.grupo = data.grupo || null;
    this.grupo_otro = data.grupo_otro || null;

    // Transporte y movilidad
    this.medio_transporte_desplazamiento = data.medio_transporte_desplazamiento || null;
    this.clase_vehiculo = data.clase_vehiculo || null;
    this.clase_vehiculo_otro = data.clase_vehiculo_otro || null;

    // Licencia de conducción
    this.licencia = data.licencia || null;
    this.vigencia_licencia = data.vigencia_licencia || null;
    this.categoria_licencia = data.categoria_licencia || null;
    this.experiencia = data.experiencia || null;

    // Accidentes e incidentes
    this.accidente_5_anios = data.accidente_5_anios || null;
    this.accidente_laboral = data.accidente_laboral || null;
    this.cantidad_accidentes = data.cantidad_accidentes || null;
    this.cantidad_accidentes_laborales = data.cantidad_accidentes_laborales || null;
    this.rol_accidente = data.rol_accidente || null;
    this.incidente = data.incidente || null;

    // Desplazamientos laborales
    this.vias_publicas = data.vias_publicas || null;
    this.frecuencia_vehiculo_propio = data.frecuencia_vehiculo_propio || null;
    this.tipo_vehiculo_propio = data.tipo_vehiculo_propio || null;
    this.tipo_vehiculo_propio_otro = data.tipo_vehiculo_propio_otro || null;
    this.empresa_paga_rodamiento = data.empresa_paga_rodamiento || null;
    this.realiza_inspeccion_propio = data.realiza_inspeccion_propio || null;
    this.frecuencia_chequeo_propio = data.frecuencia_chequeo_propio || null;

    // Vehículo empresa
    this.usa_vehiculo_empresa = data.usa_vehiculo_empresa || null;
    this.tipo_vehiculo_empresa = data.tipo_vehiculo_empresa || null;
    this.tipo_vehiculo_empresa_otro = data.tipo_vehiculo_empresa_otro || null;
    this.realiza_inspeccion_empresa = data.realiza_inspeccion_empresa || null;
    this.frecuencia_chequeo_empresa = data.frecuencia_chequeo_empresa || null;

    // Planificación
    this.planificacion = data.planificacion || null;
    this.antelacion = data.antelacion || null;
    this.km_mensuales = data.km_mensuales ? parseInt(data.km_mensuales) : null;

    // Comparendos
    this.tiene_comparendos = data.tiene_comparendos || null;

    // Campos JSON (arrays)
    this.medio_desplazamiento = this._parseJsonField(data.medio_desplazamiento);
    this.riesgos = this._parseJsonField(data.riesgos);
    this.causas = this._parseJsonField(data.causas);
    this.causas_comparendo = this._parseJsonField(data.causas_comparendo);

    // Campos de texto libre
    this.riesgo_otro = data.riesgo_otro || null;
    this.causa_otra = data.causa_otra || null;
    this.causa_comparendo_otra = data.causa_comparendo_otra || null;
    this.informacion_adicional = data.informacion_adicional || null;
  }

  /**
   * Parser helper para campos JSON
   * @private
   */
  _parseJsonField(field) {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Validar los datos del cuestionario
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Validaciones obligatorias básicas
    if (!this.id_usuario) {
      errors.push('El ID de usuario es obligatorio');
    }

    if (!this.consentimiento) {
      errors.push('El consentimiento es obligatorio');
    } else if (!['SI', 'NO'].includes(this.consentimiento)) {
      errors.push('El consentimiento debe ser SI o NO');
    }

    // Validar género si está presente
    if (this.genero && !['Femenino', 'Masculino'].includes(this.genero)) {
      errors.push('El género debe ser Femenino o Masculino');
    }

    // Validaciones condicionales: Si tiene licencia
    if (this.licencia === 'SI') {
      if (!this.vigencia_licencia) {
        errors.push('Si tiene licencia, debe proporcionar la fecha de vigencia');
      } else {
        const vigencia = new Date(this.vigencia_licencia);
        if (isNaN(vigencia.getTime())) {
          errors.push('La fecha de vigencia de licencia no es válida');
        }
      }

      if (!this.categoria_licencia) {
        errors.push('Si tiene licencia, debe proporcionar la categoría');
      }
    }

    // Validaciones condicionales: Si tuvo accidentes
    if (this.accidente_5_anios === 'SI') {
      if (!this.cantidad_accidentes) {
        errors.push('Si tuvo accidentes, debe especificar la cantidad');
      }
    }

    // Validaciones condicionales: Si tuvo accidentes laborales
    if (this.accidente_laboral === 'SI') {
      if (!this.cantidad_accidentes_laborales) {
        errors.push('Si tuvo accidentes laborales, debe especificar la cantidad');
      }
    }

    // Validar comparendos
    if (this.tiene_comparendos === 'SI') {
      if (this.causas_comparendo.length === 0 && !this.causa_comparendo_otra) {
        errors.push('Si tiene comparendos, debe especificar al menos una causa');
      }
    }

    // Validar kilometraje mensual
    if (this.km_mensuales !== null) {
      if (isNaN(this.km_mensuales) || this.km_mensuales < 0) {
        errors.push('El kilometraje mensual debe ser un número positivo');
      } else if (this.km_mensuales > 50000) {
        errors.push('El kilometraje mensual parece excesivo (máximo 50,000 km)');
      }
    }

    // Validar ENUMs
    const enumFields = {
      licencia: ['SI', 'NO'],
      accidente_5_anios: ['SI', 'NO'],
      accidente_laboral: ['SI', 'NO'],
      incidente: ['SI', 'NO'],
      vias_publicas: ['SI', 'NO'],
      empresa_paga_rodamiento: ['SI', 'NO'],
      realiza_inspeccion_propio: ['SI', 'NO'],
      usa_vehiculo_empresa: ['SI', 'NO'],
      realiza_inspeccion_empresa: ['SI', 'NO'],
      tiene_comparendos: ['SI', 'NO']
    };

    for (const [field, validValues] of Object.entries(enumFields)) {
      if (this[field] !== null && !validValues.includes(this[field])) {
        errors.push(`El campo ${field} debe ser ${validValues.join(' o ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar si la licencia está vencida
   * @returns {boolean}
   */
  isLicenseExpired() {
    if (this.licencia !== 'SI' || !this.vigencia_licencia) {
      return false;
    }

    const hoy = new Date();
    const vigencia = new Date(this.vigencia_licencia);
    return vigencia < hoy;
  }

  /**
   * Obtener días hasta vencimiento de licencia
   * @returns {number|null}
   */
  getDaysUntilLicenseExpiry() {
    if (this.licencia !== 'SI' || !this.vigencia_licencia) {
      return null;
    }

    const hoy = new Date();
    const vigencia = new Date(this.vigencia_licencia);
    const diffTime = vigencia - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Verificar si el usuario representa un riesgo alto
   * @returns {boolean}
   */
  isHighRisk() {
    let riskFactors = 0;

    // Factor 1: Tuvo accidentes en los últimos 5 años
    if (this.accidente_5_anios === 'SI') riskFactors++;

    // Factor 2: Licencia vencida
    if (this.isLicenseExpired()) riskFactors++;

    // Factor 3: Tiene comparendos
    if (this.tiene_comparendos === 'SI') riskFactors++;

    // Factor 4: Alto kilometraje mensual (más de 3000 km)
    if (this.km_mensuales && this.km_mensuales > 3000) riskFactors++;

    // Factor 5: Múltiples accidentes
    if (this.cantidad_accidentes && parseInt(this.cantidad_accidentes) > 2) riskFactors++;

    return riskFactors >= 2;
  }

  /**
   * Convertir a formato JSON para enviar al cliente
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id_adicional,
      idUsuario: this.id_usuario,
      fechaRegistro: this.fecha_registro,

      // Datos básicos
      consentimiento: this.consentimiento,
      ciudad: this.ciudad,
      sitioLabor: this.sitio_labor,
      cargo: this.cargo,

      // Datos personales
      edad: this.edad,
      tipoContratacion: this.tipo_contratacion,
      genero: this.genero,
      grupo: this.grupo,
      grupoOtro: this.grupo_otro,

      // Transporte
      medioTransporteDesplazamiento: this.medio_transporte_desplazamiento,
      claseVehiculo: this.clase_vehiculo,
      claseVehiculoOtro: this.clase_vehiculo_otro,

      // Licencia
      licencia: this.licencia,
      vigenciaLicencia: this.vigencia_licencia,
      categoriaLicencia: this.categoria_licencia,
      experiencia: this.experiencia,
      licenciaVencida: this.isLicenseExpired(),
      diasHastaVencimiento: this.getDaysUntilLicenseExpiry(),

      // Accidentes
      accidente5Anios: this.accidente_5_anios,
      accidenteLaboral: this.accidente_laboral,
      cantidadAccidentes: this.cantidad_accidentes,
      cantidadAccidentesLaborales: this.cantidad_accidentes_laborales,
      rolAccidente: this.rol_accidente,
      incidente: this.incidente,

      // Desplazamientos
      viasPublicas: this.vias_publicas,
      frecuenciaVehiculoPropio: this.frecuencia_vehiculo_propio,
      tipoVehiculoPropio: this.tipo_vehiculo_propio,
      tipoVehiculoPropioOtro: this.tipo_vehiculo_propio_otro,
      empresaPagaRodamiento: this.empresa_paga_rodamiento,
      realizaInspeccionPropio: this.realiza_inspeccion_propio,
      frecuenciaChequeoPropio: this.frecuencia_chequeo_propio,

      // Vehículo empresa
      usaVehiculoEmpresa: this.usa_vehiculo_empresa,
      tipoVehiculoEmpresa: this.tipo_vehiculo_empresa,
      tipoVehiculoEmpresaOtro: this.tipo_vehiculo_empresa_otro,
      realizaInspeccionEmpresa: this.realiza_inspeccion_empresa,
      frecuenciaChequeoEmpresa: this.frecuencia_chequeo_empresa,

      // Planificación
      planificacion: this.planificacion,
      antelacion: this.antelacion,
      kmMensuales: this.km_mensuales,

      // Comparendos
      tieneComparendos: this.tiene_comparendos,

      // Arrays JSON
      medioDesplazamiento: this.medio_desplazamiento,
      riesgos: this.riesgos,
      causas: this.causas,
      causasComparendo: this.causas_comparendo,

      // Campos adicionales
      riesgoOtro: this.riesgo_otro,
      causaOtra: this.causa_otra,
      causaComparendoOtra: this.causa_comparendo_otra,
      informacionAdicional: this.informacion_adicional,

      // Indicadores calculados
      riesgoAlto: this.isHighRisk()
    };
  }

  /**
   * Convertir a formato para la base de datos
   * @returns {Object}
   */
  toDB() {
    return {
      id_adicional: this.id_adicional,
      id_usuario: this.id_usuario,
      fecha_registro: this.fecha_registro,
      consentimiento: this.consentimiento,
      ciudad: this.ciudad,
      sitio_labor: this.sitio_labor,
      cargo: this.cargo,
      edad: this.edad,
      tipo_contratacion: this.tipo_contratacion,
      genero: this.genero,
      grupo: this.grupo,
      grupo_otro: this.grupo_otro,
      medio_transporte_desplazamiento: this.medio_transporte_desplazamiento,
      clase_vehiculo: this.clase_vehiculo,
      clase_vehiculo_otro: this.clase_vehiculo_otro,
      licencia: this.licencia,
      vigencia_licencia: this.vigencia_licencia,
      categoria_licencia: this.categoria_licencia,
      experiencia: this.experiencia,
      accidente_5_anios: this.accidente_5_anios,
      accidente_laboral: this.accidente_laboral,
      cantidad_accidentes: this.cantidad_accidentes,
      cantidad_accidentes_laborales: this.cantidad_accidentes_laborales,
      rol_accidente: this.rol_accidente,
      incidente: this.incidente,
      vias_publicas: this.vias_publicas,
      frecuencia_vehiculo_propio: this.frecuencia_vehiculo_propio,
      tipo_vehiculo_propio: this.tipo_vehiculo_propio,
      tipo_vehiculo_propio_otro: this.tipo_vehiculo_propio_otro,
      empresa_paga_rodamiento: this.empresa_paga_rodamiento,
      realiza_inspeccion_propio: this.realiza_inspeccion_propio,
      frecuencia_chequeo_propio: this.frecuencia_chequeo_propio,
      usa_vehiculo_empresa: this.usa_vehiculo_empresa,
      tipo_vehiculo_empresa: this.tipo_vehiculo_empresa,
      tipo_vehiculo_empresa_otro: this.tipo_vehiculo_empresa_otro,
      realiza_inspeccion_empresa: this.realiza_inspeccion_empresa,
      frecuencia_chequeo_empresa: this.frecuencia_chequeo_empresa,
      planificacion: this.planificacion,
      antelacion: this.antelacion,
      km_mensuales: this.km_mensuales,
      tiene_comparendos: this.tiene_comparendos,
      // Convertir arrays a JSON strings para MySQL
      medio_desplazamiento: JSON.stringify(this.medio_desplazamiento),
      riesgos: JSON.stringify(this.riesgos),
      causas: JSON.stringify(this.causas),
      causas_comparendo: JSON.stringify(this.causas_comparendo),
      riesgo_otro: this.riesgo_otro,
      causa_otra: this.causa_otra,
      causa_comparendo_otra: this.causa_comparendo_otra,
      informacion_adicional: this.informacion_adicional
    };
  }
}

export default AdditionalInfo;
