// Guía de uso de colores y estilos personalizados con Tailwind CSS

// ========================================
// COLORES PERSONALIZADOS DEL SISTEMA
// ========================================

// 1. COLOR PRIMARY (#1779BC)
// Uso: Hovers, Títulos navbar o footer
// Clases disponibles:
// - bg-primary         -> Fondo azul principal
// - text-primary       -> Texto azul principal
// - border-primary     -> Borde azul principal
// - hover:bg-primary   -> Hover con fondo azul
// - hover:text-primary -> Hover con texto azul

// 2. COLOR PRIMARY LIGHT (#67aed4)
// Uso: Subtítulos e información a resaltar
// Clases disponibles:
// - bg-primary-light
// - text-primary-light
// - border-primary-light

// 3. COLOR SECONDARY (#778191)
// Uso: Utilizarlo mínimamente
// Clases disponibles:
// - bg-secondary
// - text-secondary
// - border-secondary

// ========================================
// VARIABLES CSS PERSONALIZADAS
// ========================================
// También puedes usar las variables CSS directamente:
// - var(--color-primary)
// - var(--color-primary-light)
// - var(--color-secondary)
// - var(--color-background)

// ========================================
// EJEMPLOS DE USO
// ========================================

// Ejemplo 1: Botón principal
const PrimaryButton = () => (
  <button className="bg-primary hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors">
    Agregar Vehículo
  </button>
);

// Ejemplo 2: Card de vehículo
const VehicleCard = ({ vehicle }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
    <h3 className="text-primary font-bold text-xl mb-2">{vehicle.name}</h3>
    <p className="text-primary-light font-semibold">{vehicle.plate}</p>
    <p className="text-secondary text-sm mt-2">{vehicle.details}</p>
  </div>
);

// Ejemplo 3: Contenedor con título
const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
    <div className="bg-white rounded-lg shadow p-6">
      {children}
    </div>
  </section>
);

// Ejemplo 4: Badge/Etiqueta
const StatusBadge = ({ status }) => (
  <span className="inline-block bg-primary-light text-white text-xs font-semibold px-3 py-1 rounded-full">
    {status}
  </span>
);

// Ejemplo 5: Input con estilo personalizado
const CustomInput = () => (
  <input
    type="text"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none transition-colors"
    placeholder="Ingrese la placa del vehículo"
  />
);

// Ejemplo 6: Navbar
const Navbar = () => (
  <nav className="bg-primary shadow-md">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <h1 className="text-white text-2xl font-bold">Control Vehicular</h1>
      <ul className="flex space-x-6">
        <li>
          <a href="#" className="text-white hover:text-primary-light transition-colors">
            Vehículos
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-primary-light transition-colors">
            Mantenimientos
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

// Ejemplo 7: Tabla
const VehicleTable = ({ vehicles }) => (
  <div className="overflow-x-auto">
    <table className="w-full bg-white shadow-md rounded-lg">
      <thead className="bg-primary text-white">
        <tr>
          <th className="py-3 px-6 text-left">Placa</th>
          <th className="py-3 px-6 text-left">Modelo</th>
          <th className="py-3 px-6 text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id} className="border-b hover:bg-gray-50 transition-colors">
            <td className="py-3 px-6 text-primary font-semibold">{vehicle.plate}</td>
            <td className="py-3 px-6 text-gray-700">{vehicle.model}</td>
            <td className="py-3 px-6">
              <span className="text-primary-light font-semibold">{vehicle.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ========================================
// FUENTE PERSONALIZADA
// ========================================
// La fuente Nunito ya está configurada como fuente por defecto
// Todas las clases de Tailwind la usarán automáticamente
// 
// Pesos disponibles:
// - font-light (300)
// - font-normal (400)
// - font-medium (500)
// - font-semibold (600)
// - font-bold (700)
// - font-extrabold (800)

export {
  PrimaryButton,
  VehicleCard,
  Section,
  StatusBadge,
  CustomInput,
  Navbar,
  VehicleTable
};
