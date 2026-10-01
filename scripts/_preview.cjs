/**
 * Gedeelde preview-server voor de controles die de GEBOUWDE site meten
 * (check-kophero, check-sitemap, check-ankers, check-doorloop).
 *
 * Aanleiding (1 okt 2026): in de werkmap abgroep-afspraak bestond geen dist/,
 * en de vaste poorten 4382, 4383, 4384 en 4420 waren bezet door oude
 * preview-servers uit de hoofdwerkmap (pixelperfect-photo-painter). De eigen
 * server startte dus niet (--strictPort), maar de fetch naar de poort slaagde
 * wel: de controles maten de oude site van een andere map en gaven groen.
 * Een meting van de verkeerde site is een ongeldige meting.
 *
 * Daarom, voor elke meting:
 *  1. bouwen als dist/index.html ontbreekt of ouder is dan de broncode;
 *  2. een poort nemen waar niets op antwoordt;
 *  3. nagaan dat de server precies de eigen dist/index.html serveert.
 * Lukt één daarvan niet: exit 2, ongeldige meting.
 */
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const WORTEL = path.join(__dirname, '..');
const VITE = path.join(WORTEL, 'node_modules', 'vite', 'bin', 'vite.js');
const INDEX = path.join(WORTEL, 'dist', 'index.html');
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

function nieuwste(map) {
  let t = 0;
  for (const e of fs.readdirSync(map, { withFileTypes: true })) {
    const p = path.join(map, e.name);
    t = Math.max(t, e.isDirectory() ? nieuwste(p) : fs.statSync(p).mtimeMs);
  }
  return t;
}

function bouwAlsNodig() {
  const bron = Math.max(nieuwste(path.join(WORTEL, 'src')), nieuwste(path.join(WORTEL, 'public')),
    fs.statSync(path.join(WORTEL, 'index.html')).mtimeMs);
  if (fs.existsSync(INDEX) && fs.statSync(INDEX).mtimeMs >= bron) return;
  execSync(`"${process.execPath}" "${VITE}" build`, { cwd: WORTEL, stdio: 'ignore' });
  if (!fs.existsSync(INDEX)) throw new Error('bouwen leverde geen dist/index.html op');
}

async function antwoordt(poort) {
  try { await fetch(`http://localhost:${poort}/`, { signal: AbortSignal.timeout(800) }); return true; } catch { return false; }
}

async function startPreview(voorkeur) {
  try { bouwAlsNodig(); } catch (e) {
    console.error(`FOUT: bouwen mislukt (${e.message}) — de meting is ongeldig`);
    process.exit(2);
  }
  let poort = voorkeur;
  while (await antwoordt(poort)) poort++;
  const srv = spawn(process.execPath, [VITE, 'preview', '--port', String(poort), '--strictPort'],
    { cwd: WORTEL, stdio: 'ignore' });
  const eigen = fs.readFileSync(INDEX, 'utf8');
  let gezien = null;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${poort}/`);
      if (r.ok) { gezien = await r.text(); break; }
    } catch { await wacht(500); }
  }
  if (gezien !== eigen) {
    try { srv.kill(); } catch { /* al weg */ }
    console.error(gezien === null
      ? `FOUT: preview-server kwam niet op (poort ${poort}) — de meting is ongeldig`
      : `FOUT: poort ${poort} serveert niet de eigen dist/index.html — de meting is ongeldig`);
    process.exit(2);
  }
  return { poort, pid: srv.pid, kill: () => { try { srv.kill(); } catch { /* al weg */ } } };
}

module.exports = { startPreview };
