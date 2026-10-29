(function () {
  window.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var lenis = null;

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Scroll suave (solo sin reduced motion)
  if (!window.reduceMotion && hasGsap && typeof Lenis !== 'undefined') {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
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
      if (lenis && !window.reduceMotion) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: window.reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Fondo del body según la sección visible (clases bg-* de Tailwind, transición en CSS)
  var BG_CLASSES = ['bg-cream', 'bg-ink', 'bg-wine'];
  function setBackground(name) {
    document.body.classList.remove.apply(document.body.classList, BG_CLASSES);
    document.body.classList.add('bg-' + name);
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

  // Secciones: cada tarea posterior define su función
  // (se llaman al cargar el DOM para que los scripts posteriores ya hayan definido sus funciones)
  document.addEventListener('DOMContentLoaded', function () {
    ['initHero', 'initServices', 'initProjects', 'initTech', 'initContact'].forEach(function (fn) {
      if (typeof window[fn] === 'function') window[fn]();
    });

    // Recalcula posiciones una vez creadas todas las animaciones y otra al cargar las fuentes
    if (hasGsap) {
      ScrollTrigger.refresh();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
      }
    }
  });
})();
