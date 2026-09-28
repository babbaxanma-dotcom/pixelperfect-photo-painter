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
.kgjx .kgj-reken__vraag { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; font-size: 18px;
  line-height: 1.25; color: var(--kop); margin-bottom: 16px; letter-spacing: -.015em; }
/* minmax(0, 1fr): een kolom groeit nooit breder dan de kaart, ook niet bij een lang
   woord (26 sep: "De benedenverdieping" duwde de rechterkolom buiten de kaart). */
.kgj-reken__keuzes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.kgjx .kgj-reken__keuze .kgj-reken__tekst strong { overflow-wrap: break-word; }
/* Oneven aantal keuzes: de laatste over de volle breedte, anders blijft er een gat. */
.kgj-reken__keuzes--oneven .kgj-reken__keuze:last-child { grid-column: 1 / -1; }
.kgjx .kgj-reken__keuze { min-height: 56px; padding: 12px 16px; text-align: left; cursor: pointer;
  background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r); color: var(--inkt);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 600; font-size: 15.5px; line-height: 1.3;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease; }
/* Hover alleen met een echte muis. Op een telefoon blijft :hover na een tik
   hangen op die plek, en het antwoord dat bij de volgende vraag daar staat,
   leek dan al gekozen (Mohammed, 25 sep: "1 ding is altijd geselecteerd voor
   het klikken ... zeker op telefoon"). */
.kgjx .kgj-reken__keuze { -webkit-tap-highlight-color: transparent; }
@media (hover: hover) and (pointer: fine) {
  .kgjx .kgj-reken__keuze:hover { border-color: var(--merk); box-shadow: 0 0 0 1px var(--merk); }
  .kgjx .kgj-reken__keuze:hover .kgj-reken__icoon { background: var(--accent); color: var(--merk-diep); }
}
/* Druktoestand: zodra de vinger het antwoord raakt (is-druk, gezet bij
   pointerdown in Rekenaar.tsx), kleurt het goud (rand, vlak en icoon) en zakt
   het een fractie in. Bij het loslaten volgt meteen de volgende vraag. Geen
   overgang: de feedback moet er meteen staan. De grijze tikgloed van de browser
   zelf gaat uit, die vervangt dit. Staat na :hover, zodat drukken met de muis
   ook goud geeft. */
.kgjx .kgj-reken__keuze.is-druk, .kgjx .kgj-reken__keuze:active { border-color: var(--accent); background: var(--accent-licht);
  box-shadow: 0 0 0 2px var(--accent); transform: scale(.985); transition: none; }
.kgjx .kgj-reken__keuze.is-druk .kgj-reken__icoon, .kgjx .kgj-reken__keuze:active .kgj-reken__icoon {
  background: var(--accent); color: var(--merk-diep); transition: none; }
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
/* Keuzelijsten onder de verplichte velden (totaalrenovatie): zelfde veld als de
   invoer, met een eigen pijltje; 16px zodat een iPhone niet inzoomt. Altijd
   onder elkaar: het formulier onderaan is ook op desktop smal. */
.kgjx .kgj-reken__rij--extra { grid-template-columns: 1fr; gap: 0; }
.kgjx .kgj-reken__form select { display: block; width: 100%; margin-top: 6px; padding: 13px 38px 13px 13px;
  font-family: Lato, system-ui, sans-serif; font-size: 16px; font-weight: 400; color: var(--inkt);
  background: var(--wit) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%230a1628' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center;
  border: 1px solid var(--lijn); border-radius: var(--r); -webkit-appearance: none; appearance: none; cursor: pointer; }
.kgjx .kgj-reken__form select:focus { outline: 2px solid var(--merk); outline-offset: 1px; border-color: var(--merk); }
.kgjx .kgj-reken__form select:invalid, .kgjx .kgj-reken__form select option[value=""] { color: var(--zacht); }
.kgjx .kgj-reken__knop { width: 100%; margin-top: 4px; }
.kgjx .kgj-reken__gerust { margin-top: 10px; font-size: 13.5px; color: var(--zacht); }
.kgjx .kgj-reken__fout { margin-top: 10px; font-size: 14px; color: #a3231a; }
/* ── postcode of gemeente: voorstellen onder het veld ──
   Rijen van 44px zodat ze met een duim te raken zijn; de lijst ligt boven de
   rest van het formulier en schuift niets opzij. */
.kgjx .kgj-pg { position: relative; }
.kgjx .kgj-pg__lijst { position: absolute; left: 0; right: 0; top: 100%; z-index: 20; margin: 4px 0 0; padding: 4px;
  list-style: none; background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r);
  box-shadow: 0 16px 36px -14px rgba(5, 11, 20, .35); max-height: 264px; overflow-y: auto; }
