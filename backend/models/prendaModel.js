// ============================================================
// MODELO: PRENDAS
// El modelo es la única parte que habla con la base de datos.
// Los controladores le piden datos y él los devuelve.
// ============================================================

const db = require('../db');
const datosPrueba = require('../datos-prueba');

// Devuelve todas las prendas, cada una con su lista de tallas
async function obtenerTodas() {
  // Modo demo: sin base de datos devolvemos los datos de prueba
  if (!db.hayBaseDeDatos) {
    return datosPrueba;
  }

  const prendas = await db.consulta('SELECT * FROM prendas ORDER BY id');
  const tallas = await db.consulta('SELECT * FROM tallas ORDER BY orden');

  // A cada prenda le añadimos las tallas que le pertenecen
  return prendas.map((prenda) => ({
    ...prenda,
    tallas: tallas.filter((talla) => talla.prendaId === prenda.id),
  }));
}

// Devuelve una sola prenda (o undefined si no existe)
async function obtenerPorId(id) {
  const prendas = await obtenerTodas();
  return prendas.find((prenda) => prenda.id === id);
}

module.exports = { obtenerTodas, obtenerPorId };
