/**
 * AdditionalInfoRepository - Interface del repositorio de Información Adicional (Cuestionario PESV)
 * 
 * Parte del DOMAIN (Capa de Dominio - Arquitectura Hexagonal)
 * Este es un PORT - Define el contrato que debe implementar cualquier adaptador
 * 
 * La implementación concreta estará en: infrastructure/database/MySQLAdditionalInfoRepository.js
 */

class AdditionalInfoRepository {
  /**
   * Obtener toda la información adicional registrada
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Obtener información adicional por ID
   * @param {number} id - ID del registro
   * @returns {Promise<AdditionalInfo|null>}
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Obtener información adicional de un usuario específico
   * @param {bigint} idUsuario - Cédula del usuario
   * @returns {Promise<AdditionalInfo|null>}
   */
  async findByUserId(idUsuario) {
    throw new Error('Method findByUserId() must be implemented');
  }

  /**
   * Crear o actualizar información adicional de un usuario
   * @param {AdditionalInfo} additionalInfo - Entidad de información adicional
   * @returns {Promise<AdditionalInfo>}
   */
  async save(additionalInfo) {
    throw new Error('Method save() must be implemented');
  }

  /**
   * Crear nueva información adicional
   * @param {AdditionalInfo} additionalInfo - Entidad de información adicional
   * @returns {Promise<AdditionalInfo>}
   */
  async create(additionalInfo) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Actualizar información adicional existente
   * @param {number} id - ID del registro
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<AdditionalInfo>}
   */
  async update(id, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Eliminar información adicional
   * @param {number} id - ID del registro
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Verificar si un usuario ya tiene información adicional registrada
   * @param {bigint} idUsuario - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async existsByUserId(idUsuario) {
    throw new Error('Method existsByUserId() must be implemented');
  }

  /**
   * Obtener estadísticas generales del cuestionario
   * @returns {Promise<Object>}
   */
  async getStats() {
    throw new Error('Method getStats() must be implemented');
  }

  /**
   * Obtener usuarios con licencias vencidas
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findExpiredLicenses() {
    throw new Error('Method findExpiredLicenses() must be implemented');
  }

  /**
   * Obtener usuarios con licencias próximas a vencer
   * @param {number} dias - Días de anticipación (default: 30)
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findUpcomingLicenseExpiry(dias) {
    throw new Error('Method findUpcomingLicenseExpiry() must be implemented');
  }

  /**
   * Obtener usuarios de alto riesgo
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findHighRiskUsers() {
    throw new Error('Method findHighRiskUsers() must be implemented');
  }

  /**
   * Obtener usuarios que tuvieron accidentes
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findUsersWithAccidents() {
    throw new Error('Method findUsersWithAccidents() must be implemented');
  }

  /**
   * Obtener usuarios con comparendos
   * @returns {Promise<Array<AdditionalInfo>>}
   */
  async findUsersWithComparendos() {
    throw new Error('Method findUsersWithComparendos() must be implemented');
  }
}

export default AdditionalInfoRepository;
