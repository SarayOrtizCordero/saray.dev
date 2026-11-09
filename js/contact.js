function initContact() {
  // Los enlaces de correo, WhatsApp y CV están escritos en index.html (única fuente de los datos de contacto)
  var anio = document.getElementById('contacto-anio');
  if (anio) anio.textContent = new Date().getFullYear();

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
  gsap.from(botones, {
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.3,
    scrollTrigger: { trigger: '#contacto', start: 'top 60%', once: true }
  });
}
