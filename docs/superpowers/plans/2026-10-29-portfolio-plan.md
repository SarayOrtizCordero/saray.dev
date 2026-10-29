# Portfolio de Saray: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un portfolio de una sola página, en español, con el estilo animado de prathamfolio.com y la paleta Black Beauty / Jester Red / Gardenia.

**Architecture:** Un `index.html` estático con Tailwind (CDN en desarrollo) y scripts clásicos (sin módulos, para que se abra con doble clic en `file://`). Un `main.js` arranca Lenis y GSAP y llama a un `init*` por sección, cada uno en su archivo. Los proyectos salen de un array en `js/data.js`.

**Tech Stack:** HTML, Tailwind CSS (CDN), JavaScript, GSAP 3.12.5 + ScrollTrigger, Lenis 1.0.42, Poppins + DM Sans.

**Spec:** `docs/superpowers/specs/2026-10-29-portfolio-design.md`

## Global Constraints

- Carpeta: `C:\Users\Usuario\Desktop\MI NEGOCIO\portfolio-saray\`. No tocar `index.html`, `css`, `js`, `pages`, `blueprints` de `MI NEGOCIO\`.
- Colores: Black Beauty `#26262A`, Jester Red `#9E1030`, Gardenia `#F1E8DF`. Definirlos una vez como tokens de Tailwind: `ink`, `wine`, `cream`.
- Fuentes: Poppins (títulos) y DM Sans (texto). Todo el texto visible en español.
- Scripts clásicos, sin `type="module"`, y versiones fijadas: GSAP 3.12.5 (cdnjs), ScrollTrigger 3.12.5, Lenis 1.0.42 (jsdelivr).
- Respetar `prefers-reduced-motion`: sin animaciones de scroll ni flotado, contenido visible.
- El contenido debe verse aunque falle un CDN: estados iniciales de animación los pone JS, no CSS.
- Contacto: correo y WhatsApp aún sin datos. Usar `CORREO_PENDIENTE` y `WHATSAPP_PENDIENTE` como valores fáciles de buscar. El botón de CV va desactivado.
- No es un repo git: cada "checkpoint" es una verificación en el navegador, sin commit.

## Review Focus

- Foto de Saray no existe aún: el hero muestra un marcador visible, no una imagen rota.
- Imágenes de proyecto no existen aún: cada tarjeta muestra un marcador con el nombre, sin iconos rotos.
- cafeteri-crm no tiene demo: su tarjeta no muestra enlace de demo, solo código.
- Ancho 375 px: sin scroll horizontal y texto legible.
- Navegación por anclas con Lenis activo: pulsar "Contacto" llega a la sección.
- Botón CV desactivado: no navega ni parece activo.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura, 6 secciones, menú, carga de CDN y scripts |
| `css/styles.css` | Lo que Tailwind no cubre: texto gigante de fondo, perspectiva 3D, desenfoque |
| `js/data.js` | `window.PROJECTS` (6 proyectos) y `window.CONTACT` |
| `js/main.js` | Lenis, registro de ScrollTrigger, cambio de fondo por sección, llama a los `init*` |
| `js/hero.js` | `initHero()` |
| `js/services.js` | `initServices()` |
| `js/projects.js` | `renderProjects()` y `initProjects()` |
| `js/tech.js` | `initTech()` |
| `js/contact.js` | `initContact()` |
| `assets/` | Marcadores de foto e imágenes (vacío al inicio) |

---

### Task 1: Base, menú y scroll suave

**Files:**
- Create: `index.html`, `css/styles.css`, `js/data.js`, `js/main.js`

**Interfaces:**
- Produces: `window.PROJECTS: {id:string,name:string,type:string,description:string,demo:string|null,code:string}[]`; `window.CONTACT: {email:string,whatsapp:string,cvEnabled:boolean}`; `window.reduceMotion: boolean`; en `main.js` se llaman `initHero()`, `initServices()`, `initProjects()`, `initTech()`, `initContact()` solo si existen (`typeof fn === 'function'`).
- Tailwind config inline: colores `ink`, `wine`, `cream`; fuentes `display` (Poppins) y `body` (DM Sans).

