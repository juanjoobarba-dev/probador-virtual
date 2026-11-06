// ============================================================
// DIBUJO DEL AVATAR Y DE LA PRENDA (SVG)
//
// Todo se dibuja en CENTÍMETROS REALES: una persona de 175 cm mide
// 175 unidades en el dibujo. Así se ve la diferencia de altura.
//
// La prenda se dibuja con SUS medidas: si es más grande que el cuerpo
// se ve holgada, y si es más pequeña se ve el cuerpo "salirse".
//
// Coordenadas: x = 0 es el centro del cuerpo, y = 0 es la coronilla.
// ============================================================

const COLORES_PIEL = { claro: '#f1d3bc', medio: '#d9a77e', moreno: '#a96f47', oscuro: '#6e4429' };

// Color de cada estado (lo usan también las páginas para la leyenda)
export const COLORES_ESTADO = {
  bien: '#2e9e5b', justo: '#d99a14', aprieta: '#d64545', grande: '#3f7fd9', corto: '#d99a14', largo: '#3f7fd9',
};

const NOMBRES_ZONA = { hombros: 'Hombros', pecho: 'Pecho', cintura: 'Cintura', cadera: 'Cadera', largo: 'Largo' };

// ------------------------------------------------------------
// HERRAMIENTAS DE DIBUJO
// ------------------------------------------------------------

// Une una lista de puntos [x, y] con una línea curva y suave (para que no quede "a picos").
// Si un punto tiene un tercer valor true -> [x, y, true], ese punto es una esquina recta.
function curva(puntos) {
  const n = puntos.length;

  // Dirección de la curva en el punto i (se calcula mirando el punto anterior y el siguiente)
  const direccion = (i) => {
    if (puntos[i][2]) return [0, 0]; // esquina: sin curva
    const anterior = puntos[(i - 1 + n) % n];
    const siguiente = puntos[(i + 1) % n];
    return [(siguiente[0] - anterior[0]) / 6, (siguiente[1] - anterior[1]) / 6];
  };

  let d = `M${puntos[0][0]},${puntos[0][1]}`; // M = mover el lápiz al primer punto
  for (let i = 0; i < n; i++) {
    const a = puntos[i];
    const b = puntos[(i + 1) % n];
    const da = direccion(i);
    const db = direccion((i + 1) % n);
    // C = curva de Bézier desde a hasta b
    d += ` C${a[0] + da[0]},${a[1] + da[1]} ${b[0] - db[0]},${b[1] - db[1]} ${b[0]},${b[1]}`;
  }
  return d + ' Z'; // Z = cerrar la figura
}

// El cuerpo y la ropa son simétricos: solo definimos el LADO DERECHO
// y esta función crea el izquierdo como un espejo (cambiando x por -x).
function simetrico(ladoDerecho) {
  const ladoIzquierdo = ladoDerecho
    .slice()
    .reverse()
    .filter((p) => p[0] !== 0) // los puntos del centro no se repiten
    .map(([x, y, esquina]) => [-x, y, esquina]);
  return [...ladoDerecho, ...ladoIzquierdo];
}

// Oscurece un color hexadecimal (para los bordes)
function oscurecer(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round((n >> 16) * 0.7);
  const g = Math.round(((n >> 8) & 255) * 0.7);
  const b = Math.round((n & 255) * 0.7);
  return `rgb(${r},${g},${b})`;
}

// ------------------------------------------------------------
// CUERPO
// ------------------------------------------------------------

// Pasa las medidas (contornos en cm) a medidas del dibujo (medio ancho visto de frente).
// Un contorno de 100 cm visto de frente mide unos 32 cm de ancho -> la mitad, 16.
function medidasDibujo(cuerpo) {
  const H = cuerpo.altura;
  return {
    H,
    hombros: cuerpo.hombros / 2,
    pecho: cuerpo.pecho / 6.2,
    cintura: cuerpo.cintura / 6.6,
    cadera: cuerpo.cadera / 6.0,
    entrepiernaY: H - cuerpo.entrepierna, // altura de la ingle (y)
    // Altura (y) de cada zona: proporciones típicas del cuerpo humano
    y: { cuello: 0.165 * H, hombros: 0.19 * H, pecho: 0.28 * H, cintura: 0.40 * H, cadera: 0.51 * H },
  };
}

