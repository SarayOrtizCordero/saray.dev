/* Genera assets/cv-saray-ortiz.pdf a partir de cv.html con el Chrome o Edge instalado (modo headless).
   Uso: npm run build:cv. Falla si el CV ocupa más de una página, para que nada quede cortado ni sobre. */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const raiz = path.resolve(__dirname, '..');
const html = path.join(raiz, 'cv.html');
const pdf = path.join(raiz, 'assets', 'cv-saray-ortiz.pdf');

const candidatos = [
  process.env.CHROME_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
];
const navegador = candidatos.find(function (p) { return p && fs.existsSync(p); });
if (!navegador) {
  console.error('No se encontró Chrome ni Edge. Define CHROME_PATH con la ruta del ejecutable.');
  process.exit(1);
}

execFileSync(navegador, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=10000', // deja tiempo a que carguen las fuentes
  '--print-to-pdf=' + pdf,
  pathToFileURL(html).href
], { stdio: 'ignore' });

// Cada página de un PDF es un objeto "/Type /Page" (sin la "s" final de "/Pages")
const paginas = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log('CV generado: ' + path.relative(raiz, pdf) + ' (' + paginas + (paginas === 1 ? ' página)' : ' páginas)'));
if (paginas !== 1) {
  console.error('El CV no cabe en una página: acorta el contenido o reduce el tamaño de letra en la sección @media print de css/cv.css.');
  process.exit(1);
}