- [ ] **Step 1:** `index.html` con `<html lang="es">`, meta viewport, `<title>Saray.dev | Desarrolladora web</title>`, Tailwind CDN con la config de arriba, Google Fonts, y seis `<section>` vacías con ids `inicio`, `sobre-mi`, `servicios`, `proyectos`, `tecnologias`, `contacto` y atributo `data-bg` (`cream`, `cream`, `cream`, `cream`, `ink`, `wine`).
- [ ] **Step 2:** Menú flotante en píldora oscura (`nav#menu`), fijo arriba y centrado, con anclas a las cinco secciones y logo "Saray.dev". En móvil se reduce a logo + botón "Contacto".
- [ ] **Step 3:** `data.js` con los seis proyectos. Demos `https://sarayortizcordero.github.io/<repo>/`, código `https://github.com/SarayOrtizCordero/<repo>`. Repos: `Vortex-Gym`, `Fogon-Restaurante`, `cafeteri-crm` (`demo: null`), `Video-Game-Universe`, `Olympus-Cars`, `real-estate-agency-1`. `CONTACT = {email:'CORREO_PENDIENTE', whatsapp:'WHATSAPP_PENDIENTE', cvEnabled:false}`.
- [ ] **Step 4:** `main.js`: `window.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches`; si no hay reduce, crear `new Lenis()` y conectarlo con `gsap.ticker` y `ScrollTrigger.update`; anclas del menú usan `lenis.scrollTo(target)`. Un `ScrollTrigger` por sección cambia el color de fondo del `body` según `data-bg` con transición de 0,6 s.
- [ ] **Step 5: Verificar.** Abrir `index.html` en el navegador. Esperado: sin errores en consola, menú visible, al bajar el fondo cambia crema → oscuro → vino, pulsar "Contacto" baja suave.

### Task 2: Hero

**Files:** Create `js/hero.js`; Modify `index.html`, `css/styles.css`

**Interfaces:** Produces `initHero(): void`.

- [ ] **Step 1:** En `#inicio`: texto "Saray" gigante (`clamp(8rem, 28vw, 26rem)`, Poppins 800, color `ink` al 12 % de opacidad), contenedor de foto `#hero-foto` con marcador visible ("Aquí va tu foto") centrado delante del texto, subtítulo "Desarrolladora web", botón rojo "Contactar" (ancla a `#contacto`).
- [ ] **Step 2:** `initHero()`: entrada con `gsap.from` del nombre (sube y aparece), foto (escala) y botón; parallax suave del nombre y la foto con `ScrollTrigger` (scrub). Si `reduceMotion`, no hace nada.
- [ ] **Step 3: Verificar** a 1440 px y a 375 px: nombre no se corta, sin scroll horizontal, marcador visible.

### Task 3: Sobre mí y servicios

**Files:** Create `js/services.js`; Modify `index.html`, `css/styles.css`

**Interfaces:** Produces `initServices(): void`.

- [ ] **Step 1:** `#sobre-mi`: párrafo centrado en español (borrador mío, que Saray revisará) y botón oscuro "Más sobre mí" que baja a `#servicios`.
- [ ] **Step 2:** `#servicios`: título "¿En qué puedo ayudarte?" y cuatro tarjetas `.service-card` oscuras (Webs y landings, Sistemas a medida (CRM), Paneles de inventario, Diseño responsive), con icono SVG simple, rotación base de -6° a 6° y `perspective` en el contenedor.
- [ ] **Step 3:** `initServices()`: las tarjetas entran en abanico desde abajo con rotación 3D (`rotationX`) y `stagger`; al pasar el ratón se enderezan. En móvil se apilan sin rotación.
- [ ] **Step 4: Verificar** en 1440 px y 375 px; tarjetas legibles y sin solaparse en móvil.

### Task 4: Proyectos

**Files:** Create `js/projects.js`; Modify `index.html`, `css/styles.css`