function dibujarCuerpo(m, colorPiel) {
  const { H } = m;
  const borde = oscurecer(colorPiel);

  // Lado derecho del cuerpo, de arriba (cuello) a abajo (pie) y subiendo por dentro de la pierna
  const cuerpo = simetrico([
    [5.5, 0.12 * H], [5.6, 0.155 * H],               // cuello
    [m.hombros - 2.5, 0.172 * H], [m.hombros, 0.19 * H], // hombro
    [m.pecho, 0.26 * H], [m.cintura, 0.40 * H],       // pecho y cintura
    [m.cadera, 0.51 * H], [m.cadera * 0.93, 0.60 * H], // cadera y muslo
    [m.cadera * 0.62, 0.75 * H], [m.cadera * 0.42, 0.93 * H], // rodilla y tobillo
    [m.cadera * 0.6, H, true], [m.cadera * 0.14, H, true],    // pie
    [m.cadera * 0.15, 0.80 * H], [1.4, m.entrepiernaY],       // interior de la pierna
    [0, m.entrepiernaY - 0.6, true],                          // ingle (centro)
  ]);

  // Brazo derecho (el izquierdo es igual cambiando x de signo)
  const brazo = [
    [m.hombros - 1.5, 0.185 * H], [m.hombros + 1.2, 0.2 * H], [m.hombros + 3, 0.3 * H],
    [m.hombros + 4.5, 0.46 * H], [m.hombros + 3.6, 0.52 * H], [m.hombros + 1.5, 0.47 * H],
    [m.hombros - 0.6, 0.31 * H], [m.pecho - 0.5, 0.25 * H],
  ];
  const brazoIzquierdo = brazo.map(([x, y]) => [-x, y]);

  return `
    <g fill="${colorPiel}" stroke="${borde}" stroke-width="0.35">
      <path d="${curva(brazo)}"/>
      <path d="${curva(brazoIzquierdo)}"/>
      <path d="${curva(cuerpo)}"/>
      <ellipse cx="0" cy="${0.065 * H}" rx="${0.047 * H}" ry="${0.062 * H}"/>
    </g>`;
}

// ------------------------------------------------------------
// PRENDA
// Devuelve el SVG de la prenda y dónde está cada zona (para pintar las líneas de colores)
// ------------------------------------------------------------

function dibujarPrenda(m, prenda, talla) {
  const { H } = m;
  let puntos = [];
  const zonas = {}; // zona -> { y, ancho }

  if (prenda.tipo === 'superior') {
    // Camisetas, camisas y chaquetas
    const hombros = talla.hombros / 2;
    const pecho = talla.pecho / 6.2;
    const cintura = talla.cintura / 6.4;
    const bajo = m.y.cuello + talla.largo;               // dónde acaba la prenda
    const anchoBajo = Math.max(cintura, m.cadera * 1.02); // abajo al menos tan ancha como la cadera

    // Manga corta (camiseta) o larga (resto)
    const manga = prenda.categoria === 'camiseta'
      ? [[hombros + 3.4, 0.29 * H, true], [pecho + 1.4, 0.305 * H, true]]
      : [[hombros + 4.6, 0.46 * H, true], [hombros + 1.3, 0.465 * H, true], [pecho + 0.2, 0.28 * H]];

    puntos = simetrico([
      [0, 0.185 * H, true], [5.6, 0.158 * H], [hombros, 0.19 * H], // cuello y hombro
      ...manga,
      [pecho, 0.3 * H], [cintura, 0.4 * H],                         // pecho y cintura
      [anchoBajo, bajo, true], [0, bajo, true],                     // bajo de la prenda
    ]);

    zonas.hombros = { y: m.y.hombros, ancho: hombros };
    zonas.pecho = { y: m.y.pecho, ancho: pecho };
    zonas.cintura = { y: m.y.cintura, ancho: cintura };
    zonas.largo = { y: bajo, ancho: anchoBajo };
  }

  if (prenda.tipo === 'inferior') {
    // Pantalones
    const cintura = talla.cintura / 6.4;
    const cadera = talla.cadera / 6.0;
    const arriba = 0.405 * H;                                   // la cinturilla
    const bajo = Math.min(m.entrepiernaY + talla.largo, H + 1.5); // el bajo (si es muy largo, toca el suelo)

    puntos = simetrico([
      [0, arriba, true], [cintura, arriba, true],               // cinturilla
      [cadera, 0.51 * H], [cadera * 0.68, 0.76 * H],            // cadera y rodilla (exterior)
      [cadera * 0.62, bajo, true], [cadera * 0.1, bajo, true],  // bajo del pantalón
      [cadera * 0.14, 0.7 * H], [0, m.entrepiernaY + 0.5, true], // interior de la pierna y tiro
    ]);

    zonas.cintura = { y: arriba + 1, ancho: cintura };
    zonas.cadera = { y: m.y.cadera, ancho: cadera };
    zonas.largo = { y: bajo, ancho: cadera * 0.62 };
  }

  if (prenda.tipo === 'completo') {
    // Vestidos
    const pecho = talla.pecho / 6.2;
    const cintura = talla.cintura / 6.6;
    const cadera = talla.cadera / 6.0;
    const bajo = Math.min(m.y.cuello + talla.largo, H - 1);

    puntos = simetrico([
      [0, 0.25 * H, true], [pecho + 0.3, 0.245 * H, true],        // escote
      [cintura, 0.4 * H], [cadera, 0.51 * H],                      // cintura y cadera
      [cadera * 1.3, bajo, true], [0, bajo, true],                 // falda con vuelo
    ]);

    zonas.pecho = { y: m.y.pecho, ancho: pecho };
    zonas.cintura = { y: m.y.cintura, ancho: cintura };
    zonas.cadera = { y: m.y.cadera, ancho: cadera };
    zonas.largo = { y: bajo, ancho: cadera * 1.3 };
  }

  const svg = `<path d="${curva(puntos)}" fill="${prenda.color}" stroke="${oscurecer(prenda.color)}" stroke-width="0.4"/>`;
  return { svg, zonas };
}

