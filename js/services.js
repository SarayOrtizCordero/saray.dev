function initServices() {
  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var rows = gsap.utils.toArray('.servicio');
  if (!rows.length) return;

  // Cada fila: se dibuja la línea, el título sube desde su máscara y el texto aparece (una vez)
  var datos = rows.map(function (row) {
    return {
      row: row,
      linea: row.querySelector('.servicio-linea'),
      palabras: splitText(row.querySelector('.servicio-titulo'), 'words').words,
      texto: row.querySelector('.servicio-texto'),
      icono: row.querySelector('.servicio-icono')
    };
  });

  var mm = gsap.matchMedia();

  function entrada(vel, desplazamiento) {
    datos.forEach(function (d) {
      var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: d.row, start: 'top 88%', once: true }
      });
      tl.from(d.linea, { scaleX: 0, duration: 1.1 * vel, ease: 'power3.inOut' }, 0)
        .from(d.palabras, { yPercent: 115, duration: 0.9 * vel, stagger: 0.07 }, 0.1)
        .from(d.texto, { y: desplazamiento, opacity: 0, duration: 0.8 * vel }, 0.3);
      if (d.icono) tl.from(d.icono, { scale: 0, rotate: -90, duration: 0.8 * vel, ease: 'back.out(1.8)' }, 0.4);
    });
  }

  mm.add('(min-width: 768px)', function () {
    entrada(1, 20);

    // El icono gira al pasar el ratón por la fila (con GSAP: absorbe la propiedad CSS `rotate`)
    var limpiar = [];
    if (window.matchMedia('(hover: hover)').matches) {
      datos.forEach(function (d) {
        if (!d.icono) return;
        var entra = function () { gsap.to(d.icono, { rotation: 12, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); };
        var sale = function () { gsap.to(d.icono, { rotation: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); };
        d.row.addEventListener('mouseenter', entra);
        d.row.addEventListener('mouseleave', sale);
        limpiar.push(function () {
          d.row.removeEventListener('mouseenter', entra);
          d.row.removeEventListener('mouseleave', sale);
        });
      });
    }
    return function () { limpiar.forEach(function (fn) { fn(); }); };
  });
  mm.add('(max-width: 767px)', function () { entrada(0.7, 12); });
}
