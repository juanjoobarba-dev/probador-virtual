// ============================================================
// SERVICIO: AJUSTE DE LA PRENDA
// Lógica de negocio: compara las medidas del cuerpo con las de
// cada talla y dice cómo queda en cada zona.
//
// HOLGURA = medida de la prenda - medida del cuerpo
//   holgura negativa  -> la prenda es más pequeña que tú -> aprieta
//   holgura pequeña   -> justa
//   holgura parecida a la ideal -> bien
//   holgura muy grande -> holgada
// ============================================================

// Zonas que se miran según el tipo de prenda
const ZONAS = {
  superior: ['hombros', 'pecho', 'cintura', 'largo'],
  inferior: ['cintura', 'cadera', 'largo'],
  completo: ['pecho', 'cintura', 'cadera', 'largo'],
};

// Holgura ideal (cm) según cómo le gusta al usuario llevar la ropa
const HOLGURA_IDEAL = {
  ajustado: { hombros: 0, pecho: 2, cintura: 2, cadera: 2 },
  normal: { hombros: 1, pecho: 6, cintura: 6, cadera: 5 },
  holgado: { hombros: 3, pecho: 12, cintura: 12, cadera: 10 },
};

// Texto que ve el usuario para cada estado
const TEXTOS = {
  aprieta: 'Aprieta',
  justo: 'Queda justa',
  bien: 'Queda bien',
  grande: 'Queda holgada',
  corto: 'Queda corta',
  largo: 'Queda larga',
};

// Evalúa UNA zona (por ejemplo el pecho) de UNA talla
function evaluarZona(zona, prenda, talla, cuerpo, preferencia) {
  // --- El largo se mide distinto: comparamos con el largo ideal ---
  if (zona === 'largo') {
    const ideal = prenda.tipo === 'inferior'
      ? cuerpo.entrepierna                    // pantalones: de la ingle al suelo
      : cuerpo.altura * prenda.largoFactor;   // resto: proporción de la altura
    const diferencia = talla.largo - ideal;

    let estado = 'bien';
    if (diferencia < -3) estado = 'corto';
    if (diferencia > 6) estado = 'largo';

    return { zona, estado, texto: TEXTOS[estado], prenda: talla.largo, cuerpo: Math.round(ideal), diferencia: Math.round(diferencia) };
  }

  // --- Contornos (hombros, pecho, cintura, cadera) ---
  let ideal = HOLGURA_IDEAL[preferencia][zona];
  if (prenda.tipo === 'inferior' && zona === 'cintura') ideal = 1; // un pantalón en la cintura va casi justo

  const holgura = talla[zona] - cuerpo[zona];

  let estado = 'bien';
  if (holgura < -1) estado = 'aprieta';              // la prenda es más pequeña que tú
  else if (holgura < ideal - 3) estado = 'justo';    // le falta holgura
  else if (holgura > ideal + 10) estado = 'grande';  // le sobra mucha

  return { zona, estado, texto: TEXTOS[estado], prenda: talla[zona], cuerpo: cuerpo[zona], diferencia: Math.round(holgura * 10) / 10 };
}

// Evalúa todas las zonas de una talla
function evaluarTalla(prenda, talla, cuerpo, preferencia) {
  return ZONAS[prenda.tipo].map((zona) => evaluarZona(zona, prenda, talla, cuerpo, preferencia));
}

// Elige la mejor talla: la que tenga menos "puntos de penalización"
function recomendarTalla(prenda, cuerpo, preferencia) {
  const PENALIZACION = { bien: 0, justo: 10, grande: 10, corto: 5, largo: 5, aprieta: 100 };

  let mejorTalla = null;
  let menosPuntos = Infinity;

  for (const talla of prenda.tallas) {
    const zonas = evaluarTalla(prenda, talla, cuerpo, preferencia);
    // Sumamos la penalización de cada zona (+ un poco por la diferencia, para desempatar)
    const puntos = zonas.reduce((total, z) => total + PENALIZACION[z.estado] + Math.abs(z.diferencia) * 0.1, 0);

    if (puntos < menosPuntos) {
      menosPuntos = puntos;
      mejorTalla = talla.talla;
    }
  }
  return mejorTalla;
}

// Función principal: devuelve todo lo que necesita el probador
function calcular(prenda, cuerpo, preferencia, tallaElegida) {
  const tallaRecomendada = recomendarTalla(prenda, cuerpo, preferencia);

  // Si el usuario no ha elegido talla, le enseñamos la recomendada
  const nombreTalla = tallaElegida || tallaRecomendada;
  const talla = prenda.tallas.find((t) => t.talla === nombreTalla);
  if (!talla) return null;

  const zonas = evaluarTalla(prenda, talla, cuerpo, preferencia);

  // Frase resumen
  let resumen = 'Te queda bien, con algún detalle';
  if (zonas.every((z) => z.estado === 'bien')) resumen = 'Te queda perfecta';
  if (zonas.some((z) => z.estado === 'aprieta')) resumen = 'Esta talla te queda pequeña';

  return { talla: talla.talla, tallaRecomendada, resumen, zonas };
}

module.exports = { calcular };
