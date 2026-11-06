// ============================================================
// CONTROLADOR: PRENDAS
// Recibe la petición (req), pide los datos al modelo y
// responde (res) con JSON.
// ============================================================

const prendaModel = require('../models/prendaModel');

// GET /api/prendas -> lista de todas las prendas
async function listar(req, res) {
  try {
    const prendas = await prendaModel.obtenerTodas();
    res.json(prendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar las prendas' });
  }
}

// GET /api/prendas/:id -> una prenda concreta
async function verUna(req, res) {
  try {
    const id = Number(req.params.id); // el :id de la URL
    const prenda = await prendaModel.obtenerPorId(id);

    if (!prenda) {
      return res.status(404).json({ error: 'Prenda no encontrada' });
    }
    res.json(prenda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar la prenda' });
  }
}

module.exports = { listar, verUna };
