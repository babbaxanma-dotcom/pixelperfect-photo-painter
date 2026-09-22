/**
 * Lichte previewserver voor dist/, zonder vite.
 *
 * Aanleiding: met meerdere sessies tegelijk is het geheugen op deze machine
 * krap, en de taakbewaker schoot "vite preview" twee keer neer terwijl Mohammed
 * naar de pagina keek. Dit is kaal node zonder afhankelijkheden: één klein
 * proces dat dist/ uitserveert.
 *
 * Elk adres dat geen bestand is, krijgt index.html terug — de site is een
 * eenpagina-app, dus /lp/totaalrenovatie bestaat niet als bestand maar moet wel
 * werken.
 *
 * Draaien: node preview-licht.cjs [poort]
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, 'dist');
const POORT = Number(process.argv[2] || 8140);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

if (!fs.existsSync(ROOT)) {
  console.error('FOUT: dist/ bestaat niet — eerst npm run build');
  process.exit(1);
}

http.createServer((vraag, antwoord) => {
  let pad = decodeURIComponent((vraag.url || '/').split('?')[0]);
  let bestand = path.join(ROOT, pad);
  /* Buiten dist/ wijzen mag niet, ook niet met ../ in het adres. */
  if (!bestand.startsWith(ROOT)) bestand = ROOT;
  if (!fs.existsSync(bestand) || fs.statSync(bestand).isDirectory()) {
    bestand = path.join(ROOT, 'index.html');
  }
  antwoord.writeHead(200, {
    'content-type': MIME[path.extname(bestand).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  /* Tijdens npm run build is dist/ even leeg. Zonder deze vangst viel de
     server om zodra er op dat moment een verzoek binnenkwam. */
  fs.createReadStream(bestand).on('error', () => {
    if (!antwoord.headersSent) antwoord.writeHead(503);
    antwoord.end('bezig met bouwen, ververs zo');
  }).pipe(antwoord);
}).listen(POORT, '127.0.0.1', () => {
  console.log(`abgroep-preview op http://127.0.0.1:${POORT}/`);
});
