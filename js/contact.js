function initContact() {
  var data = window.CONTACT || {};

  // Los enlaces se rellenan siempre, con o sin animación
  var correo = document.getElementById('contacto-correo');
  var whatsapp = document.getElementById('contacto-whatsapp');
  var cv = document.getElementById('contacto-cv');
  var anio = document.getElementById('contacto-anio');

  // Los botones sin dato real siguen ocultos (clase hidden en el HTML) hasta que haya valor
  if (correo && data.email && data.email !== 'CORREO_PENDIENTE') {
    correo.setAttribute('href', 'mailto:' + data.email);
    correo.classList.remove('hidden');
  }
  if (whatsapp && data.whatsapp && data.whatsapp !== 'WHATSAPP_PENDIENTE') {
    // wa.me solo admite dígitos
    var numero = String(data.whatsapp).replace(/\D/g, '');
    if (numero) {
      whatsapp.setAttribute('href', 'https://wa.me/' + numero);
      whatsapp.classList.remove('hidden');
    }
  }
  if (anio) anio.textContent = new Date().getFullYear();

  if (cv && data.cvEnabled) {
    cv.setAttribute('href', 'assets/cv.pdf');
    cv.classList.remove('hidden');
  }

  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var frase = document.getElementById('contacto-frase');
  var botones = gsap.utils.toArray('.contacto-boton:not(.hidden)');
  if (!frase) return;

  gsap.from(frase, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#contacto', start: 'top 60%', once: true }
  });
  gsap.from(botones, {
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.3,
    scrollTrigger: { trigger: '#contacto', start: 'top 60%', once: true }
  });
}
