-- =====================================================
-- BASE DE DATOS: control_vehicular_acueducto
-- =====================================================

DROP DATABASE IF EXISTS control_vehicular_acueducto;

CREATE DATABASE control_vehicular_acueducto
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE control_vehicular_acueducto;

-- =====================================================
-- TABLA: roles
-- =====================================================

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =====================================================
-- TABLA: usuarios
-- =====================================================

CREATE TABLE usuarios (
    id_cedula BIGINT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_rol INT NOT NULL,
    area VARCHAR(100),
    celular VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    edad INT,
    tipo_contratacion VARCHAR(100),

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Índice para mejorar búsquedas
CREATE INDEX idx_usuario_rol ON usuarios(id_rol);

-- =====================================================
-- TABLA: vehiculos
-- =====================================================

CREATE TABLE vehiculos (
    id_placa VARCHAR(10) PRIMARY KEY,
    modelo VARCHAR(50),
    marca VARCHAR(50),
    anio YEAR,
    color VARCHAR(30),
    tipo_combustible VARCHAR(30),
    kilometraje_actual INT,
    ultimo_mantenimiento DATE,
    id_usuario BIGINT NULL,
    soat DATE,
    tecno DATE,

    CONSTRAINT fk_vehiculo_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_cedula)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_vehiculo_usuario ON vehiculos(id_usuario);

-- =====================================================
-- TABLA: mantenimientos
-- =====================================================

CREATE TABLE mantenimientos (
    id_mantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_placa VARCHAR(10) NOT NULL,
    tipo_mantenimiento VARCHAR(100) NOT NULL,
    fecha_realizado DATE NOT NULL,
    fecha_proxima DATE,
    kilometraje INT,
    costo DECIMAL(12,2),
    descripcion TEXT,
    informacion_adicional TEXT,

    CONSTRAINT fk_mantenimiento_vehiculo
        FOREIGN KEY (id_placa)
        REFERENCES vehiculos(id_placa)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_mantenimiento_placa ON mantenimientos(id_placa);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Roles
INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Supervisor'),
('Conductor');

-- Usuarios
INSERT INTO usuarios 
(id_cedula, nombre, id_rol, area, celular, password, edad, tipo_contratacion)
VALUES
(1234567890, 'Juan Perez', 1, 'Operaciones', '3001234567', '123456', 35, 'Planta'),
(1098765432, 'Maria Gomez', 3, 'Transporte', '3019876543', '123456', 29, 'Contratista');

-- Vehículos
INSERT INTO vehiculos
(id_placa, modelo, marca, anio, color, tipo_combustible, kilometraje_actual, ultimo_mantenimiento, id_usuario, soat, tecno)
VALUES
('ABC123', 'Hilux', 'Toyota', 2022, 'Blanco', 'Diesel', 45000, '2025-01-15', 1098765432, '2026-05-01', '2026-04-15'),
('XYZ789', 'Dmax', 'Chevrolet', 2021, 'Amarillo', 'Diesel', 60000, '2025-02-10', 1098765432, '2026-06-10', '2026-06-01');

-- Mantenimientos
INSERT INTO mantenimientos
(id_placa, tipo_mantenimiento, fecha_realizado, fecha_proxima, kilometraje, costo, descripcion, informacion_adicional)
VALUES
('ABC123', 'Cambio de aceite', '2025-01-15', '2025-07-15', 45000, 350000.00, 'Cambio de aceite y filtro', 'Aceite 15W40'),
('XYZ789', 'Cambio de frenos', '2025-02-10', '2026-02-10', 60000, 800000.00, 'Pastillas delanteras', 'Revisión completa del sistema');

-- =====================================================
-- CONSULTAS ÚTILES PARA DASHBOARD
-- =====================================================

-- Vehículos por usuario
SELECT u.nombre, v.id_placa, v.marca, v.modelo
FROM vehiculos v
JOIN usuarios u ON v.id_usuario = u.id_cedula;

-- Próximos mantenimientos
SELECT id_placa, fecha_proxima
FROM mantenimientos
WHERE fecha_proxima >= CURDATE()
ORDER BY fecha_proxima ASC;

-- Vehículos con SOAT vencido
SELECT id_placa, soat
FROM vehiculos
WHERE soat < CURDATE();

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
