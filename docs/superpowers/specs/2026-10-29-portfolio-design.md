# Portfolio de Saray: diseño

## Intención
Saray es desarrolladora web full stack junior. Necesita un portfolio que haga que **clientes** quieran encargarle un proyecto y que **reclutadores/empresas** quieran incorporarla a su equipo. Sustituye al portfolio actual (`saraydev.vercel.app`, repo `portfolio-web`), que queda como respaldo.

La referencia visual es `prathamfolio.com` (portfolio de una diseñadora gráfica). Se toma el **estilo y la mecánica de animación**, no los textos, imágenes ni la estructura de contenido.

## Objetivos
- Una sola página, en español, que se recorre bajando, con un fondo distinto por sección.
- Efecto "wow" por animación: tipografía gigante de fondo, tarjetas/iconos 3D flotantes con inclinación, profundidad y desenfoque de movimiento, scroll suave.
- Mostrar 6 proyectos reales con demo y código.
- Contacto directo por correo y WhatsApp; botón de CV preparado pero desactivado.

## No objetivos
- No incluye CRM ni paneles de inventario (los añadirá más adelante, cuando los rehaga).
- No incluye CV real (pendiente de revisión por Saray).
- No incluye las fotos finales: foto de Saray e imágenes de proyectos van como marcadores de posición hasta que ella las aporte.
- No copiar textos, imágenes ni marca de prathamfolio.com.
- Sin backend, sin WordPress, sin formulario de contacto.

## Antiobjetivos (fallaría aunque "funcione")
- Que parezca un portfolio de diseñadora gráfica en vez de uno de desarrolladora.
- Animaciones que se traben en móvil o que bloqueen el scroll.
- Texto ilegible por contraste bajo sobre los fondos de color.
- Dependencia de nada que no sea abrir `index.html` o servir la carpeta estática.

## Restricciones
- Stack: HTML, CSS con **Tailwind**, JavaScript, **GSAP 3.12.5 + ScrollTrigger**, **Lenis** (scroll suave). Sin Three.js ni framework.
- Fuentes: **Poppins** y **DM Sans** (Google Fonts).
- Carpeta de trabajo: `C:\Users\Usuario\Desktop\MI NEGOCIO\portfolio-saray\`. No tocar los archivos que ya hay en `MI NEGOCIO\` (`index.html`, `css`, `js`, `pages`, `blueprints`).
- Todo en español.
- Respetar `prefers-reduced-motion`.
- Tailwind por CDN solo para desarrollo; dejar preparado el paso de compilarlo antes de publicar.

## Decisiones tomadas por Saray
- Nombre grande en el hero: **"Saray"**; ".dev" en el logo pequeño (propuesta aceptada implícitamente).
- Paleta: **Black Beauty `#26262A`**, **Jester Red `#9E1030`**, **Gardenia `#F1E8DF`**.
- Proyectos a mostrar (repos de GitHub `SarayOrtizCordero`): Vortex-Gym, Fogon-Restaurante, cafeteri-crm, Video-Game-Universe, Olympus-Cars, real-estate-agency-1.
- Contacto: correo, WhatsApp y CV (CV desactivado por ahora).
- Orden y contenido de secciones aprobado con el boceto de estructura.

## Decisiones tomadas por Claude (a revisar)
- Reparto de color: Gardenia en hero, sobre mí, servicios y proyectos; Black Beauty en tecnologías; Jester Red en contacto y en botones de acción.
- Cuatro tarjetas de servicio: Webs y landings, Sistemas a medida (CRM), Paneles de inventario, Diseño responsive.
- Sección de tecnologías con iconos tipo polaroid que caen y giran.
- Al pulsar un proyecto: enlaces a demo y a código.
- URLs de demo: `https://sarayortizcordero.github.io/<repo>/` para cada repo; cafeteri-crm no tiene demo publicada, solo código.

## Secciones
1. **Hero** (Gardenia): "Saray" gigante en tono apagado, foto recortada delante, subtítulo "Desarrolladora web", botón de contacto en rojo, menú flotante en píldora (Inicio, Proyectos, Sobre mí, Contacto).
2. **Sobre mí** (Gardenia): párrafo corto centrado, botón oscuro.
3. **¿En qué puedo ayudarte?** (Gardenia): cuatro tarjetas 3D oscuras en abanico.
4. **Proyectos** (Gardenia): texto gigante de fondo; seis tarjetas flotantes con inclinación y profundidad.
5. **Tecnologías** (Black Beauty): iconos polaroid que caen y giran (HTML, CSS, JavaScript, PHP, Git/GitHub, Vercel, Tailwind, GSAP).
6. **Contacto** (Jester Red): frase de cierre, botones de correo, WhatsApp y CV (desactivado).

## A cargo de quien construya
- Estructura de archivos, nombres de clases y organización del JS.
- Tiempos, easings y parámetros concretos de GSAP.
- Texto de los párrafos (en español, tono profesional y cercano), que Saray revisará.
- Datos de contacto: **correo y número de WhatsApp aún no facilitados**; usar marcadores claramente identificables.
