// Login simplificado para acceso al Cuestionario PESV
import { useState } from 'react';
import { IdentificationIcon, ClipboardDocumentCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo_acueducto_individual.png';
import { useAlert } from '../context/AlertContext';

const API_URL = import.meta.env.VITE_API_URL;

const LoginSurvey = ({ onLogin }) => {
  const [cedula, setCedula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useAlert();

  const handleChange = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (value && !/^\d*$/.test(value)) {
      return;
    }
    setCedula(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cedula || cedula.trim().length === 0) {
      error('Por favor ingresa tu número de documento');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/auth/login-survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula: cedula.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al acceder al cuestionario');
      }

      if (data.success) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('access_type', 'survey_only'); // Marcar acceso limitado
        
        success(`¡Bienvenido ${data.data.user.nombre}!`);
        onLogin(data.data.user, 'survey_only');
      }
    } catch (err) {
      console.error('Error en login:', err);
      error(err.message || 'Error al acceder. Verifica tu número de documento.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToMainLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Card del Login */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con logo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-5 px-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white rounded-full p-3 shadow-lg w-20 h-20 flex items-center justify-center">
                <img src={logo} alt="Logo Acueducto" className="w-14 h-14 object-contain" /> 
              </div>
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              Cuestionario PESV
            </h1>
            <p className="text-white/90 text-xs">
              Plan Estratégico de Seguridad Vial
            </p>
          </div>

          {/* Formulario */}
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <ClipboardDocumentCheckIcon className="h-10 w-10 text-blue-600 mr-2" />
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Acceso al Cuestionario
                </h2>
                <p className="text-xs text-gray-500">
                  Ingresa con tu documento
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
              <p className="text-xs text-blue-700">
                📝 Este cuestionario es confidencial y tiene como objetivo mejorar la seguridad vial.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cédula */}
              <div>
                <label 
                  htmlFor="cedula" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Número de Documento *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={cedula}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 1001234567"
                    maxLength="15"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Ingresa tu cédula sin puntos ni comas
                </p>
              </div>

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={isLoading || !cedula}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verificando...
                  </div>
                ) : (
                  'Acceder al Cuestionario'
                )}
              </button>
            </form>

            {/* Footer del formulario */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <p className="text-gray-600 text-xs text-center mb-2">
                ¿Eres supervisor o administrador?
              </p>
              <button
                onClick={goToMainLogin}
                className="w-full py-2.5 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <LockClosedIcon className="w-5 h-5" />
                Ir al Login Principal
              </button>
            </div>
          </div>
        </div>

        {/* Ayuda */}
        <div className="mt-4 bg-white rounded-lg shadow-lg p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-1">
            ¿Necesitas ayuda?
          </h3>
          <p className="text-xs text-gray-600">
             Contactate con Talento Humano - recursoshuma@acueducto.com
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-xs">
            © 2026 Acueducto y Alcantarillado de Popayán
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSurvey;
