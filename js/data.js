(function () {
  var USER = 'SarayOrtizCordero';
  var PAGES = 'https://sarayortizcordero.github.io/';

  function repo(id, name, type, description, hasDemo) {
    return {
      id: id,
      name: name,
      type: type,
      description: description,
      demo: hasDemo === false ? null : PAGES + id + '/',
      code: 'https://github.com/' + USER + '/' + id
    };
  }

  window.PROJECTS = [
    repo('Vortex-Gym', 'Vortex Gym', 'Web de gimnasio', 'Página para un gimnasio con planes, horarios y contacto.'),
    repo('Fogon-Restaurante', 'Fogón', 'Web de restaurante', 'Sitio de restaurante con carta, ambiente y reservas.'),
    repo('cafeteri-crm', 'Cafeteri CRM', 'Aplicación de gestión', 'CRM para gestionar clientes y pedidos de una cafetería.', false),
    repo('Video-Game-Universe', 'Video Game Universe', 'Web de videojuegos', 'Catálogo de videojuegos con diseño inmersivo.'),
    repo('Olympus-Cars', 'Olympus Cars', 'Web de automóviles', 'Escaparate de coches con fichas y filtros.'),
    repo('real-estate-agency-1', 'Real Estate Agency', 'Web inmobiliaria', 'Sitio para una agencia inmobiliaria con listado de propiedades.')
  ];

  window.CONTACT = {
    email: 'CORREO_PENDIENTE',
    whatsapp: 'WHATSAPP_PENDIENTE',
    cvEnabled: false
  };
})();
