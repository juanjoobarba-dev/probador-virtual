// ============================================================
// RUTAS
// Une cada URL de la API con la función del controlador que la atiende.
// Ejemplo: GET /api/prendas  ->  prendasController.listar
// ============================================================

const express = require('express');
const prendasController = require('../controllers/prendasController');
const perfilesController = require('../controllers/perfilesController');
const ajusteController = require('../controllers/ajusteController');

const router = express.Router();

// Para comprobar que la API funciona: abre /api/salud en el navegador
router.get('/salud', (req, res) => {
  res.json({ ok: true });
});

// Prendas del catálogo
router.get('/prendas', prendasController.listar);      // todas
router.get('/prendas/:id', prendasController.verUna);  // una por su id

// Perfil del usuario (datos del formulario)
router.post('/medidas', perfilesController.calcularMedidas); // calcula medidas (vista previa)
router.post('/perfiles', perfilesController.guardar);        // guarda el perfil

// Cómo le queda una prenda al usuario
router.post('/ajuste', ajusteController.calcular);

module.exports = router;
