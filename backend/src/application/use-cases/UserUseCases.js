/**
 * UserUseCases - Capa de Aplicación
 * 
 * Orquesta las operaciones de negocio relacionadas con usuarios.
 * Coordina entre el dominio y la infraestructura.
 */

import User from '../../domain/entities/User.js';

class UserUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Object>} Lista de usuarios en formato JSON
   */
  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return users.map(user => user.toJSON());
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por cédula
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<Object|null>} Usuario en formato JSON o null
   */
  async getUserByCedula(cedula) {
    try {
      const user = await this.userRepository.findByCedula(cedula);
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('Error en getUserByCedula:', error);
      throw error;
    }
  }

  /**
   * Obtiene usuarios por rol
   * @param {string} roleName - Nombre del rol ('Conductor', 'Supervisor', 'Administrador')
   * @returns {Promise<Object[]>} Lista de usuarios en formato JSON
   */
  async getUsersByRole(roleName) {
    try {
      // Mapear nombre del rol a ID
      const roleMap = {
        'conductor': 1,
        'supervisor': 2,
        'administrador': 3
      };

      const idRol = roleMap[roleName.toLowerCase()];
      
      if (!idRol) {
        throw new Error('Rol inválido. Use: Conductor, Supervisor o Administrador');
      }

      const users = await this.userRepository.findByRole(idRol);
      return users.map(user => user.toJSON());
    } catch (error) {
      console.error('Error en getUsersByRole:', error);
      throw error;
    }
  }

  /**
   * Busca usuarios por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Object[]>} Lista de usuarios en formato JSON
   */
  async searchUsers(searchTerm) {
    try {
      const users = await this.userRepository.searchByName(searchTerm);
      return users.map(user => user.toJSON());
    } catch (error) {
      console.error('Error en searchUsers:', error);
      throw error;
    }
  }

  /**
   * Obtiene usuarios por área
   * @param {string} area - Área de trabajo
   * @returns {Promise<Object[]>} Lista de usuarios en formato JSON
   */
  async getUsersByArea(area) {
    try {
      const users = await this.userRepository.findByArea(area);
      return users.map(user => user.toJSON());
    } catch (error) {
      console.error('Error en getUsersByArea:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado en formato JSON
   */
  async createUser(userData) {
    try {
      // Crear entidad User
      const user = new User({
        id_cedula: userData.cedula || userData.id_cedula,
        nombre: userData.name || userData.nombre,
        id_rol: userData.id_rol,
        area: userData.area,
        celular: userData.phone || userData.celular,
        password: userData.password
      });

      // Validar datos
      const validation = user.validate();
      if (!validation.valid) {
        const error = new Error('Datos de usuario inválidos');
        error.validationErrors = validation.errors;
        throw error;
      }

      // Verificar que la cédula no exista
      const exists = await this.userRepository.exists(user.id_cedula);
      if (exists) {
        throw new Error('Ya existe un usuario con esa cédula');
      }

      // Crear usuario en DB
      const createdUser = await this.userRepository.create(user);
      return createdUser.toJSON();
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {number|string} cedula - Cédula del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object|null>} Usuario actualizado en formato JSON o null
   */
  async updateUser(cedula, userData) {
    try {
      // Verificar que el usuario existe
      const existingUser = await this.userRepository.findByCedula(cedula);
      if (!existingUser) {
        return null;
      }

      // Preparar datos para actualizar
      const updateData = {};
      
      if (userData.name !== undefined || userData.nombre !== undefined) {
        updateData.nombre = userData.name || userData.nombre;
      }
      if (userData.id_rol !== undefined) {
        updateData.id_rol = userData.id_rol;
      }
      if (userData.area !== undefined) {
        updateData.area = userData.area;
      }
      if (userData.phone !== undefined || userData.celular !== undefined) {
        updateData.celular = userData.phone || userData.celular;
      }
      
      // Manejo especial de contraseña
      if (userData.password !== undefined) {
        // Si password es explícitamente null, eliminar contraseña (para cambio a Conductor)
        if (userData.password === null) {
          updateData.password = null;
        }
        // Si password tiene valor, actualizarla
        else if (userData.password !== '') {
          updateData.password = userData.password;
        }
      }

      // Si se está cambiando el rol, validar que password sea consistente
      const newRole = updateData.id_rol || existingUser.id_rol;
      
      // Si cambia a Supervisor/Admin y no tiene contraseña, requerirla
      if ([2, 3].includes(Number(newRole))) {
        // Solo validar si se está intentando poner password vacía en Supervisor/Admin
        if (userData.password === '') {
          throw new Error('Los Supervisores y Administradores requieren contraseña');
        }
      }
      
      // Si cambia a Conductor (rol 1) y se envía password: null, permitirlo (eliminar contraseña)
      if (Number(newRole) === 1 && userData.password === null) {
        updateData.password = null;
      }

      // Actualizar en DB
      const updatedUser = await this.userRepository.update(cedula, updateData);
      return updatedUser ? updatedUser.toJSON() : null;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   */
  async deleteUser(cedula) {
    try {
      return await this.userRepository.delete(cedula);
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de usuarios por rol
   * @returns {Promise<Object>} { total, conductores, supervisores, administradores }
   */
  async getUserStats() {
    try {
      return await this.userRepository.countByRole();
    } catch (error) {
      console.error('Error en getUserStats:', error);
      throw error;
    }
  }

  /**
   * Verifica si existe un usuario con una cédula
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async userExists(cedula) {
    try {
      return await this.userRepository.exists(cedula);
    } catch (error) {
      console.error('Error en userExists:', error);
      throw error;
    }
  }

  /**
   * Autentica un usuario (para futuro sistema de login)
   * @param {number|string} cedula - Cédula del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object|null>} Usuario en formato JSON o null si falla
   */
  async authenticateUser(cedula, password) {
    try {
      // Buscar usuario con password
      const user = await this.userRepository.findForAuth(cedula);
      
      if (!user) {
        return null;
      }

      // Solo Supervisores y Admins pueden hacer login
      if (!user.requiresPassword()) {
        throw new Error('Los conductores no pueden hacer login en el sistema');
      }

      // Verificar password
      const isValid = await this.userRepository.verifyPassword(password, user.password);
      
      if (!isValid) {
        return null;
      }

      // Retornar usuario sin password
      return user.toJSON();
    } catch (error) {
      console.error('Error en authenticateUser:', error);
      throw error;
    }
  }
}

export default UserUseCases;
