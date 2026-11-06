// ============================================================
// CONTROLADOR: PERFILES
// Trabaja con los datos que el usuario rellena en el formulario.
// ============================================================

const perfilModel = require('../models/perfilModel');
const medidas = require('../services/medidas');

// POST /api/medidas -> calcula las medidas del cuerpo SIN guardar nada.
// El formulario lo llama cada vez que cambias un dato, para redibujar el avatar.
function calcularMedidas(req, res) {
  const perfil = medidas.limpiarPerfil(req.body);

  const error = medidas.validarPerfil(perfil);
  if (error) {
    return res.status(400).json({ error }); // 400 = el usuario ha mandado datos incorrectos
  }

  res.json(medidas.calcular(perfil));
}

// POST /api/perfiles -> guarda el perfil en la base de datos
async function guardar(req, res) {
  try {
    const perfil = medidas.limpiarPerfil(req.body);

    const error = medidas.validarPerfil(perfil);
    if (error) {
      return res.status(400).json({ error });
    }

    const guardado = await perfilModel.guardar(perfil);
    res.status(201).json(guardado); // 201 = creado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el perfil' });
  }
}

module.exports = { calcularMedidas, guardar };
