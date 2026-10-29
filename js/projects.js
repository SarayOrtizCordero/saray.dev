function renderProjects(list) {
  var container = document.querySelector('#proyectos .cards');
  if (!container || !Array.isArray(list)) return;
  container.textContent = '';

  function link(href, label, classes, aria) {
    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = classes;
    a.textContent = label;
    a.setAttribute('aria-label', aria);
    return a;
  }

  list.forEach(function (p) {
    var card = document.createElement('article');
    card.className = 'project-card flex flex-col gap-4 rounded-3xl bg-ink text-cream p-5 shadow-xl';
    card.dataset.id = p.id;

    var ph = document.createElement('div');
    ph.className = 'project-image flex aspect-video w-full items-center justify-center rounded-2xl border-2 border-dashed border-cream/40 bg-cream/10 px-4 text-center font-display text-xl font-semibold text-cream';
    ph.textContent = p.name;
    ph.setAttribute('aria-hidden', 'true');
    card.appendChild(ph);

    var type = document.createElement('p');
    type.className = 'text-sm font-medium uppercase tracking-wide text-cream/70';
    type.textContent = p.type;
    card.appendChild(type);

    var title = document.createElement('h3');
    title.className = 'font-display text-2xl font-semibold';
    title.textContent = p.name;
    card.appendChild(title);

    var desc = document.createElement('p');
    desc.className = 'text-cream/80 leading-relaxed';
    desc.textContent = p.description;
    card.appendChild(desc);

    var links = document.createElement('div');
    links.className = 'mt-auto flex flex-wrap gap-3 pt-2';
    if (p.demo) {
      links.appendChild(link(p.demo, 'Ver demo', 'rounded-full bg-wine px-5 py-2 text-sm font-medium text-cream hover:brightness-110', 'Ver demo de ' + p.name + ' (se abre en una pestaña nueva)'));
    }
    links.appendChild(link(p.code, 'Ver código', 'rounded-full border border-cream/50 px-5 py-2 text-sm font-medium text-cream hover:bg-cream hover:text-ink', 'Ver código de ' + p.name + ' en GitHub (se abre en una pestaña nueva)'));
    card.appendChild(links);

    container.appendChild(card);
  });
}

function initProjects() {
  renderProjects(window.PROJECTS || []);

  if (window.reduceMotion) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var cards = gsap.utils.toArray('#proyectos .project-card');
  if (!cards.length) return;

  var mm = gsap.matchMedia();

  // Escritorio y tablet: flotado suave y profundidad con el scroll; desenfoque breve solo en escritorio con ratón.
  // matchMedia vuelve a ejecutar la función cuando cambia cualquier condición (p. ej. al cruzar 1024 px):
  // las columnas se recalculan y los tweens/ScrollTriggers anteriores se revierten.
  mm.add({ tablet: '(min-width: 768px)', blur: '(min-width: 1024px) and (hover: hover)' }, function (context) {
    // Misma amplitud para todas las tarjetas de una columna: así nunca se solapan entre sí
    var cols = getComputedStyle(cards[0].parentNode).gridTemplateColumns.split(' ').length || 1;
    var depths = [8, -6, 4];

    cards.forEach(function (card, i) {
      // flotado continuo (y) distinto por tarjeta
      gsap.to(card, {
        y: ((i % cols) % 2 ? -1 : 1) * 8,
        duration: 2.4 + (i % 3) * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.3
      });

      // profundidad según scroll (yPercent, no choca con el flotado)
      gsap.fromTo(card,
        { yPercent: depths[(i % cols) % depths.length] },
        {
          yPercent: -depths[(i % cols) % depths.length],
          ease: 'none',
          scrollTrigger: { trigger: '#proyectos', start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // desenfoque breve mientras hay movimiento (solo escritorio con ratón)
    var blurTimer;
    var st = null;
    if (context.conditions.blur) {
      st = ScrollTrigger.create({
        trigger: '#proyectos',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: function (self) {
          var b = Math.min(Math.abs(self.getVelocity()) / 1500, 2.5);
          gsap.set(cards, { filter: 'blur(' + b.toFixed(2) + 'px)' });
          clearTimeout(blurTimer);
          blurTimer = setTimeout(function () {
            gsap.to(cards, { filter: 'blur(0px)', duration: 0.4, overwrite: 'auto' });
          }, 120);
        },
        onLeave: function () { gsap.set(cards, { filter: 'none' }); },
        onLeaveBack: function () { gsap.set(cards, { filter: 'none' }); }
      });
    }

    return function () {
      clearTimeout(blurTimer);
      if (st) st.kill();
      gsap.set(cards, { clearProps: 'filter,yPercent,y' });
    };
  });

  // Móvil: columna simple, sin flotado ni profundidad
}
