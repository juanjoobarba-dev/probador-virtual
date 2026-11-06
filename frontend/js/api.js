// ============================================================
// COMUNICACIÓN CON EL BACKEND + PERFIL GUARDADO EN EL NAVEGADOR
// Todas las páginas usan estas funciones en vez de llamar a
// fetch directamente. Así, si cambia la API, solo se toca aquí.
// ============================================================

// Hace una petición a la API y devuelve el JSON de la respuesta.
// Si el servidor responde con error, lanza una excepción con el mensaje.
async function peticion(ruta, metodo = 'GET', datos = null) {
  const opciones = { method: metodo, headers: { 'Content-Type': 'application/json' } };
  if (datos) opciones.body = JSON.stringify(datos);

  const respuesta = await fetch('/api' + ruta, opciones);
  const json = await respuesta.json();

  if (!respuesta.ok) throw new Error(json.error || 'Error en el servidor');
  return json;
}

// --- Llamadas a la API ---
export const obtenerPrendas = () => peticion('/prendas');
export const calcularMedidas = (perfil) => peticion('/medidas', 'POST', perfil);
export const guardarPerfilEnServidor = (perfil) => peticion('/perfiles', 'POST', perfil);
export const calcularAjuste = (perfil, prendaId, talla) => peticion('/ajuste', 'POST', { perfil, prendaId, talla });

// --- Perfil guardado en el navegador (localStorage) ---
// Así el usuario no tiene que rellenar el formulario cada vez que entra.
export function guardarPerfil(perfil) {
  localStorage.setItem('perfil', JSON.stringify(perfil));
}

export function leerPerfil() {
  const texto = localStorage.getItem('perfil');
  return texto ? JSON.parse(texto) : null; // null si todavía no hay perfil
}