// Líneas de colores en cada zona + su nombre a la derecha
function dibujarIndicadores(zonasDibujo, zonasAjuste) {
  return zonasAjuste.map((z) => {
    const posicion = zonasDibujo[z.zona];
    const color = COLORES_ESTADO[z.estado];
    return `
      <line x1="${-posicion.ancho}" y1="${posicion.y}" x2="${posicion.ancho}" y2="${posicion.y}"
            stroke="${color}" stroke-width="0.9" stroke-dasharray="1.6 1.2"/>
      <line x1="${posicion.ancho}" y1="${posicion.y}" x2="36" y2="${posicion.y}" stroke="${color}" stroke-width="0.3"/>
      <circle cx="38" cy="${posicion.y}" r="1.6" fill="${color}"/>
      <text x="41" y="${posicion.y + 1.4}" font-size="4">${NOMBRES_ZONA[z.zona]}</text>`;
  }).join('');
}

// ------------------------------------------------------------
// FUNCIONES QUE USAN LAS PÁGINAS
// ------------------------------------------------------------

// Dibuja el avatar (y si se pasa, la prenda con sus zonas de colores) dentro de un <svg>
export function dibujarEscena(svg, { cuerpo, tonoPiel, prenda, talla, zonas }) {
  const m = medidasDibujo(cuerpo);
  const SUELO = 210; // y del suelo en el dibujo

  // Si hay prenda, la dibujamos
  let prendaDibujo = { svg: '', zonas: {} };
  if (prenda && talla) prendaDibujo = dibujarPrenda(m, prenda, talla);

  // Regla de altura a la izquierda (una marca cada 50 cm)
  let regla = `<line x1="-56" y1="${SUELO - 200}" x2="-56" y2="${SUELO}" stroke="#bbb" stroke-width="0.3"/>`;
  for (let cm = 50; cm <= 200; cm += 50) {
    regla += `<text x="-54" y="${SUELO - cm + 1.2}" font-size="3.2" fill="#999">${cm}</text>`;
  }

  // viewBox = qué parte del dibujo se ve: 120 cm de ancho x 216 cm de alto
  svg.setAttribute('viewBox', '-60 0 120 216');
  svg.innerHTML = `
    ${regla}
    <g transform="translate(0 ${SUELO - m.H})">  <!-- bajamos el avatar para que pise el suelo -->
      ${dibujarCuerpo(m, COLORES_PIEL[tonoPiel] || COLORES_PIEL.medio)}
      ${prendaDibujo.svg}
      ${zonas ? dibujarIndicadores(prendaDibujo.zonas, zonas) : ''}
    </g>`;
}

// Miniatura de una prenda para el catálogo (sobre un maniquí gris de talla media)
export function miniaturaPrenda(prenda) {
  const maniqui = { altura: 172, hombros: 44, pecho: 96, cintura: 80, cadera: 98, entrepierna: 78 };
  const m = medidasDibujo(maniqui);
  const tallaMedia = prenda.tallas[Math.floor(prenda.tallas.length / 2)];

  // Recortamos el dibujo a la parte del cuerpo que ocupa la prenda
  const recortes = { superior: [22, 80], inferior: [65, 110], completo: [22, 126] }; // [y inicio, alto]
  const [y, alto] = recortes[prenda.tipo];

  return `<svg viewBox="${-alto * 0.4} ${y} ${alto * 0.8} ${alto}">
    ${dibujarCuerpo(m, '#dcd6ce')}
    ${dibujarPrenda(m, prenda, tallaMedia).svg}
  </svg>`;
}
