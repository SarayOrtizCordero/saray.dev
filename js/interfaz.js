/* Interfaz: tema oscuro, sección activa en el menú, volver arriba y transición entre secciones.
   Se carga al final; main.js llama a window.irA para los enlaces internos. */
(function () {
  var raiz = document.documentElement;
  var hayGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  // ---------------------------------------------------------------- Tema
  var botonesTema = document.querySelectorAll('[data-tema-boton]');

  function pintarTema() {
    var oscuro = raiz.dataset.tema === 'oscuro';
    botonesTema.forEach(function (b) {
      b.setAttribute('aria-pressed', String(oscuro));
      b.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', oscuro ? '#1E1E22' : '#26262A');
  }

  botonesTema.forEach(function (b) {
    b.addEventListener('click', function () {
      raiz.dataset.tema = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
      try { localStorage.setItem('tema', raiz.dataset.tema); } catch (e) {}
      pintarTema();
    });
  });
  pintarTema();

  // ------------------------------------------------- Sección activa en el menú
  function marcarActiva(id, activa) {
    document.querySelectorAll('#menu a[href="#' + id + '"], #menu-panel a[href="#' + id + '"]').forEach(function (a) {
      if (activa) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (hayGsap) {
    ['sobre-mi', 'servicios', 'proceso', 'proyectos', 'preguntas', 'contacto'].forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: function (self) { marcarActiva(id, self.isActive); }
      });
    });
  }

  // ---------------------------------------------------------- Volver arriba
  var subir = document.getElementById('subir');
  if (subir) {
    subir.addEventListener('click', function () {
      if (window.lenis) window.lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: window.reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // -------------------------------------------- Transición entre secciones
  var cortina = document.getElementById('cortina');
  var cortinaTexto = document.getElementById('cortina-texto');
  var ocupada = false;

  function saltoSuave(destino) {
    if (window.lenis && !window.reduceMotion) window.lenis.scrollTo(destino);
    else destino.scrollIntoView({ behavior: window.reduceMotion ? 'auto' : 'smooth' });
  }

  // Si el destino queda lejos, una cortina de color tapa la pantalla, se salta y se abre.
  // Si queda cerca, un desplazamiento suave basta.
  window.irA = function (destino, enlace) {
    var lejos = Math.abs(destino.getBoundingClientRect().top) > window.innerHeight * 1.2;
    if (window.reduceMotion || !hayGsap || !cortina || !lejos) { saltoSuave(destino); return; }
    if (ocupada) return;
    ocupada = true;

    var h = destino.querySelector('h2');
    var nombre = (enlace && enlace.closest('#menu, .pie') ? enlace.textContent : (h ? h.getAttribute('aria-label') || h.textContent : '')).trim();
    cortinaTexto.textContent = nombre;
    if (window.lenis) window.lenis.stop();

    var tl = gsap.timeline({
      onComplete: function () {
        gsap.set(cortina, { visibility: 'hidden' });
        if (window.lenis) window.lenis.start();
        ocupada = false;
      }
    });
    tl.set(cortina, { visibility: 'visible', transformOrigin: 'bottom', scaleY: 0 })
      .to(cortina, { scaleY: 1, duration: 0.5, ease: 'power3.inOut' })
      .to(cortinaTexto, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15')
      .add(function () {
        if (window.lenis) window.lenis.scrollTo(destino, { immediate: true, force: true });
        else destino.scrollIntoView({ behavior: 'auto' });
        ScrollTrigger.update();
      })
      .to(cortinaTexto, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '+=0.2')
      .set(cortina, { transformOrigin: 'top' })
      .to(cortina, { scaleY: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.1');
    gsap.set(cortinaTexto, { y: 20 });
  };
})();
