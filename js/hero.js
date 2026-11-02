function initHero() {
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // El nombre entra letra a letra y el lema palabra a palabra (se dividen una sola vez)
  var letras = splitText(document.getElementById('hero-nombre'), 'chars').chars;
  var lema = splitText(document.querySelector('#inicio .hero-lema'), 'words').words;

  var mm = gsap.matchMedia();

  // Escritorio y tablet: entrada con rotación, parallax con scroll y con el ratón
  mm.add('(min-width: 768px)', function () {
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(letras, { yPercent: 110, rotate: 8, duration: 1.2, stagger: 0.07 })
      .from('#hero-foto', { scale: 0.85, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0.35)
      .from(lema, { yPercent: 110, duration: 0.8, stagger: 0.04 }, 0.8)
      .from('#hero-boton', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, 1);

    var trigger = { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('#hero-nombre', { yPercent: 25, ease: 'none', scrollTrigger: trigger });
    gsap.to('#hero-foto', { yPercent: -15, ease: 'none', scrollTrigger: trigger });

    // La foto sigue levemente al ratón (propiedades x/y, no chocan con yPercent del scroll)
    var cleanup = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var foto = document.getElementById('hero-foto');
      var fx = gsap.quickTo(foto, 'x', { duration: 0.9, ease: 'power3.out' });
      var fy = gsap.quickTo(foto, 'y', { duration: 0.9, ease: 'power3.out' });
      var move = function (e) {
        fx((e.clientX / window.innerWidth - 0.5) * 28);
        fy((e.clientY / window.innerHeight - 0.5) * 20);
      };
      window.addEventListener('mousemove', move);
      cleanup = function () {
        window.removeEventListener('mousemove', move);
        gsap.set(foto, { clearProps: 'x,y' });
      };
    }
    return cleanup;
  });

  // Móvil: misma historia, más corta y sin parallax
  mm.add('(max-width: 767px)', function () {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(letras, { yPercent: 110, duration: 0.8, stagger: 0.05 })
      .from('#hero-foto', { scale: 0.94, opacity: 0, duration: 0.7 }, 0.2)
      .from(lema, { yPercent: 110, duration: 0.6, stagger: 0.03 }, 0.5)
      .from('#hero-boton', { y: 20, opacity: 0, duration: 0.6 }, 0.7);
  });
}
