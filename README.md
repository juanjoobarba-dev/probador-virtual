# Probador Virtual

Proyecto de fin de curso de **DAW**.

El usuario rellena un formulario sobre su cuerpo y la web crea un **avatar a escala**. Cuando elige una prenda del catálogo, la ve puesta en el avatar, con colores que indican cómo le queda en cada zona:

- 🟢 Verde: le queda bien
- 🟡 Amarillo: le queda justa o corta
- 🔴 Rojo: le aprieta
- 🔵 Azul: le queda holgada o larga

Además, la web le recomienda la mejor talla.

**Tecnologías:** HTML, CSS y JavaScript (sin frameworks) · Node.js con Express · MySQL · Netlify

---

## ¿Qué es MVC y dónde está cada parte?

MVC divide el código en 3 partes para que cada archivo haga una sola cosa:

| Parte | Qué hace | Dónde está |
|---|---|---|
| **M**odelo | Habla con la base de datos | `backend/models/` |
| **V**ista | Lo que ve el usuario (HTML, CSS, JS del navegador) | `frontend/` |
| **C**ontrolador | Recibe la petición, pide los datos al modelo y responde | `backend/controllers/` |

Además hay dos carpetas que ayudan:

- `backend/routes/`: dice qué controlador atiende cada URL.
- `backend/services/`: los cálculos, es decir, las medidas del cuerpo y si la talla queda bien.

### El recorrido de una petición

Ejemplo: el usuario pulsa la talla "M" en el probador.

```
1. VISTA        frontend/js/probador.js     → llama a calcularAjuste() de api.js
2. (fetch)      POST /api/ajuste             → manda el perfil, la prenda y la talla
3. RUTA         backend/routes/rutas.js      → /ajuste lo atiende ajusteController
4. CONTROLADOR  ajusteController.js          → pide la prenda al modelo
5. MODELO       prendaModel.js               → la saca de MySQL (o de los datos de prueba)
6. SERVICIOS    medidas.js + ajuste.js       → calculan cómo le queda
7. CONTROLADOR  responde con JSON
8. VISTA        avatar.js dibuja el avatar con la prenda y los colores
```

---

## Archivos

```
probador-virtual/
│
├── frontend/                     ← VISTA
│   ├── index.html                portada
│   ├── pages/
│   │   ├── formulario.html       "Mi perfil": formulario de 4 pasos
│   │   ├── catalogo.html         lista de prendas
│   │   └── probador.html         avatar con la prenda puesta
│   ├── css/styles.css            estilos de toda la web
│   └── js/
│       ├── api.js                todas las llamadas al backend + perfil guardado en el navegador
│       ├── avatar.js             dibuja el avatar y la ropa en SVG
│       ├── formulario.js         lógica de la página "Mi perfil"
│       ├── catalogo.js           lógica de la página "Catálogo"
│       └── probador.js           lógica de la página "Probador"
│
├── backend/
│   ├── server.js                 arranca el servidor en tu PC (npm run dev)
│   ├── app.js                    crea la app de Express y le pone las rutas
│   ├── db.js                     conexión a MySQL
│   ├── datos-prueba.js           prendas de ejemplo (para usar sin base de datos)
│   ├── routes/rutas.js           ← RUTAS
│   ├── controllers/              ← CONTROLADORES
│   ├── models/                   ← MODELOS
│   ├── services/                 ← CÁLCULOS
│   └── functions/api.js          para que Netlify pueda ejecutar Express
│
├── database/
│   ├── schema.sql                crea las tablas
│   └── seed.sql                  mete las prendas de ejemplo
│
├── netlify.toml                  configuración de Netlify
├── package.json                  librerías y comandos
└── .env.example                  plantilla de los datos de la base de datos
```

---

## Arrancarlo en tu PC

Necesitas tener instalado [Node.js](https://nodejs.org) (versión 20 o superior).

```bash
npm install     # instala las librerías (solo la primera vez)
npm run dev     # arranca la web
```

Abre <http://localhost:3000>.

**Sin base de datos:** la web funciona en **modo demo** con las prendas de `backend/datos-prueba.js`, pero los perfiles no se guardan en ningún sitio.

**Con MySQL:**

1. Ejecuta `database/schema.sql` y después `database/seed.sql` (por ejemplo, desde MySQL Workbench).
2. Copia `.env.example`, llama a la copia `.env` y rellena tus datos.
3. Vuelve a arrancar con `npm run dev`.

---

## La API

| Método | URL | Qué hace |
|---|---|---|
| GET | `/api/salud` | Comprueba que la API funciona |
| GET | `/api/prendas` | Devuelve todas las prendas con sus tallas |
| GET | `/api/prendas/3` | Devuelve la prenda con id 3 |
| POST | `/api/medidas` | Calcula las medidas del cuerpo a partir del formulario |
| POST | `/api/perfiles` | Guarda el perfil en la base de datos |
| POST | `/api/ajuste` | Devuelve cómo le queda una prenda y qué talla se recomienda |

---

## Publicarlo en Netlify

1. En [app.netlify.com](https://app.netlify.com) elige **Add new site** → **Import an existing project** → **GitHub** → `probador-virtual`.
2. Pulsa **Deploy**. No hace falta configurar nada, porque todo está en `netlify.toml`.
3. Sin base de datos, la web funciona en modo demo.
4. Para conectar MySQL, ve a **Site configuration** → **Environment variables** y añade las mismas variables que tienes en tu `.env`. El MySQL tiene que estar en internet, por ejemplo en el plan gratis de Aiven o TiDB Cloud. Uno instalado en tu PC no sirve, porque Netlify no puede llegar a él.

Cada vez que hagas `git push` a `main`, Netlify vuelve a publicar la web solo.

---

## Cómo trabajamos los dos con Git

```bash
git pull                              # 1. Bajar lo último antes de empezar
git checkout -b nombre-de-la-tarea    # 2. Crear una rama para tu tarea
# ... programar ...
git add .
git commit -m "Qué he hecho"
git push -u origin nombre-de-la-tarea # 3. Subir la rama
```

4. En GitHub, abre un **Pull Request** de tu rama a `main`. El compañero lo revisa y lo une.
