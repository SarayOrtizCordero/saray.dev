/* Genera los datos estructurados (JSON-LD) de index.html a partir de js/data.js y de los datos de contacto del propio HTML.
   Uso: npm run build:seo. Ejecútalo al cambiar proyectos o datos de contacto.
   Escribe dentro de <script type="application/ld+json" id="datos-estructurados"> y no toca nada más. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.resolve(__dirname, '..');
const rutaHtml = path.join(raiz, 'index.html');
const SITIO = 'https://sarayortizcordero.github.io/saray.dev/';

// js/data.js escribe en window.PROJECTS: se ejecuta con un window de pega
const ventana = {};
vm.runInNewContext(fs.readFileSync(path.join(raiz, 'js', 'data.js'), 'utf8'), { window: ventana });
const proyectos = ventana.PROJECTS || [];

let html = fs.readFileSync(rutaHtml, 'utf8');
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
fs.writeFileSync(rutaHtml, html);
console.log('Datos estructurados actualizados: ' + proyectos.length + ' proyectos, ' + sameAs.length + ' perfiles.');
