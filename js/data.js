(function () {
  var USER = 'SarayOrtizCordero';
  var PAGES = 'https://sarayortizcordero.github.io/';

  // Categorías del filtro de proyectos. Solo aparecen las que tienen al menos un proyecto:
  // cuando añadas un CRM o un panel de inventario, pon cat: 'crm' o cat: 'inventario' y saldrá su pestaña.
  window.CATEGORIES = [
    { id: 'web', label: 'Webs' },
    { id: 'tienda', label: 'Tienda online' },
    { id: 'gestion', label: 'Gestión' },
    { id: 'crm', label: 'CRM' },
    { id: 'inventario', label: 'Inventario' }
  ];

  // Campos: reto y hice alimentan la ventana "Ver detalles" (borradores a partir de cada repositorio: revísalos).
  function proyecto(p) {
    p.code = p.code || 'https://github.com/' + USER + '/' + p.id;
    p.demo = p.demo === undefined ? PAGES + p.id + '/' : p.demo;
    return p;
  }

  window.PROJECTS = [
    proyecto({
      id: 'administracion-autores-contratos',
      name: 'Autores y contratos',
      type: 'Editorial',
      cat: 'gestion',
      nota: 'Proyecto propio',
      image: 'assets/proyectos/autores-contratos.webp',
      description: 'Herramienta para que una editorial gestione autores, contratos, anticipos y liquidaciones de royalties.',
      reto: 'Una editorial necesita saber qué contrato vence pronto, cuánto del anticipo está recuperado y qué hay que liquidar a cada autor, sin depender de hojas de cálculo.',
      hice: 'Diseñé y programé la herramienta con HTML, CSS y JavaScript puros, sin frameworks: lista de autores con semáforo de vencimientos, ficha con contratos, anticipos y liquidaciones, cálculo de royalties paso a paso con reparto entre coautores, correo simulado y tema claro y oscuro. Funciona con datos de ejemplo y la lógica de negocio tiene pruebas automáticas.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Node']
    }),
    proyecto({
      id: 'chapterandbloom.shop',
      name: 'Chapter & Bloom',
      type: 'Tienda online',
      cat: 'tienda',
      nota: 'Tienda con carrito',
      image: 'assets/proyectos/chapter-and-bloom.webp',
      description: 'Tienda de skins, inserts y marcapáginas para e-readers, con carrito y buscador.',
      reto: 'Una tienda de productos pequeños y muy visuales necesita enseñar bien cada diseño y dejar elegir modelo y acabado sin complicaciones.',
      hice: 'Construí la tienda con Next.js y TypeScript: portada con carrusel, catálogo por categorías, buscador y carrito.',
      stack: ['Next.js', 'React', 'TypeScript'],
      demo: 'https://chapterandbloom-shop.vercel.app'
    }),
    proyecto({
      id: 'centro-aura-2',
      name: 'Centro Aura',
      type: 'Peluquería y spa',
      cat: 'web',
      nota: 'Propuesta de diseño',
      image: 'assets/proyectos/centro-aura.webp',
      description: 'Web de una peluquería, spa capilar y tricología con reserva por WhatsApp.',
      reto: 'Presentar los servicios, el horario y los productos del centro con una sola acción clara: reservar por WhatsApp.',
      hice: 'Diseñé una segunda propuesta para que la clienta pudiera elegir entre dos diseños. Son siete páginas en HTML, CSS y JavaScript sin frameworks, con precios y horario editables desde un solo archivo y pruebas automáticas.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Node'],
      demo: PAGES + 'centro-aura-2/'
    }),
    proyecto({
      id: 'real-estate-agency-1',
      name: 'Serrano & Vega',
      type: 'Inmobiliaria',
      cat: 'web',
      nota: 'Proyecto propio',
      image: 'assets/proyectos/serrano-vega.webp',
      description: 'Web de inmobiliaria con catálogo de propiedades filtrable y fichas con galería.',
      reto: 'Buscar piso tiene que ser rápido: filtrar por operación, tipo, barrio y precio, y ver cada inmueble sin salir de la página.',
      hice: 'Catálogo con filtros combinables, ficha de propiedad en ventana modal con galería, obra nueva, formulario que precarga la referencia del inmueble y mapa con OpenStreetMap. En móvil, el menú ocupa toda la pantalla.',
      stack: ['HTML', 'CSS', 'JavaScript']
    }),
    proyecto({
      id: 'template-cafeter-a',
      name: 'Café de la Esquina',
      type: 'Cafetería',
      cat: 'web',
      nota: 'Proyecto propio',
      image: 'assets/proyectos/cafe-de-la-esquina.webp',
      description: 'Web de cafetería de barrio con carta, galería y contacto por WhatsApp.',
      reto: 'Un café de barrio necesita enseñar el local y la carta, y que escribir al negocio sea inmediato.',
      hice: 'Sitio de una página con las secciones de nosotros, menú, galería y ubicación, y un botón flotante de WhatsApp.',
      stack: ['HTML', 'CSS', 'JavaScript']
    }),
    proyecto({
      id: 'Fogon-Restaurante',
      name: 'El Fogón Porteño',
      type: 'Restaurante',
      cat: 'web',
      nota: 'Proyecto propio',
      image: 'assets/proyectos/fogon.webp',
      description: 'Web de restaurante de cocina argentina con carta, galería y reserva de mesa.',
      reto: 'Un restaurante vive de que la gente reserve: la carta y el botón de reserva tienen que estar siempre a mano.',
      hice: 'Portada a pantalla completa, carta, galería, ubicación, botón de reserva y WhatsApp flotante.',
      stack: ['HTML', 'CSS', 'JavaScript']
    }),
    proyecto({
      id: 'Vortex-Gym',
      name: 'Vortex Gym',
      type: 'Gimnasio',
      cat: 'web',
      nota: 'Proyecto propio',
      image: 'assets/proyectos/vortex-gym.webp',
      description: 'Web de gimnasio con servicios, planes, galería y testimonios en diseño oscuro.',
      reto: 'Un gimnasio tiene que convencer rápido: servicios, planes y una llamada a apuntarse desde la primera pantalla.',
      hice: 'Portada con cifras destacadas y secciones de servicios, galería, planes y testimonios, en un diseño oscuro con acentos naranja.',
      stack: ['HTML', 'CSS']
    })
  ];
})();
