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

  list.forEach(function (p, index) {
    var card = document.createElement('article');
    card.className = 'project-card ticket';
    card.dataset.id = p.id;
    card.style.setProperty('--i', index);

    if (p.image) {
      var img = document.createElement('img');
      img.src = p.image;
      img.alt = 'Captura de ' + p.name;
      img.loading = 'lazy';
      img.className = 'project-image ticket-img';
      card.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'project-image ticket-img';
      ph.textContent = p.name;
      ph.setAttribute('aria-hidden', 'true');
      card.appendChild(ph);
    }

    // Sello con el tipo de negocio, pegado sobre la esquina de la imagen
    var sello = document.createElement('span');
    sello.className = 'ticket-sello';
    sello.textContent = p.type;
    card.appendChild(sello);

    var corte = document.createElement('div');
    corte.className = 'ticket-corte';
    corte.setAttribute('aria-hidden', 'true');
    card.appendChild(corte);

    var title = document.createElement('h3');
    title.className = 'ticket-nombre';
    title.textContent = p.name;
    card.appendChild(title);

    var desc = document.createElement('p');
    desc.className = 'ticket-desc';
    desc.textContent = p.description;
    card.appendChild(desc);

    var links = document.createElement('div');
    links.className = 'mt-auto flex flex-wrap gap-3 pt-5';
    if (p.demo) {
      links.appendChild(link(p.demo, 'Ver demo', 'ticket-btn ticket-btn-lleno', 'Ver demo de ' + p.name + ' (se abre en una pestaña nueva)'));
    }
    links.appendChild(link(p.code, 'Ver código', 'ticket-btn', 'Ver código de ' + p.name + ' en GitHub (se abre en una pestaña nueva)'));
    card.appendChild(links);

    container.appendChild(card);
  });
}

// Revela cada elemento una sola vez al entrar en pantalla. También lo revela si la página se
// carga ya más abajo (recarga con el scroll restaurado) o si se salta de golpe con una ancla:
// en esos casos el elemento "ya pasó" y un ScrollTrigger normal lo dejaría oculto.
function revealOnce(items, start, run) {
  items.forEach(function (el, i) {
    var hecho = false;
    function ir() {
      if (hecho) return;
      hecho = true;
      run(el, i);
    }
    ScrollTrigger.create({ trigger: el, start: start, onEnter: ir, onLeave: ir });
  });
}

function initProjects() {
  renderProjects(window.PROJECTS || []);

  // Solo los 3 primeros a la vista; el resto se despliega con el botón
  var FEATURED = 3;
  var extra = Array.prototype.slice.call(document.querySelectorAll('#proyectos .project-card')).slice(FEATURED);
  var more = document.getElementById('proyectos-mas');
  if (more && extra.length) {
    extra.forEach(function (c) { c.classList.add('hidden'); });
    more.classList.remove('hidden');
    more.addEventListener('click', function () {
      var open = more.getAttribute('aria-expanded') === 'true';
      extra.forEach(function (c) { c.classList.toggle('hidden', open); });
      more.setAttribute('aria-expanded', String(!open));
      more.textContent = open ? 'Ver más proyectos' : 'Ver menos';
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      // Las tarjetas nuevas entran con un fundido (solo opacity/scale: no chocan con el flotado en y)
      if (!open && !window.reduceMotion && typeof gsap !== 'undefined') {
        gsap.fromTo(extra, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 });
      }
    });
  }

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

    // Entrada escalonada de las tarjetas visibles al llegar a la sección
    var visibles = cards.filter(function (c) { return !c.classList.contains('hidden'); });
    gsap.set(visibles, { opacity: 0, scale: 0.9 });
    var columnas = getComputedStyle(cards[0].parentNode).gridTemplateColumns.split(' ').length || 1;
    revealOnce(visibles, 'top 88%', function (card, i) {
      gsap.to(card, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: (i % columnas) * 0.12 });
    });

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
    // Con ratón, cada ticket se endereza al pasar por encima. Se hace con GSAP porque
    // GSAP absorbe la propiedad CSS `rotate` en su transform y un :hover en CSS dejaría de funcionar.
    var hoverCleanups = [];
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cards.forEach(function (card) {
        var base = gsap.getProperty(card, 'rotation');
        var enter = function () { gsap.to(card, { rotation: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); };
        var leave = function () { gsap.to(card, { rotation: base, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); };
        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
        hoverCleanups.push(function () {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mouseleave', leave);
        });
      });
    }

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
      hoverCleanups.forEach(function (fn) { fn(); });
      if (st) st.kill();
      gsap.set(cards, { clearProps: 'filter,yPercent,y' });
    };
  });

  // Móvil: columna simple; cada tarjeta sube y aparece al llegar, sin flotado ni profundidad
  mm.add('(max-width: 767px)', function () {
    var visibles = cards.filter(function (c) { return !c.classList.contains('hidden'); });
    gsap.set(visibles, { opacity: 0, y: 40 });
    revealOnce(visibles, 'top 92%', function (card) {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    });
  });
}
