// ============================================================
// MODELO: PERFILES
// Guarda en MySQL los datos que el usuario rellena en el formulario.
// ============================================================

const db = require('../db');

// Guarda un perfil y lo devuelve con su id
async function guardar(perfil) {
  // Modo demo: no hay base de datos, así que no se guarda (id = null)
  if (!db.hayBaseDeDatos) {
    return { id: null, ...perfil };
  }

  // "INSERT ... SET ?" convierte el objeto en columnas: { altura: 175 } -> altura = 175
  const resultado = await db.consulta('INSERT INTO perfiles SET ?', [perfil]);
  return { id: resultado.insertId, ...perfil };
}

module.exports = { guardar };
