# Saray.dev - Portfolio

Portfolio web de una página para Saray, desarrolladora web. Secciones: inicio, sobre mí, servicios, proyectos, tecnologías y contacto, con animaciones de scroll.

## Cómo abrirlo

Haz doble clic en `index.html`. No necesita servidor ni instalación (carga Tailwind, GSAP y Lenis desde CDN, así que hace falta conexión a internet).

## Stack

- HTML + JavaScript clásico (sin módulos)
- Tailwind CSS 3.4.17 (por CDN, con paso de compilación preparado)
- GSAP 3.12.5 + ScrollTrigger y Lenis 1.0.42 (scroll suave)
- Fuentes Poppins (títulos) y DM Sans (texto)

## Estructura

```
index.html        Página única
css/styles.css    Estilos propios
js/data.js        Proyectos y datos de contacto
js/main.js        Scroll suave, fondo por sección, arranque
js/*.js           Una animación por sección (hero, services, projects, tech, contact)
src/input.css     Entrada de Tailwind (para compilar)
tailwind.config.js, package.json   Compilación de Tailwind
docs/, .superpowers/   Solo documentación interna
```

## Qué hay que reemplazar

- **Foto del hero**: en `index.html`, el bloque `#hero-foto` con el texto "Aquí va tu foto".
- **Imágenes de proyectos**: ahora cada tarjeta usa un recuadro con el nombre; se genera en `js/projects.js`.
- **Correo y WhatsApp**: sustituye `CORREO_PENDIENTE` y `WHATSAPP_PENDIENTE` en **los dos sitios**: `js/data.js` y los `href` estáticos de `index.html` (sección de contacto, ids `contacto-correo` y `contacto-whatsapp`). El WhatsApp va con prefijo de país y solo dígitos.
- **CV**: guarda el PDF en `assets/cv.pdf` y pon `cvEnabled: true` en `js/data.js`.

## Compilar Tailwind antes de publicar

Ahora la página usa el CDN de Tailwind (cómodo para desarrollar, pesado para producción). Para publicar:

1. `npm install`
2. `npm run build:css` (genera `css/tailwind.css`)
3. En `index.html`, elimina el `<script src="https://cdn.tailwindcss.com/...">` y el bloque `tailwind.config = {...}`, y añade `<link rel="stylesheet" href="css/tailwind.css">` antes de `css/styles.css`.

La configuración (colores y fuentes) está en `tailwind.config.js`; incluye `js/` porque las tarjetas de proyectos se crean desde JavaScript.

## Publicar

Sube solo `index.html`, `css/`, `js/` y `assets/`. **No** publiques `docs/` ni `.superpowers/` (ni `node_modules/`, `src/` o los archivos de configuración).
