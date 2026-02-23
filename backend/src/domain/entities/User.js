/**
 * User Entity - Capa de Dominio
 * 
 * Representa un usuario del sistema (Conductor, Supervisor o Administrador).
 * Contiene la lógica de negocio relacionada con usuarios.
 * 
 * ROLES:
 * - 1: Conductor
 * - 2: Supervisor (requiere password)
 * - 3: Administrador (requiere password)
 */

class User {
  constructor(data) {
    this.id_cedula = data.id_cedula;
    this.nombre = data.nombre;
    this.id_rol = data.id_rol;
    this.nombre_rol = data.nombre_rol; // Viene del JOIN con tabla roles
    this.area = data.area;
    this.celular = data.celular;
    this.password = data.password; // Solo para Supervisores y Admins
  }

  /**
   * Valida los datos del usuario
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Validar cédula (requerida, debe ser numérica, entre 6 y 12 dígitos)
    if (!this.id_cedula) {
      errors.push('La cédula es requerida');
    } else {
      const cedulaStr = String(this.id_cedula);
      if (!/^\d{6,12}$/.test(cedulaStr)) {
        errors.push('La cédula debe ser un número de 6 a 12 dígitos');
      }
    }

    // Validar nombre (requerido, mínimo 3 caracteres)
    if (!this.nombre || this.nombre.trim().length < 3) {
      errors.push('El nombre es requerido y debe tener al menos 3 caracteres');
    }

    // Validar rol (requerido, debe ser 1, 2 o 3)
    if (!this.id_rol || ![1, 2, 3].includes(Number(this.id_rol))) {
      errors.push('El rol es requerido y debe ser: 1 (Conductor), 2 (Supervisor) o 3 (Administrador)');
    }

    // Validar password para Supervisores y Administradores
    if (this.isSupervisor() || this.isAdmin()) {
      if (!this.password || this.password.trim().length < 6) {
        errors.push('Los Supervisores y Administradores requieren una contraseña de al menos 6 caracteres');
      }
    }

    // Validar celular (opcional, pero si existe debe ser válido)
    if (this.celular) {
      const celularStr = String(this.celular).replace(/\s+/g, '');
      if (!/^\d{10}$/.test(celularStr)) {
        errors.push('El celular debe ser un número de 10 dígitos');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Verifica si el usuario es un Conductor
   * @returns {boolean}
   */
  isDriver() {
    return Number(this.id_rol) === 1;
  }

  /**
   * Verifica si el usuario es un Supervisor
   * @returns {boolean}
   */
  isSupervisor() {
    return Number(this.id_rol) === 2;
  }

  /**
   * Verifica si el usuario es un Administrador
   * @returns {boolean}
   */
  isAdmin() {
    return Number(this.id_rol) === 3;
  }

  /**
   * Verifica si el usuario requiere password
   * @returns {boolean}
   */
  requiresPassword() {
    return this.isSupervisor() || this.isAdmin();
  }

  /**
   * Obtiene el nombre del rol en español
   * @returns {string}
   */
  getRoleName() {
    if (this.nombre_rol) {
      return this.nombre_rol;
    }
    
    const roleNames = {
      1: 'Conductor',
      2: 'Supervisor',
      3: 'Administrador'
    };
    return roleNames[this.id_rol] || 'Desconocido';
  }

  /**
   * Convierte la entidad a objeto JSON para la API
   * IMPORTANTE: Excluye el password por seguridad
   * @returns {Object}
   */
  toJSON() {
    return {
      cedula: String(this.id_cedula),
      name: this.nombre,
      area: this.area || '',
      phone: this.celular || '',
      role: this.getRoleName(),
      id_rol: Number(this.id_rol)
      // password NO se incluye por seguridad
    };
  }

  /**
   * Convierte la entidad a objeto para guardar en DB
   * @returns {Object}
   */
  toDB() {
    const dbData = {
      id_cedula: this.id_cedula,
      nombre: this.nombre,
      id_rol: this.id_rol,
      area: this.area || null,
      celular: this.celular || null
    };

    // Solo incluir password si existe (para updates puede no venir)
    if (this.password) {
      dbData.password = this.password;
    }

    return dbData;
  }
}

export default User;