.kgjx .kgj-pg__lijst li { display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 10px;
  border-radius: calc(var(--r) - 2px); cursor: pointer; font-family: Lato, system-ui, sans-serif; font-size: 15px;
  font-weight: 400; color: var(--inkt); }
.kgjx .kgj-pg__lijst li b { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; color: var(--merk); min-width: 40px; }
.kgjx .kgj-pg__lijst li.is-aan { background: var(--accent-licht); }
@media (hover: hover) and (pointer: fine) { .kgjx .kgj-pg__lijst li:hover { background: var(--accent-licht); } }
/* Kruisje rechts in het veld (44px raakvlak) en de bevestiging van de gevonden
   gemeente onder het veld (Mohammed 25 sep: wissen op telefoon, geen
   automatische vervanging tijdens het typen). */
.kgjx .kgj-pg__veld { position: relative; display: block; }
.kgjx .kgj-pg__veld input { padding-right: 48px; }
.kgjx .kgj-pg__wis { position: absolute; right: 2px; top: calc(50% + 3px); transform: translateY(-50%);
  display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; background: none;
  color: var(--tekst); cursor: pointer; -webkit-tap-highlight-color: transparent; }
.kgjx .kgj-pg__wis svg { width: 18px; height: 18px; }
.kgjx .kgj-pg__ok { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-family: Lato, system-ui, sans-serif;
  font-size: 14.5px; font-weight: 400; color: var(--merk); }
.kgjx .kgj-pg__ok svg { width: 16px; height: 16px; color: var(--accent-diep); stroke-width: 2.6; }

/* AVG-regel onder de formulieren: klein en rustig, zelfde grijs als de rest. */
.kgjx .kgj-reken__privacy { margin: 10px 0 0; font-family: Lato, system-ui, sans-serif; font-size: 12.5px;
  line-height: 1.45; color: var(--zacht); }
.kgjx .kgj-reken__privacy a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }

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

/* ── foto boven de keuze (vraag 1: hellend of plat dak) ──
   Mohammed, 23 sep: bij pannendak en plat dak een bijpassende foto. De foto
   loopt tot de rand van de knop; de negatieve marge heft de binnenruimte op. */
.kgjx .kgj-reken__foto { display: block; width: calc(100% + 32px); max-width: none; margin: -12px -16px 8px;
  aspect-ratio: 16 / 9; height: auto; object-fit: cover;
  border-radius: calc(var(--r) - 1px) calc(var(--r) - 1px) 0 0; }
@media (max-width: 420px) {
  .kgjx .kgj-reken__foto { width: calc(100% + 24px); margin: -10px -12px 8px; }
}

/* ── kaartkop: wat dit is, en de weg van het huis naar de prijs ──
   Mohammed, 24 sep: "duidelijker voor de bezoeker een calculator", met
   Airadvisor als referentie. De titel zegt wat de kaart doet en hoe lang het
   duurt; de balk loopt van een huisje naar het eurosymbool, dat oplicht bij de
   laatste stap. Onderaan de kaart de geruststelling, op elke stap. */
.kgj-reken__hoofd { display: flex; align-items: center; gap: 12px; margin: 0 0 16px; }
.kgjx .kgj-reken__logo { flex: none; display: grid; place-items: center; width: 44px; height: 44px;
  border-radius: 12px; background: var(--merk); color: var(--accent); }
.kgjx .kgj-reken__logo svg { width: 24px; height: 24px; }
.kgjx .kgj-reken__titel { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 800; font-size: 21px;
  line-height: 1.15; letter-spacing: -.02em; color: var(--kop); margin: 0; }
/* Tekst in navy: oranje op wit haalde 3,76:1, AA eist 4,5:1 (check-contrast, 24 sep).
   Het klokje mag oranje blijven, een icoon heeft 3:1 nodig. */
