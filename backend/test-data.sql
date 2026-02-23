-- =====================================================
-- DATOS DE PRUEBA PARA EL BACKEND
-- =====================================================
-- Ejecuta este archivo DESPUÉS de db.sql

USE control_vehicular_acueducto;

-- Limpiar datos existentes
DELETE FROM mantenimientos;
DELETE FROM vehiculos;
DELETE FROM informacion_adicional;
DELETE FROM usuarios;
DELETE FROM roles;

-- =====================================================
-- ROLES
-- =====================================================
INSERT INTO roles (id_rol, nombre_rol) VALUES
(1, 'Conductor'),
(2, 'Supervisor'),
(3, 'Administrador');

-- =====================================================
-- USUARIOS (Conductores y Supervisores)
-- =====================================================
-- Nota: Las contraseñas están en texto plano aquí para pruebas
-- En producción deben estar hasheadas con bcrypt

INSERT INTO usuarios (id_cedula, nombre, id_rol, area, celular, password) VALUES
-- Conductores
(1001234567, 'Carlos Andrés López García', 1, 'Operaciones', '3001234567', '123456'),
(1001234568, 'María Fernanda Ruiz Torres', 1, 'Mantenimiento', '3009876543', '123456'),
(1001234569, 'José Manuel Gómez Pérez', 1, 'Distribución', '3123456789', '123456'),
(1001234570, 'Ana Lucía Martínez Silva', 1, 'Operaciones', '3156789012', '123456'),
(1001234571, 'Luis Fernando Castro Díaz', 1, 'Logística', '3189012345', '123456'),

-- Supervisores (con contraseña)
(1002345678, 'Roberto Carlos Sánchez Méndez', 2, 'Supervisión', '3201234567', 'supervisor123'),
(1002345679, 'Patricia Elena Ramírez Ortiz', 2, 'Control Interno', '3209876543', 'supervisor123'),

-- Administrador
(1003456789, 'Juan Pablo Admin González', 3, 'Administración', '3101112233', 'admin123');

-- =====================================================
-- VEHÍCULOS
-- =====================================================
INSERT INTO vehiculos (
    id_placa, modelo, marca, anio, color, tipo_combustible,
    kilometraje_actual, ultimo_mantenimiento, id_usuario, soat, tecno
) VALUES
-- Vehículos vigentes (SOAT y Tecno lejanos)
('ABC-123', 'Hilux', 'Toyota', 2022, 'Blanco', 'Diesel', 45000, '2026-01-15', 1001234567, '2027-08-15', '2027-05-20'),
('DEF-456', 'Ranger', 'Ford', 2023, 'Gris', 'Diesel', 28000, '2026-02-01', 1001234568, '2027-09-30', '2027-06-15'),
('GHI-789', 'NP300', 'Nissan', 2021, 'Negro', 'Diesel', 62000, '2025-12-20', 1001234569, '2027-07-10', '2027-04-25'),

-- Vehículos por vencer (SOAT o Tecno en 30 días o menos)
('JKL-012', 'Dmax', 'Chevrolet', 2020, 'Rojo', 'Diesel', 78000, '2025-11-10', 1001234570, '2026-03-15', '2026-04-10'),
('MNO-345', 'Amarok', 'Volkswagen', 2024, 'Azul', 'Diesel', 12000, '2026-02-20', 1001234571, '2026-03-25', '2027-02-10'),

-- Vehículos vencidos (SOAT o Tecno ya pasó)
('PQR-678', 'Frontier', 'Nissan', 2019, 'Verde', 'Diesel', 95000, '2025-08-15', 1001234567, '2026-01-15', '2026-02-10'),
('STU-901', 'Saveiro', 'Volkswagen', 2018, 'Blanca', 'Gasolina', 110000, '2025-07-20', 1001234568, '2025-12-20', '2026-01-05'),

