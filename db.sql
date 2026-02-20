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

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_usuario_rol ON usuarios(id_rol);

-- =====================================================
-- TABLA: informacion_adicional (Cuestionario Seguridad Vial)
-- =====================================================

CREATE TABLE informacion_adicional (
    id_adicional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- CONSENTIMIENTO Y DATOS BÁSICOS
    consentimiento ENUM('SI', 'NO') NOT NULL,
    ciudad VARCHAR(100),
    sitio_labor VARCHAR(150),
    cargo VARCHAR(100),
    
    -- DATOS PERSONALES
    edad VARCHAR(20),
    tipo_contratacion VARCHAR(100),
    genero ENUM('Femenino', 'Masculino'),
    grupo VARCHAR(50),
    grupo_otro VARCHAR(100),
    
    -- TRANSPORTE Y MOVILIDAD
    medio_transporte_desplazamiento VARCHAR(100),
    clase_vehiculo VARCHAR(50),
    clase_vehiculo_otro VARCHAR(100),
    
    -- LICENCIA DE CONDUCCIÓN
    licencia ENUM('SI', 'NO'),
    vigencia_licencia DATE,
    categoria_licencia VARCHAR(10),
    experiencia VARCHAR(20),
    
    -- ACCIDENTES E INCIDENTES
    accidente_5_anios ENUM('SI', 'NO'),
    accidente_laboral ENUM('SI', 'NO'),
    cantidad_accidentes VARCHAR(20),
    cantidad_accidentes_laborales VARCHAR(20),
    rol_accidente VARCHAR(50),
    incidente ENUM('SI', 'NO'),
    
    -- DESPLAZAMIENTOS LABORALES
    vias_publicas ENUM('SI', 'NO'),
    frecuencia_vehiculo_propio VARCHAR(50),
    tipo_vehiculo_propio VARCHAR(50),
    tipo_vehiculo_propio_otro VARCHAR(100),
    empresa_paga_rodamiento ENUM('SI', 'NO'),
    realiza_inspeccion_propio ENUM('SI', 'NO'),
    frecuencia_chequeo_propio VARCHAR(50),
    
    -- VEHÍCULO EMPRESA
    usa_vehiculo_empresa ENUM('SI', 'NO'),
    tipo_vehiculo_empresa VARCHAR(50),
    tipo_vehiculo_empresa_otro VARCHAR(100),
    realiza_inspeccion_empresa ENUM('SI', 'NO'),
    frecuencia_chequeo_empresa VARCHAR(50),
    
    -- PLANIFICACIÓN
    planificacion VARCHAR(50),
    antelacion VARCHAR(50),
    km_mensuales INT,
    
    -- COMPARENDOS
    tiene_comparendos ENUM('SI', 'NO'),
    
    -- CAMPOS JSON PARA ARRAYS Y DATOS COMPLEJOS
    medio_desplazamiento JSON COMMENT 'Array de medios de desplazamiento',
    riesgos JSON COMMENT 'Array de factores de riesgo',
    causas JSON COMMENT 'Array de causas de riesgo',
    causas_comparendo JSON COMMENT 'Array de causas de comparendos',
    
    -- CAMPOS ADICIONALES DE TEXTO LIBRE
    riesgo_otro TEXT,
    causa_otra TEXT,
    causa_comparendo_otra TEXT,
    informacion_adicional TEXT COMMENT 'Información adicional del usuario',

    CONSTRAINT fk_info_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_cedula)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_info_usuario ON informacion_adicional(id_usuario);
CREATE INDEX idx_fecha_registro ON informacion_adicional(fecha_registro);
CREATE INDEX idx_licencia ON informacion_adicional(licencia);
CREATE INDEX idx_accidente ON informacion_adicional(accidente_5_anios);

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
-- NOTAS Y EJEMPLOS DE USO
-- =====================================================

/*
TABLA: informacion_adicional (Cuestionario Seguridad Vial)

ESTRUCTURA:
- Campos estructurados para datos importantes y consultables
- Campos JSON para arrays (medio_desplazamiento, riesgos, causas, causas_comparendo)
- Campos TEXT para respuestas "Otro - ¿Cuál?"
- ENUM para valores Sí/No garantiza integridad de datos
- Índices en campos frecuentemente consultados

EJEMPLO DE INSERCIÓN:

INSERT INTO informacion_adicional (
    id_usuario,
    consentimiento,
    ciudad,
    sitio_labor,
    cargo,
    edad,
    tipo_contratacion,
    genero,
    grupo,
    licencia,
    vigencia_licencia,
    categoria_licencia,
    experiencia,
    accidente_5_anios,
    vias_publicas,
    medio_desplazamiento,
    riesgos,
    causas,
    tiene_comparendos,
    causas_comparendo,
    km_mensuales
) VALUES (
    123456789,
    'SI',
    'Bogotá',
    'Planta Central',
    'Técnico de Campo',
    '28-37',
    'Termino indefinido',
    'Masculino',
    'Operativo',
    'SI',
    '2027-12-31',
    'B1',
    '5-10',
    'NO',
    'SI',
    JSON_ARRAY('Conduciendo propio', 'Vehiculo empresa'),
    JSON_ARRAY('Infraestructura', 'Organizacion'),
    JSON_ARRAY('Trafico', 'Clima', 'Vehiculo'),
    'NO',
    JSON_ARRAY(),
    350
);

CONSULTA DE DATOS JSON:

-- Obtener usuarios que se desplazan conduciendo vehículo propio
SELECT u.nombre, ia.ciudad, ia.cargo
FROM informacion_adicional ia
JOIN usuarios u ON ia.id_usuario = u.id_cedula
WHERE JSON_CONTAINS(ia.medio_desplazamiento, '"Conduciendo propio"');

-- Listar factores de riesgo identificados
SELECT u.nombre, JSON_UNQUOTE(JSON_EXTRACT(ia.riesgos, '$')) as factores_riesgo
FROM informacion_adicional ia
JOIN usuarios u ON ia.id_usuario = u.id_cedula
WHERE ia.riesgos IS NOT NULL;

-- Estadísticas de accidentes por área
SELECT u.area, 
       COUNT(*) as total,
       SUM(CASE WHEN accidente_5_anios = 'SI' THEN 1 ELSE 0 END) as con_accidentes
FROM informacion_adicional ia
JOIN usuarios u ON ia.id_usuario = u.id_cedula
GROUP BY u.area;
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