.kgjx .kgj-reken__tijd { display: flex; align-items: center; gap: 6px; margin: 3px 0 0;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 13.5px; font-weight: 600; color: var(--merk); }
.kgjx .kgj-reken__tijd svg { width: 15px; height: 15px; color: var(--accent-diep); }

/* ── melding na een antwoord (de 6% btw na "Hoe oud is uw dak?") ──
   Klein, onder de keuzes, in een rustig groen vlak: goed nieuws dat de
   bezoeker verder laat klikken, zoals grote formulierbouwers dat doen. */
.kgjx .kgj-reken__tip { display: flex; align-items: flex-start; gap: 9px; margin: 12px 0 0; padding: 10px 12px;
  border-radius: var(--r); background: #edf7ef; border: 1px solid #cfe9d5; color: #1d5632;
  font-family: Lato, system-ui, sans-serif; font-size: 14px; line-height: 1.4; animation: kgj-tip-in .35s ease both; }
.kgjx .kgj-reken__tip svg { flex: none; width: 18px; height: 18px; margin-top: 1px; color: #23703f; }
@keyframes kgj-tip-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .kgjx .kgj-reken__tip { animation: none; } }

/* ── iconen bij de antwoorden ──
   Mohammed, 24 sep: "maak super mooie en duidelijke iconen en voeg iconen toe
   in de vragen". Icoon links in een zacht vlak, label ernaast: de knop blijft
   even hoog als zonder icoon, dus vraag 3 met vijf antwoorden past nog. */
.kgjx .kgj-reken__keuze--icoon { flex-direction: row; align-items: center; gap: 10px; padding-left: 12px; }
.kgjx .kgj-reken__icoon { flex: none; display: grid; place-items: center; width: 36px; height: 36px;
  border-radius: 10px; background: var(--accent-licht); color: var(--accent-diep);
  transition: background .15s ease, color .15s ease; }
.kgjx .kgj-reken__icoon svg { width: 22px; height: 22px; }
.kgjx .kgj-reken__keuze.is-aan .kgj-reken__icoon { background: var(--accent); color: var(--merk-diep); }
.kgjx .kgj-reken__keuze .kgj-reken__tekst { display: flex; flex-direction: column; gap: 3px; min-width: 0;
  font: inherit; color: inherit; }
.kgjx .kgj-reken__keuze.is-aan .kgj-reken__tekst { color: inherit; }
/* Op een telefoon staan antwoorden met een icoon onder elkaar: in twee smalle
   kolommen brak "Vlakke pannen of leien" over drie regels. */
