# Saray.dev - Portfolio

Portfolio web de una página para Saray, desarrolladora web. Secciones: inicio, sobre mí, servicios, proceso, proyectos (con filtros y "Ver caso"), tecnologías, preguntas frecuentes y contacto. Incluye modo oscuro, menú adaptado a móvil y animaciones de scroll.

## Cómo verlo

Necesita un servidor estático (por ejemplo `npx http-server . -p 5173`) y conexión a internet para las fuentes, GSAP y Lenis (cargan desde CDN). No hace falta compilar nada para verlo: `css/tailwind.css` ya está generado.

## Stack

- HTML + JavaScript clásico (sin módulos)
- Tailwind CSS 3.4 **compilado** (`css/tailwind.css`), sin CDN
- GSAP 3.12.5 + ScrollTrigger y Lenis 1.0.42 (scroll suave en escritorio)
- Fuentes Bricolage Grotesque (títulos) e Instrument Sans (texto)

## Tailwind: cuándo recompilar

Cada vez que añadas o cambies **clases de Tailwind** en `index.html` o en `js/*.js` (las tarjetas de proyectos se crean desde JavaScript):

```bash
npm install        # solo la primera vez
npm run build:css  # regenera css/tailwind.css
```

La configuración (colores, fuentes y archivos que analiza) está en `tailwind.config.js`. Los colores `ink`, `cream` y `kraft` salen de variables CSS: así el modo oscuro cambia los colores sin tocar las clases.

## Estructura

```
index.html          Página única
css/styles.css      Estilos propios (hero, servicios, proceso, tickets, marquesina…)
css/interfaz.css    Tema oscuro, menú, filtros, ventana de caso, pie y cortina
css/tailwind.css    Generado con `npm run build:css` (no se edita a mano)
js/data.js          Proyectos, categorías de filtro y datos de contacto
js/projects.js      Tickets, filtros y ventana "Ver caso"
js/interfaz.js      Tema, sección activa en el menú, volver arriba, transición
js/main.js          Scroll suave, menú móvil, fondo por sección, arranque
js/*.js             Una animación por sección
assets/             Foto, capturas de proyectos (assets/proyectos) e imagen para redes (og.png)
src/input.css       Entrada de Tailwind
robots.txt, sitemap.xml
docs/, .superpowers/   Solo documentación interna (no se suben)
```

## Cosas que se cambian en un solo sitio

- **Proyectos**: `js/data.js`. Cada proyecto lleva `cat` (`web`, `tienda`, `crm`, `inventario`): la pestaña de filtro aparece sola cuando hay proyectos de esa categoría. Los textos `reto` y `hice` alimentan la ventana "Ver caso".
- **Correo y WhatsApp**: `js/data.js` y los `href` estáticos de `index.html` (sección de contacto y pie).
- **CV**: guarda el PDF en `assets/cv.pdf` y pon `cvEnabled: true` en `js/data.js`.
- **Dirección pública** (vista previa al compartir): `canonical`, `og:url`, `og:image` y `twitter:image` en el `<head>` de `index.html`, más `robots.txt` y `sitemap.xml`. Ahora apuntan a `https://sarayortizcordero.github.io/saray.dev/`.
- **Imagen para redes**: `assets/og.png` (1200×630). Se genera con `docs/og.html`.

## Publicar

Sube `index.html`, `css/`, `js/`, `assets/`, `robots.txt` y `sitemap.xml`. **No** publiques `docs/` ni `.superpowers/` (ni `node_modules/`).
