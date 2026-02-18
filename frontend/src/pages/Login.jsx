// Página de Login con diseño responsivo
import { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import logo from '../assets/logo_acueducto_individual.png'; // Descomenta cuando agregues el logo

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo redirige al home
    onLogin();
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
                {/* Logo - Descomenta cuando agregues la imagen */}
                <img src={logo} alt="Logo Acueducto" className="w-20 h-20 object-contain" /> 
                
                {/* Placeholder temporal - Elimina esto cuando agregues el logo */}
                {/* <div className="text-primary text-5xl font-bold">A</div> */}
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
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-primary-light mb-2"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="usuario@acueducto.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
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
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Recordar y olvidó contraseña */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary-light"
                  />
                  <span className="ml-2 text-secondary">Recordarme</span>
                </label>
                <a href="#" className="text-primary hover:text-primary-light font-semibold transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón de submit */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-light"
              >
                Iniciar Sesión
              </button>
            </form>

            {/* Footer del formulario */}
            <div className="mt-6 text-center">
              <p className="text-secondary text-sm">
                ¿Necesitas ayuda? {' '}
                <a href="#" className="text-primary hover:text-primary-light font-semibold transition-colors">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            © 2026 Acueducto y Alcantarillado de Popayán
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
