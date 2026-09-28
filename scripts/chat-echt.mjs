/**
 * Start de site lokaal met de ECHTE chatassistent (Claude API) op poort 8091.
 * De sleutel komt uit .env.local (ANTHROPIC_API_KEY=...), nooit uit de code.
 * Poort 8080 (gewone dev-server, verify) en 8090 (nepmodel) blijven ongemoeid.
 *
 * Draaien: npm run chat:echt   → http://localhost:8091/lp/dakwerken
 */
import { spawn } from 'node:child_process';
import { laadSleutel } from './chat-sleutel.mjs';

if (!laadSleutel()) {
  console.log('Geen sleutel gevonden. Zet in .env.local één regel: ANTHROPIC_API_KEY=sk-ant-...');
  process.exit(2);
}
const env = { ...process.env };
delete env.CHAT_NEP;
console.log('Sleutel gevonden (niet getoond). Echte chat op http://localhost:8091/lp/dakwerken');
spawn('npx', ['vite', '--port', '8091', '--strictPort'], { stdio: 'inherit', env, shell: true });