@media (max-width: 560px) {
  .kgj-reken__keuzes:has(.kgj-reken__keuze--icoon) { grid-template-columns: 1fr; gap: 8px; }
  .kgjx .kgj-reken__keuze--icoon { min-height: 54px; }
  /* Vraag met vier korte antwoorden (raster: true in inhoud): twee tegels naast
     elkaar, icoon boven het label, zodat alle antwoorden van vraag 1 boven de
     vouw staan (totaalrenovatie, 26 sep). */
  .kgjx .kgj-reken__keuzes--raster { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kgjx .kgj-reken__keuzes--raster .kgj-reken__keuze--icoon { flex-direction: column; justify-content: center;
    gap: 6px; padding: 12px 8px; text-align: center; min-height: 92px; }
}
.kgj-reken__weg { display: flex; align-items: center; gap: 10px; }
.kgjx .kgj-reken__weg .kgj-reken__balk { flex: 1; margin: 0; height: 6px; border-radius: 3px; }
.kgjx .kgj-reken__begin { flex: none; width: 20px; height: 20px; color: var(--merk); }
.kgjx .kgj-reken__eind { flex: none; display: inline-grid; place-items: center; width: 26px; height: 26px;
  border-radius: 999px; border: 1.5px solid var(--accent); background: var(--accent-licht); color: var(--merk);
  font: 700 13px/1 "Plus Jakarta Sans", system-ui, sans-serif;
  transition: background .2s ease, border-color .2s ease, color .2s ease; }
.kgjx .kgj-reken__eind.is-aan { background: var(--accent); border-color: var(--accent); color: var(--merk-diep); }
.kgjx .kgj-reken__weg + .kgj-reken__kop { min-height: 0; margin: 8px 0 12px; }
.kgjx .kgj-reken__zeker { display: flex; align-items: center; gap: 7px; margin: 16px 0 0; padding-top: 12px;
  border-top: 1px solid var(--lijn); font-family: Lato, system-ui, sans-serif; font-size: 13.5px; color: var(--zacht); }
.kgjx .kgj-reken__zeker svg { flex: none; width: 16px; height: 16px; color: var(--merk); }
/* Geen los woord op de laatste regel ("prijs.", "15°"). */
.kgjx .kgj-hero__sub, .kgjx .kgj-reken__keuze span { text-wrap: pretty; }

/* ── onze diensten: vier diensten met een icoon ──
   Mohammed, 25 sep: "korte diensten sectie, diensten met mooie iconen gewoon,
   naam, en de nodige tekst", daarna "betere clean iconen en graag lichte iconen
   niet zwarte". Eigen dienst-iconen met een dunnere lijn, goud op een licht
   goudvlak (contrast 3,3:1, boven de 3:1 voor grafische elementen).
   scroll-margin houdt de kaart vrij van de vaste kop als een sitelink ernaartoe
   springt. */
.kgj-dienstraster { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; list-style: none; margin: 0; padding: 0; }
.kgjx .kgj-dienst { scroll-margin-top: 110px; padding: 26px 22px 24px; background: var(--wit);
  border: 1px solid var(--lijn); border-radius: var(--r); }
.kgjx .kgj-dienst__icoon { display: grid; place-items: center; width: 56px; height: 56px; margin-bottom: 18px;
  border-radius: 14px; background: var(--accent-licht); color: var(--accent-diep); }
.kgjx .kgj-dienst__icoon svg { width: 30px; height: 30px; stroke-width: 1.75; }
.kgjx .kgj-dienst h3 { margin: 0 0 8px; font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 19px;
  font-weight: 700; line-height: 1.25; color: var(--kop); }
.kgjx .kgj-dienst p { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--tekst); }
.kgjx .kgj-diensten .kgj-kopblok { margin-bottom: 34px; }
@media (max-width: 1000px) { .kgj-dienstraster { grid-template-columns: repeat(2, 1fr); gap: 14px; } }
@media (max-width: 560px) {
  .kgj-dienstraster { grid-template-columns: 1fr; gap: 12px; }
  .kgjx .kgj-dienst { display: grid; grid-template-columns: 48px 1fr; column-gap: 14px; padding: 18px 16px; }
  .kgjx .kgj-dienst__icoon { grid-row: span 2; width: 48px; height: 48px; margin: 0; border-radius: 12px; }
  .kgjx .kgj-dienst__icoon svg { width: 26px; height: 26px; }
  .kgjx .kgj-dienst h3 { font-size: 17px; margin-bottom: 4px; }
  .kgjx .kgj-dienst p { font-size: 15px; }
}

/* ── onze diensten, kort: alleen icoon en naam (totaalrenovatie, 27 sep) ──
   Mohammed: "simpel, zonder al te veel tekst, die 6 afdelingen". Drie kolommen
   op desktop, één kolom op de telefoon; icoon en naam naast elkaar. */
