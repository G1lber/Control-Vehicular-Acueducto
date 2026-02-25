/**
 * UserController - Controlador HTTP
 * 
 * Maneja las peticiones HTTP relacionadas con usuarios.
 * Transforma requests HTTP en llamadas a casos de uso.
 */

import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';

class UserController {
  constructor(userUseCases, surveyUseCases = null) {
    this.userUseCases = userUseCases;
    this.surveyUseCases = surveyUseCases;
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
   * Autentica un usuario y genera un JWT token
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

      // Generar JWT token
      const token = jwt.sign(
        {
          cedula: user.cedula,
          nombre: user.name,
          id_rol: user.id_rol,
          nombre_rol: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: user,
          token: token,
          expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        }
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
   * POST /api/users/auth/login-survey
   * Login simple para conductores que acceden al cuestionario
   * Solo requiere cédula (sin password)
   */
  async loginSurvey(req, res) {
    try {
      const { cedula } = req.body;

      if (!cedula) {
        return res.status(400).json({
          success: false,
          message: 'Cédula es requerida'
        });
      }

      // Buscar el usuario por cédula
      const user = await this.userUseCases.getUserByCedula(cedula);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado. Verifica tu número de documento.'
        });
      }

      // Generar JWT token simplificado para el cuestionario
      const token = jwt.sign(
        {
          cedula: user.cedula,
          nombre: user.name,
          id_rol: user.id_rol,
          access_type: 'survey_only' // Marca especial para acceso limitado
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' } // Token de 2 horas para el cuestionario
      );

      return res.status(200).json({
        success: true,
        message: 'Acceso al cuestionario concedido',
        data: {
          user: {
            cedula: user.cedula,
            nombre: user.name,
            area: user.area,
            role: user.role
          },
          token: token,
          expiresIn: '2h'
        }
      });
    } catch (error) {
      console.error('Error en loginSurvey:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al autenticar para el cuestionario',
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

  /**
   * GET /api/users/:cedula/pdf
   * Genera y descarga la hoja de vida del usuario en PDF
   */
  async generateUserPDF(req, res) {
    try {
      const { cedula } = req.params;

      // Obtener datos del usuario
      const user = await this.userUseCases.getUserByCedula(cedula);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Obtener datos del cuestionario
      let surveyData = null;
      
      if (this.surveyUseCases) {
        try {
          surveyData = await this.surveyUseCases.getSurveyByUserId(cedula);
          console.log('=== DEBUG PDF ===');
          console.log('Usuario cedula:', cedula);
          console.log('Datos de encuesta encontrados:', surveyData ? 'SÍ' : 'NO');
          if (surveyData) {
            console.log('Propiedades de surveyData:', Object.keys(surveyData));
          }
        } catch (err) {
          console.log('Error al obtener cuestionario:', err.message);
        }
      } else {
        console.log('surveyUseCases no está disponible');
      }

      // Crear el documento PDF
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'LETTER',
        info: {
          Title: `Hoja de Vida PESV - ${user.name}`,
          Author: 'Sistema Control Vehicular',
          Subject: 'Hoja de Vida PESV'
        }
      });
      
      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=HojaDeVida_${cedula}_${user.name.replace(/\s+/g, '_')}.pdf`);
      
      // Conectar el PDF al response
      doc.pipe(res);

      // Colores del sistema (matching con la app)
      const colors = {
        primary: '#1779BC',
        primaryLight: '#67aed4', 
        secondary: '#778191',
        text: '#2c3e50',
        textLight: '#7f8c8d',
        border: '#e0e0e0',
        background: '#f8f9fa'
      };

      // Función para crear encabezado de sección
      const createSection = (title) => {
        const y = doc.y;
        doc.rect(50, y, doc.page.width - 100, 1).fill(colors.primary);
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.primary)
           .text(title.toUpperCase());
        doc.fillColor(colors.text);
        doc.moveDown(0.5);
      };

      // Función para agregar campo con formato
      const addField = (label, value, options = {}) => {
        if (!value && !options.showEmpty) return;
        
        const indent = options.indent || 0;
        const x = 60 + indent;
        
        doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.textLight)
           .text(label, x, doc.y, { continued: true, width: 140 });
        doc.font('Helvetica').fillColor(colors.text)
           .text(value || 'N/A', { width: doc.page.width - 100 - indent - 150 });
      };

      // ENCABEZADO DEL DOCUMENTO
      doc.rect(0, 0, doc.page.width, 60).fill(colors.primary);
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#FFFFFF')
         .text('HOJA DE VIDA', 0, 15, { align: 'center' });
      doc.fontSize(11).fillColor('#FFFFFF').font('Helvetica')
         .text('Plan Estratégico de Seguridad Vial - PESV', 0, 40, { align: 'center' });
      
      doc.y = 80;

      // Información del documento
      doc.fontSize(8).fillColor(colors.textLight)
         .text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO', { 
           year: 'numeric', month: 'long', day: 'numeric' 
         })}`, 60, doc.y);
      doc.text(`Documento ID: ${cedula}`, doc.page.width - 200, 80, { width: 140, align: 'right' });
      
      doc.moveDown(2);
      doc.fillColor(colors.text);

      // INFORMACIÓN BÁSICA
      createSection('Información Básica del Empleado');
      addField('Nombre Completo:', user.name);
      addField('Número de Cédula:', user.cedula);
      addField('Teléfono:', user.phone);
      addField('Área:', user.area);
      addField('Rol:', user.role);
      doc.moveDown(1.5);

      // CUESTIONARIO PESV
      if (surveyData) {
        createSection('Cuestionario PESV');
        
        // Consentimiento
        if (surveyData.consentimiento) {
          addField('Consentimiento informado:', surveyData.consentimiento);
          doc.moveDown(0.3);
        }

        // UBICACIÓN Y CARGO
        if (surveyData.ciudad || surveyData.sitioLabor || surveyData.cargo) {
          doc.moveDown(0.5);
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Ubicación y Cargo');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.ciudad) addField('Ciudad:', surveyData.ciudad, { indent: 15 });
          if (surveyData.sitioLabor) addField('Sitio de labor:', surveyData.sitioLabor, { indent: 15 });
          if (surveyData.cargo) addField('Cargo:', surveyData.cargo, { indent: 15 });
          doc.moveDown(0.8);
        }

        // DATOS PERSONALES
        if (surveyData.edad || surveyData.genero || surveyData.tipoContratacion || surveyData.grupo) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Datos Personales');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.edad) addField('Edad:', `${surveyData.edad} años`, { indent: 15 });
          if (surveyData.genero) addField('Género:', surveyData.genero, { indent: 15 });
          if (surveyData.tipoContratacion) addField('Tipo de contratación:', surveyData.tipoContratacion, { indent: 15 });
          if (surveyData.grupo) {
            const grupoTexto = surveyData.grupo === 'Otro' && surveyData.grupoOtro 
              ? `${surveyData.grupo} (${surveyData.grupoOtro})` 
              : surveyData.grupo;
            addField('Grupo poblacional:', grupoTexto, { indent: 15 });
          }
          doc.moveDown(0.8);
        }

        // TRANSPORTE
        if (surveyData.medioTransporteDesplazamiento || surveyData.claseVehiculo) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Transporte');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.medioTransporteDesplazamiento) {
            addField('Medio de transporte:', surveyData.medioTransporteDesplazamiento, { indent: 15 });
          }
          if (surveyData.claseVehiculo) {
            const claseTexto = surveyData.claseVehiculo === 'Otro' && surveyData.claseVehiculoOtro
              ? `${surveyData.claseVehiculo} (${surveyData.claseVehiculoOtro})`
              : surveyData.claseVehiculo;
            addField('Clase de vehículo:', claseTexto, { indent: 15 });
          }
          doc.moveDown(0.8);
        }

