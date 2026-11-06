// ============================================================
// CONEXIÓN A LA BASE DE DATOS (MySQL)
// Si en el .env no hay DB_HOST, no nos conectamos a nada y la
// app funciona en "modo demo" con los datos de datos-prueba.js
// ============================================================

const mysql = require('mysql2/promise');

// true si hay base de datos configurada, false si no
const hayBaseDeDatos = Boolean(process.env.DB_HOST);

let pool = null;

if (hayBaseDeDatos) {
  // Un "pool" es un grupo de conexiones abiertas que se reutilizan
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    decimalNumbers: true, // los DECIMAL de MySQL llegan como números y no como texto
    ssl: process.env.DB_SSL === 'true' ? {} : undefined,
  });
}

// Ejecuta una consulta SQL y devuelve el resultado.
// Los "?" del SQL se rellenan con "valores" (así evitamos inyección SQL).
async function consulta(sql, valores = []) {
  const [resultado] = await pool.query(sql, valores);
  return resultado;
}

module.exports = { hayBaseDeDatos, consulta };
