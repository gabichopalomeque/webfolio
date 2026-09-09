# Portafolio de Gabriel Palomeque

Sitio + panel de administración conectado a Supabase. El sitio (`index.html`)
lee todos los textos, fotos, videos y links desde una base de datos — no hay
que tocar código para actualizar contenido, todo se edita desde `/admin`.

## Estructura del proyecto

```
├── index.html              → el sitio público
├── css/style.css           → todos los estilos
├── js/
│   ├── config.js           → tu URL y llave de Supabase
│   └── site.js             → carga el contenido y arma cada sección
├── assets/                 → fotos y videos que vienen "de fábrica"
├── admin/
│   ├── index.html          → panel de administración (login + edición)
│   └── admin.js
├── schema.sql               → crea las tablas en Supabase (ya lo corriste)
├── seed.sql                 → carga el contenido real (ya lo corriste)
└── fix-formacion.sql        → arregla un párrafo que quedó vacío (corre esto una vez)
```

## Antes de publicar: corre el arreglo pendiente

En el SQL Editor de Supabase, corre el contenido de `fix-formacion.sql` (una
sola vez). Sin esto, el párrafo de la sección Formación se va a ver vacío.

## Subir el proyecto a GitHub

1. Entra a [github.com/new](https://github.com/new) y crea un repositorio
   nuevo (puede ser privado). No marques ninguna opción de "inicializar con
   README" — lo vas a subir tú.
2. En tu computadora, abre una terminal dentro de la carpeta de este proyecto
   (la que tiene `index.html` adentro) y corre:
   ```
   git init
   git add .
   git commit -m "Portafolio inicial"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```
   (Reemplaza la URL por la de tu repositorio — GitHub te la muestra apenas
   lo creas.)

## Publicar en Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project**.
2. Elige **GitHub** y autoriza el acceso. Selecciona el repositorio que
   acabas de subir.
3. En la configuración de build, **déjalo todo vacío** (Build command en
   blanco, Publish directory en blanco o `.`) — este sitio no necesita
   compilarse, son archivos directos.
4. Dale **Deploy site**. En 1–2 minutos tu sitio está en línea con una URL
   tipo `nombre-al-azar.netlify.app`.
5. (Opcional) En **Site settings → Domain management** puedes cambiar ese
   nombre por uno tuyo, o conectar un dominio propio si tienes uno.

De aquí en adelante: cada vez que hagas `git push` con cambios de código,
Netlify vuelve a publicar el sitio solo. Pero para cambiar **textos, fotos o
links** no hace falta tocar código ni GitHub — eso se hace desde `/admin`.

## Cómo usar el panel de administración

1. Ve a `https://tu-sitio.netlify.app/admin/` (o `admin/index.html` en local).
2. Entra con el correo y contraseña que creaste en Supabase (Authentication
   → Users).
3. Usa las pestañas de arriba para moverte entre secciones. Cada bloque tiene
   su botón **Guardar** — los cambios no se aplican hasta que le des clic.
4. Para fotos/videos: elige el archivo, espera a que diga "Listo ✓", y **dale
   Guardar** igual — la subida y el guardado son dos pasos distintos.
5. Los cambios se ven reflejados en el sitio público al recargar la página
   (no hace falta volver a publicar ni tocar Netlify).

## Probarlo en tu computadora antes de subirlo

Como el sitio carga datos por internet (Supabase), necesitas abrirlo desde
un servidor local, no con doble clic:

```
python3 -m http.server 8000
```

y entra a `http://localhost:8000/` en el navegador. Para el panel:
`http://localhost:8000/admin/`.

## Si algo no carga

- Abre la consola del navegador (clic derecho → Inspeccionar → Console) y
  busca errores en rojo — casi siempre dicen exactamente qué tabla o campo
  falló.
- Revisa que `js/config.js` tenga tu URL y llave de Supabase correctas.
- Si un sitio o recorrido 360° embebido no carga, prueba el botón "Abrir en
  pestaña nueva" que está junto a cada uno — algunas plataformas (Wix, por
  ejemplo) bloquean que su contenido se muestre dentro de otras páginas.
