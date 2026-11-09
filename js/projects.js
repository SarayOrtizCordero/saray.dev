/* Proyectos: tickets, pestañas de filtro, ventana de caso y animaciones. */

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

// Texto del botón que abre el proyecto (el mismo para todos los tipos)
function textoVer() {
  return 'Visitar';
}

function renderProjects(list) {
  var container = document.querySelector('#proyectos .cards');
  if (!container || !Array.isArray(list)) return;
  container.textContent = '';

  list.forEach(function (p, index) {
    var card = document.createElement('article');
    card.className = 'project-card ticket';
    card.dataset.id = p.id;
    card.dataset.cat = p.cat || 'web';
    card.style.setProperty('--i', index);

    // Marco de la imagen: la captura (o un recuadro con el nombre si aún no hay) + chip "Ver detalles"
    var marco = document.createElement('div');
    marco.className = 'ticket-marco';
    if (p.image) {
      var img = document.createElement('img');
      img.src = p.image;
      img.alt = 'Captura de la portada de ' + p.name;
      img.width = 1000;
      img.height = 498;
      img.loading = 'lazy';
      img.decoding = 'async';
      marco.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'ticket-img';
      ph.textContent = p.name;
      ph.setAttribute('aria-hidden', 'true');
      marco.appendChild(ph);
    }
    var ver = document.createElement('span');
    ver.className = 'ticket-ver';
    ver.setAttribute('aria-hidden', 'true');
    ver.textContent = 'Ver detalles';
    marco.appendChild(ver);
    card.appendChild(marco);

    var corte = document.createElement('div');
    corte.className = 'ticket-corte';
    corte.setAttribute('aria-hidden', 'true');
    card.appendChild(corte);

    // Etiqueta con el tipo de negocio, bajo la línea de corte
    var sello = document.createElement('span');
    sello.className = 'ticket-sello';
    sello.textContent = p.type;
    card.appendChild(sello);

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

    var caso = document.createElement('button');
    caso.type = 'button';
    caso.className = 'ticket-btn ticket-btn-lleno';
    caso.dataset.caso = p.id;
    caso.textContent = 'Ver detalles';
    caso.setAttribute('aria-label', 'Ver detalles de ' + p.name);
    links.appendChild(caso);

    if (p.demo) {
      links.appendChild(link(p.demo, textoVer(p), 'ticket-btn', textoVer(p) + ': ' + p.name + ' (se abre en una pestaña nueva)'));
    }
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

// ------------------------------------------------------------ Pestañas de filtro
function initFiltros(list) {
  var tablist = document.getElementById('proy-tabs');
  var cuenta = document.getElementById('proy-cuenta');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#proyectos .project-card'));
  if (!tablist || !cards.length) return;

  var categorias = (window.CATEGORIES || []).filter(function (c) {
    return list.some(function (p) { return p.cat === c.id; });
  });
  var pestanas = [{ id: 'todos', label: 'Todos', n: list.length }].concat(categorias.map(function (c) {
    return { id: c.id, label: c.label, n: list.filter(function (p) { return p.cat === c.id; }).length };
  }));

  // Con una sola categoría no hace falta filtrar
  if (categorias.length < 2) { tablist.hidden = true; return; }

  tablist.textContent = '';
  var botones = pestanas.map(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'proy-tab';
    b.setAttribute('role', 'tab');
    b.id = 'tab-' + t.id;
    b.dataset.filtro = t.id;
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = '';
    b.appendChild(document.createTextNode(t.label));
    var n = document.createElement('span');
    n.className = 'proy-tab-n';
    n.textContent = t.n;
    b.appendChild(n);
    tablist.appendChild(b);
    return b;
  });

  function aplicar(id) {
    var mostradas = [];
    cards.forEach(function (c) {
      var ver = id === 'todos' || c.dataset.cat === id;
      c.classList.toggle('filtrado', !ver);
      if (ver) {
        c.style.setProperty('--i', mostradas.length); // el apilado en móvil cuenta solo las visibles
        mostradas.push(c);
      }
    });
    cuenta.textContent = 'Mostrando ' + mostradas.length + (mostradas.length === 1 ? ' proyecto' : ' proyectos');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    if (!window.reduceMotion && typeof gsap !== 'undefined') {
      gsap.fromTo(mostradas, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07, overwrite: 'auto' });
    }
  }

  function elegir(b) {
    botones.forEach(function (x) {
      var on = x === b;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
    });
    aplicar(b.dataset.filtro);
  }

  botones.forEach(function (b, i) {
    b.addEventListener('click', function () { elegir(b); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var sig = botones[(i + d + botones.length) % botones.length];
      sig.focus();
      elegir(sig);
    });
  });
}

// --------------------------------------------------------------- Ventana de caso
function initCaso(list) {
  var dlg = document.getElementById('caso');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var el = {
    img: document.getElementById('caso-img'),
    nota: document.getElementById('caso-nota'),
    titulo: document.getElementById('caso-titulo'),
    reto: document.getElementById('caso-reto'),
    hice: document.getElementById('caso-hice'),
    stack: document.getElementById('caso-stack'),
    demo: document.getElementById('caso-demo'),
    codigo: document.getElementById('caso-codigo')
  };

  function abrir(p) {
    el.img.src = p.image || '';
    el.img.alt = 'Captura de la portada de ' + p.name;
    el.img.hidden = !p.image;
    el.nota.textContent = p.nota || p.type;
    el.nota.hidden = false;
    el.titulo.textContent = p.name;
    el.reto.textContent = p.reto || p.description;
    el.hice.textContent = p.hice || '';
    el.stack.textContent = '';
    (p.stack || []).forEach(function (s) {
      var li = document.createElement('li');
      li.textContent = s;
      el.stack.appendChild(li);
    });
    el.demo.hidden = !p.demo;
    if (p.demo) {
      el.demo.href = p.demo;
      el.demo.textContent = textoVer(p);
      el.demo.setAttribute('aria-label', textoVer(p) + ': ' + p.name + ' (se abre en una pestaña nueva)');
    }
    el.codigo.href = p.code;
    el.codigo.setAttribute('aria-label', 'Ver código de ' + p.name + ' en GitHub (se abre en una pestaña nueva)');

    dlg.showModal();
    document.documentElement.classList.add('caso-abierto');
    if (window.lenis) window.lenis.stop();

    if (!window.reduceMotion) {
      // La ventana se anima con la API del navegador (no con GSAP): GSAP mueve un instante en el DOM los
      // elementos position:fixed al leer su transform, y eso expulsa a un <dialog> de la capa modal.
      if (dlg.animate) {
        dlg.animate(
          [{ opacity: 0, transform: 'translateY(40px) scale(0.96)' }, { opacity: 1, transform: 'none' }],
          { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
        );
      }
      if (typeof gsap !== 'undefined') {
        gsap.from(dlg.querySelectorAll('.caso-texto > *'), { y: 18, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: 0.15 });
      }
    }
  }

  function cerrar() { if (dlg.open) dlg.close(); }

  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('caso-abierto');
    if (window.lenis) window.lenis.start();
  });
  dlg.querySelector('[data-cerrar]').addEventListener('click', cerrar);
  // Clic en el fondo oscuro (fuera del contenido) cierra la ventana
  dlg.addEventListener('click', function (e) { if (e.target === dlg) cerrar(); });

  function porId(id) { return list.filter(function (p) { return p.id === id; })[0]; }

  // El botón "Ver detalles" es el control accesible; con ratón también se puede pulsar el ticket entero
  document.querySelectorAll('#proyectos .project-card').forEach(function (card) {
    var p = porId(card.dataset.id);
    if (!p) return;
    card.querySelector('[data-caso]').addEventListener('click', function () { abrir(p); });
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      abrir(p);
    });
  });
}