.kgjx .kgj-diensten .kgj-kopblok p { max-width: 60ch; margin: 12px auto 0; }
.kgj-dienstraster--kort { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.kgjx .kgj-dienstraster--kort .kgj-dienst { display: flex; align-items: center; gap: 16px; padding: 18px 20px; }
.kgjx .kgj-dienstraster--kort .kgj-dienst__icoon { flex: none; width: 52px; height: 52px; margin: 0; border-radius: 12px; }
.kgjx .kgj-dienstraster--kort .kgj-dienst__icoon svg { width: 28px; height: 28px; }
.kgjx .kgj-dienstraster--kort .kgj-dienst h3 { margin: 0; font-size: 18px; }
@media (max-width: 1000px) { .kgj-dienstraster--kort { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) {
  .kgj-dienstraster--kort { grid-template-columns: 1fr; gap: 10px; }
  .kgjx .kgj-dienstraster--kort .kgj-dienst { padding: 14px 16px; }
  .kgjx .kgj-dienstraster--kort .kgj-dienst__icoon { width: 44px; height: 44px; }
  .kgjx .kgj-dienstraster--kort .kgj-dienst__icoon svg { width: 24px; height: 24px; }
  .kgjx .kgj-dienstraster--kort .kgj-dienst h3 { font-size: 16.5px; }
}

/* ── voordelen van dakrenovatie: drie kaarten met een ronde, gekleurde bol ──
   Mohammed, 26 sep: "iconen, graag in bolvorm en met verschillende bijpassende
   kleuren", "bij elk bolletje een korte uitleg". 27 sep: de glanzende bollen
   oogden "te tech achtig" en de tekst eronder "asymmetrisch, alsof het daar
   gewoon is gegooid". Nu: een vlakke, lichte bol met het icoon in kleur (zoals
   de dienst-iconen), drie even hoge kaarten, tekst links uitgelijnd. De bol
   staat naast de titel: die kop is in elke kaart 60px hoog, ook als de titel
   twee regels telt, zodat de uitleg overal op dezelfde hoogte begint.
   Icoon op bol: oranje 4,19:1, blauw 5,16:1, groen 4,52:1 (minimum 3:1). */
.kgj-voordeelraster { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; list-style: none; margin: 0; padding: 0; }
.kgjx .kgj-voordelen .kgj-kopblok { margin-bottom: 34px; }
.kgjx .kgj-voordeel { display: grid; grid-template-columns: 60px minmax(0, 1fr); grid-template-areas: "bol titel" "tekst tekst";
  column-gap: 16px; row-gap: 16px; align-items: center; align-content: start; padding: 26px 26px 28px;
  background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r-vak); text-align: left; }
.kgjx .kgj-voordeel__bol { grid-area: bol; display: grid; place-items: center; width: 60px; height: 60px; margin: 0;
  border-radius: 50%; background: var(--bol-licht); color: var(--bol); }
.kgjx .kgj-voordeel__bol svg { width: 30px; height: 30px; stroke-width: 1.75; }
.kgjx .kgj-voordeel--oranje { --bol: #b9531a; --bol-licht: #fcebdd; }
.kgjx .kgj-voordeel--blauw { --bol: #2a63a6; --bol-licht: #e3edf8; }
.kgjx .kgj-voordeel--groen { --bol: #1f7a52; --bol-licht: #e0f1e8; }
.kgjx .kgj-voordeel h3 { grid-area: titel; margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 19px;
  font-weight: 700; line-height: 1.3; color: var(--kop); }
.kgjx .kgj-voordeel p { grid-area: tekst; align-self: start; margin: 0; font-size: 15.5px; line-height: 1.6; color: var(--tekst); }
@media (max-width: 760px) {
  .kgj-voordeelraster { grid-template-columns: 1fr; gap: 12px; }
  .kgjx .kgj-voordelen .kgj-kopblok { margin-bottom: 24px; }
  .kgjx .kgj-voordeel { grid-template-columns: 52px minmax(0, 1fr); grid-template-areas: "bol titel" "bol tekst";
    column-gap: 14px; row-gap: 4px; align-items: start; padding: 18px 16px; }
  .kgjx .kgj-voordeel__bol { width: 52px; height: 52px; }
  .kgjx .kgj-voordeel__bol svg { width: 26px; height: 26px; }
  .kgjx .kgj-voordeel h3 { font-size: 17px; margin-top: 2px; }
  .kgjx .kgj-voordeel p { font-size: 15px; }
}

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

/* ── uitgevoerd werk: het doorlopende spoor van de homepage (totaalrenovatie, 28 sep) ──
   Mohammed: "zonder de namen", "op de manier van de home page", "zo dat het
   horizontaal doorloopt". Maten letterlijk uit replica/stijl.ts (.pc-werk-*,
   .pc-bediening): vierkante tegels van 309px, 24px tussenruimte, 14px afronding,
   in een baan van 974px (--pc-container), dus drie tegels in beeld zoals op de
   homepage. Onder 1000px een tegel van 78% met een streep van de volgende
   ernaast: het teken dat er zijwaarts meer staat. position: relative maakt het
   spoor de offsetParent van de tegels (zie Werkspoor.tsx). */
.kgj-werkspoor { max-width: 974px; margin: 0 auto; }
.kgj-werkspoor__spoor { position: relative; display: flex; gap: 24px; overflow-x: auto;
  scroll-behavior: smooth; scrollbar-width: none; padding-bottom: 4px; }
.kgj-werkspoor__spoor::-webkit-scrollbar { display: none; }
.kgjx .kgj-werkspoor__foto { flex: 0 0 309px; margin: 0; }
.kgjx .kgj-werkspoor__foto img { width: 100%; aspect-ratio: 1 / 1; height: auto; object-fit: cover;
  border-radius: 14px; display: block; }
/* De vullijn: vier seconden vol, dan schuift het spoor een tegel op. */
.kgj-werkspoor__lijn { height: 3px; border-radius: 999px; background: rgba(10, 22, 40, .10);
  margin-top: 22px; overflow: hidden; }
.kgj-werkspoor__vul { display: block; height: 100%; width: 100%; border-radius: inherit;
  background: var(--accent); transform-origin: left center;
  animation: kgj-werkspoor-vullen 4s linear infinite; }
.kgj-werkspoor__vul--stil { animation-play-state: paused; }
@keyframes kgj-werkspoor-vullen { from { transform: scaleX(0); } to { transform: scaleX(1); } }
/* De pijlen: Bediening uit replica/Onderdelen.tsx, met de maten van .pc-bediening. */
.kgjx .kgj-werkspoor .pc-bediening { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 28px; }
.kgjx .kgj-werkspoor .pc-bediening button { width: 44px; height: 44px; border-radius: 50%; background: #fff;
  display: grid; place-items: center; color: var(--kop); flex: 0 0 auto; border: 0; padding: 0; cursor: pointer;
  box-shadow: inset 0 0 0 1px #dddddd;
  transition: background-color .18s ease, color .18s ease, opacity .18s ease; }
.kgjx .kgj-werkspoor .pc-bediening button:hover { background: var(--accent); color: var(--merk); box-shadow: none; }
.kgjx .kgj-werkspoor .pc-bediening button:focus-visible { outline: 3px solid var(--merk); outline-offset: 3px; }
@media (max-width: 1000px) {
  .kgj-werkspoor__spoor { gap: 12px; padding-right: 40px; }
  .kgjx .kgj-werkspoor__foto { flex: 0 0 78%; }
  .kgj-werkspoor__lijn { margin-top: 16px; }
  .kgjx .kgj-werkspoor .pc-bediening { margin-top: 20px; gap: 12px; }
}
@media (prefers-reduced-motion: reduce) { .kgj-werkspoor__lijn { display: none; } }

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
  .kgjx .kgj-reken__vraag { font-size: 17px; }
  .kgjx .kgj-reken__titel { font-size: 20px; }
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

/* ── inspectieformulier met keuzelijsten (totaalrenovatie) ──
   Mohammed, 28 sep: het blok "Plan uw plaatsbezoek" is "te groot" en op de
   telefoon "de knop is er niet". Zes velden van 93px zetten de knop 651px onder
   de kop: meer dan een iPhone met Safari-balken (664px) onder de vaste kop toont.
   Lagere velden en minder lucht tussen label en veld: kop en knop staan samen
   in beeld. Dakwerken (drie velden, 372px) blijft zoals het is. Velden 46px
   (duimmaat 44) en 16px tekst, zodat een iPhone niet inzoomt. */
.kgjx .kgj-reken--extra .kgj-reken__vraag { margin-bottom: 12px; }
.kgjx .kgj-reken--extra .kgj-reken__form label { margin-bottom: 10px; line-height: 1.3; }
.kgjx .kgj-reken--extra .kgj-reken__form input,
.kgjx .kgj-reken--extra .kgj-reken__form select { margin-top: 4px; padding-top: 10px; padding-bottom: 10px; line-height: 24px; }
.kgjx .kgj-reken--extra .kgj-pg__wis { top: calc(50% + 2px); }
/* De knoptekst "Vraag uw gratis plaatsbezoek aan" is 254px, 4px breder dan die
   van dakwerken: met 29px zijmarge brak "aan" op 390px af naar een tweede regel. */
.kgjx .kgj-reken--inspectie .kgj-reken__knop { padding-inline: 16px; }

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
