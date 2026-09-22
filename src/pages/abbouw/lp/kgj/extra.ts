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
.kgjx .kgj-hero--lp h1 { max-width: 14ch; }
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
/* Vijf keuzes: de laatste over de volle breedte, anders blijft er een gat. */
.kgj-reken__keuzes--vijf .kgj-reken__keuze:last-child { grid-column: 1 / -1; }
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

/* ── voor en na: één liggende foto ──
   De demo zet staande foto's naast elkaar in kolommen van 380px. AB heeft één
   liggend paar; in zo'n smalle kolom werd dat een postzegel. Eén kolom van
   maximaal 880px toont het dak op een leesbare maat. */
.kgjx .kgj-voorna .kgj-schuif { grid-template-columns: minmax(0, 880px); }

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
@media (prefers-reduced-motion: reduce) {
  .kgj-reken__stap { animation: none; }
}
`;
