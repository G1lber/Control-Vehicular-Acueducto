// =====================================================
// CONFIGURACIÓN DE MULTER - Upload de archivos
// =====================================================
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio base para documentos
const DOCS_BASE_DIR = path.join(__dirname, '../../../SOAT_Tecno');

// Crear directorio base si no existe
if (!fs.existsSync(DOCS_BASE_DIR)) {
  fs.mkdirSync(DOCS_BASE_DIR, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Obtener placa del vehículo (puede venir en body o params)
    const placa = req.body.placa || req.params.placa;
    
    if (!placa) {
      return cb(new Error('La placa del vehículo es requerida para subir documentos'));
    }

    // Crear carpeta específica para la placa
    const vehicleDir = path.join(DOCS_BASE_DIR, placa);
    
    if (!fs.existsSync(vehicleDir)) {
      fs.mkdirSync(vehicleDir, { recursive: true });
    }

    cb(null, vehicleDir);
  },
  filename: (req, file, cb) => {
    // Determinar tipo de documento (soat o tecno)
    const docType = req.body.docType || 'documento';
    
    // Obtener extensión del archivo
    const ext = path.extname(file.originalname);
    
    // Generar nombre: tipo_timestamp.ext
    const filename = `${docType}_${Date.now()}${ext}`;
    
    cb(null, filename);
  }
});

// Filtro de archivos - Solo permitir PDF, imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF, JPG, JPEG o PNG'));
  }
};

// Configuración de multer
export const uploadConfig = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: fileFilter
});

// Middleware para subir un solo archivo
export const uploadSingle = (fieldName) => {
  return uploadConfig.single(fieldName);
};

// Middleware para subir múltiples archivos
export const uploadMultiple = (fields) => {
  return uploadConfig.fields(fields);
};

// Función helper para eliminar archivo
export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath || !fs.existsSync(filePath)) {
      return resolve(false);
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error al eliminar archivo:', err);
        return reject(err);
      }
      resolve(true);
    });
  });
};

// Función helper para obtener ruta completa del archivo
export const getFilePath = (placa, filename) => {
  if (!filename) return null;
  return path.join(DOCS_BASE_DIR, placa, filename);
};

// Función helper para verificar si un archivo existe
export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

export { DOCS_BASE_DIR };