        // LICENCIA DE CONDUCCIÓN
        if (surveyData.licencia) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Licencia de Conducción');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.licencia === 'SI') {
            if (surveyData.categoriaLicencia) addField('Categoría:', surveyData.categoriaLicencia, { indent: 15 });
            if (surveyData.experiencia) addField('Experiencia:', `${surveyData.experiencia} años`, { indent: 15 });
            if (surveyData.vigenciaLicencia) {
              const vigencia = new Date(surveyData.vigenciaLicencia).toLocaleDateString('es-CO', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              });
              const vencida = surveyData.licenciaVencida ? ' (VENCIDA)' : '';
              addField('Vigencia:', vigencia + vencida, { indent: 15 });
            }
          } else {
            doc.fontSize(9).fillColor(colors.textLight).text('No posee licencia de conducción', 75);
            doc.fillColor(colors.text);
          }
          doc.moveDown(0.8);
        }

        // ACCIDENTES
        if (surveyData.accidente5Anios) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Accidentes - Últimos 5 años');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.accidente5Anios === 'SI') {
            if (surveyData.cantidadAccidentes) {
              addField('Cantidad:', surveyData.cantidadAccidentes, { indent: 15 });
            }
            if (surveyData.accidenteLaboral === 'SI' && surveyData.cantidadAccidentesLaborales) {
              addField('Accidentes laborales:', surveyData.cantidadAccidentesLaborales, { indent: 15 });
            }
            if (surveyData.rolAccidente) {
              addField('Rol en accidente:', surveyData.rolAccidente, { indent: 15 });
            }
          } else {
            doc.fontSize(9).fillColor(colors.textLight).text('Sin accidentes reportados', 75);
            doc.fillColor(colors.text);
          }
          doc.moveDown(0.8);
        }

        // COMPARENDOS
        if (surveyData.tieneComparendos) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Comparendos');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.tieneComparendos === 'SI') {
            if (surveyData.causasComparendo && surveyData.causasComparendo.length > 0) {
              doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.textLight).text('Causas:', 75);
              doc.font('Helvetica').fillColor(colors.text);
              surveyData.causasComparendo.forEach(causa => {
                doc.fontSize(9).text(`• ${causa}`, 85);
              });
              if (surveyData.causaComparendoOtra) {
                doc.fontSize(9).text(`• Otra: ${surveyData.causaComparendoOtra}`, 85);
              }
            }
          } else {
            doc.fontSize(9).fillColor(colors.textLight).text('Sin comparendos reportados', 75);
            doc.fillColor(colors.text);
          }
          doc.moveDown(0.8);
        }

        // PLANIFICACIÓN
        if (surveyData.planificacion || surveyData.antelacion || surveyData.kmMensuales) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Planificación de Desplazamientos');
          doc.fillColor(colors.text).moveDown(0.3);
          
          if (surveyData.planificacion) addField('Planifica:', surveyData.planificacion, { indent: 15 });
          if (surveyData.antelacion) addField('Antelación:', surveyData.antelacion, { indent: 15 });
          if (surveyData.kmMensuales) addField('Km mensuales:', `${surveyData.kmMensuales} km`, { indent: 15 });
          doc.moveDown(0.8);
        }

        // Información adicional
        if (surveyData.informacionAdicional) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary).text('Información Adicional');
          doc.fillColor(colors.text).moveDown(0.3);
          doc.fontSize(9).font('Helvetica').text(surveyData.informacionAdicional, 75, doc.y, { 
            width: doc.page.width - 125,
            align: 'justify'
          });
          doc.moveDown(0.8);
        }

        // Fecha de registro
        if (surveyData.fechaRegistro) {
          doc.moveDown(0.5);
          doc.fontSize(8).fillColor(colors.textLight).font('Helvetica-Oblique')
             .text(`Cuestionario registrado: ${new Date(surveyData.fechaRegistro).toLocaleDateString('es-CO', { 
               year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
             })}`, 60);
          doc.fillColor(colors.text);
        }
      } else {
        createSection('Cuestionario PESV');
        doc.fontSize(9).fillColor(colors.textLight).font('Helvetica-Oblique')
           .text('El usuario aún no ha completado el cuestionario PESV.', 60);
        doc.fillColor(colors.text);
      }

      // FOOTER
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        const footerY = doc.page.height - 50;
        doc.strokeColor(colors.border).lineWidth(0.5)
           .moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).stroke();
        
        doc.fontSize(8).fillColor(colors.textLight).font('Helvetica');
        doc.text(
          'Control Vehicular - Sistema de Gestión de Seguridad Vial',
          50,
          footerY + 10,
          { align: 'center', width: doc.page.width - 100 }
        );
        doc.fontSize(7).fillColor(colors.secondary);
        doc.text(
          `Página ${i + 1} de ${pageCount}`,
          50,
          footerY + 20,
          { align: 'center', width: doc.page.width - 100 }
        );
      }

      doc.end();

    } catch (error) {
      console.error('Error en generateUserPDF:', error);
      
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Error al generar el PDF',
          error: error.message
        });
      }
    }
  }
}

export default UserController;
