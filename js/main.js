(function () {
  // Siempre se empieza arriba al recargar (salvo que la URL lleve un ancla): así las entradas animadas
  // se ven en orden y ningún bloque queda oculto por haber cargado con el scroll ya restaurado.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  window.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var lenis = null;

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    // En móvil la barra del navegador cambia la altura al hacer scroll: no recalcular por eso
    ScrollTrigger.config({ ignoreMobileResize: true });
    // Si un disparador ya quedó atrás (recarga con el scroll restaurado, ancla, tecla Fin o salto rápido),
    // la animación se completa en vez de quedarse oculta en su estado inicial.
    ScrollTrigger.defaults({ toggleActions: 'play complete none none' });
  }

  // Scroll suave: solo con ratón y sin reduced motion. En táctil se deja el scroll nativo (inercia del sistema).
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!window.reduceMotion && finePointer && hasGsap && typeof Lenis !== 'undefined') {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis; // lo usan js/interfaz.js (transición, volver arriba) y js/projects.js (ventana de caso)
  }

  // Todas las anclas internas (menú, botones del hero y de "Sobre mí") pasan por Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    link.addEventListener('click', function (e) {
      var target;
      try { target = document.querySelector(href); } catch (err) { target = null; }
      if (!target) return;
      e.preventDefault();
      // js/interfaz.js decide entre desplazamiento suave y la cortina de transición
      if (typeof window.irA === 'function') {
        window.irA(target, link);
      } else if (lenis && !window.reduceMotion) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: window.reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Menú desplegable (móvil y tablet): se cierra con Escape, al tocar fuera o al elegir una sección
  var menuNav = document.getElementById('menu');
  var menuBoton = document.getElementById('menu-boton');
  var menuPanel = document.getElementById('menu-panel');
  function setMenu(abierto) {
    if (!menuBoton || !menuPanel) return;
    menuPanel.hidden = !abierto;
    menuBoton.setAttribute('aria-expanded', String(abierto));
    menuBoton.textContent = abierto ? 'Cerrar' : 'Menú';
    menuNav.classList.toggle('abierto', abierto);
  }
  if (menuBoton && menuPanel) {
    menuBoton.addEventListener('click', function () { setMenu(menuPanel.hidden); });
    menuPanel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menuPanel.hidden) { setMenu(false); menuBoton.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!menuPanel.hidden && !menuNav.contains(e.target)) setMenu(false);
    });
  }

  // Fondo del body según la sección visible (clases bg-* de Tailwind, transición en CSS)
  var BG_CLASSES = ['fondo-cream', 'fondo-ink', 'fondo-wine'];
  function setBackground(name) {
    document.body.classList.remove.apply(document.body.classList, BG_CLASSES);
    document.body.classList.add('fondo-' + name);
  }

  if (hasGsap) {
    document.querySelectorAll('section[data-bg]').forEach(function (section) {
      var name = section.dataset.bg;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: function () { setBackground(name); },
        onEnterBack: function () { setBackground(name); }
      });
    });
  }

  // Muestra la página cuando Tailwind y las fuentes están listos (máximo 2,5 s por si algo falla)
  var raiz = document.documentElement;
  function mostrar() { raiz.classList.remove('cargando'); }
  var esperas = [new Promise(function (ok) {
    if (document.readyState === 'complete') ok(); else window.addEventListener('load', ok);
  })];
  if (document.fonts && document.fonts.ready) esperas.push(document.fonts.ready);
  Promise.all(esperas).then(function () { requestAnimationFrame(function () { requestAnimationFrame(mostrar); }); });
  setTimeout(mostrar, 2500);

  // Secciones: cada tarea posterior define su función
  // (se llaman al cargar el DOM para que los scripts posteriores ya hayan definido sus funciones)
  document.addEventListener('DOMContentLoaded', function () {
    ['initFaq', 'initHero', 'initMotion', 'initServices', 'initProceso', 'initProjects', 'initTech', 'initContact'].forEach(function (fn) {
      if (typeof window[fn] === 'function') window[fn]();
    });

    // Red de seguridad: si la página se abre ya más abajo (ancla en la URL), los disparadores que
    // quedaron atrás no llegan a ejecutarse; se completan para que no queden bloques ocultos.
    function completarPasados() {
      ScrollTrigger.getAll().forEach(function (st) {
        if (st.progress < 1 || st.vars.scrub) return;
        if (st.animation) {
          if (st.animation.progress() === 0) st.animation.progress(1);
        } else if (typeof st.vars.onLeave === 'function' && !st._hecho) {
          st._hecho = true;
          st.vars.onLeave(st);
        }
      });
    }

    // Recalcula posiciones una vez creadas todas las animaciones y otra al cargar las fuentes
    if (hasGsap) {
      ScrollTrigger.refresh();
      completarPasados();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); completarPasados(); });
      }
    }
  });
})();
