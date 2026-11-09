/* Divide un texto en palabras (o letras) con máscara. Conserva el texto accesible con aria-label. */
function splitText(el, mode) {
  if (!el) return null;
  if (el._split) return el._split;

  var text = el.textContent.replace(/\s+/g, ' ').trim();
  el.textContent = '';

  // Copia legible solo para lectores de pantalla (aria-label no sirve en párrafos);
  // las palabras visibles se ocultan a la tecnología de asistencia para no leerlas dos veces
  var lectura = document.createElement('span');
  lectura.className = 'sr-only';
  lectura.textContent = text;
  el.appendChild(lectura);

  var words = [];
  var chars = [];
  text.split(' ').forEach(function (w, i) {
    if (i > 0) el.appendChild(document.createTextNode(' '));
    var mask = document.createElement('span');
    mask.className = 'sp-word';
    mask.setAttribute('aria-hidden', 'true');

    if (mode === 'chars') {
      w.split('').forEach(function (c) {
        var ch = document.createElement('span');
        ch.className = 'sp-char';
        ch.textContent = c;
        mask.appendChild(ch);
        chars.push(ch);
      });
    } else {
      var inner = document.createElement('span');
      inner.className = 'sp-inner';
      inner.textContent = w;
      mask.appendChild(inner);
    }
    el.appendChild(mask);
    words.push(mode === 'chars' ? mask : mask.firstChild);
  });

  el._split = { words: words, chars: chars };
  return el._split;
}

function initMotion() {
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // --- Preparación común (una sola vez, fuera de matchMedia) ---
  var titulos = gsap.utils.toArray('main h2').map(function (h) { return { el: h, s: splitText(h, 'words') }; });
  var parrafo = document.getElementById('sobre-mi-texto');
  var parrafoSplit = parrafo ? splitText(parrafo, 'words') : null;

  var mm = gsap.matchMedia();

  // =====================================================================
  // ESCRITORIO Y TABLET (>= 768px): scroll con scrub, parallax, ratón
  // =====================================================================
  mm.add('(min-width: 768px)', function () {
    var cleanups = [];

    // Títulos: palabras que suben desde la máscara
    titulos.forEach(function (t) {
      gsap.from(t.s.words, {
        yPercent: 115,
        rotate: 4,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: t.el, start: 'top 85%', once: true }
      });
    });

    // "Sobre mí": las palabras se iluminan una a una mientras haces scroll
    if (parrafoSplit) {
      gsap.fromTo(parrafoSplit.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: parrafo, start: 'top 80%', end: 'bottom 45%', scrub: true }
        });
    }

    // Menú: se esconde al bajar y vuelve al subir
    var menu = document.getElementById('menu');
    var stMenu = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) {
        if (!menu) return;
        // No se oculta con el panel abierto ni mientras el teclado tiene el foco dentro
        var enMenu = menu.contains(document.activeElement);
        menu.classList.toggle('menu-oculto', self.direction === 1 && self.scroll() > 240 && !enMenu && !menu.classList.contains('abierto'));
      }
    });
    // Al tabular hacia el menú, reaparece
    var mostrar = function () { menu.classList.remove('menu-oculto'); };
    if (menu) menu.addEventListener('focusin', mostrar);
    cleanups.push(function () {
      stMenu.kill();
      if (menu) {
        menu.removeEventListener('focusin', mostrar);
        menu.classList.remove('menu-oculto');
      }
    });

    // Botones magnéticos (solo con ratón)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var botones = gsap.utils.toArray('#hero-boton, #sobre-mi-boton, .contacto-boton');
      botones.forEach(function (b) {
        var mx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' });
        var my = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
        var move = function (e) {
          var r = b.getBoundingClientRect();
          mx((e.clientX - (r.left + r.width / 2)) * 0.25);
          my((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        var leave = function () { mx(0); my(0); };
        b.addEventListener('mousemove', move);
        b.addEventListener('mouseleave', leave);
        cleanups.push(function () {
          b.removeEventListener('mousemove', move);
          b.removeEventListener('mouseleave', leave);
          gsap.set(b, { clearProps: 'x,y' });
        });
      });
    }

    return function () { cleanups.forEach(function (fn) { fn(); }); };
  });

  // =====================================================================
  // MÓVIL (< 768px): pocas animaciones, cortas, sin scrub ni parallax
  // =====================================================================
  mm.add('(max-width: 767px)', function () {
    // Títulos: entrada breve
    titulos.forEach(function (t) {
      gsap.from(t.s.words, {
        yPercent: 100,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: { trigger: t.el, start: 'top 92%', once: true }
      });
    });

    // Párrafo y botón: aparecen una sola vez, sin depender del dedo
    if (parrafo) {
      gsap.from(parrafo, {
        y: 24, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: parrafo, start: 'top 90%', once: true }
      });
    }
    gsap.from('#sobre-mi-boton', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: '#sobre-mi-boton', start: 'top 95%', once: true }
    });
  });
}
