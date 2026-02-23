/**
 * UserController - Controlador HTTP
 * 
 * Maneja las peticiones HTTP relacionadas con usuarios.
 * Transforma requests HTTP en llamadas a casos de uso.
 */

class UserController {
  constructor(userUseCases) {
    this.userUseCases = userUseCases;
  }

  /**
   * GET /api/users
   * Obtiene todos los usuarios o filtra por query params
   */
  async getAllUsers(req, res) {
    try {
      const { role, area, search } = req.query;

      let users;

      // Filtrar por rol si viene en query
      if (role) {
        users = await this.userUseCases.getUsersByRole(role);
      }
      // Buscar por nombre si viene search
      else if (search) {
        users = await this.userUseCases.searchUsers(search);
      }
      // Filtrar por área si viene en query
      else if (area) {
        users = await this.userUseCases.getUsersByArea(area);
      }
      // Sin filtros, traer todos
      else {
        users = await this.userUseCases.getAllUsers();
      }

      return res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/stats
   * Obtiene estadísticas de usuarios por rol
   */
  async getUserStats(req, res) {
    try {
      const stats = await this.userUseCases.getUserStats();

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error en getUserStats:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas de usuarios',
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/:cedula
   * Obtiene un usuario específico por cédula
   */
  async getUserByCedula(req, res) {
    try {
      const { cedula } = req.params;

      const user = await this.userUseCases.getUserByCedula(cedula);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error en getUserByCedula:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/role/:role
   * Obtiene usuarios por rol específico
   */
  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;

      const users = await this.userUseCases.getUsersByRole(role);

      return res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error en getUsersByRole:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios por rol',
        error: error.message
      });
    }
  }

  /**
   * POST /api/users
   * Crea un nuevo usuario
   */
  async createUser(req, res) {
    try {
      const userData = req.body;

      // Validar que vengan los campos mínimos
      if (!userData.cedula && !userData.id_cedula) {
        return res.status(400).json({
          success: false,
          message: 'La cédula es requerida'
        });
      }

      if (!userData.name && !userData.nombre) {
        return res.status(400).json({
          success: false,
          message: 'El nombre es requerido'
        });
      }

      if (!userData.id_rol) {
        return res.status(400).json({
          success: false,
          message: 'El rol es requerido'
        });
      }

      const user = await this.userUseCases.createUser(userData);

      return res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: user
      });
    } catch (error) {
      console.error('Error en createUser:', error);

      // Errores de validación
      if (error.validationErrors) {
        return res.status(400).json({
          success: false,
          message: 'Datos de usuario inválidos',
          errors: error.validationErrors
        });
      }

      // Error de cédula duplicada
      if (error.message.includes('Ya existe')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
        error: error.message
      });
    }
  }

  /**
   * PUT /api/users/:cedula
   * Actualiza un usuario existente
   */
  async updateUser(req, res) {
    try {
      const { cedula } = req.params;
      const userData = req.body;

      const user = await this.userUseCases.updateUser(cedula, userData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: user
      });
    } catch (error) {
      console.error('Error en updateUser:', error);

      // Error de validación
      if (error.message.includes('requieren contraseña')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error al actualizar usuario',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/users/:cedula
   * Elimina un usuario
   */
  async deleteUser(req, res) {
    try {
      const { cedula } = req.params;

      const deleted = await this.userUseCases.deleteUser(cedula);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error en deleteUser:', error);

      // Error de foreign key (usuario tiene vehículos asignados)
      if (error.message.includes('vehículos asignados')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error al eliminar usuario',
        error: error.message
      });
    }
  }

  /**
   * POST /api/users/auth/login
   * Autentica un usuario (para futuro sistema de login)
   */
  async login(req, res) {
    try {
      const { cedula, password } = req.body;

      if (!cedula || !password) {
        return res.status(400).json({
          success: false,
          message: 'Cédula y contraseña son requeridas'
        });
      }

      const user = await this.userUseCases.authenticateUser(cedula, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Cédula o contraseña incorrectas'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: user
        // TODO: Aquí se generaría un JWT token en el futuro
      });
    } catch (error) {
      console.error('Error en login:', error);

      // Error de conductores intentando hacer login
      if (error.message.includes('conductores no pueden')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error al autenticar usuario',
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/exists/:cedula
   * Verifica si existe un usuario con una cédula
   */
  async checkUserExists(req, res) {
    try {
      const { cedula } = req.params;

      const exists = await this.userUseCases.userExists(cedula);

      return res.status(200).json({
        success: true,
        exists
      });
    } catch (error) {
      console.error('Error en checkUserExists:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar existencia de usuario',
        error: error.message
      });
    }
  }
}

export default UserController;
