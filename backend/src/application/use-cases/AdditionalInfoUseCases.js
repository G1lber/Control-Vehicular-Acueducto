/**
 * AdditionalInfoUseCases - Casos de uso de Información Adicional (Cuestionario PESV)
 * 
 * Parte de APPLICATION (Capa de Aplicación - Arquitectura Hexagonal)
 * Orquesta las operaciones entre el dominio y la infraestructura
 */

import AdditionalInfo from '../../domain/entities/AdditionalInfo.js';

class AdditionalInfoUseCases {
  constructor(additionalInfoRepository) {
    this.additionalInfoRepository = additionalInfoRepository;
  }

  /**
   * Obtener todos los cuestionarios registrados
   * @returns {Promise<Array>}
   */
  async getAllSurveys() {
    const surveys = await this.additionalInfoRepository.findAll();
    return surveys.map(s => s.toJSON());
  }

  /**
   * Obtener cuestionario por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getSurveyById(id) {
    const survey = await this.additionalInfoRepository.findById(id);
    return survey ? survey.toJSON() : null;
  }

  /**
   * Obtener cuestionario de un usuario específico
   * @param {bigint} idUsuario - Cédula del usuario
   * @returns {Promise<Object|null>}
   */
  async getSurveyByUserId(idUsuario) {
    const survey = await this.additionalInfoRepository.findByUserId(idUsuario);
    return survey ? survey.toJSON() : null;
  }

  /**
   * Crear o actualizar cuestionario de un usuario
   * Si el usuario ya tiene cuestionario, lo actualiza; si no, crea uno nuevo
   * @param {Object} data - Datos del cuestionario
   * @returns {Promise<Object>}
   */
  async saveSurvey(data) {
    // Crear entidad
    const survey = new AdditionalInfo(data);

    // Validar
    const validation = survey.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Guardar en BD (create o update automático)
    const saved = await this.additionalInfoRepository.save(survey);
    return saved.toJSON();
  }

  /**
   * Crear nuevo cuestionario
   * @param {Object} data - Datos del cuestionario
   * @returns {Promise<Object>}
   */
  async createSurvey(data) {
    // Verificar si el usuario ya tiene cuestionario
    const exists = await this.additionalInfoRepository.existsByUserId(data.id_usuario);
    if (exists) {
      throw new Error('El usuario ya tiene un cuestionario registrado. Use actualizar en su lugar.');
    }

    // Crear entidad
    const survey = new AdditionalInfo(data);

    // Validar
    const validation = survey.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Crear en BD
    const created = await this.additionalInfoRepository.create(survey);
    return created.toJSON();
  }

  /**
   * Actualizar cuestionario existente
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateSurvey(id, data) {
    // Verificar que exista
    const exists = await this.additionalInfoRepository.findById(id);
    if (!exists) {
      throw new Error('Cuestionario no encontrado');
    }

    // Crear entidad temporal para validar
    const updatedData = { ...exists.toDB(), ...data };
    const survey = new AdditionalInfo(updatedData);

    // Validar
    const validation = survey.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Actualizar en BD
    const updated = await this.additionalInfoRepository.update(id, data);
    return updated.toJSON();
  }

  /**
   * Eliminar cuestionario
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async deleteSurvey(id) {
    const exists = await this.additionalInfoRepository.findById(id);
    if (!exists) {
      throw new Error('Cuestionario no encontrado');
    }

    return await this.additionalInfoRepository.delete(id);
  }

  /**
   * Obtener estadísticas generales
   * @returns {Promise<Object>}
   */
  async getSurveyStats() {
    return await this.additionalInfoRepository.getStats();
  }

  /**
   * Obtener alertas de seguridad vial
   * @returns {Promise<Object>}
   */
  async getSecurityAlerts() {
    const [expiredLicenses, upcomingExpiry, highRisk, withAccidents, withComparendos] = await Promise.all([
      this.additionalInfoRepository.findExpiredLicenses(),
      this.additionalInfoRepository.findUpcomingLicenseExpiry(30),
      this.additionalInfoRepository.findHighRiskUsers(),
      this.additionalInfoRepository.findUsersWithAccidents(),
      this.additionalInfoRepository.findUsersWithComparendos()
    ]);

    return {
      licenciasVencidas: expiredLicenses.map(s => s.toJSON()),
      licenciasPorVencer: upcomingExpiry.map(s => s.toJSON()),
      usuariosAltoRiesgo: highRisk.map(s => s.toJSON()),
      usuariosConAccidentes: withAccidents.map(s => s.toJSON()),
      usuariosConComparendos: withComparendos.map(s => s.toJSON()),
      totales: {
        licenciasVencidas: expiredLicenses.length,
        licenciasPorVencer: upcomingExpiry.length,
        usuariosAltoRiesgo: highRisk.length,
        usuariosConAccidentes: withAccidents.length,
        usuariosConComparendos: withComparendos.length
      }
    };
  }

  /**
   * Obtener usuarios con licencias vencidas
   * @returns {Promise<Array>}
   */
  async getUsersWithExpiredLicenses() {
    const users = await this.additionalInfoRepository.findExpiredLicenses();
    return users.map(u => u.toJSON());
  }

  /**
   * Obtener usuarios con licencias próximas a vencer
   * @param {number} dias - Días de anticipación
   * @returns {Promise<Array>}
   */
  async getUsersWithUpcomingLicenseExpiry(dias = 30) {
    const users = await this.additionalInfoRepository.findUpcomingLicenseExpiry(dias);
    return users.map(u => u.toJSON());
  }

  /**
   * Obtener usuarios de alto riesgo
   * @returns {Promise<Array>}
   */
  async getHighRiskUsers() {
    const users = await this.additionalInfoRepository.findHighRiskUsers();
    return users.map(u => u.toJSON());
  }

  /**
   * Obtener usuarios con accidentes
   * @returns {Promise<Array>}
   */
  async getUsersWithAccidents() {
    const users = await this.additionalInfoRepository.findUsersWithAccidents();
    return users.map(u => u.toJSON());
  }

  /**
   * Obtener usuarios con comparendos
   * @returns {Promise<Array>}
   */
  async getUsersWithComparendos() {
    const users = await this.additionalInfoRepository.findUsersWithComparendos();
    return users.map(u => u.toJSON());
  }

  /**
   * Verificar si un usuario puede registrar cuestionario
   * @param {bigint} idUsuario
   * @returns {Promise<Object>}
   */
  async canUserRegisterSurvey(idUsuario) {
    const exists = await this.additionalInfoRepository.existsByUserId(idUsuario);
    return {
      canRegister: !exists,
      hasExisting: exists,
      message: exists 
        ? 'El usuario ya tiene un cuestionario registrado. Puede actualizarlo.'
        : 'El usuario puede registrar un cuestionario nuevo.'
    };
  }
}

export default AdditionalInfoUseCases;
