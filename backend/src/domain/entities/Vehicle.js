// =====================================================
// DOMAIN LAYER - ENTIDAD VEHICLE
// =====================================================
// Esta es la capa de dominio (núcleo de negocio)
// NO depende de tecnologías externas (sin imports de Express, MySQL, etc.)

export class Vehicle {
  constructor({
    id_placa,
    modelo,
    marca,
    anio,
    color,
    tipo_combustible,
    kilometraje_actual,
    ultimo_mantenimiento,
    id_usuario,
    soat,
    tecno
  }) {
    this.id_placa = id_placa;
    this.modelo = modelo;
    this.marca = marca;
    this.anio = anio;
    this.color = color;
    this.tipo_combustible = tipo_combustible;
    this.kilometraje_actual = kilometraje_actual;
    this.ultimo_mantenimiento = ultimo_mantenimiento;
    this.id_usuario = id_usuario;
    this.soat = soat;
    this.tecno = tecno;
  }

  // Métodos de dominio (lógica de negocio)
  
  /**
   * Calcula los días hasta el vencimiento del SOAT
   * @returns {number} Días restantes (negativo si está vencido)
   */
  getDaysUntilSoatExpiry() {
    if (!this.soat) return null;
    const today = new Date();
    const soatDate = new Date(this.soat);
    const diffTime = soatDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Calcula los días hasta el vencimiento de la revisión técnica
   * @returns {number} Días restantes (negativo si está vencido)
   */
  getDaysUntilTecnoExpiry() {
    if (!this.tecno) return null;
    const today = new Date();
    const tecnoDate = new Date(this.tecno);
    const diffTime = tecnoDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Determina el estado del vehículo basado en vencimientos
   * @returns {string} 'vencido', 'por_vencer', 'vigente'
   */
  getStatus() {
    const soatDays = this.getDaysUntilSoatExpiry();
    const tecnoDays = this.getDaysUntilTecnoExpiry();

    // Si alguno está vencido
    if (soatDays < 0 || tecnoDays < 0) {
      return 'vencido';
    }

    // Si alguno está por vencer (menos de 30 días)
    if (soatDays <= 30 || tecnoDays <= 30) {
      return 'por_vencer';
    }

    // Todo vigente
    return 'vigente';
  }

  /**
   * Valida que los datos del vehículo sean correctos
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.id_placa || this.id_placa.trim().length === 0) {
      errors.push('La placa es obligatoria');
    }

    if (!this.marca || this.marca.trim().length === 0) {
      errors.push('La marca es obligatoria');
    }

    if (!this.modelo || this.modelo.trim().length === 0) {
      errors.push('El modelo es obligatorio');
    }

    if (this.anio) {
      const currentYear = new Date().getFullYear();
      if (this.anio < 1900 || this.anio > currentYear + 1) {
        errors.push('El año del vehículo no es válido');
      }
    }

    // id_usuario es opcional - un vehículo puede no tener conductor asignado
    // if (!this.id_usuario) {
    //   errors.push('El vehículo debe tener un conductor asignado');
    // }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte la entidad a un objeto plano (para respuestas JSON)
   * @returns {Object}
   */
  toJSON() {
    return {
      id_placa: this.id_placa,
      modelo: this.modelo,
      marca: this.marca,
      anio: this.anio,
      color: this.color,
      tipo_combustible: this.tipo_combustible,
      kilometraje_actual: this.kilometraje_actual,
      ultimo_mantenimiento: this.ultimo_mantenimiento,
      id_usuario: this.id_usuario,
      soat: this.soat,
      tecno: this.tecno,
      status: this.getStatus(),
      days_until_soat: this.getDaysUntilSoatExpiry(),
      days_until_tecno: this.getDaysUntilTecnoExpiry()
    };
  }
}
