/* Preguntas frecuentes: la lista de preguntas no se mueve; la respuesta cambia en el panel de al lado. */
function initFaq() {
  var botones = Array.prototype.slice.call(document.querySelectorAll('.faq-btn'));
  var panel = document.getElementById('faq-panel');
  var q = document.getElementById('faq-panel-q');
  var r = document.getElementById('faq-panel-r');
  if (!botones.length || !panel || !q || !r) return;

  function elegir(boton) {
    botones.forEach(function (b) {
      var activo = b === boton;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
    q.textContent = boton.querySelector('span').textContent;
    r.textContent = boton.dataset.resp;
    panel.setAttribute('aria-labelledby', boton.id);

    // Reinicia la animación de entrada del texto (sin mover nada más de la página)
    panel.classList.remove('cambia');
    void panel.offsetWidth;
    if (!window.reduceMotion) panel.classList.add('cambia');
  }

  botones.forEach(function (b, i) {
    b.addEventListener('click', function () { elegir(b); });
    b.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowDown') destino = botones[(i + 1) % botones.length];
      else if (e.key === 'ArrowUp') destino = botones[(i - 1 + botones.length) % botones.length];
      else if (e.key === 'Home') destino = botones[0];
      else if (e.key === 'End') destino = botones[botones.length - 1];
      if (!destino) return;
      e.preventDefault();
      destino.focus();
      elegir(destino);
    });
  });
}
