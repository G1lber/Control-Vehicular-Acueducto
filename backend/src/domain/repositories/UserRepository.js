/**
 * UserRepository - Interface (Puerto)
 * 
 * Define el contrato que debe cumplir cualquier implementación
 * de repositorio de usuarios (MySQL, MongoDB, etc.)
 * 
 * Este es el PUERTO en la arquitectura hexagonal.
 * La implementación concreta estará en la capa de Infrastructure.
 */

class UserRepository {
  /**
   * Obtiene todos los usuarios con información de su rol
   * @returns {Promise<User[]>}
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Busca un usuario por cédula
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<User|null>}
   */
  async findByCedula(cedula) {
    throw new Error('Method findByCedula() must be implemented');
  }

  /**
   * Busca usuarios por rol
   * @param {number} idRol - ID del rol (1=Conductor, 2=Supervisor, 3=Administrador)
   * @returns {Promise<User[]>}
   */
  async findByRole(idRol) {
    throw new Error('Method findByRole() must be implemented');
  }

  /**
   * Busca usuarios por área
   * @param {string} area - Área de trabajo
   * @returns {Promise<User[]>}
   */
  async findByArea(area) {
    throw new Error('Method findByArea() must be implemented');
  }

  /**
   * Busca usuarios por nombre (búsqueda parcial)
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<User[]>}
   */
  async searchByName(searchTerm) {
    throw new Error('Method searchByName() must be implemented');
  }

  /**
   * Crea un nuevo usuario
   * @param {User} user - Usuario a crear
   * @returns {Promise<User>}
   */
  async create(user) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Actualiza un usuario existente
   * @param {number|string} cedula - Cédula del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<User|null>}
   */
  async update(cedula, userData) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Elimina un usuario
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async delete(cedula) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Cuenta los usuarios por rol
   * @returns {Promise<Object>} { total, conductores, supervisores, administradores }
   */
  async countByRole() {
    throw new Error('Method countByRole() must be implemented');
  }

  /**
   * Verifica si existe un usuario con una cédula
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async exists(cedula) {
    throw new Error('Method exists() must be implemented');
  }

  /**
   * Busca un usuario por cédula para autenticación (incluye password)
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<User|null>}
   */
  async findForAuth(cedula) {
    throw new Error('Method findForAuth() must be implemented');
  }
}

export default UserRepository;
