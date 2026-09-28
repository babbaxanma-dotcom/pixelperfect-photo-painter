/**
 * Toets van de chatassistent (api/chat.js), zonder netwerk en zonder sleutel.
 *
 * Mohammed, 28 sep 2026: "never, never, never, nooit een prijs". Deze toets
 * bewaakt de laatste laag: elk antwoord met een bedrag wordt vervangen. Met
 * positieve controle: elke lokvorm moet gevangen worden, en zinnen die wel
 * mogen (oppervlakte, termijnen, btw, de premiezin) mogen niet gevangen worden.
 *
 * Draaien: node scripts/check-chat.mjs
 */
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import { bouwKennis, bestandInhoud } from './maak-chat-kennis.mjs';
import { nepClient } from './chat-nep.mjs';
import { KENNIS } from '../api/_kennis.js';
import { heeftBedrag, bewaakPrijs, naarBerichten, maakHandler, beurt, SYSTEEM, SCHEMA, PRIJS_ANTWOORD } from '../api/chat.js';

const uitslag = [];
const meld = (ok, wat, detail = '') => uitslag.push(`${ok ? 'AF     ' : 'NIET AF'}  ${wat}${detail ? '  (' + detail + ')' : ''}`);

/* 1. De kennis loopt gelijk met de site. */
meld(fs.readFileSync(new URL('../api/_kennis.js', import.meta.url), 'utf8') === bestandInhoud(bouwKennis()),
  'api/_kennis.js is bijgewerkt (anders: node scripts/maak-chat-kennis.mjs)');
