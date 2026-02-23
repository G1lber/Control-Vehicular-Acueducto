// =====================================================
// CONFIGURACIÓN DE BASE DE DATOS
// =====================================================
// Esta capa pertenece a Infrastructure (adaptador externo)

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'control_vehicular_acueducto',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    return false;
  }
};

export default pool;
