// ============================================================
// CONTROLADOR: AJUSTE
// Calcula cómo le queda una prenda al usuario.
//
// El frontend manda:  { perfil: {...}, prendaId: 1, talla: "M" }
// (talla es opcional: si no viene, se usa la recomendada)
// ============================================================

const prendaModel = require('../models/prendaModel');
const medidas = require('../services/medidas');
const ajuste = require('../services/ajuste');

// POST /api/ajuste
async function calcular(req, res) {
  try {
    // 1) Comprobamos el perfil del usuario
    const perfil = medidas.limpiarPerfil(req.body.perfil || {});
    const error = medidas.validarPerfil(perfil);
    if (error) {
      return res.status(400).json({ error });
    }

    // 2) Buscamos la prenda
    const prenda = await prendaModel.obtenerPorId(Number(req.body.prendaId));
    if (!prenda) {
      return res.status(404).json({ error: 'Prenda no encontrada' });
    }

    // 3) Calculamos las medidas del cuerpo y comparamos con la prenda
    const cuerpo = medidas.calcular(perfil);
    const resultado = ajuste.calcular(prenda, cuerpo, perfil.preferencia, req.body.talla);
    if (!resultado) {
      return res.status(400).json({ error: 'Esa talla no existe' });
    }

    // 4) Respondemos con todo lo que necesita el probador para dibujar
    res.json({ prenda, cuerpo, ...resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular el ajuste' });
  }
}

module.exports = { calcular };