const euroRegels = KENNIS.split('\n').filter((r) => /€|\beuro\b/i.test(r));
meld(euroRegels.length > 0 && euroRegels.every((r) => /VerbouwPremie/.test(r)), 'kennis: bedragen alleen in de premiezin', `${euroRegels.length} regels`);
meld(!/50\.000|100\.000|200\.000/.test(KENNIS), 'kennis: geen budgetkeuzes van het formulier');
meld((KENNIS.match(/^V: /gm) || []).length >= 20 && (KENNIS.match(/### Afdeling/g) || []).length === 6, 'kennis: zes afdelingen met hun veelgestelde vragen',
  `${(KENNIS.match(/### Afdeling/g) || []).length} afdelingen, ${(KENNIS.match(/^V: /gm) || []).length} vragen`);
meld(SYSTEEM.includes(KENNIS) && /Nooit een prijs/.test(SYSTEEM) && /Nooit andere aannemers/.test(SYSTEEM), 'instructie bevat de kennis en de harde regels');
meld(SYSTEEM.length > 4000, 'instructie lang genoeg voor de cache (minimum 512 tokens)', `${SYSTEEM.length} tekens`);

/* 2. Prijsbewaking: elke lokvorm gevangen. */
const lok = [
  'Reken op ongeveer € 12.000.', 'Dat kost 12.000 euro.', 'Tussen 80 en 120 euro per m².', 'ongeveer 15k', 'Een paar duizend euro.',
  '15.000 tot 25.000 voor een dak van 100 m²', 'vanaf 95 per m²', 'EUR 5000', 'zo\'n 20 000', 'enkele honderden euro\'s',
  'De buurman betaalde 18.500.', 'Per m² rekent u best 110.', 'Duizenden euro\'s aan schade', 'rond de 9 000 all-in',
  'Voor dakisolatie tot 50% terug via Mijn VerbouwPremie, maximaal € 5.750, en het dak kost € 20.000.',
];
const gemist = lok.filter((z) => !heeftBedrag(z));
meld(gemist.length === 0, `prijsbewaking vangt ${lok.length} lokvormen`, gemist.join(' | '));

/* 3. En laat gewone zinnen staan. */
const goed = [
  'Meestal duurt dakwerk één tot twee weken.', 'Plaatsbezoek binnen 5 werkdagen.', 'Kleiner dan 50 m²', '50 tot 100 m²', 'Groter dan 150 m²',
  'Dankzij de wettelijke 6% btw-regeling betaalt u 15% minder btw.', 'Bel ons op 0460 20 77 88.', 'Met buitenisolatie komt de gevel 14 tot 20 cm naar buiten.',
  'PIR, PUR of cellulose tot onder K30.', 'Wij tekenen uw badkamer in 3D.', 'August van Landeghemstraat 63, 2830 Willebroek', 'Tien jaar garantie op dakrenovatie.',
  'Voor dakisolatie krijgt u via Mijn VerbouwPremie bij inkomenscategorie 3 of 4 tot 50% van de factuur terug, maximaal € 5.750.',
  'Een goed uitgevoerde crepi gaat vlot 25 jaar mee.', '1 vast aanspreekpunt', 'Dakrenovatie hellend dak – Mortsel',
];
const vals = goed.filter(heeftBedrag);
meld(vals.length === 0, `prijsbewaking laat ${goed.length} gewone zinnen staan`, vals.join(' | '));

const leeg = { klaar: false, titel: '', velden: [], bericht: '' };
const b1 = bewaakPrijs({ antwoord: 'Reken op 150 euro per m².', keuzes: [], suggesties: [], actie: 'geen', aanvraag: leeg });
meld(b1.bewaakt && b1.antwoord === PRIJS_ANTWOORD && b1.actie === 'rekenaar', 'bedrag in het antwoord: vast antwoord + knop prijsberekening');
const b2 = bewaakPrijs({ antwoord: 'Prima.', keuzes: [], suggesties: [], actie: 'geen', aanvraag: { klaar: true, titel: 'Dak', velden: [{ label: 'Budget', waarde: '€ 30.000' }], bericht: '' } });
meld(b2.bewaakt && !b2.aanvraag.klaar, 'bedrag in een veld van de aanvraag: ook tegengehouden');
const b3 = bewaakPrijs({ antwoord: 'Tien jaar garantie.', keuzes: ['Ja', 'Nee'], suggesties: [], actie: 'geen', aanvraag: leeg });
meld(!b3.bewaakt && b3.antwoord === 'Tien jaar garantie.', 'gewoon antwoord: ongewijzigd door');

/* 4. Invoer. */
meld(naarBerichten('x') === null && naarBerichten([]) === null, 'ongeldige invoer geweigerd');
const nb = naarBerichten([{ rol: 'assistent', tekst: 'Welkom' }, { rol: 'bezoeker', tekst: 'a' }, { rol: 'bezoeker', tekst: 'b' }]);
meld(nb.length === 1 && nb[0].role === 'user' && nb[0].content === 'a\nb', 'welkomstbericht weg, twee bezoekersberichten samengevoegd');
meld(naarBerichten([{ rol: 'bezoeker', tekst: 'a' }, { rol: 'assistent', tekst: 'b' }]) === null, 'laatste bericht moet van de bezoeker zijn');
meld(naarBerichten([{ rol: 'bezoeker', tekst: 'x'.repeat(5000) }])[0].content.length === 800, 'bericht afgekapt op 800 tekens');
meld(SCHEMA.required.length === 5 && SCHEMA.additionalProperties === false, 'schema: vijf verplichte velden, niets extra');

/* 5. De route, met nepmodellen. */
const doe = async (handler, { method = 'POST', origin, body, ip = '1.2.3.' + Math.floor(Math.random() * 250) } = {}) => {
  let code = 0, data = null;
  const res = { status(c) { code = c; return res; }, json(o) { data = o; return res; } };
  await handler({ method, headers: { origin, 'x-forwarded-for': ip }, body }, res);
  return { code, data };
};
const oudeSleutel = process.env.ANTHROPIC_API_KEY; const oudNep = process.env.CHAT_NEP;
delete process.env.ANTHROPIC_API_KEY; delete process.env.CHAT_NEP;
const h = maakHandler(nepClient);
meld((await doe(h, { method: 'GET' })).data.gereed === false, 'zonder sleutel: gereed false (geen chatknop)');
process.env.CHAT_NEP = '1';
meld((await doe(h, { method: 'GET' })).data.gereed === true, 'met sleutel: gereed true');
meld((await doe(h, { origin: 'https://kwaadaardig.example', body: { berichten: [{ rol: 'bezoeker', tekst: 'hoi' }] } })).code === 403, 'andere site: 403');
const ok = await doe(h, { origin: 'https://www.abgroep.be', body: { pagina: 'dakwerken', berichten: [{ rol: 'bezoeker', tekst: 'Ik wil een gratis dakinspectie aanvragen.' }] } });
meld(ok.code === 200 && ok.data.keuzes.length === 4 && /dak/.test(ok.data.antwoord), 'aanvraag start op dakwerken: dakvraag met vier keuzes', ok.data && ok.data.antwoord);
const okR = await doe(h, { body: { pagina: 'totaalrenovatie', berichten: [{ rol: 'bezoeker', tekst: 'Ik wil een gratis plaatsbezoek aanvragen.' }] } });
meld(/woning/.test(okR.data.antwoord), 'aanvraag start op totaalrenovatie: woningvraag', okR.data.antwoord);
const prijs = await doe(h, { body: { pagina: 'dakwerken', berichten: [{ rol: 'bezoeker', tekst: 'Wat kost een nieuw dak?' }] } });
meld(prijs.code === 200 && prijs.data.actie === 'rekenaar' && !heeftBedrag(prijs.data.antwoord), 'prijsvraag: geen bedrag, knop prijsberekening');

const vast = (tekst, stop = 'end_turn') => () => ({ beta: { messages: { create: async () => ({ stop_reason: stop, content: [{ type: 'text', text: tekst }] }) } } });
const prijsModel = vast(JSON.stringify({ antwoord: 'Gemiddeld 180 euro per m².', keuzes: [], suggesties: [], actie: 'geen', aanvraag: leeg }));
const pm = await doe(maakHandler(prijsModel), { body: { berichten: [{ rol: 'bezoeker', tekst: 'Gemiddeld?' }] } });
meld(pm.data.antwoord === PRIJS_ANTWOORD, 'model noemt toch een prijs: bezoeker krijgt het vaste antwoord');
meld(!('bewaakt' in pm.data), 'intern veld "bewaakt" gaat niet naar de browser');
const weiger = await doe(maakHandler(vast('', 'refusal')), { body: { berichten: [{ rol: 'bezoeker', tekst: 'x' }] } });
meld(weiger.code === 200 && weiger.data.actie === 'bellen', 'weigering: nette melding met belknop');
const kapot = await doe(maakHandler(vast('{niet af')), { body: { berichten: [{ rol: 'bezoeker', tekst: 'x' }] } });
meld(kapot.code === 200 && kapot.data.actie === 'bellen', 'onleesbaar antwoord: nette melding met belknop');
let tweede = false;
const fout400 = () => ({
  beta: { messages: { create: async () => { throw new Anthropic.BadRequestError(400, { error: { message: 'fallbacks' } }, 'fallbacks', new Headers()); } } },
  messages: { create: async () => { tweede = true; return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ antwoord: 'Oké.', keuzes: [], suggesties: [], actie: 'geen', aanvraag: leeg }) }] }; } },
});
const r400 = await doe(maakHandler(fout400), { body: { berichten: [{ rol: 'bezoeker', tekst: 'x' }] } });
meld(tweede && r400.data.antwoord === 'Oké.', '400 op de beta-velden: tweede poging zonder, bezoeker merkt niets');
const lang = Array.from({ length: 31 }, (_, i) => ({ rol: i % 2 ? 'assistent' : 'bezoeker', tekst: 'v' + i }));
meld((await doe(h, { body: { berichten: lang } })).data.actie === 'bellen', 'heel lang gesprek: vriendelijk naar de telefoon');

