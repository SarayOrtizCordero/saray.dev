/* Preguntas frecuentes: la respuesta se despliega debajo de su pregunta; solo hay una abierta a la vez. */
function initFaq() {
  var botones = Array.prototype.slice.call(document.querySelectorAll('.faq-btn'));
  if (!botones.length) return;

  function abrir(boton, visible) {
    boton.setAttribute('aria-expanded', String(visible));
    boton.closest('.faq-item').classList.toggle('abierto', visible);
    var resp = document.getElementById(boton.getAttribute('aria-controls'));
    // Una respuesta cerrada no debe poder leerse ni enfocarse; se oculta al terminar la animación
    if (resp) resp.inert = !visible;
  }

  function alternar(boton) {
    var abierto = boton.getAttribute('aria-expanded') === 'true';
    botones.forEach(function (b) { abrir(b, b === boton && !abierto); });
    if (typeof ScrollTrigger !== 'undefined') setTimeout(function () { ScrollTrigger.refresh(); }, 450);
  }

  botones.forEach(function (b, i) {
    abrir(b, b.getAttribute('aria-expanded') === 'true');
    b.addEventListener('click', function () { alternar(b); });
    b.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowDown') destino = botones[(i + 1) % botones.length];
      else if (e.key === 'ArrowUp') destino = botones[(i - 1 + botones.length) % botones.length];
      else if (e.key === 'Home') destino = botones[0];
      else if (e.key === 'End') destino = botones[botones.length - 1];
      if (!destino) return;
      e.preventDefault();
      destino.focus();
    });
  });
}
