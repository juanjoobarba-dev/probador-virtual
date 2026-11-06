// ============================================================
// SERVIDOR LOCAL
// Se usa solo en tu PC (npm run dev). En Netlify NO se usa este
// archivo, se usa functions/api.js.
// ============================================================

const path = require('path');

// Carga las variables del archivo .env (datos de la base de datos)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const app = require('./app'); // la app con todas las rutas de la API

// Además de la API, en local servimos también la carpeta frontend,
// así abriendo http://localhost:3000 ves la web completa.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log(`Web funcionando en http://localhost:${PUERTO}`);
});
