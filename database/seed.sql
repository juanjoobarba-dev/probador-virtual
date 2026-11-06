-- ============================================================
-- DATOS DE PRUEBA: las mismas prendas que backend/datos-prueba.js
-- Ejecuta este archivo después de schema.sql
-- ============================================================

USE probador_virtual;

INSERT INTO prendas (id, nombre, categoria, tipo, color, precio, largoFactor) VALUES
  (1, 'Camiseta básica', 'camiseta', 'superior', '#e9e4d8', 12.99, 0.4),
  (2, 'Camisa Oxford', 'camisa', 'superior', '#8fb3d9', 29.99, 0.42),
  (3, 'Chaqueta vaquera', 'chaqueta', 'superior', '#3d5a80', 49.99, 0.36),
  (4, 'Pantalón chino', 'pantalon', 'inferior', '#c2a878', 34.99, NULL),
  (5, 'Vaquero slim', 'pantalon', 'inferior', '#2b3a55', 39.99, NULL),
  (6, 'Vestido midi', 'vestido', 'completo', '#b5484f', 44.99, 0.66);

-- Medidas de cada talla (cm). NULL = esa medida no se usa en esa prenda
INSERT INTO tallas (prendaId, talla, orden, hombros, pecho, cintura, cadera, largo) VALUES
  (1, 'XS', 1, 40, 90, 86, NULL, 66),
  (1, 'S', 2, 42, 96, 92, NULL, 68),
  (1, 'M', 3, 45, 102, 98, NULL, 70),
  (1, 'L', 4, 48, 108, 104, NULL, 72),
  (1, 'XL', 5, 51, 116, 112, NULL, 74),
  (2, 'XS', 1, 41, 94, 88, NULL, 71),
  (2, 'S', 2, 43, 100, 94, NULL, 73),
  (2, 'M', 3, 45.5, 106, 100, NULL, 75),
  (2, 'L', 4, 48, 112, 106, NULL, 77),
  (2, 'XL', 5, 50.5, 120, 114, NULL, 79),
  (3, 'XS', 1, 42, 98, 94, NULL, 60),
  (3, 'S', 2, 44, 104, 100, NULL, 62),
  (3, 'M', 3, 46.5, 110, 106, NULL, 64),
  (3, 'L', 4, 49, 116, 112, NULL, 66),
  (3, 'XL', 5, 52, 124, 120, NULL, 68),
  (4, '38', 1, NULL, NULL, 76, 98, 80),
  (4, '40', 2, NULL, NULL, 80, 102, 80),
  (4, '42', 3, NULL, NULL, 84, 106, 81),
  (4, '44', 4, NULL, NULL, 88, 110, 81),
  (4, '46', 5, NULL, NULL, 92, 114, 82),
  (5, '38', 1, NULL, NULL, 74, 94, 78),
  (5, '40', 2, NULL, NULL, 78, 98, 79),
  (5, '42', 3, NULL, NULL, 82, 102, 80),
  (5, '44', 4, NULL, NULL, 86, 106, 80),
  (5, '46', 5, NULL, NULL, 90, 110, 81),
  (6, 'XS', 1, NULL, 82, 64, 90, 108),
  (6, 'S', 2, NULL, 88, 70, 96, 110),
  (6, 'M', 3, NULL, 94, 76, 102, 112),
  (6, 'L', 4, NULL, 100, 82, 108, 114),
  (6, 'XL', 5, NULL, 108, 90, 116, 116);
