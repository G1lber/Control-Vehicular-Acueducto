/**
 * MySQLUserRepository - Adaptador de Infraestructura
 * 
 * Implementa UserRepository usando MySQL como motor de base de datos.
 * Maneja todas las operaciones de persistencia de usuarios.
 */

import UserRepository from '../../domain/repositories/UserRepository.js';
import User from '../../domain/entities/User.js';
import pool from '../../config/database.js';
import bcrypt from 'bcrypt';

class MySQLUserRepository extends UserRepository {
  constructor() {
    super();
    this.db = pool;
  }

  /**
   * Obtiene todos los usuarios con información de su rol
   * @returns {Promise<User[]>}
   */
  async findAll() {
    const query = `
      SELECT 
        u.id_cedula,
        u.nombre,
        u.id_rol,
        r.nombre_rol,
        u.area,
        u.celular
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY u.nombre ASC
    `;

    try {
      const [rows] = await this.db.query(query);
      return rows.map(row => new User(row));
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new Error('Error al obtener usuarios de la base de datos');
    }
  }

  /**
   * Busca un usuario por cédula
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<User|null>}
   */
  async findByCedula(cedula) {
    const query = `
      SELECT 
        u.id_cedula,
        u.nombre,
        u.id_rol,
        r.nombre_rol,
        u.area,
        u.celular
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_cedula = ?
    `;

    try {
      const [rows] = await this.db.query(query, [cedula]);
      
      if (rows.length === 0) {
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      console.error('Error en findByCedula:', error);
      throw new Error('Error al buscar usuario por cédula');
    }
  }

  /**
   * Busca usuarios por rol
   * @param {number} idRol - ID del rol (1=Conductor, 2=Supervisor, 3=Administrador)
   * @returns {Promise<User[]>}
   */
  async findByRole(idRol) {
    const query = `
      SELECT 
        u.id_cedula,
        u.nombre,
        u.id_rol,
        r.nombre_rol,
        u.area,
        u.celular
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_rol = ?
      ORDER BY u.nombre ASC
    `;

    try {
      const [rows] = await this.db.query(query, [idRol]);
      return rows.map(row => new User(row));
    } catch (error) {
      console.error('Error en findByRole:', error);
      throw new Error('Error al buscar usuarios por rol');
    }
  }

  /**
   * Busca usuarios por área
   * @param {string} area - Área de trabajo
   * @returns {Promise<User[]>}
   */
  async findByArea(area) {
    const query = `
      SELECT 
        u.id_cedula,
        u.nombre,
        u.id_rol,
        r.nombre_rol,
        u.area,
        u.celular
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.area = ?
      ORDER BY u.nombre ASC
    `;

    try {
      const [rows] = await this.db.query(query, [area]);
      return rows.map(row => new User(row));
    } catch (error) {
      console.error('Error en findByArea:', error);
      throw new Error('Error al buscar usuarios por área');
    }
  }

  /**
   * Busca usuarios por nombre (búsqueda parcial)
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<User[]>}
   */
  async searchByName(searchTerm) {
    const query = `
      SELECT 
        u.id_cedula,
        u.nombre,
        u.id_rol,
        r.nombre_rol,
        u.area,
        u.celular
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.nombre LIKE ?
      ORDER BY u.nombre ASC
    `;

    try {
      const [rows] = await this.db.query(query, [`%${searchTerm}%`]);
      return rows.map(row => new User(row));
    } catch (error) {
      console.error('Error en searchByName:', error);
      throw new Error('Error al buscar usuarios por nombre');
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {User} user - Usuario a crear
   * @returns {Promise<User>}
   */
  async create(user) {
    const dbData = user.toDB();

    // Construir campos y valores dinámicamente
    const fields = ['id_cedula', 'nombre', 'id_rol'];
    const values = [dbData.id_cedula, dbData.nombre, dbData.id_rol];

    // Agregar campos opcionales solo si existen
    if (dbData.area) {
      fields.push('area');
      values.push(dbData.area);
    }

    if (dbData.celular) {
      fields.push('celular');
      values.push(dbData.celular);
    }

    // Si el usuario tiene password, hashearlo y agregarlo
    if (dbData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(dbData.password, saltRounds);
      fields.push('password');
      values.push(hashedPassword);
    }

    const placeholders = fields.map(() => '?').join(', ');
    const query = `
      INSERT INTO usuarios (${fields.join(', ')})
      VALUES (${placeholders})
    `;

    try {
      await this.db.query(query, values);

      // Retornar el usuario creado
      return await this.findByCedula(dbData.id_cedula);
    } catch (error) {
      console.error('Error en create:', error);
      
      // Error de cédula duplicada
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe un usuario con esa cédula');
      }
      
      throw new Error('Error al crear usuario en la base de datos');
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {number|string} cedula - Cédula del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<User|null>}
   */
  async update(cedula, userData) {
    // Verificar que el usuario existe
    const existingUser = await this.findByCedula(cedula);
    if (!existingUser) {
      return null;
    }

    const updates = [];
    const values = [];

    // Construir query dinámicamente solo con los campos que vienen
    if (userData.nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(userData.nombre);
    }
    if (userData.id_rol !== undefined) {
      updates.push('id_rol = ?');
      values.push(userData.id_rol);
    }
    if (userData.area !== undefined) {
      updates.push('area = ?');
      values.push(userData.area);
    }
    if (userData.celular !== undefined) {
      updates.push('celular = ?');
      values.push(userData.celular);
    }

    // Si viene password, hashearlo
    if (userData.password !== undefined && userData.password !== null && userData.password !== '') {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      // No hay nada que actualizar
      return existingUser;
    }

    // Agregar cédula al final del array de values
    values.push(cedula);

    const query = `
      UPDATE usuarios
      SET ${updates.join(', ')}
      WHERE id_cedula = ?
    `;

    try {
      await this.db.query(query, values);
      
      // Retornar el usuario actualizado
      return await this.findByCedula(cedula);
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error('Error al actualizar usuario en la base de datos');
    }
  }

  /**
   * Elimina un usuario
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async delete(cedula) {
    const query = `DELETE FROM usuarios WHERE id_cedula = ?`;

    try {
      const [result] = await this.db.query(query, [cedula]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      
      // Error de foreign key constraint (usuario tiene vehículos asignados)
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new Error('No se puede eliminar el usuario porque tiene vehículos asignados');
      }
      
      throw new Error('Error al eliminar usuario de la base de datos');
    }
  }

  /**
   * Cuenta los usuarios por rol
   * @returns {Promise<Object>} { total, conductores, supervisores, administradores }
   */
  async countByRole() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN id_rol = 1 THEN 1 ELSE 0 END) as conductores,
        SUM(CASE WHEN id_rol = 2 THEN 1 ELSE 0 END) as supervisores,
        SUM(CASE WHEN id_rol = 3 THEN 1 ELSE 0 END) as administradores
      FROM usuarios
    `;

    try {
      const [rows] = await this.db.query(query);
      return {
        total: Number(rows[0].total),
        conductores: Number(rows[0].conductores),
        supervisores: Number(rows[0].supervisores),
        administradores: Number(rows[0].administradores)
      };
    } catch (error) {
      console.error('Error en countByRole:', error);
      throw new Error('Error al contar usuarios por rol');
    }
  }

  /**
   * Verifica si existe un usuario con una cédula
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<boolean>}
   */
  async exists(cedula) {
    const query = `SELECT COUNT(*) as count FROM usuarios WHERE id_cedula = ?`;

    try {
      const [rows] = await this.db.query(query, [cedula]);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error en exists:', error);
      throw new Error('Error al verificar existencia de usuario');
    }
  }

  /**
   * Busca un usuario por cédula para autenticación (incluye password)
   * SOLO usar para login/autenticación
   * @param {number|string} cedula - Cédula del usuario
   * @returns {Promise<User|null>}
   */
  async findForAuth(cedula) {
    const query = `
      SELECT 
        u.id_cedula,
        u.nombre,
        u.id_rol,
        r.nombre_rol,
        u.area,
        u.celular,
        u.password
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.id_cedula = ?
    `;

    try {
      const [rows] = await this.db.query(query, [cedula]);
      
      if (rows.length === 0) {
        return null;
      }

      return new User(rows[0]);
    } catch (error) {
      console.error('Error en findForAuth:', error);
      throw new Error('Error al buscar usuario para autenticación');
    }
  }

  /**
   * Verifica una contraseña contra su hash
   * @param {string} plainPassword - Contraseña en texto plano
   * @param {string} hashedPassword - Hash de la contraseña
   * @returns {Promise<boolean>}
   */
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error en verifyPassword:', error);
      return false;
    }
  }
}

export default MySQLUserRepository;
