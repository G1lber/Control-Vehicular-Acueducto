// Componente AddUserModal - Modal para agregar usuarios (Conductores/Supervisores)
import { useState } from 'react';
import Modal from './Modal';
import { useAlert } from '../context/AlertContext';
import { UserIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const { success, error } = useAlert();
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    phone: '',
    area: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando se empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'El número de cédula es obligatorio';
    } else if (!/^\d{6,10}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener entre 6 y 10 dígitos';
    }

    // Validar celular
    if (!formData.phone.trim()) {
      newErrors.phone = 'El número de celular es obligatorio';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'El celular debe tener 10 dígitos';
    }

    // Validar área
    if (!formData.area.trim()) {
      newErrors.area = 'El área es obligatoria';
    }

    // Validar rol
    if (!formData.role) {
      newErrors.role = 'El cargo/rol es obligatorio';
    }

    // Validar contraseña solo si es Supervisor
    if (formData.role === 'Supervisor') {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria para Supervisores';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Debe confirmar la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Por favor corrige los errores en el formulario');
      return;
    }

    // Crear objeto de usuario
    const userData = {
      name: formData.name.trim(),
      cedula: formData.cedula.trim(),
      phone: formData.phone.trim(),
      area: formData.area.trim(),
      role: formData.role,
      createdAt: new Date().toISOString()
    };

    // Incluir contraseña solo si es Supervisor
    if (formData.role === 'Supervisor') {
      userData.password = formData.password;
    }

    // Llamar al callback
    if (onSubmit) {
      onSubmit(userData);
    }

    success(`Usuario ${userData.name} creado correctamente`);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      cedula: '',
      phone: '',
      area: '',
      role: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Usuario" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header con icono */}
        <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-lg mb-4">
          <div className="bg-primary p-3 rounded-full">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Nuevo Usuario</h3>
            <p className="text-sm text-secondary">Complete la información del usuario</p>
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.name ? 'border-red-500' : 'border-primary-light'
            }`}
            placeholder="Ej: Juan Pérez García"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Cédula */}
        <div>
          <label htmlFor="cedula" className="block text-sm font-semibold text-primary mb-2">
            Número de Cédula *
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.cedula ? 'border-red-500' : 'border-primary-light'
            }`}
            placeholder="Ej: 1234567890"
            maxLength="10"
          />
          {errors.cedula && (
            <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>
          )}
        </div>

        {/* Celular */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
            Número de Celular *
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.phone ? 'border-red-500' : 'border-primary-light'
            }`}
            placeholder="Ej: 3001234567"
            maxLength="10"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Área */}
        <div>
          <label htmlFor="area" className="block text-sm font-semibold text-primary mb-2">
            Área *
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.area ? 'border-red-500' : 'border-primary-light'
            }`}
            placeholder="Ej: Operaciones, Mantenimiento, Administración"
          />
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area}</p>
          )}
        </div>

        {/* Cargo/Rol */}
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-primary mb-2">
            Cargo / Rol *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.role ? 'border-red-500' : 'border-primary-light'
            }`}
          >
            <option value="">Seleccione un cargo</option>
            <option value="Conductor">Conductor</option>
            <option value="Supervisor">Supervisor</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {/* Contraseña (solo para Supervisores) */}
        {formData.role === 'Supervisor' && (
          <>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <LockClosedIcon className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  <strong>Supervisor:</strong> Se requiere contraseña para acceso al sistema.
                </p>
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.password ? 'border-red-500' : 'border-primary-light'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary mb-2">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-primary-light'
                  }`}
                  placeholder="Repita la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </>
        )}

        {/* Información adicional */}
        <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4">
          <p className="text-sm text-primary">
            <strong>ℹ️ Información:</strong> Los campos marcados con (*) son obligatorios.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Crear Usuario
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
