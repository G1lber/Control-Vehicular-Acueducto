// ChartsSection - Componente para visualizar gráficas estadísticas de conductores
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import userService from '../services/user.service';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartsSection = () => {
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChartsData();
  }, []);

  const loadChartsData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Cargando datos de gráficas...');
      const response = await userService.getChartsData();
      console.log('📊 Respuesta completa:', response);
      console.log('📈 Datos recibidos:', response.data);
      setChartsData(response.data);
    } catch (err) {
      console.error('❌ Error al cargar datos de gráficas:', err);
      console.error('📋 Detalles del error:', err.response?.data);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-primary font-semibold">Cargando gráficas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-800 font-semibold mb-2">{error}</p>
          <button 
            onClick={loadChartsData}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Reintentar
          </button>
          <p className="text-sm text-red-600 mt-3">
            💡 Asegúrate de que el backend esté ejecutándose
          </p>
        </div>
      </div>
    );
  }

  if (!chartsData) {
    return null;
  }

  // Verificar si hay conductores
  if (chartsData.totalDrivers === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
        <div className="text-center">
          <ChartBarIcon className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            No hay conductores registrados
          </h3>
          <p className="text-yellow-700">
            Las gráficas estadísticas se mostrarán cuando haya conductores con datos del cuestionario de seguridad vial.
          </p>
        </div>
      </div>
    );
  }

  console.log('🎨 Renderizando gráficas con datos:', chartsData);
  console.log('👥 Género:', chartsData.gender);
  console.log('📅 Edad:', chartsData.age);
  console.log('🚗 Accidentes:', chartsData.accidents);

  // Verificar si hay datos
  const hasGenderData = Object.values(chartsData.gender).some(val => val > 0);
  const hasAgeData = Object.values(chartsData.age).some(val => val > 0);
  // La gráfica de accidentes siempre se muestra si hay conductores (incluye "Sin información")
  const hasAccidentData = chartsData.totalDrivers > 0;

  // Datos para gráfica de género (torta)
  const genderChartData = {
    labels: Object.keys(chartsData.gender),
    datasets: [
      {
        label: 'Conductores',
        data: Object.values(chartsData.gender),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Azul
          'rgba(255, 99, 132, 0.8)',  // Rosa
          'rgba(153, 102, 255, 0.8)', // Púrpura
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfica de edad (barras)
  const ageChartData = {
    labels: Object.keys(chartsData.age),
    datasets: [
      {
        label: 'Cantidad de Conductores',
        data: Object.values(chartsData.age),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfica de accidentes (torta)
  const accidentChartData = {
    labels: Object.keys(chartsData.accidents),
    datasets: [
      {
        label: 'Conductores',
        data: Object.values(chartsData.accidents),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',   // Rojo (Sí)
          'rgba(75, 192, 192, 0.8)',   // Verde (No)
          'rgba(201, 203, 207, 0.8)',  // Gris (Sin información)
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Opciones comunes para gráficas
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <ChartBarIcon className="w-7 h-7" />
          Gráficas Estadísticas de Conductores
        </h2>
        <p className="text-secondary">
          Visualización de datos demográficos y de seguridad vial • {chartsData.totalDrivers} conductores registrados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Género */}
        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5" />
            Distribución por Género
          </h3>
          {hasGenderData ? (
            <div className="max-w-xs mx-auto">
              <Pie data={genderChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary">
                📊 No hay datos de género disponibles.
                <br />
                <span className="text-sm">Los conductores deben completar el cuestionario de seguridad vial.</span>
              </p>
            </div>
          )}
        </div>

        {/* Gráfica de Edad */}
        <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary mb-4">
            Rango de Edad
          </h3>
          {hasAgeData ? (
            <div>
              <Bar data={ageChartData} options={barChartOptions} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary">
                📊 No hay datos de edad disponibles.
                <br />
                <span className="text-sm">Los conductores deben completar el cuestionario de seguridad vial.</span>
              </p>
            </div>
          )}
        </div>

        {/* Gráfica de Accidentes */}
        <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-100 rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-primary mb-4">
            Accidentes de Tránsito en los Últimos 5 Años
          </h3>
          {hasAccidentData ? (
            <>
              <div className="max-w-md mx-auto">
                <Pie data={accidentChartData} options={chartOptions} />
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> "Sin información" incluye conductores que no han completado el cuestionario de seguridad vial.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary">
                📊 No hay datos de accidentes disponibles.
                <br />
                <span className="text-sm">Los conductores deben completar el cuestionario de seguridad vial.</span>
              </p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {chartsData.accidents['Sin información']} conductor(es) sin información de accidentes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
