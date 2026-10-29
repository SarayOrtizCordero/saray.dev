function initServices() {
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var cards = gsap.utils.toArray('.service-card');
  if (!cards.length) return;

  var mm = gsap.matchMedia();

  // Escritorio y tablet: abanico con rotación 3D; al pasar el ratón se enderezan
  mm.add('(min-width: 768px)', function () {
    cards.forEach(function (card) {
      card.dataset.baseRot = gsap.getProperty(card, 'rotation');
    });

    gsap.from(cards, {
      y: 140,
      rotationX: -70,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: '#servicios-lista', start: 'top 80%', once: true }
    });

    var cleanups = [];
    if (window.matchMedia('(hover: hover)').matches) {
      cards.forEach(function (card) {
        var base = parseFloat(card.dataset.baseRot) || 0;
        var enter = function () {
          gsap.to(card, { rotation: 0, y: -12, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        };
        var leave = function () {
          gsap.to(card, { rotation: base, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        };
        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
        cleanups.push(function () {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mouseleave', leave);
        });
      });
    }
    return function () { cleanups.forEach(function (fn) { fn(); }); };
  });

  // Móvil: tarjetas apiladas, sin rotación
  mm.add('(max-width: 767px)', function () {
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '#servicios-lista', start: 'top 85%', once: true }
    });
  });
}
