// ============================================================
// FUNCIÓN DE NETLIFY
// Netlify no tiene un servidor encendido todo el rato.
// "serverless-http" adapta nuestra app de Express para que
// Netlify la ejecute cada vez que llega una petición a /api/...
// ============================================================

const serverless = require('serverless-http');
const app = require('../app');

exports.handler = serverless(app);
