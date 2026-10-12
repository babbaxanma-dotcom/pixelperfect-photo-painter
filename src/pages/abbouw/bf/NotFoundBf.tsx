/**
 * 404 in de stijl van bfbouw.be (spec/bf-stijl.md §10; BF-tegenhanger /404-pagina/, bouw/paginas.cjs r.254-256):
 * vlakke paginakop "Deze pagina bestaat niet" met knoppen naar / en tel: (CONTACT, niet meer hard in de code).
 * Tekst woordelijk uit NotFound.tsx (NOTFOUND_TEKST): één bron. De kop zonder punt (spec §10: een kop).
 */
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NOTFOUND_TEKST } from '@/pages/NotFound';
import BfPagina from './BfPagina';
import { pagina, ICOON, TEL, TEL_HREF, esc } from './schil';
import { paginakop } from './blokken';
import { HOME_BF, OMSCHRIJVING_STANDAARD } from './inhoud';

export const NOTFOUND_BF = {
  titel: NOTFOUND_TEKST.titel,
  omschrijving: OMSCHRIJVING_STANDAARD, // NotFound.tsx zette geen beschrijving: die van index.html r.8
  kop: NOTFOUND_TEKST.kop.replace(/\.$/, ''),
  sub: NOTFOUND_TEKST.tekst,
  knopHome: NOTFOUND_TEKST.knopHome,
};

export function notFoundHtml() {
  const N = NOTFOUND_BF;
  const knoppen = `<a class="bf-knop bf-hero__knop" href="/">${esc(N.knopHome)}${ICOON.pijlR}</a><a class="bf-knop bf-knop--rand-wit" href="${TEL_HREF}">Bel ${TEL}</a>`;
  // op gsm geen los woord "niet" op de tweede regel: text-wrap balance voor elke paginakop (bf-ab.css)
  const inhoud = paginakop({ kop: [N.kop], sub: N.sub, knoppen });
  return pagina({ actief: '', heeftPlaats: false, inhoud, voettekst: HOME_BF.voet });
}

/* De vaste robots-waarde van elke gewone pagina: index.html r.10. Bij het verlaten van de 404 komt
   precies deze waarde terug, NIET "de vorige waarde": Bedankt, Afspraak, Status en de calculators
   zetten noindex zonder opruiming, dus na /bedankt -> foute URL -> "Naar de homepage" zou de vorige
   waarde de home op noindex laten staan. */
const ROBOTS_STANDAARD = 'index, follow, max-image-preview:large, max-snippet:-1';

export default function NotFoundBf() {
  const { pathname } = useLocation();
  const html = useMemo(notFoundHtml, []);

  /* Elke onbekende URL geeft 200 met index.html (vercel.json en netlify.toml herschrijven "/(.*)"):
     zonder noindex is elke foute URL een soft-404 die Google mag opnemen. BF zet de 404 op
     "noindex, nofollow" (bfbouw-website/build.cjs r.116, NIET_INDEXEREN). De canonical blijft
     zoals ze is (spec §11). Zelfde patroon als Bedankt.tsx r.156-158. */
  useEffect(() => {
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m); }
    m.setAttribute('content', 'noindex, nofollow');
    return () => { document.querySelector('meta[name="robots"]')?.setAttribute('content', ROBOTS_STANDAARD); };
  }, []);

  return <BfPagina html={html} titel={NOTFOUND_BF.titel} omschrijving={NOTFOUND_BF.omschrijving} pad={pathname} bron="404" />;
}
