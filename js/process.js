function initProceso() {
  var pasos = Array.prototype.slice.call(document.querySelectorAll('#proceso .paso'));
  if (!pasos.length) return;

  // Sin animación (movimiento reducido o sin GSAP): todos los pasos se ven activos y la línea completa
  if (window.reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    pasos.forEach(function (p) { p.classList.add('activo'); });
    return;
  }

  // La línea se dibuja a la vez que se baja por la lista (ambos tamaños: es un solo transform)
  gsap.fromTo('.proceso-linea', { scaleY: 0 }, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.proceso-lista', start: 'top 55%', end: 'bottom 55%', scrub: true }
  });

  // Cada paso se activa al llegar la línea (y se desactiva al volver atrás)
  pasos.forEach(function (paso) {
    ScrollTrigger.create({
      trigger: paso,
      start: 'top 55%',
      // onLeave/onEnterBack: si se carga o se salta más abajo, los pasos ya recorridos quedan activos
      onEnter: function () { paso.classList.add('activo'); },
      onLeave: function () { paso.classList.add('activo'); },
      onEnterBack: function () { paso.classList.add('activo'); },
      onLeaveBack: function () { paso.classList.remove('activo'); }
    });
  });

  var mm = gsap.matchMedia();

  // Escritorio y tablet: el cuerpo entra desde su lado
  mm.add('(min-width: 768px)', function () {
    pasos.forEach(function (paso, i) {
      var cuerpo = paso.querySelector('.paso-cuerpo');
      gsap.from(cuerpo, {
        x: i % 2 === 0 ? -60 : 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: paso, start: 'top 80%', once: true }
      });
    });
  });

  // Móvil: aparición corta hacia arriba
  mm.add('(max-width: 767px)', function () {
    pasos.forEach(function (paso) {
      gsap.from(paso.querySelector('.paso-cuerpo'), {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: paso, start: 'top 88%', once: true }
      });
    });
  });
}
