// ============================================================
// DATOS DE PRUEBA (modo demo, sin base de datos)
// Son las mismas prendas que mete database/seed.sql en MySQL.
//
// Cada prenda tiene:
//  - tipo: "superior" (camisetas, camisas, chaquetas),
//          "inferior" (pantalones) o "completo" (vestidos)
//  - largoFactor: largo ideal de la prenda = altura del usuario * largoFactor
//  - tallas: medidas DE LA PRENDA en cm (contorno de pecho, cintura...)
// ============================================================

module.exports = [
  {
    id: 1, nombre: 'Camiseta básica', categoria: 'camiseta', tipo: 'superior',
    color: '#e9e4d8', precio: 12.99, largoFactor: 0.40,
    tallas: [
      { talla: 'XS', hombros: 40, pecho: 90, cintura: 86, cadera: null, largo: 66 },
      { talla: 'S', hombros: 42, pecho: 96, cintura: 92, cadera: null, largo: 68 },
      { talla: 'M', hombros: 45, pecho: 102, cintura: 98, cadera: null, largo: 70 },
      { talla: 'L', hombros: 48, pecho: 108, cintura: 104, cadera: null, largo: 72 },
      { talla: 'XL', hombros: 51, pecho: 116, cintura: 112, cadera: null, largo: 74 },
    ],
  },
  {
    id: 2, nombre: 'Camisa Oxford', categoria: 'camisa', tipo: 'superior',
    color: '#8fb3d9', precio: 29.99, largoFactor: 0.42,
    tallas: [
      { talla: 'XS', hombros: 41, pecho: 94, cintura: 88, cadera: null, largo: 71 },
      { talla: 'S', hombros: 43, pecho: 100, cintura: 94, cadera: null, largo: 73 },
      { talla: 'M', hombros: 45.5, pecho: 106, cintura: 100, cadera: null, largo: 75 },
      { talla: 'L', hombros: 48, pecho: 112, cintura: 106, cadera: null, largo: 77 },
      { talla: 'XL', hombros: 50.5, pecho: 120, cintura: 114, cadera: null, largo: 79 },
    ],
  },
  {
    id: 3, nombre: 'Chaqueta vaquera', categoria: 'chaqueta', tipo: 'superior',
    color: '#3d5a80', precio: 49.99, largoFactor: 0.36,
    tallas: [
      { talla: 'XS', hombros: 42, pecho: 98, cintura: 94, cadera: null, largo: 60 },
      { talla: 'S', hombros: 44, pecho: 104, cintura: 100, cadera: null, largo: 62 },
      { talla: 'M', hombros: 46.5, pecho: 110, cintura: 106, cadera: null, largo: 64 },
      { talla: 'L', hombros: 49, pecho: 116, cintura: 112, cadera: null, largo: 66 },
      { talla: 'XL', hombros: 52, pecho: 124, cintura: 120, cadera: null, largo: 68 },
    ],
  },
  {
    id: 4, nombre: 'Pantalón chino', categoria: 'pantalon', tipo: 'inferior',
    color: '#c2a878', precio: 34.99, largoFactor: null,
    tallas: [
      { talla: '38', hombros: null, pecho: null, cintura: 76, cadera: 98, largo: 80 },
      { talla: '40', hombros: null, pecho: null, cintura: 80, cadera: 102, largo: 80 },
      { talla: '42', hombros: null, pecho: null, cintura: 84, cadera: 106, largo: 81 },
      { talla: '44', hombros: null, pecho: null, cintura: 88, cadera: 110, largo: 81 },
      { talla: '46', hombros: null, pecho: null, cintura: 92, cadera: 114, largo: 82 },
    ],
  },
  {
    id: 5, nombre: 'Vaquero slim', categoria: 'pantalon', tipo: 'inferior',
    color: '#2b3a55', precio: 39.99, largoFactor: null,
    tallas: [
      { talla: '38', hombros: null, pecho: null, cintura: 74, cadera: 94, largo: 78 },
      { talla: '40', hombros: null, pecho: null, cintura: 78, cadera: 98, largo: 79 },
      { talla: '42', hombros: null, pecho: null, cintura: 82, cadera: 102, largo: 80 },
      { talla: '44', hombros: null, pecho: null, cintura: 86, cadera: 106, largo: 80 },
      { talla: '46', hombros: null, pecho: null, cintura: 90, cadera: 110, largo: 81 },
    ],
  },
  {
    id: 6, nombre: 'Vestido midi', categoria: 'vestido', tipo: 'completo',
    color: '#b5484f', precio: 44.99, largoFactor: 0.66,
    tallas: [
      { talla: 'XS', hombros: null, pecho: 82, cintura: 64, cadera: 90, largo: 108 },
      { talla: 'S', hombros: null, pecho: 88, cintura: 70, cadera: 96, largo: 110 },
      { talla: 'M', hombros: null, pecho: 94, cintura: 76, cadera: 102, largo: 112 },
      { talla: 'L', hombros: null, pecho: 100, cintura: 82, cadera: 108, largo: 114 },
      { talla: 'XL', hombros: null, pecho: 108, cintura: 90, cadera: 116, largo: 116 },
    ],
  },
];