**Interfaces:** Consumes `window.PROJECTS`. Produces `renderProjects(list): void` (crea `.project-card` dentro de `#proyectos .cards`) e `initProjects(): void`.

- [ ] **Step 1:** `#proyectos`: texto gigante "Proyectos" de fondo (gris pálido) y contenedor `.cards`.
- [ ] **Step 2:** `renderProjects`: cada tarjeta lleva marcador de imagen con el nombre del proyecto, tipo, descripción corta, enlace "Ver demo" (solo si `demo` no es null) y "Ver código". Los enlaces abren en pestaña nueva con `rel="noopener"`.
- [ ] **Step 3:** `initProjects()`: tarjetas con posiciones y rotaciones distintas, flotado suave continuo y desplazamiento de profundidad según scroll (`ScrollTrigger` scrub); desenfoque breve mientras se mueven. En móvil, columna sin flotado.
- [ ] **Step 4: Verificar:** seis tarjetas, cafeteri-crm sin enlace de demo, enlaces apuntan a las URLs de `data.js`.

### Task 5: Tecnologías

**Files:** Create `js/tech.js`; Modify `index.html`, `css/styles.css`

**Interfaces:** Produces `initTech(): void`.

- [ ] **Step 1:** `#tecnologias` (fondo `ink`): título "Mi caja de herramientas" en `cream` y ocho `.tech-tile` tipo polaroid (HTML, CSS, JavaScript, PHP, Git/GitHub, Vercel, Tailwind, GSAP), con texto en vez de logos de marca.
- [ ] **Step 2:** `initTech()`: al entrar en pantalla las polaroids caen desde arriba con rotaciones aleatorias fijas y rebote; luego un flotado leve.
- [ ] **Step 3: Verificar:** texto en `cream` sobre `ink` legible, ocho polaroids visibles.

### Task 6: Contacto

**Files:** Create `js/contact.js`; Modify `index.html`

**Interfaces:** Consumes `window.CONTACT`. Produces `initContact(): void`.

- [ ] **Step 1:** `#contacto` (fondo `wine`, texto `cream`): frase "Las grandes ideas empiezan en conversación" (borrador mío), botones Correo (`mailto:`), WhatsApp (`https://wa.me/<número>`) y "Descargar CV" con `aria-disabled="true"`, aspecto atenuado y `pointer-events:none`; pie con ©, "Saray.dev" y enlace a GitHub.
- [ ] **Step 2:** `initContact()`: rellena los `href` desde `CONTACT`; con `cvEnabled:false` el CV queda desactivado; animación de entrada de la frase.
- [ ] **Step 3: Verificar:** los botones muestran los marcadores pendientes sin romperse, el CV no hace nada al pulsar.

### Task 7: Revisión final

**Files:** Modify según lo que salga.

- [ ] **Step 1:** Recorrer la página completa a 1440 px, 768 px y 375 px: sin scroll horizontal, sin errores en consola.
- [ ] **Step 2:** Activar `prefers-reduced-motion` y confirmar que todo el contenido es visible.
- [ ] **Step 3:** Bloquear los CDN (o simular fallo): el contenido sigue legible.
- [ ] **Step 4:** Revisar contraste de `cream` sobre `wine` y `ink`, y `ink` sobre `cream` (mínimo 4,5:1 en texto normal).
- [ ] **Step 5:** Listar a Saray lo pendiente: foto, imágenes de proyectos, correo, WhatsApp, CV, revisión de textos y compilar Tailwind antes de publicar.

---

## Auto-revisión

- Cobertura de la especificación: las seis secciones, paleta, fuentes, stack, seis proyectos, contacto, reduced-motion y marcadores pendientes tienen tarea.
- Review Focus: foto y marcadores (Tareas 2 y 4), cafeteri-crm sin demo (Tarea 4), 375 px (Tareas 2, 3, 7), anclas con Lenis (Tarea 1), CV desactivado (Tarea 6).
- Consistencia de nombres: `initHero`, `initServices`, `renderProjects`, `initProjects`, `initTech`, `initContact`, `window.PROJECTS`, `window.CONTACT`, `window.reduceMotion`.
