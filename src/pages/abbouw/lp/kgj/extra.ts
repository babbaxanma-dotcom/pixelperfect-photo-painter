/**
 * Wat de KGJ-demo niet had en een landingspagina wel nodig heeft.
 *
 * Met de hand geschreven, in dezelfde maten en variabelen als stijl.ts (die
 * gegenereerd wordt en niet met de hand gewijzigd mag worden):
 *
 *   - Een kop met alleen het logo en het telefoonnummer. Recotex' eigen
 *     campagnepagina doet het zo: elke menulink is een uitgang weg van het doel.
 *   - Een hero in twee kolommen: links de kop, rechts de calculator.
 *   - De calculatorkaart zelf.
 */
export const KGJ_EXTRA = `
/* ── kop: logo en telefoon ── */
.kgjx .kgj-kop--lp .kgj-kop__in { justify-content: space-between; }
.kgjx .kgj-kop--lp .kgj-kop__bel { display: inline-flex; gap: 10px; }
.kgjx .kgj-kop--lp .kgj-kop__bel svg { flex: none; }

/* ── hero: kop links, calculator rechts ── */
.kgjx .kgj-hero--lp { min-height: calc(100svh - 84px); }
.kgjx .kgj-hero--lp .kgj-hero__in { padding-block: 64px 96px; }
.kgj-hero__raster { display: grid; grid-template-columns: minmax(0, 1fr) 440px; gap: 64px; align-items: center; }
.kgjx .kgj-hero--lp h1 { max-width: 15ch; text-wrap: balance; }
.kgjx .kgj-hero__ondertitel { margin-top: 16px; color: #fff; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 22px; font-weight: 700; line-height: 1.3; }
.kgjx .kgj-hero__ondertitel + .kgj-hero__sub { margin-top: 8px; }
.kgjx .kgj-hero__sub { margin-top: 20px; color: rgba(255, 255, 255, .9); font-size: 18px; max-width: 40ch; }

/* ── de calculatorkaart ── */
.kgjx .kgj-reken { background: var(--wit); color: var(--inkt); border-radius: var(--r-vak);
  padding: 26px 28px 24px; box-shadow: 0 30px 70px -30px rgba(5, 11, 20, .6); text-align: left; }
.kgj-reken__kop { display: flex; justify-content: space-between; align-items: center; min-height: 28px;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 13px; font-weight: 700; color: var(--zacht); }
.kgjx .kgj-reken__terug { background: none; border: 0; padding: 4px 0; font: inherit; color: var(--merk); cursor: pointer; }
.kgjx .kgj-reken__terug:hover { color: var(--accent-diep); }
.kgj-reken__balk { height: 4px; border-radius: 2px; background: var(--lijn); margin: 10px 0 20px; overflow: hidden; }
.kgj-reken__balk i { display: block; height: 100%; background: var(--accent); transition: width .35s cubic-bezier(.3,.7,.3,1); }
.kgj-reken__stap { animation: kgj-reken-in .32s cubic-bezier(.22,.7,.3,1); }
@keyframes kgj-reken-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
.kgjx .kgj-reken__vraag { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; font-size: 21px;
  line-height: 1.25; color: var(--kop); margin-bottom: 16px; letter-spacing: -.015em; }
.kgj-reken__keuzes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
/* Oneven aantal keuzes: de laatste over de volle breedte, anders blijft er een gat. */
.kgj-reken__keuzes--oneven .kgj-reken__keuze:last-child { grid-column: 1 / -1; }
.kgjx .kgj-reken__keuze { min-height: 56px; padding: 12px 16px; text-align: left; cursor: pointer;
  background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r); color: var(--inkt);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 600; font-size: 15.5px; line-height: 1.3;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease; }
.kgjx .kgj-reken__keuze:hover { border-color: var(--merk); box-shadow: 0 0 0 1px var(--merk); }
.kgjx .kgj-reken__keuze.is-aan { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); background: var(--accent-licht); }
.kgjx .kgj-reken__keuze:focus-visible { outline: 3px solid var(--merk); outline-offset: 2px; }

.kgjx .kgj-reken__form label { display: block; margin-bottom: 12px; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 13px; font-weight: 600; color: var(--tekst); }
/* 16px: kleiner laat Safari op een iPhone inzoomen zodra je het veld aantikt. */
.kgjx .kgj-reken__form input { display: block; width: 100%; margin-top: 6px; padding: 13px; font: inherit;
  font-family: Lato, system-ui, sans-serif; font-size: 16px; font-weight: 400; color: var(--inkt);
  background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r); }
.kgjx .kgj-reken__form input:focus { outline: 2px solid var(--merk); outline-offset: 1px; border-color: var(--merk); }
.kgj-reken__rij { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.kgjx .kgj-reken__knop { width: 100%; margin-top: 4px; }
.kgjx .kgj-reken__gerust { margin-top: 10px; font-size: 13.5px; color: var(--zacht); }
.kgjx .kgj-reken__fout { margin-top: 10px; font-size: 14px; color: #a3231a; }

/* ── bewijs onder de kop ── */
/* Vier punten onder elkaar: groot genoeg om te lezen op de foto, en geen
   punt dat halverwege afbreekt (in twee kolommen brak 'offerte' af). Het vinkje staat in een oranje
   bolletje met een donker vinkje, dat leest op elke foto. Mohammed: "die 4
   punten bij de hero moeten duidelijker". */
.kgj-hero__bewijs { margin-top: 26px; display: grid; grid-template-columns: 1fr; gap: 11px; }
.kgjx .kgj-hero__bewijs li { display: flex; align-items: center; gap: 11px;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 16px; font-weight: 700; line-height: 1.3;
  color: #fff; text-shadow: 0 1px 10px rgba(5, 11, 20, .55); }
.kgjx .kgj-hero__bewijs svg { flex: none; width: 26px; height: 26px; padding: 5px; border-radius: 999px;
  background: var(--accent); color: var(--merk-diep); stroke-width: 2.6; }
@media (max-width: 640px) {
  .kgj-hero__bewijs { gap: 10px; margin-top: 20px; }
  .kgjx .kgj-hero__bewijs li { font-size: 15px; }
}

/* ── keuze met een verduidelijking eronder (het btw-tarief) ── */
.kgjx .kgj-reken__keuze { display: flex; flex-direction: column; gap: 3px; }
.kgjx .kgj-reken__keuze strong { font-weight: 600; }
.kgjx .kgj-reken__keuze span { font-family: Lato, system-ui, sans-serif; font-size: 13px;
  font-weight: 400; color: var(--zacht); }
.kgjx .kgj-reken__keuze.is-aan span { color: var(--accent-diep); }

/* ── voor en na: één liggende foto ──
   De demo zet staande foto's naast elkaar in kolommen van 380px. AB heeft één
   liggend paar; in zo'n smalle kolom werd dat een postzegel. Eén kolom van
   maximaal 880px toont het dak op een leesbare maat. */
.kgjx .kgj-voorna .kgj-schuif { grid-template-columns: minmax(0, 880px); }

/* ── uitgevoerd werk: rustig raster, geen schuivende band ──
   De demo laat de realisaties vanzelf voorbijschuiven. Op een advertentie-
   pagina is dat een bewegend doel: je wil iets bekijken en het schuift weg.
   Hier staan de foto's stil in een raster; op een telefoon veeg je ze opzij. */
.kgj-werkraster { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
.kgjx .kgj-werkraster .kgj-tegel { width: auto; margin-right: 0; }
@media (max-width: 1000px) {
  .kgj-werkraster { grid-auto-flow: column; grid-auto-columns: 74%; grid-template-columns: none;
    overflow-x: auto; scroll-snap-type: x mandatory; gap: 14px;
    scrollbar-width: none; padding-bottom: 4px; }
  .kgj-werkraster::-webkit-scrollbar { display: none; }
  .kgjx .kgj-werkraster .kgj-tegel { scroll-snap-align: start; }
}

/* ── vaste actiebalk op de telefoon ──
   Waar de bezoeker ook staat, de volgende stap blijft in beeld. Alleen op een
   telefoon: op een groot scherm staat de calculator zelf al rechts naast de
   kop en zou een balk alleen ruimte innemen. */
.kgj-actiebalk { display: none; }
@media (max-width: 1000px) {
  .kgj-actiebalk.is-aan { position: fixed; left: 0; right: 0; bottom: 0; z-index: 80;
    display: flex; gap: 10px; padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, .96); border-top: 1px solid var(--lijn);
    backdrop-filter: blur(8px); }
  .kgjx .kgj-actiebalk .kgj-knop { flex: 1; justify-content: center; height: 50px; }
  .kgjx .kgj-actiebalk .kgj-knop--rand { flex: 0 0 64px; }
  /* Ruimte onder de voet, anders dekt de balk de laatste regels af. */
  .kgjx .kgj-voet--lp { padding-bottom: 96px; }
}

/* ── onderaan: de calculator in plaats van het formulier van de demo ── */
.kgjx .kgj-cta--lp .kgj-reken { box-shadow: 0 30px 70px -30px rgba(0, 0, 0, .7); }

/* ── voet: alleen wat wettelijk en praktisch moet ── */
/* Het logo van AB is navy met goud en valt weg op de donkere voet. Daar staat het
   in wit, zoals de demo er een lichte versie van zijn logo zet. */
.kgjx .kgj-voet__logo { filter: brightness(0) invert(1); }
.kgjx .kgj-voet--lp .kgj-voet__in { grid-template-columns: 1.4fr 1fr; }
.kgjx .kgj-voet--lp .kgj-voet__onder { display: flex; gap: 22px; flex-wrap: wrap; }
.kgjx .kgj-voet--lp .kgj-voet__onder a { text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 1000px) {
  .kgjx .kgj-hero--lp { min-height: 0; }
  .kgjx .kgj-hero--lp .kgj-hero__in { padding-block: 30px 40px; }
  .kgj-hero__raster { grid-template-columns: 1fr; gap: 22px; }
  .kgjx .kgj-hero__sub { font-size: 16px; margin-top: 12px; }
  .kgjx .kgj-hero__ondertitel { font-size: 18px; margin-top: 10px; }
  .kgjx .kgj-reken { padding: 20px 18px 18px; }
  .kgjx .kgj-reken__vraag { font-size: 19px; }
  .kgjx .kgj-kop--lp .kgj-kop__bel { display: inline-flex; height: 44px; padding: 0 16px; font-size: 14px; }
  .kgjx .kgj-kop--lp .kgj-kop__bel span { display: none; }
  .kgjx .kgj-hero--lp .kgj-hero__bediening, .kgjx .kgj-hero--lp .kgj-hero__streep { display: none; }
  .kgjx .kgj-voet--lp .kgj-voet__in { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .kgj-reken__rij { grid-template-columns: 1fr; gap: 0; }
  .kgjx .kgj-reken__keuze { min-height: 52px; padding: 10px 12px; font-size: 15px; }
}
/* ── werkwijze: vijf stappen op één rij ──
   De demo had er vier. Met Nazorg erbij zijn het er vijf; op een groot scherm
   blijven ze naast elkaar, zodat de golf één lijn blijft. Kleiner dan 1000px
   neemt de gegenereerde stijl het over (twee kolommen, dan één). */
@media (min-width: 1001px) {
  .kgjx .kgj-werkwijze .kgj-stappen { grid-template-columns: repeat(5, 1fr); gap: 22px; }
}

/* ── inspectieformulier: tweede weg naar de calculator ── */
.kgjx .kgj-reken__alt { display: block; margin-top: 14px; text-align: center;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 600; font-size: 14.5px;
  color: var(--merk); text-decoration: underline; text-underline-offset: 3px; }
.kgjx .kgj-reken__alt:hover { color: var(--accent-diep); }

/* ── de calculator in een venster ──
   Elke knop 'Bereken uw prijs' opent hem hier, op de plek waar de bezoeker
   is. Sluiten met het kruisje, met Escape of met een klik naast de kaart. */
.kgj-venster { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center;
  padding: 16px; background: rgba(5, 11, 20, .64); animation: kgj-venster-in .18s ease; }
.kgj-venster__in { position: relative; width: 100%; max-width: 460px; max-height: calc(100svh - 32px); overflow-y: auto; border-radius: var(--r-vak); }
.kgjx .kgj-venster__dicht { position: absolute; top: 14px; right: 14px; z-index: 1; width: 36px; height: 36px;
  display: grid; place-items: center; border: 0; border-radius: 999px; cursor: pointer;
  background: var(--merk-licht); color: var(--merk); font-size: 24px; line-height: 1; }
.kgjx .kgj-venster .kgj-reken__kop { padding-right: 46px; }
.kgjx .kgj-venster .kgj-reken { box-shadow: 0 30px 80px -24px rgba(0, 0, 0, .6); }
@keyframes kgj-venster-in { from { opacity: 0; } to { opacity: 1; } }

/* ── verzendknoppen in de formulieren: oranje ──
   De laatste knop van de calculator en die van de inspectie zijn de knoppen
   die een aanvraag maken. Ze krijgen de accentkleur, zodat ze de duidelijkste
   knop van hun kaart zijn. Donkere tekst op oranje: contrast 7,9 op 1. */
.kgjx .kgj-reken__knop { background: var(--accent); border-color: var(--accent); color: var(--merk-diep); }
.kgjx .kgj-reken__knop:hover { background: var(--accent-diep); border-color: var(--accent-diep); color: var(--merk-diep); }

/* ── slotblok: wat de gratis inspectie inhoudt ── */
.kgj-cta__punten { margin: 18px 0 26px; display: grid; gap: 11px; }
.kgjx .kgj-cta__punten li { display: flex; align-items: center; gap: 11px; color: #fff;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 16px; font-weight: 700; }
.kgjx .kgj-cta__punten svg { flex: none; width: 26px; height: 26px; padding: 5px; border-radius: 999px;
  background: var(--accent); color: var(--merk-diep); stroke-width: 2.6; }

@media (prefers-reduced-motion: reduce) {
  .kgj-reken__stap { animation: none; }
  .kgj-venster { animation: none; }
}
`;
