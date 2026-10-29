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

  // Anclas del menú
  document.querySelectorAll('#menu a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
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
  });
})();