-- Camionetas sin asignar (para pruebas)
('VWX-234', 'L200', 'Mitsubishi', 2023, 'Gris Oscuro', 'Diesel', 8000, '2026-02-10', 1001234569, '2027-10-15', '2027-08-20'),
('YZA-567', 'BT-50', 'Mazda', 2022, 'Rojo', 'Diesel', 35000, '2026-01-25', 1001234570, '2027-06-30', '2027-03-15'),

-- Vehículos de supervisores
('SUP-111', 'Grand Vitara', 'Suzuki', 2024, 'Blanco', 'Gasolina', 5000, '2026-02-15', 1002345678, '2027-11-20', '2027-09-10'),
('SUP-222', 'Sportage', 'Kia', 2023, 'Negro', 'Gasolina', 18000, '2026-01-30', 1002345679, '2027-08-25', '2027-07-05');

-- =====================================================
-- MANTENIMIENTOS (Ejemplos)
-- =====================================================
INSERT INTO mantenimientos (
    id_placa, tipo_mantenimiento, fecha_realizado, fecha_proxima,
    kilometraje, costo, descripcion
) VALUES
-- Vehículo ABC-123
('ABC-123', 'oil_change', '2026-01-15', '2026-07-15', 45000, 180000, 'Cambio de aceite y filtro'),
('ABC-123', 'tire_change', '2025-11-20', '2026-05-20', 43000, 850000, 'Cambio de 4 llantas'),
('ABC-123', 'brake_fluid', '2025-09-10', '2027-09-10', 40000, 120000, 'Cambio de líquido de frenos'),

-- Vehículo DEF-456
('DEF-456', 'oil_change', '2026-02-01', '2026-08-01', 28000, 185000, 'Cambio de aceite sintético'),
('DEF-456', 'filters', '2026-02-01', '2026-08-01', 28000, 95000, 'Cambio de filtros de aire y combustible'),

-- Vehículo GHI-789
('GHI-789', 'oil_change', '2025-12-20', '2026-06-20', 62000, 175000, 'Cambio de aceite'),
('GHI-789', 'brakes', '2025-10-15', '2026-10-15', 60000, 380000, 'Cambio de pastillas de freno'),

-- Vehículo JKL-012
('JKL-012', 'oil_change', '2025-11-10', '2026-05-10', 78000, 170000, 'Cambio de aceite'),
('JKL-012', 'suspension', '2025-08-05', '2026-08-05', 75000, 650000, 'Reparación de suspensión delantera'),

-- Vehículo MNO-345
('MNO-345', 'oil_change', '2026-02-20', '2026-08-20', 12000, 190000, 'Primer cambio de aceite'),

-- Vehículo PQR-678
('PQR-678', 'oil_change', '2025-08-15', '2026-02-15', 95000, 165000, 'Cambio de aceite'),
('PQR-678', 'battery', '2025-06-10', '2027-06-10', 92000, 280000, 'Cambio de batería'),

-- Vehículo STU-901
('STU-901', 'oil_change', '2025-07-20', '2026-01-20', 110000, 160000, 'Cambio de aceite'),
('STU-901', 'transmission', '2025-05-15', '2026-05-15', 108000, 1200000, 'Mantenimiento de transmisión');

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'DATOS DE PRUEBA INSERTADOS CORRECTAMENTE' as mensaje;

SELECT 
    (SELECT COUNT(*) FROM roles) as roles,
    (SELECT COUNT(*) FROM usuarios) as usuarios,
    (SELECT COUNT(*) FROM vehiculos) as vehiculos,
    (SELECT COUNT(*) FROM mantenimientos) as mantenimientos;

-- Mostrar vehículos con conductor
SELECT 
    v.id_placa,
    v.marca,
    v.modelo,
    u.nombre as conductor,
    v.soat,
    v.tecno
FROM vehiculos v
LEFT JOIN usuarios u ON v.id_usuario = u.id_cedula
ORDER BY v.id_placa;
