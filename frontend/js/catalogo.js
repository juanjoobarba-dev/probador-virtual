// ============================================================
// PÁGINA "CATÁLOGO"
// Pide las prendas a la API y las pinta en tarjetas.
// ============================================================

import { obtenerPrendas, leerPerfil } from './api.js';
import { miniaturaPrenda } from './avatar.js';

const rejilla = document.getElementById('rejilla');
const filtros = document.getElementById('filtros');

let prendas = []; // aquí guardamos las prendas que llegan de la API

// Pinta las tarjetas de las prendas de una categoría ('' = todas)
function pintarPrendas(categoria) {
  const visibles = prendas.filter((p) => categoria === '' || p.categoria === categoria);

  rejilla.innerHTML = visibles.map((prenda) => `
    <article class="producto tarjeta">
      <div class="imagen">${miniaturaPrenda(prenda)}</div>
      <div class="info">
        <h3>${prenda.nombre}</h3>
        <span class="precio">${prenda.precio.toFixed(2)} €</span>
        <span class="tallas">Tallas: ${prenda.tallas.map((t) => t.talla).join(' · ')}</span>
        <a class="boton" href="probador.html?prenda=${prenda.id}">Probármela</a>
      </div>
    </article>`).join('');
}

// Al pulsar un filtro, lo marcamos y pintamos solo esa categoría
filtros.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button');
  if (!boton) return;

  filtros.querySelectorAll('button').forEach((b) => b.classList.remove('activo'));
  boton.classList.add('activo');
  pintarPrendas(boton.dataset.categoria);
});

// Al cargar la página
async function iniciar() {
  // Si no hay perfil, enseñamos el aviso para que lo cree
  document.getElementById('aviso-perfil').hidden = leerPerfil() !== null;

  try {
    prendas = await obtenerPrendas();
    pintarPrendas('');
  } catch (error) {
    rejilla.innerHTML = `<p class="aviso error">${error.message}</p>`;
  }
}

iniciar();
