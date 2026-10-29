function initTech() {
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var tiles = gsap.utils.toArray('.tech-tile');
  if (!tiles.length) return;

  // Caída desde arriba con rebote; la rotación fija de cada polaroid viene del CSS
  gsap.from(tiles, {
    y: -500,
    opacity: 0,
    duration: 1.4,
    ease: 'bounce.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '#tecnologias-lista', start: 'top 80%', once: true },
    onComplete: function () {
      // Flotado leve en el contenedor interior para no tocar la rotación
      tiles.forEach(function (tile, i) {
        var inner = tile.querySelector('.tech-tile-inner');
        if (!inner) return;
        gsap.to(inner, {
          y: -8,
          duration: 1.8 + (i % 3) * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.15
        });
      });
    }
  });
}
