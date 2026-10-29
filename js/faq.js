function initFaq() {
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var boton = item.querySelector('.faq-btn');
    var panel = item.querySelector('.faq-resp');
    if (!boton || !panel) return;

    boton.addEventListener('click', function () {
      var abierto = item.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
    });

    // Al cambiar la altura de la página, ScrollTrigger recalcula las posiciones de lo que hay debajo
    panel.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'grid-template-rows' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });
}
