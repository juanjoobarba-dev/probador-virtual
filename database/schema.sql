-- ============================================================
-- BASE DE DATOS DEL PROBADOR VIRTUAL (MySQL)
-- Ejecuta este archivo primero y después seed.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS probador_virtual;
USE probador_virtual;

-- Borramos las tablas si ya existían (para poder ejecutar el archivo varias veces)
DROP TABLE IF EXISTS tallas;
DROP TABLE IF EXISTS prendas;
DROP TABLE IF EXISTS perfiles;

-- Catálogo de prendas
CREATE TABLE prendas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL,
  categoria    VARCHAR(20)  NOT NULL,  -- camiseta, camisa, chaqueta, pantalon, vestido
  tipo         VARCHAR(20)  NOT NULL,  -- superior, inferior o completo
  color        VARCHAR(7)   NOT NULL,  -- color en hexadecimal, ej: #3d5a80
  precio       DECIMAL(8,2) NOT NULL,
  largoFactor  DECIMAL(4,2) NULL       -- largo ideal = altura del usuario * largoFactor
);

-- Medidas de cada talla de cada prenda (en cm)
CREATE TABLE tallas (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  prendaId  INT NOT NULL,              -- a qué prenda pertenece
  talla     VARCHAR(5) NOT NULL,       -- XS, S, M... o 38, 40, 42...
  orden     INT NOT NULL,              -- para mostrarlas en orden
  hombros   DECIMAL(5,1) NULL,
  pecho     DECIMAL(5,1) NULL,
  cintura   DECIMAL(5,1) NULL,
  cadera    DECIMAL(5,1) NULL,
  largo     DECIMAL(5,1) NULL,
  FOREIGN KEY (prendaId) REFERENCES prendas(id) ON DELETE CASCADE
);

-- Perfiles que rellenan los usuarios en el formulario
CREATE TABLE perfiles (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(60) NULL,
  sexo         VARCHAR(20) NOT NULL,
  altura       DECIMAL(5,1) NOT NULL,
  peso         DECIMAL(5,1) NOT NULL,
  tipoCuerpo   VARCHAR(30) NOT NULL,
  hombros      VARCHAR(20) NOT NULL,
  tripa        VARCHAR(20) NOT NULL,
  piernas      VARCHAR(20) NOT NULL,
  pecho        DECIMAL(5,1) NULL,     -- las medidas exactas son opcionales
  cintura      DECIMAL(5,1) NULL,
  cadera       DECIMAL(5,1) NULL,
  entrepierna  DECIMAL(5,1) NULL,
  preferencia  VARCHAR(20) NOT NULL,  -- ajustado, normal u holgado
  tonoPiel     VARCHAR(20) NOT NULL,
  creadoEn     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