/* Rem per IP: met een (nep)sleutel en zonder nepmodus telt hij wel. */
delete process.env.CHAT_NEP; process.env.ANTHROPIC_API_KEY = 'toets';
const rem = maakHandler(nepClient);
let laatsteCode = 0;
for (let i = 0; i < 121; i++) laatsteCode = (await doe(rem, { ip: '9.9.9.9', body: { berichten: [{ rol: 'bezoeker', tekst: 'Welke garantie krijg ik?' }] } })).code;
const anderAdres = (await doe(rem, { ip: '9.9.9.10', body: { berichten: [{ rol: 'bezoeker', tekst: 'Welke garantie krijg ik?' }] } })).code;
meld(laatsteCode === 429 && anderAdres === 200, 'rem: 121ste bericht van hetzelfde adres geweigerd, ander adres gaat door', `${laatsteCode} / ${anderAdres}`);
process.env.CHAT_NEP = '1'; delete process.env.ANTHROPIC_API_KEY;

/* 6. Het volledige verzoek aan het model (vorm uit de documentatie). */
let verzoek = null;
await beurt({ client: { beta: { messages: { create: async (p) => { verzoek = p; return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ antwoord: 'a', keuzes: [], suggesties: [], actie: 'geen', aanvraag: leeg }) }] }; } } } },
  berichten: [{ role: 'user', content: 'hoi' }], pagina: 'totaalrenovatie' });
meld(verzoek.model === 'claude-opus-5' && verzoek.output_config.effort === 'low' && verzoek.output_config.format.type === 'json_schema', 'verzoek: claude-opus-5, effort low, JSON-schema');
meld(verzoek.system[0].cache_control?.type === 'ephemeral' && verzoek.system[0].text === SYSTEEM && /totaalrenovatie/.test(verzoek.system[1].text), 'verzoek: vaste instructie gecachet, pagina apart erachter');
meld(verzoek.fallbacks === 'default' && verzoek.betas[0] === 'server-side-fallback-2026-07-01', 'verzoek: fallbacks default met de juiste beta');

if (oudeSleutel) process.env.ANTHROPIC_API_KEY = oudeSleutel; else delete process.env.ANTHROPIC_API_KEY;
if (oudNep) process.env.CHAT_NEP = oudNep; else delete process.env.CHAT_NEP;

console.log(uitslag.join('\n'));
const af = uitslag.filter((r) => r.startsWith('AF')).length;
console.log(`\n${af} van ${uitslag.length} AF`);
process.exit(af === uitslag.length ? 0 : 1);
