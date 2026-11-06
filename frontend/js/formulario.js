// ============================================================
// PÁGINA "MI PERFIL"
// Formulario de 4 pasos + vista previa del avatar a la derecha.
// ============================================================

import { calcularMedidas, guardarPerfilEnServidor, guardarPerfil, leerPerfil } from './api.js';
import { dibujarEscena } from './avatar.js';

// Elementos de la página que vamos a usar
const formulario = document.getElementById('formulario');
const pasos = document.querySelectorAll('.paso');
const marcasProgreso = document.querySelectorAll('#progreso li');
const botonAtras = document.getElementById('atras');
const botonSiguiente = document.getElementById('siguiente');
const botonGuardar = document.getElementById('guardar');
const mensajeError = document.getElementById('error');
const svgAvatar = document.getElementById('avatar');
const textoAvatar = document.getElementById('texto-avatar');
const listaMedidas = document.getElementById('medidas');

let pasoActual = 0;

// Lee todos los campos del formulario y los devuelve como objeto: { altura: "175", sexo: "masculino", ... }
function leerFormulario() {
  const datos = Object.fromEntries(new FormData(formulario));
  // Quitamos los campos vacíos
  for (const campo in datos) {
    if (datos[campo] === '') delete datos[campo];
  }
  return datos;
}

// Rellena el formulario con un perfil guardado (para poder editarlo)
function rellenarFormulario(perfil) {
  for (const campo in perfil) {
    const elemento = formulario.elements[campo];
    if (elemento && perfil[campo] !== null) elemento.value = perfil[campo];
  }
}

// ------------------------------------------------------------
// PASOS DEL FORMULARIO
// ------------------------------------------------------------

function mostrarPaso(numero) {
  pasoActual = numero;

  // Enseñamos solo el paso actual
  pasos.forEach((paso, i) => { paso.hidden = i !== numero; });
  // Pintamos la barra de progreso
  marcasProgreso.forEach((marca, i) => marca.classList.toggle('activo', i <= numero));

  // Botones: "Atrás" desactivado en el primer paso, "Guardar" solo en el último
  const esUltimo = numero === pasos.length - 1;
  botonAtras.disabled = numero === 0;
  botonSiguiente.hidden = esUltimo;
  botonGuardar.hidden = !esUltimo;
  mensajeError.hidden = true;
}

// Comprueba los campos del paso actual (usa las reglas del HTML: required, min, max...)
function pasoEsValido() {
  for (const campo of pasos[pasoActual].querySelectorAll('input, select')) {
    if (!campo.checkValidity()) {
      campo.reportValidity(); // el navegador enseña el mensaje de error
      return false;
    }
  }
  return true;
}

botonSiguiente.addEventListener('click', () => {
  if (pasoEsValido()) mostrarPaso(pasoActual + 1);
});

botonAtras.addEventListener('click', () => mostrarPaso(pasoActual - 1));

// ------------------------------------------------------------
// VISTA PREVIA DEL AVATAR
// Cada vez que cambia un dato, pedimos las medidas al backend y redibujamos.
// ------------------------------------------------------------

let temporizador;

function actualizarAvatar() {
  // Esperamos 300 ms sin cambios antes de llamar al servidor (para no llamarle con cada tecla)
  clearTimeout(temporizador);
  temporizador = setTimeout(async () => {
    const perfil = leerFormulario();
    if (!perfil.altura || !perfil.peso) return; // sin altura y peso no podemos dibujar

    try {
      const cuerpo = await calcularMedidas(perfil);
      dibujarEscena(svgAvatar, { cuerpo, tonoPiel: perfil.tonoPiel });
      svgAvatar.removeAttribute('hidden'); // (en un <svg> no vale .hidden = false)
      textoAvatar.hidden = true;

      // Lista de medidas debajo del avatar
      listaMedidas.innerHTML = `
        <dt>Pecho</dt><dd>${cuerpo.pecho} cm</dd>
        <dt>Cintura</dt><dd>${cuerpo.cintura} cm</dd>
        <dt>Cadera</dt><dd>${cuerpo.cadera} cm</dd>
        <dt>Hombros</dt><dd>${cuerpo.hombros} cm</dd>
        <dt>Entrepierna</dt><dd>${cuerpo.entrepierna} cm</dd>`;
    } catch (error) {
      textoAvatar.textContent = error.message; // ej: "La altura debe estar entre 120 y 220 cm"
      textoAvatar.hidden = false;
    }
  }, 300);
}

formulario.addEventListener('input', actualizarAvatar);

// ------------------------------------------------------------
// GUARDAR
// ------------------------------------------------------------

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  const perfil = leerFormulario();
  try {
    const guardado = await guardarPerfilEnServidor(perfil); // en la base de datos
    guardarPerfil(guardado);                                // en el navegador
    window.location.href = 'catalogo.html';                 // al catálogo
  } catch (error) {
    mensajeError.textContent = error.message;
    mensajeError.hidden = false;
  }
});

// ------------------------------------------------------------
// AL CARGAR LA PÁGINA
// ------------------------------------------------------------

const perfilAnterior = leerPerfil();
if (perfilAnterior) {
  rellenarFormulario(perfilAnterior);
  actualizarAvatar();
}
mostrarPaso(0);