function initProjects() {
  var lista = window.PROJECTS || [];
  renderProjects(lista);
  initFiltros(lista);
  initCaso(lista);

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

    // Entrada escalonada de las tarjetas al llegar a la sección
    gsap.set(cards, { opacity: 0, scale: 0.9 });
    revealOnce(cards, 'top 88%', function (card, i) {
      gsap.to(card, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: (i % cols) * 0.12 });
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

    // Con ratón, cada ticket se endereza y se inclina hacia el cursor (efecto 3D). Se hace con GSAP
    // porque GSAP absorbe la propiedad CSS `rotate` en su transform y un :hover en CSS dejaría de funcionar.
    var hoverCleanups = [];
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cards.forEach(function (card) {
        var base = gsap.getProperty(card, 'rotation');
        var enter = function () {
          gsap.to(card, { rotation: 0, scale: 1.035, transformPerspective: 900, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        };
        var move = function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotationY: px * 12, rotationX: -py * 9, transformPerspective: 900, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
        };
        var leave = function () {
          gsap.to(card, { rotation: base, rotationX: 0, rotationY: 0, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
        };
        card.addEventListener('mouseenter', enter);
        card.addEventListener('mousemove', move);
        card.addEventListener('mouseleave', leave);
        hoverCleanups.push(function () {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mousemove', move);
          card.removeEventListener('mouseleave', leave);
        });
      });
    }

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
      hoverCleanups.forEach(function (fn) { fn(); });
      if (st) st.kill();
      gsap.set(cards, { clearProps: 'filter,yPercent,y,rotationX,rotationY,scale,opacity' });
    };
  });

  // Móvil: columna simple; cada tarjeta sube y aparece al llegar, sin flotado ni profundidad
  mm.add('(max-width: 767px)', function () {
    gsap.set(cards, { opacity: 0, y: 40 });
    revealOnce(cards, 'top 92%', function (card) {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    });
  });
}
