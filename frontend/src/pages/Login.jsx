// Página de Login con diseño responsivo
import { useState } from 'react';
import { IdentificationIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo_acueducto_individual.png';
import { useAlert } from '../context/AlertContext';

const API_URL = 'http://localhost:3000/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Solo permitir números en el campo cédula
    if (name === 'cedula' && value && !/^\d*$/.test(value)) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cedula: formData.cedula,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      if (data.success) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        success(`¡Bienvenido ${data.data.user.name}!`);
        onLogin(data.data.user);
      }
    } catch (err) {
      console.error('Error en login:', err);
      error(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Card del Login */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con logo */}
          <div className="bg-primary py-8 px-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg w-28 h-28 flex items-center justify-center">
                <img src={logo} alt="Logo Acueducto" className="w-20 h-20 object-contain" /> 
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Control Vehicular
            </h1>
            <p className="text-white/90 text-sm">
              Acueducto y Alcantarillado de Popayán
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">
              Iniciar Sesión
            </h2>
            <p className="text-secondary text-sm text-center mb-6">
              Supervisores y Administradores
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cédula */}
              <div>
                <label 
                  htmlFor="cedula" 
                  className="block text-sm font-semibold text-primary-light mb-2"
                >
                  Número de Documento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 1002345678"
                    maxLength="15"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-primary-light mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary transition-colors disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-light disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Footer del formulario */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-secondary">o</span>
                </div>
              </div>

              <p className="text-secondary text-sm text-center">
                ¿Eres conductor? {' '}
                <button 
                  onClick={() => window.location.href = '/survey-login'}
                  className="text-primary hover:text-primary-light font-semibold transition-colors"
                >
                  Accede al cuestionario aquí
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-secondary text-sm">
            © 2026 Acueducto y Alcantarillado de Popayán
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
