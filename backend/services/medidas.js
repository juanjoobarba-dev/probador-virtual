// ============================================================
// SERVICIO: MEDIDAS DEL CUERPO
// Lógica de negocio: con los datos del formulario calculamos
// las medidas del cuerpo del usuario (en cm).
// ============================================================

// Medidas base según el sexo, como fracción de la altura.
// Ejemplo: un hombre de 175 cm tiene un pecho de unos 175 * 0.55 = 96 cm
const PROPORCIONES = {
  masculino: { pecho: 0.55, cintura: 0.46, cadera: 0.55 },
  femenino: { pecho: 0.53, cintura: 0.42, cadera: 0.58 },
  neutro: { pecho: 0.54, cintura: 0.44, cadera: 0.565 },
};

// Cada silueta hace más grande o más pequeña alguna zona (1 = sin cambio)
const SILUETAS = {
  'triangulo': { pecho: 0.98, cintura: 1.0, cadera: 1.05 },
  'triangulo-invertido': { pecho: 1.04, cintura: 1.0, cadera: 0.97 },
  'rectangulo': { pecho: 1.0, cintura: 1.03, cadera: 1.0 },
  'reloj-arena': { pecho: 1.02, cintura: 0.94, cadera: 1.03 },
  'ovalo': { pecho: 1.03, cintura: 1.1, cadera: 1.02 },
};

// Convierte un valor del formulario en número (o null si está vacío)
function aNumero(valor) {
  if (valor === undefined || valor === null || valor === '') return null;
  return Number(valor);
}

// Limpia los datos del formulario: solo nos quedamos con los campos
// que conocemos y ponemos valores por defecto a los que falten.
function limpiarPerfil(datos) {
  return {
    nombre: datos.nombre || null,
    sexo: datos.sexo || 'neutro',
    altura: aNumero(datos.altura),
    peso: aNumero(datos.peso),
    tipoCuerpo: datos.tipoCuerpo || 'rectangulo',
    hombros: datos.hombros || 'normales',
    tripa: datos.tripa || 'media',
    piernas: datos.piernas || 'proporcionadas',
    pecho: aNumero(datos.pecho),
    cintura: aNumero(datos.cintura),
    cadera: aNumero(datos.cadera),
    entrepierna: aNumero(datos.entrepierna),
    preferencia: datos.preferencia || 'normal',
    tonoPiel: datos.tonoPiel || 'medio',
  };
}

// Comprueba que los datos tienen sentido. Devuelve un texto de error o null si todo está bien.
function validarPerfil(perfil) {
  if (!perfil.altura || perfil.altura < 120 || perfil.altura > 220) return 'La altura debe estar entre 120 y 220 cm';
  if (!perfil.peso || perfil.peso < 30 || perfil.peso > 200) return 'El peso debe estar entre 30 y 200 kg';
  if (!PROPORCIONES[perfil.sexo]) return 'Sexo no válido';
  if (!SILUETAS[perfil.tipoCuerpo]) return 'Silueta no válida';
  return null;
}

// Calcula las medidas del cuerpo
function calcular(perfil) {
  const { altura, peso } = perfil;

  // IMC = peso / altura². Con él sabemos si la persona es más delgada o corpulenta.
  // "complexion" vale 1 para una persona media (IMC 22), más de 1 si es más corpulenta.
  const imc = peso / (altura / 100) ** 2;
  const complexion = Math.sqrt(imc / 22);

  const base = PROPORCIONES[perfil.sexo];
  const silueta = SILUETAS[perfil.tipoCuerpo];

  // 1) Estimamos cada medida
  let pecho = altura * base.pecho * complexion * silueta.pecho;
  let cintura = altura * base.cintura * complexion * silueta.cintura;
  let cadera = altura * base.cadera * complexion * silueta.cadera;
  let entrepierna = altura * 0.45; // de la ingle al suelo

  // 2) Ajustamos con las respuestas del paso "Forma del cuerpo"
  if (perfil.tripa === 'plana') cintura *= 0.97;
  if (perfil.tripa === 'marcada') cintura *= 1.06;
  if (perfil.piernas === 'cortas') entrepierna *= 0.96;
  if (perfil.piernas === 'largas') entrepierna *= 1.04;

  // 3) Si el usuario escribió sus medidas exactas, usamos las suyas
  pecho = perfil.pecho || pecho;
  cintura = perfil.cintura || cintura;
  cadera = perfil.cadera || cadera;
  entrepierna = perfil.entrepierna || entrepierna;

  // 4) Ancho de hombros (de un hombro al otro), sale del pecho
  let hombros = pecho * 0.46;
  if (perfil.hombros === 'estrechos') hombros *= 0.95;
  if (perfil.hombros === 'anchos') hombros *= 1.06;

  // Redondeamos a 1 decimal
  const r = (n) => Math.round(n * 10) / 10;
  return {
    altura, hombros: r(hombros), pecho: r(pecho), cintura: r(cintura), cadera: r(cadera), entrepierna: r(entrepierna),
  };
}

module.exports = { limpiarPerfil, validarPerfil, calcular };
