# Saray.dev - Portfolio

Portfolio web de una página para Saray, desarrolladora web. Secciones: inicio, sobre mí, servicios, proceso, proyectos (con filtros y "Ver detalles"), tecnologías, preguntas frecuentes y contacto. Incluye modo oscuro, menú adaptado a móvil, animaciones de scroll y una página de CV (`cv.html`) con versión descargable en PDF.

## Cómo verlo

Necesita un servidor estático (por ejemplo `npx http-server . -p 5173`) y conexión a internet para las fuentes, GSAP y Lenis (cargan desde CDN). No hace falta compilar nada para verlo: `css/tailwind.css` ya está generado.

## Stack

- HTML + JavaScript clásico (sin módulos)
- Tailwind CSS 3.4 **compilado** (`css/tailwind.css`), sin CDN
- GSAP 3.12.5 + ScrollTrigger y Lenis 1.0.42 (scroll suave en escritorio)
- Fuentes Bricolage Grotesque (títulos) e Instrument Sans (texto)

## Comandos

```bash
npm install        # solo la primera vez
npm run build:css  # regenera css/tailwind.css
npm run build:cv   # regenera assets/cv-saray-ortiz.pdf desde cv.html
```

**Tailwind**: recompila cada vez que añadas o cambies clases de Tailwind en `index.html` o en `js/*.js` (las tarjetas de proyectos se crean desde JavaScript). La configuración (colores, fuentes y archivos que analiza) está en `tailwind.config.js`. Los colores `ink`, `cream` y `kraft` salen de variables CSS: así el modo oscuro cambia los colores sin tocar las clases. `cv.html` no usa Tailwind (tiene su propio `css/cv.css`).

**CV**: `npm run build:cv` usa el Chrome o Edge instalado (o el que indique la variable `CHROME_PATH`) y falla si el CV no cabe en una página. Ejecútalo cada vez que cambies `cv.html` o `css/cv.css`, y sube el PDF junto con el cambio.

## Estructura

```
index.html          Página única
cv.html             Currículum (web + base del PDF)
css/styles.css      Estilos propios (hero, servicios, proceso, tickets, marquesina…)
css/interfaz.css    Tema oscuro, menú, filtros, ventana de caso, pie y cortina
css/cv.css          Estilos del CV (pantalla, móvil e impresión/PDF)
css/tailwind.css    Generado con `npm run build:css` (no se edita a mano)
js/data.js          Proyectos y categorías de filtro
js/projects.js      Tickets, filtros y ventana "Ver detalles"
js/interfaz.js      Tema, sección activa en el menú, volver arriba, transición
js/main.js          Scroll suave, menú móvil, fondo por sección, arranque
js/*.js             Una animación por sección
scripts/build-cv.js Genera el PDF del CV
assets/             Foto, capturas de proyectos (assets/proyectos), imagen para redes (og.jpg) y PDF del CV
src/input.css       Entrada de Tailwind
robots.txt, sitemap.xml
docs/, .superpowers/   Solo documentación interna y material de origen (no se suben)
```

## Cosas que se cambian en un solo sitio

- **Proyectos**: `js/data.js`. Cada proyecto lleva `cat` (`web`, `tienda`, `gestion`, `crm`, `inventario`): la pestaña de filtro aparece sola cuando hay proyectos de esa categoría. Los textos `reto` y `hice` alimentan la ventana "Ver detalles".
- **Correo, WhatsApp y CV**: los `href` de `index.html` (botones de Contacto y pie). `cv.html` lleva su propio contacto.
- **Dirección pública** (vista previa al compartir): `canonical`, `og:url`, `og:image` y `twitter:image` en el `<head>` de `index.html` y de `cv.html`, más `robots.txt` y `sitemap.xml`. Ahora apuntan a `https://sarayortizcordero.github.io/saray.dev/`.
- **Imagen para redes**: `assets/og.jpg` (1200×630, unos 50 KB; las redes muestran la vista previa grande solo si pesa menos de ~300 KB). El original sin comprimir está en `docs/fuentes/og.png` (se genera con `docs/og.html`).

## Publicar

Sube `index.html`, `cv.html`, `css/`, `js/`, `assets/`, `robots.txt` y `sitemap.xml`. **No** publiques `docs/`, `.superpowers/` ni `node_modules/`.
