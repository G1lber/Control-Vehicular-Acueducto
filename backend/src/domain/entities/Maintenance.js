/**
 * Entidad Maintenance - Representa un mantenimiento de un vehículo
 * 
 * Parte del DOMAIN (Capa de Dominio - Arquitectura Hexagonal)
 * Esta capa contiene las reglas de negocio puras, independientes de frameworks
 */

class Maintenance {
  constructor({
    id_mantenimiento = null,
    id_placa,
    tipo_mantenimiento,
    fecha_realizado,
    fecha_proxima = null,
    kilometraje = null,
    costo = null,
    descripcion = null,
    informacion_adicional = null
  }) {
    this.id_mantenimiento = id_mantenimiento;
    this.id_placa = id_placa ? id_placa.toUpperCase().trim() : null;
    this.tipo_mantenimiento = tipo_mantenimiento ? tipo_mantenimiento.trim() : null;
    this.fecha_realizado = fecha_realizado;
    this.fecha_proxima = fecha_proxima;
    this.kilometraje = kilometraje ? parseInt(kilometraje) : null;
    this.costo = costo ? parseFloat(costo) : null;
    this.descripcion = descripcion ? descripcion.trim() : null;
    this.informacion_adicional = informacion_adicional ? informacion_adicional.trim() : null;
  }

  /**
   * Validar los datos del mantenimiento
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Validar placa (formato XXX-123 o similar)
    if (!this.id_placa) {
      errors.push('La placa es obligatoria');
    } else if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(this.id_placa)) {
      errors.push('La placa debe tener el formato XXX-XXX (ej: ABC-123)');
    }

    // Validar tipo de mantenimiento
    if (!this.tipo_mantenimiento) {
      errors.push('El tipo de mantenimiento es obligatorio');
    } else if (this.tipo_mantenimiento.length < 3) {
      errors.push('El tipo de mantenimiento debe tener al menos 3 caracteres');
    } else if (this.tipo_mantenimiento.length > 100) {
      errors.push('El tipo de mantenimiento no puede exceder 100 caracteres');
    }

    // Validar fecha de realización
    if (!this.fecha_realizado) {
      errors.push('La fecha de realización es obligatoria');
    } else {
      const fechaRealizado = new Date(this.fecha_realizado);
      if (isNaN(fechaRealizado.getTime())) {
        errors.push('La fecha de realización no es válida');
      }
      // No permitir fechas futuras
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaRealizado > hoy) {
        errors.push('La fecha de realización no puede ser futura');
      }
    }

    // Validar fecha próxima (si existe)
    if (this.fecha_proxima) {
      const fechaProxima = new Date(this.fecha_proxima);
      if (isNaN(fechaProxima.getTime())) {
        errors.push('La fecha próxima no es válida');
      } else {
        const fechaRealizado = new Date(this.fecha_realizado);
        if (fechaProxima <= fechaRealizado) {
          errors.push('La fecha próxima debe ser posterior a la fecha de realización');
        }
      }
    }

    // Validar kilometraje (si existe)
    if (this.kilometraje !== null) {
      if (isNaN(this.kilometraje) || this.kilometraje < 0) {
        errors.push('El kilometraje debe ser un número positivo');
      } else if (this.kilometraje > 9999999) {
        errors.push('El kilometraje no puede exceder 9,999,999 km');
      }
    }

    // Validar costo (si existe)
    if (this.costo !== null) {
      if (isNaN(this.costo) || this.costo < 0) {
        errors.push('El costo debe ser un número positivo');
      } else if (this.costo > 9999999999.99) {
        errors.push('El costo excede el límite permitido');
      }
    }

    // Validar descripción (si existe)
    if (this.descripcion && this.descripcion.length > 1000) {
      errors.push('La descripción no puede exceder 1000 caracteres');
    }

    // Validar información adicional (si existe)
    if (this.informacion_adicional && this.informacion_adicional.length > 1000) {
      errors.push('La información adicional no puede exceder 1000 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcular días transcurridos desde el mantenimiento
   * @returns {number} Días transcurridos
   */
  getDaysSinceMaintenance() {
    const hoy = new Date();
    const fechaRealizado = new Date(this.fecha_realizado);
    const diffTime = hoy - fechaRealizado;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Calcular días hasta el próximo mantenimiento
   * @returns {number|null} Días hasta el próximo mantenimiento, null si no hay fecha próxima
   */
  getDaysUntilNextMaintenance() {
    if (!this.fecha_proxima) {
      return null;
    }

    const hoy = new Date();
    const fechaProxima = new Date(this.fecha_proxima);
    const diffTime = fechaProxima - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Verificar si el mantenimiento está próximo a vencer
   * @param {number} diasAlerta - Días de anticipación para la alerta (default: 30)
   * @returns {boolean}
   */
  isUpcoming(diasAlerta = 30) {
    const diasHastaProximo = this.getDaysUntilNextMaintenance();
    if (diasHastaProximo === null) {
      return false;
    }
    return diasHastaProximo > 0 && diasHastaProximo <= diasAlerta;
  }

  /**
   * Verificar si el mantenimiento está vencido
   * @returns {boolean}
   */
  isOverdue() {
    const diasHastaProximo = this.getDaysUntilNextMaintenance();
    if (diasHastaProximo === null) {
      return false;
    }
    return diasHastaProximo < 0;
  }

  /**
   * Obtener el estado del mantenimiento
   * @returns {string} 'vencido', 'proximo', 'al_dia', 'sin_fecha'
   */
  getStatus() {
    if (!this.fecha_proxima) {
      return 'sin_fecha';
    }

    if (this.isOverdue()) {
      return 'vencido';
    }

    if (this.isUpcoming()) {
      return 'proximo';
    }

    return 'al_dia';
  }

  /**
   * Convertir a formato JSON para enviar al cliente
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id_mantenimiento,
      placa: this.id_placa,
      tipo: this.tipo_mantenimiento,
      fechaRealizado: this.fecha_realizado,
      fechaProxima: this.fecha_proxima,
      kilometraje: this.kilometraje,
      costo: this.costo,
      descripcion: this.descripcion,
      informacionAdicional: this.informacion_adicional,
      diasDesdeMantenimiento: this.getDaysSinceMaintenance(),
      diasHastaProximo: this.getDaysUntilNextMaintenance(),
      estado: this.getStatus()
    };
  }

  /**
   * Convertir a formato para la base de datos
   * @returns {Object}
   */
  toDB() {
    return {
      id_mantenimiento: this.id_mantenimiento,
      id_placa: this.id_placa,
      tipo_mantenimiento: this.tipo_mantenimiento,
      fecha_realizado: this.fecha_realizado,
      fecha_proxima: this.fecha_proxima,
      kilometraje: this.kilometraje,
      costo: this.costo,
      descripcion: this.descripcion,
      informacion_adicional: this.informacion_adicional
    };
  }
}

export default Maintenance;
