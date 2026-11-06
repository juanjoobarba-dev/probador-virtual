// ============================================================
// PÁGINA "PROBADOR"
// Pide a la API cómo le queda la prenda al usuario y lo dibuja.
// La prenda viene en la URL: probador.html?prenda=3
// ============================================================

import { obtenerPrendas, calcularAjuste, leerPerfil } from './api.js';
import { dibujarEscena, miniaturaPrenda, COLORES_ESTADO } from './avatar.js';

const NOMBRES_ZONA = { hombros: 'Hombros', pecho: 'Pecho', cintura: 'Cintura', cadera: 'Cadera', largo: 'Largo' };

const perfil = leerPerfil();
let prendaId = Number(new URLSearchParams(location.search).get('prenda')); // el ?prenda= de la URL

// ------------------------------------------------------------
// Lista de prendas de la izquierda (para cambiar de prenda)
// ------------------------------------------------------------
function pintarListaPrendas(prendas) {
  document.getElementById('lista-prendas').innerHTML = prendas.map((p) => `
    <button type="button" data-id="${p.id}" class="${p.id === prendaId ? 'activo' : ''}">
      <span class="mini">${miniaturaPrenda(p)}</span>
      <span>${p.nombre}</span>
    </button>`).join('');
}

// ------------------------------------------------------------
// Prueba una talla (si no se pasa talla, la API usa la recomendada)
// ------------------------------------------------------------
async function probar(talla) {
  const resultado = await calcularAjuste(perfil, prendaId, talla);
  const { prenda, cuerpo, zonas } = resultado;
  const datosTalla = prenda.tallas.find((t) => t.talla === resultado.talla);

  // 1) Dibujo: avatar + prenda + líneas de colores
  dibujarEscena(document.getElementById('escena'), {
    cuerpo, tonoPiel: perfil.tonoPiel, prenda, talla: datosTalla, zonas,
  });

  // 2) Nombre, precio y resumen
  document.getElementById('nombre').textContent = prenda.nombre;
  document.getElementById('precio').textContent = `${prenda.precio.toFixed(2)} €`;
  document.getElementById('resumen').textContent = resultado.resumen;

  // 3) Botones de talla (la recomendada lleva una estrella)
  document.getElementById('tallas').innerHTML = prenda.tallas.map((t) => `
    <button type="button" data-talla="${t.talla}" class="${t.talla === resultado.talla ? 'activo' : ''}">
      ${t.talla}${t.talla === resultado.tallaRecomendada ? ' ★' : ''}
    </button>`).join('');
  document.getElementById('recomendada').textContent = `★ Te recomendamos la ${resultado.tallaRecomendada}`;

  // 4) Lista de zonas con su color
  document.getElementById('zonas').innerHTML = zonas.map((z) => `
    <li>
      <span class="punto" style="background:${COLORES_ESTADO[z.estado]}"></span>
      <div>
        <strong>${NOMBRES_ZONA[z.zona]}: ${z.texto}</strong>
        <small>Prenda ${z.prenda} cm · Tú ${z.cuerpo} cm</small>
      </div>
    </li>`).join('');
}

// ------------------------------------------------------------
// Al cargar la página
// ------------------------------------------------------------
async function iniciar() {
  // Sin perfil no podemos dibujar el avatar: enseñamos el aviso
  if (!perfil) {
    document.getElementById('sin-perfil').hidden = false;
    return;
  }
  document.getElementById('probador').hidden = false;

  try {
    const prendas = await obtenerPrendas();
    if (!prendaId) prendaId = prendas[0].id; // si no viene prenda en la URL, la primera
    pintarListaPrendas(prendas);
    await probar();

    // Clic en otra prenda de la lista
    document.getElementById('lista-prendas').addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton) return;
      prendaId = Number(boton.dataset.id);
      history.replaceState(null, '', `?prenda=${prendaId}`); // actualiza la URL sin recargar
      pintarListaPrendas(prendas);
      probar();
    });

    // Clic en una talla
    document.getElementById('tallas').addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (boton) probar(boton.dataset.talla);
    });
  } catch (error) {
    document.getElementById('resumen').textContent = error.message;
  }
}

iniciar();
