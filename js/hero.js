function initHero() {
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Entrada
  gsap.from('#hero-nombre', { y: 120, opacity: 0, duration: 1.2, ease: 'power3.out' });
  gsap.from('#hero-foto', { scale: 0.85, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
  gsap.from('#hero-boton', { y: 30, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' });

  // Parallax suave con scroll
  var trigger = { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('#hero-nombre', { yPercent: 25, ease: 'none', scrollTrigger: trigger });
  gsap.to('#hero-foto', { yPercent: -15, ease: 'none', scrollTrigger: trigger });
}
