/* SEO: propaga la dirección pública de site.json y genera los datos estructurados.
   Uso: npm run build:seo. Ejecútalo al cambiar de dirección, añadir un proyecto o cambiar los datos de contacto.
   Actualiza: canonical, og:url, og:image y twitter:image de index.html y cv.html; robots.txt; sitemap.xml;
   y el bloque <script type="application/ld+json" id="datos-estructurados"> de index.html (desde js/data.js). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.resolve(__dirname, '..');
const ruta = function (f) { return path.join(raiz, f); };

// Dirección pública, siempre con barra final
const SITIO = JSON.parse(fs.readFileSync(ruta('site.json'), 'utf8')).url.replace(/\/*$/, '/');

// Sustituye el atributo de una etiqueta <head> y falla si no la encuentra (para no dejar una dirección antigua)
function fijar(html, archivo, patron, valor) {
  if (!patron.test(html)) {
    console.error('No encuentro ' + patron + ' en ' + archivo + '.');
    process.exit(1);
  }
  return html.replace(patron, function (_, a, b) { return a + valor + b; });
}

function sincronizarCabecera(archivo, pagina) {
  let html = fs.readFileSync(ruta(archivo), 'utf8');
  html = fijar(html, archivo, /(<link rel="canonical" href=")[^"]*(")/, SITIO + pagina);
  html = fijar(html, archivo, /(<meta property="og:url" content=")[^"]*(")/, SITIO + pagina);
  html = fijar(html, archivo, /(<meta property="og:image" content=")[^"]*(")/, SITIO + 'assets/og.jpg');
  html = fijar(html, archivo, /(<meta name="twitter:image" content=")[^"]*(")/, SITIO + 'assets/og.jpg');
  return html;
}

// ------------------------------------------------------------------ cv.html
fs.writeFileSync(ruta('cv.html'), sincronizarCabecera('cv.html', 'cv.html'));

// ------------------------------------------------------- robots.txt y sitemap
fs.writeFileSync(ruta('robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITIO + 'sitemap.xml\n');
fs.writeFileSync(ruta('sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  '  <url>\n    <loc>' + SITIO + '</loc>\n  </url>\n' +
  '  <url>\n    <loc>' + SITIO + 'cv.html</loc>\n  </url>\n' +
  '</urlset>\n');

// ---------------------------------------------------------------- index.html
// js/data.js escribe en window.PROJECTS: se ejecuta con un window de pega
const ventana = {};
vm.runInNewContext(fs.readFileSync(ruta('js/data.js'), 'utf8'), { window: ventana });
const proyectos = ventana.PROJECTS || [];

let html = sincronizarCabecera('index.html', '');
const correo = (html.match(/href="mailto:([^"]+)"/) || [])[1];
const telefono = (html.match(/href="https:\/\/wa\.me\/(\d+)"/) || [])[1];
const redes = Array.from(html.matchAll(/href="(https:\/\/(?:github\.com|www\.instagram\.com)\/[^"]+)"/g)).map(function (m) { return m[1]; });
const sameAs = Array.from(new Set(redes));

const servicios = [
  'Desarrollo de páginas web y landing pages',
  'Sistemas a medida (CRM)',
  'Paneles de inventario',
  'Diseño web responsive'
];

const persona = {
  '@type': 'Person',
  '@id': SITIO + '#saray',
  name: 'Saray Ortiz Cordero',
  jobTitle: 'Desarrolladora web full stack junior',
  url: SITIO,
  image: SITIO + 'assets/og.jpg',
  sameAs: sameAs
};
if (correo) persona.email = correo;
if (telefono) persona.telephone = '+' + telefono;

const grafo = {
  '@context': 'https://schema.org',
  '@graph': [
    persona,
    {
      '@type': 'ProfessionalService',
      '@id': SITIO + '#servicio',
      name: 'Saray.dev',
      url: SITIO,
      image: SITIO + 'assets/og.jpg',
      description: 'Desarrolladora web freelance: webs, landing pages, CRM y paneles de inventario a medida para negocios, en remoto.',
      areaServed: { '@type': 'Country', name: 'España' },
      knowsLanguage: 'es',
      founder: { '@id': SITIO + '#saray' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios',
        itemListElement: servicios.map(function (s) {
          return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } };
        })
      }
    },
    {
      '@type': 'ItemList',
      name: 'Proyectos',
      itemListElement: proyectos.map(function (p, i) {
        const obra = {
          '@type': 'CreativeWork',
          name: p.name,
          description: p.description,
          creator: { '@id': SITIO + '#saray' }
        };
        if (p.demo) obra.url = p.demo;
        return { '@type': 'ListItem', position: i + 1, item: obra };
      })
    }
  ]
};

const abre = '<script type="application/ld+json" id="datos-estructurados">';
const inicio = html.indexOf(abre);
const fin = inicio === -1 ? -1 : html.indexOf('</script>', inicio);
if (inicio === -1 || fin === -1) {
  console.error('No encuentro ' + abre + ' en index.html.');
  process.exit(1);
}

html = html.slice(0, inicio + abre.length) + '\n' + JSON.stringify(grafo, null, 2) + '\n  ' + html.slice(fin);
fs.writeFileSync(ruta('index.html'), html);
console.log('SEO actualizado para ' + SITIO + ' (' + proyectos.length + ' proyectos, ' + sameAs.length + ' perfiles).');
