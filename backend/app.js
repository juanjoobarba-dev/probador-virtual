// ============================================================
// APP DE EXPRESS
// Aquí se crea la aplicación y se le dice qué rutas tiene.
// La usan tanto server.js (local) como functions/api.js (Netlify).
// ============================================================

const express = require('express');
const rutas = require('./routes/rutas');

const app = express();

// Permite leer el JSON que manda el frontend en el cuerpo de las peticiones (req.body)
app.use(express.json());

// Todas las rutas de la API empiezan por /api
// (en Netlify las peticiones llegan como /.netlify/functions/api, por eso ponemos las dos)
app.use(['/api', '/.netlify/functions/api'], rutas);

module.exports = app;
