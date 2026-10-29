function initTech() {
  // La marquesina se mueve por CSS (y se detiene con movimiento reducido).
  // Aquí solo se añade la inclinación según la velocidad del scroll, en escritorio con ratón.
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (hover: hover) and (pointer: fine)', function () {
    var filas = gsap.utils.toArray('#tecnologias .marquee');
    var inclinar = filas.map(function (f) {
      return gsap.quickTo(f, 'skewX', { duration: 0.5, ease: 'power3.out' });
    });
    var reposo;

    var st = ScrollTrigger.create({
      trigger: '#tecnologias',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: function (self) {
        var v = gsap.utils.clamp(-9, 9, self.getVelocity() / -250);
        inclinar.forEach(function (fn) { fn(v); });
        clearTimeout(reposo);
        reposo = setTimeout(function () { inclinar.forEach(function (fn) { fn(0); }); }, 120);
      }
    });

    return function () {
      clearTimeout(reposo);
      st.kill();
      gsap.set(filas, { clearProps: 'skewX' });
    };
  });
}
