function initContact() {
  var data = window.CONTACT || {};

  // Los enlaces se rellenan siempre, con o sin animación
  var correo = document.getElementById('contacto-correo');
  var whatsapp = document.getElementById('contacto-whatsapp');
  var cv = document.getElementById('contacto-cv');
  var anio = document.getElementById('contacto-anio');

  if (correo && data.email) correo.setAttribute('href', 'mailto:' + data.email);
  if (whatsapp && data.whatsapp) {
    // wa.me solo admite dígitos; el marcador pendiente se deja tal cual
    var numero = data.whatsapp === 'WHATSAPP_PENDIENTE' ? data.whatsapp : String(data.whatsapp).replace(/\D/g, '');
    if (numero) whatsapp.setAttribute('href', 'https://wa.me/' + numero);
  }
  if (anio) anio.textContent = new Date().getFullYear();

  if (cv) {
    if (data.cvEnabled) {
      cv.setAttribute('href', 'assets/cv.pdf');
      cv.removeAttribute('aria-disabled');
      cv.removeAttribute('tabindex');
      cv.removeAttribute('role');
      cv.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      cv.removeAttribute('href');
      cv.setAttribute('aria-disabled', 'true');
    }
  }

  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var frase = document.getElementById('contacto-frase');
  var botones = gsap.utils.toArray('.contacto-boton');
  if (!frase) return;

  gsap.from(frase, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#contacto', start: 'top 60%', once: true }
  });
  // El CV desactivado conserva su opacidad atenuada: solo se anima la posición
  gsap.from(botones, {
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.3,
    scrollTrigger: { trigger: '#contacto', start: 'top 60%', once: true }
  });
}
