/**
 * Leest ANTHROPIC_API_KEY uit de omgeving of uit .env.local (dat bestand staat in
 * .gitignore en gaat nooit mee naar git of naar Vercel). Drukt de sleutel nooit af.
 * Voor lokaal testen alleen; live staat de sleutel in Vercel.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function laadSleutel() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const bestand = path.join(repo, '.env.local');
  if (!fs.existsSync(bestand)) return null;
  const m = fs.readFileSync(bestand, 'utf8').match(/^\s*ANTHROPIC_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m);
  const sleutel = m ? m[1].trim() : '';
  if (!sleutel) return null;
  process.env.ANTHROPIC_API_KEY = sleutel;
  return sleutel;
}
