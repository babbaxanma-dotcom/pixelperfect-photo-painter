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
/* 4 okt: belknop goud (#E59819), donkere tekst (contrast 8,4:1). Op de computer het nummer,
   op de telefoon "Bel direct". */
.kgjx .kgj-kop--lp .kgj-kop__bel { background: #e59819; border-color: #e59819; color: var(--merk-diep); }
.kgjx .kgj-kop--lp .kgj-kop__bel:hover { background: #cf8812; border-color: #cf8812; color: var(--merk-diep); }
.kgjx .kgj-kop--lp .kgj-kop__bel-kort { display: none; }
/* De vinkjes onder de rekenaar bestaan alleen op telefoon en tablet. */
.kgjx .kgj-hero__vertrouwen { display: none; }
/* 4 okt, plan desktop-hero totaalrenovatie: een gekozen kaart krijgt een gouden rand (#E59819)
   en een lichte gloed. */
/* Telefoon (totaalrenovatie): geen kaarttitel, zoals op dakwerken; de kop en subkop zeggen het al.
   Met de subkop eindigde het laatste antwoord van vraag 1 op 857 van 844 px (check-lp-reno). */
@media (max-width: 640px) { .kgjx.kgj-lp--totaalrenovatie .kgj-reken--hero .kgj-reken__hoofd { display: none; } }
.kgjx.kgj-lp--totaalrenovatie .kgj-reken__keuze.is-aan { border-color: #e59819;
  box-shadow: 0 0 0 1px #e59819, 0 0 0 6px rgba(229, 152, 25, .16); background: #fdf6ea; }

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
.kgjx .kgj-reken { overflow-anchor: none; background: var(--wit); color: var(--inkt); border-radius: var(--r-vak);
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

/* ── afvinkvraag (totaalrenovatie, vraag 2) ──
   Twee kolommen vakjes met een echt vinkje links; "Alles" over de volle breedte
   bovenaan. Aangevinkt = hetzelfde goud als een gekozen antwoord. */
.kgjx .kgj-reken__vraag--vink { margin-bottom: 4px; }
.kgjx .kgj-reken__meer { margin: 0 0 14px; font-size: 13.5px; color: var(--zacht); }
.kgjx .kgj-reken__vinken { display: block; }
.kgjx .kgj-reken__vink.kgj-reken__vink--alles { width: 100%; min-height: 54px; }
/* Onder Alles: twee korte groepen ronde knopjes die naast elkaar doorlopen
   (28 sep: "tis nu allemaal vakjes overwhelming"). */
.kgjx .kgj-reken__groep { margin-top: 14px; }
.kgjx .kgj-reken__groepnaam { margin: 0 0 8px; font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 13px;
  font-weight: 700; color: var(--zacht); }
.kgjx .kgj-reken__chips { display: flex; flex-wrap: wrap; gap: 8px; }
.kgjx .kgj-reken__vink.kgj-reken__vink--chip { min-height: 40px; padding: 8px 14px 8px 11px; gap: 6px; border-radius: 999px; font-size: 14px; }
.kgjx .kgj-reken__vink--chip svg { flex: none; width: 16px; height: 16px; stroke-width: 2.4; color: var(--zacht); }
.kgjx .kgj-reken__vink--chip.is-aan svg { color: var(--merk-diep); stroke-width: 3; }
.kgjx .kgj-reken__vink { display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 10px 12px;
  text-align: left; cursor: pointer; background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r);
  color: var(--inkt); font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 600; font-size: 14.5px;
  line-height: 1.25; overflow-wrap: break-word; -webkit-tap-highlight-color: transparent;
  transition: border-color .15s ease, box-shadow .15s ease, background .15s ease; }
.kgjx .kgj-reken__vink--alles { grid-column: 1 / -1; font-weight: 700; font-size: 15.5px; }
.kgjx .kgj-reken__vakje { flex: none; display: grid; place-items: center; width: 20px; height: 20px;
  border: 1.5px solid #b9bdc4; border-radius: 4px; background: var(--wit); color: transparent;
  transition: background .12s ease, border-color .12s ease; }
.kgjx .kgj-reken__vakje svg { width: 14px; height: 14px; stroke-width: 3.2; }
@media (hover: hover) and (pointer: fine) {
  .kgjx .kgj-reken__vink:hover { border-color: var(--merk); box-shadow: 0 0 0 1px var(--merk); }
}
.kgjx .kgj-reken__vink.is-aan { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); background: var(--accent-licht); }
.kgjx .kgj-reken__vink.is-aan .kgj-reken__vakje { background: var(--accent); border-color: var(--accent); color: var(--merk-diep); }
.kgjx .kgj-reken__vink:focus-visible { outline: 3px solid var(--merk); outline-offset: 2px; }
.kgjx .kgj-reken__verder { width: 100%; height: 54px; margin-top: 14px; gap: 10px; border-radius: 12px; font-size: 16px; }
.kgjx .kgj-reken__verder svg { width: 18px; height: 18px; }
.kgjx .kgj-reken__verder:disabled { background: #eef0f3; border-color: #eef0f3; color: var(--zacht); cursor: default; box-shadow: none; }

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
/* ── laatste stap: vervaagde richtprijs met slot ──
   Bovenaan de stap, groot en zacht vervaagd. Het slot staat in het midden van
   het bedrag. Geen echte cijfers in de bron (zie Rekenaar.tsx). */
.kgjx .kgj-reken__richt { position: relative; display: grid; place-items: center; height: 88px; margin: 0 0 8px;
  border-radius: 12px; background: radial-gradient(120% 140% at 50% 0%, #16294a 0%, var(--merk) 55%, var(--merk-diep) 100%);
  overflow: hidden; user-select: none; }
.kgjx .kgj-reken__richt-bedrag { display: inline-flex; align-items: baseline; gap: 10px;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 28px; font-weight: 800; line-height: 1;
  letter-spacing: .5px; white-space: nowrap; }
.kgjx .kgj-reken__richt-euro { color: var(--accent); }
.kgjx .kgj-reken__richt-cijfers { color: #fff; filter: blur(7px); opacity: .85; }
.kgjx .kgj-reken__slot { position: absolute; inset: 0; margin: auto; width: 44px; height: 44px; display: grid;
  place-items: center; border-radius: 999px; background: var(--accent); color: var(--merk-diep);
  box-shadow: 0 0 0 6px rgba(217, 140, 3, .18), 0 8px 20px -6px rgba(0, 0, 0, .5); }
.kgjx .kgj-reken__slot svg { width: 20px; height: 20px; stroke-width: 2.4; }
.kgjx .kgj-reken__vraag--richt { margin-bottom: 16px; text-align: center; }
.kgjx .kgj-reken__richt-onder { margin: 0 0 18px; text-align: center; font-size: 13.5px; color: var(--zacht); }
@media (max-width: 420px) { .kgjx .kgj-reken__richt-bedrag { font-size: 22px; gap: 8px; } }

/* ── drie zekerheden net boven de knop ── */
/* Het puntje onder de keuzes van een gewone vraag (startvraag, 1 okt). */
.kgjx .kgj-reken__troeven.kgj-reken__troeven--vraag { margin: 18px 0 2px; }
.kgjx .kgj-reken__troeven { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; margin: 6px 0 14px;
  padding: 0; list-style: none; }
.kgjx .kgj-reken__troeven li { display: inline-flex; align-items: center; gap: 6px; font-family: "Plus Jakarta Sans",
  system-ui, sans-serif; font-size: 13.5px; font-weight: 700; color: var(--inkt); }
.kgjx .kgj-reken__troeven svg { flex: none; width: 16px; height: 16px; padding: 2px; border-radius: 999px;
  background: var(--accent); color: var(--merk-diep); stroke-width: 3; }

/* ── verzendknop van de rekenaar: groter, ronder, met pijl ── */
.kgjx .kgj-reken__knop--richt { height: 58px; gap: 10px; border-radius: 12px; font-size: 17px;
  box-shadow: 0 12px 24px -12px rgba(184, 117, 2, .8); transition: background .18s ease, transform .18s ease; }
.kgjx .kgj-reken__knop--richt svg { width: 20px; height: 20px; transition: transform .18s ease; }
.kgjx .kgj-reken__knop--richt:hover svg { transform: translateX(3px); }
.kgjx .kgj-reken__knop--richt:active { transform: translateY(1px); }
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
/* 4 okt: USP's als "Titel: uitleg" (totaalrenovatie): titel vet, uitleg gewoon, vinkje bij de eerste regel. */
.kgjx .kgj-hero__bewijs li:has(strong), .kgjx .kgj-hero__vertrouwen li:has(strong) { align-items: flex-start; font-weight: 500; }
.kgjx .kgj-hero__bewijs strong, .kgjx .kgj-hero__vertrouwen strong { font-weight: 800; }
.kgjx .kgj-hero__bewijs li:has(strong) svg { margin-top: -2px; }
/* Telefoon en tablet (totaalrenovatie): de USP's onder de rekenaar, zodat de kaart boven de vouw staat. */
@media (max-width: 1000px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero__bewijs { display: none; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero__vertrouwen { display: grid; gap: 10px; margin: 16px 2px 0; padding: 0; list-style: none; }
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
/* Trust signals onderaan de rekenaar (4 okt): onder elkaar, links uitgelijnd, elk op één regel.
   Vier gecentreerde regels "ziet er niet uit" (Mohammed); een 2x2-raster brak de teksten over
   2 tot 3 regels af. */
.kgjx .kgj-reken__vertrouwen { display: grid; gap: 8px; margin: 16px 0 0; padding: 14px 0 0; list-style: none;
  border-top: 1px solid var(--lijn); }
.kgjx .kgj-reken__vertrouwen li { display: flex; align-items: flex-start; gap: 8px; font-family: "Plus Jakarta Sans",
  system-ui, sans-serif; font-size: 13px; font-weight: 600; line-height: 1.35; color: var(--inkt); text-align: left; }
.kgjx .kgj-reken__vertrouwen svg { flex: none; width: 16px; height: 16px; margin-top: 1px; padding: 2px; border-radius: 999px;
  background: var(--accent); color: var(--merk-diep); stroke-width: 3; }
/* "2 minuten" in de kop (4 okt): helder goud met een getekende streep eronder; de twee woorden
   breken nooit uit elkaar ("2" stond op de telefoon alleen op de eerste regel). */
.kgjx .kgj-hero__accent { position: relative; display: inline-block; white-space: nowrap; color: #f5b432; }
.kgjx .kgj-hero__accent::after { content: ""; position: absolute; left: -1%; right: -1%; bottom: -0.16em; height: 0.3em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 24' preserveAspectRatio='none'%3E%3Cpath d='M4 17 C 46 7, 118 5, 196 12' fill='none' stroke='%23f5b432' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center / 100% 100%; pointer-events: none; }
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

/* ── onze diensten met foto (dakwerken, 2 okt) ──
   Mohammed: "nu zijn het gewoon zo lelijke vierkantjes op een scherm", "visueel
   mooier en beter, clean", "wees creatief". De conventie van de dienstkaarten op
   de homepage: foto boven, naam en uitleg eronder. Zonder kader: de foto draagt
   de kaart. Op de telefoon staat elke dienst als rij, een vierkante foto links,
   zodat de vier diensten in één scherm passen. */
.kgjx .kgj-dienstraster:has(.kgj-dienst--foto) { gap: 30px; }
.kgjx .kgj-dienst--foto { padding: 0; background: none; border: 0; border-radius: 0; }
.kgjx .kgj-dienst__foto { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; margin: 0 0 20px;
  border-radius: var(--r-vak); background: var(--band); }
.kgjx .kgj-dienst--foto h3 { font-size: 20px; }
/* 3 okt: de foto's zijn weg ("doe maar die twee fotos bij diensten ook weg"). Een
   dienst zonder foto krijgt op die plek een licht goudvlak met zijn icoon; zo
   blijft de kaart even groot. Icoon op vlak: 3,3:1 (minimum 3:1). */
.kgjx .kgj-dienst__foto--leeg { display: grid; place-items: center; background: var(--accent-licht); color: var(--accent-diep); }
.kgjx .kgj-dienst__foto--leeg svg { width: 64px; height: 64px; stroke-width: 1.4; }
@media (max-width: 1000px) {
  .kgjx .kgj-dienstraster:has(.kgj-dienst--foto) { gap: 32px 20px; }
  .kgjx .kgj-dienst__foto { aspect-ratio: 16 / 10; }
}
@media (max-width: 560px) {
  .kgjx .kgj-dienstraster:has(.kgj-dienst--foto) { gap: 0; }
  .kgjx .kgj-dienst--foto { display: grid; grid-template-columns: 104px minmax(0, 1fr); column-gap: 16px; align-items: center;
    padding: 16px 0; }
  .kgjx .kgj-dienst--foto + .kgj-dienst--foto { border-top: 1px solid var(--lijn); }
  .kgjx .kgj-dienst__foto { aspect-ratio: 1; margin: 0; border-radius: 10px; }
  .kgjx .kgj-dienst__foto--leeg svg { width: 40px; height: 40px; }
  .kgjx .kgj-dienst--foto h3 { font-size: 17px; margin-bottom: 4px; }
  .kgjx .kgj-dienst--foto p { font-size: 14.5px; line-height: 1.5; }
}

/* ── voordelen van dakrenovatie: een donkere band met drie kolommen ──
   Mohammed, 26 sep: "iconen, graag in bolvorm en met verschillende bijpassende
   kleuren", "bij elk bolletje een korte uitleg". 27 sep: de tekst onder de bol
   stond "asymmetrisch, alsof het daar gewoon is gegooid". 2 okt: de drie witte
   kaarten waren "gewoon zo lelijke vierkantjes op een scherm" ("clean", "wees
   creatief"). Nu: de band zelf is donkerblauw en de kaarten zijn weg; dunne
   lijnen scheiden drie kolommen. De bollen en hun drie kleuren blijven, getint
   op het donker. Een subgrid zet titel en uitleg in elke kolom op dezelfde
   hoogte, ook als één titel twee regels telt: de titel staat onderaan zijn rij,
   tegen zijn uitleg.
   Contrast op #0a1628: titel 18,1:1, uitleg 10,2:1; icoon op bol: oranje 7,2:1,
   blauw 7,4:1, groen 8,0:1. */
.kgjx .kgj-voordelen { background: var(--merk); }
.kgjx .kgj-voordelen .kgj-kopblok h2 { color: var(--wit); }
.kgjx .kgj-voordelen .kgj-kopblok { margin-bottom: 52px; }
.kgj-voordeelraster { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: auto auto auto;
  list-style: none; margin: 0; padding: 0; }
.kgjx .kgj-voordeel { display: grid; grid-row: span 3; grid-template-rows: subgrid; justify-items: center;
  padding: 4px 44px; text-align: center; }
.kgjx .kgj-voordeel + .kgj-voordeel { border-left: 1px solid rgba(255, 255, 255, .14); }
.kgjx .kgj-voordeel__bol { display: grid; place-items: center; width: 76px; height: 76px; margin: 0 0 24px;
  border-radius: 50%; background: var(--bol-licht); box-shadow: inset 0 0 0 1px var(--bol-rand); color: var(--bol); }
.kgjx .kgj-voordeel__bol svg { width: 36px; height: 36px; stroke-width: 1.6; }
.kgjx .kgj-voordeel--oranje { --bol: #f4a66a; --bol-licht: rgba(244, 166, 106, .13); --bol-rand: rgba(244, 166, 106, .32); }
.kgjx .kgj-voordeel--blauw { --bol: #8fc0f4; --bol-licht: rgba(143, 192, 244, .13); --bol-rand: rgba(143, 192, 244, .32); }
.kgjx .kgj-voordeel--groen { --bol: #7fd5a7; --bol-licht: rgba(127, 213, 167, .13); --bol-rand: rgba(127, 213, 167, .32); }
.kgjx .kgj-voordeel h3 { align-self: end; margin: 0 0 12px; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 20px; font-weight: 700; line-height: 1.3; color: var(--wit); text-wrap: balance; }
.kgjx .kgj-voordeel p { margin: 0; max-width: 34ch; font-size: 15.5px; line-height: 1.65; color: rgba(255, 255, 255, .74); }
@media (max-width: 1000px) { .kgjx .kgj-voordeel { padding: 4px 24px; } }
@media (max-width: 760px) {
  .kgj-voordeelraster { grid-template-columns: 1fr; grid-template-rows: none; }
  .kgjx .kgj-voordelen .kgj-kopblok { margin-bottom: 12px; }
  .kgjx .kgj-voordeel { grid-row: auto; grid-template-rows: none; grid-template-columns: 54px minmax(0, 1fr);
    grid-template-areas: "bol titel" "bol tekst"; column-gap: 16px; justify-items: start; align-items: start;
    padding: 22px 0; text-align: left; }
  .kgjx .kgj-voordeel + .kgj-voordeel { border-left: 0; border-top: 1px solid rgba(255, 255, 255, .14); }
  .kgjx .kgj-voordeel__bol { grid-area: bol; width: 54px; height: 54px; margin: 0; }
  .kgjx .kgj-voordeel__bol svg { width: 27px; height: 27px; }
  .kgjx .kgj-voordeel h3 { grid-area: titel; margin: 3px 0 6px; font-size: 17.5px; text-wrap: wrap; }
  .kgjx .kgj-voordeel p { grid-area: tekst; max-width: none; font-size: 15px; }
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
.kgjx .kgj-schuif__wissel .pc-bediening-tel { min-width: 44px; text-align: center; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 14px; font-weight: 700; color: var(--zacht); }
@keyframes kgj-werkspoor-vullen { from { transform: scaleX(0); } to { transform: scaleX(1); } }
/* De pijlen: Bediening uit replica/Onderdelen.tsx, met de maten van .pc-bediening. */
.kgjx :is(.kgj-werkspoor, .kgj-schuif__wissel) .pc-bediening { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 28px; }
.kgjx :is(.kgj-werkspoor, .kgj-schuif__wissel) .pc-bediening button { width: 44px; height: 44px; border-radius: 50%; background: #fff;
  display: grid; place-items: center; color: var(--kop); flex: 0 0 auto; border: 0; padding: 0; cursor: pointer;
  box-shadow: inset 0 0 0 1px #dddddd;
  transition: background-color .18s ease, color .18s ease, opacity .18s ease; }
.kgjx :is(.kgj-werkspoor, .kgj-schuif__wissel) .pc-bediening button:hover { background: var(--accent); color: var(--merk); box-shadow: none; }
.kgjx :is(.kgj-werkspoor, .kgj-schuif__wissel) .pc-bediening button:focus-visible { outline: 3px solid var(--merk); outline-offset: 3px; }
@media (max-width: 1000px) {
  .kgj-werkspoor__spoor { gap: 12px; padding-right: 40px; }
  .kgjx .kgj-werkspoor__foto { flex: 0 0 78%; }
  .kgj-werkspoor__lijn { margin-top: 16px; }
  .kgjx :is(.kgj-werkspoor, .kgj-schuif__wissel) .pc-bediening { margin-top: 20px; gap: 12px; }
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
  .kgjx .kgj-kop--lp .kgj-kop__bel .kgj-kop__bel-kort { display: inline; }
  /* 4 okt, plan mobiele hero (dak): geen titel in de kaart (staat al in de kop), de kaart
     begint met de voortgang en "Vraag 1 van 8"; de vinkjes staan onder de kaart. */
  .kgjx.kgj-lp--dakwerken .kgj-reken--hero .kgj-reken__hoofd { display: none; }
  .kgjx.kgj-lp--dakwerken .kgj-reken--hero .kgj-reken__vertrouwen { display: none; }
  .kgjx.kgj-lp--dakwerken .kgj-hero__vertrouwen { display: grid; gap: 9px; margin: 16px 2px 0; padding: 0; list-style: none; }
  .kgjx .kgj-hero__vertrouwen li { display: flex; align-items: flex-start; gap: 9px; font-family: "Plus Jakarta Sans",
    system-ui, sans-serif; font-size: 15px; font-weight: 700; line-height: 1.35; color: var(--wit); }
  .kgjx .kgj-hero__vertrouwen svg { flex: none; width: 20px; height: 20px; padding: 3px; border-radius: 999px;
    background: var(--accent); color: var(--merk-diep); }
  .kgjx .kgj-hero--lp .kgj-hero__bediening, .kgjx .kgj-hero--lp .kgj-hero__streep { display: none; }
  .kgjx .kgj-voet--lp .kgj-voet__in { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .kgj-reken__rij { grid-template-columns: 1fr; gap: 0; }
  .kgjx .kgj-reken__keuze { min-height: 52px; padding: 10px 12px; font-size: 15px; }
}
/* 4 okt, Mohammed: "above the fold op telefoon maar voor 70 procent gevuld". Dakwerken op telefoon:
   de foto vult het hele eerste scherm onder de kopbalk (69 px). Kop en rekenaar blijven bovenaan
   staan en de vinkjes zakken naar de onderrand, zodat er niets verspringt als de kaart groeit.
   Op een scherm vanaf 760 px hoog krijgen de antwoordfoto's ook meer hoogte (4:3). */
@media (max-width: 640px) {
  .kgjx.kgj-lp--dakwerken .kgj-hero--lp { min-height: calc(100svh - 69px); align-items: stretch; }
  .kgjx.kgj-lp--dakwerken .kgj-hero--lp .kgj-hero__in { display: flex; flex-direction: column; padding-block: 34px 28px; }
  .kgjx.kgj-lp--dakwerken .kgj-hero__raster { flex: 1; grid-template-rows: auto 1fr; align-items: stretch; }
  .kgjx.kgj-lp--dakwerken #rekenaar { display: flex; flex-direction: column; }
  .kgjx.kgj-lp--dakwerken .kgj-hero__vertrouwen { margin-top: auto; padding-top: 18px; }
}
@media (max-width: 640px) and (min-height: 760px) {
  .kgjx.kgj-lp--dakwerken .kgj-reken__foto { aspect-ratio: 4 / 3; }
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

/* ── veelgestelde vragen (totaalrenovatie, 29 sep) ──
   Eén kolom, gecentreerd; elke vraag klapt open (details/summary, werkt zonder
   JavaScript en met het toetsenbord). Plus wordt een streep als hij open staat. */
.kgjx .kgj-faq__lijst { max-width: 820px; margin: 0 auto; border-top: 1px solid var(--lijn); }
.kgjx .kgj-faq__item { border-bottom: 1px solid var(--lijn); }
.kgjx .kgj-faq__item summary { position: relative; display: block; padding: 20px 48px 20px 0; cursor: pointer; list-style: none;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; font-size: 17px; line-height: 1.35; color: var(--kop); }
.kgjx .kgj-faq__item summary::-webkit-details-marker { display: none; }
.kgjx .kgj-faq__item summary::before, .kgjx .kgj-faq__item summary::after { content: ""; position: absolute; right: 8px; top: 50%;
  width: 16px; height: 2px; margin-top: -1px; background: var(--accent-diep); transition: transform .2s ease; }
.kgjx .kgj-faq__item summary::after { transform: rotate(90deg); }
.kgjx .kgj-faq__item[open] summary::after { transform: rotate(0deg); }
.kgjx .kgj-faq__item summary:hover { color: var(--merk); }
.kgjx .kgj-faq__item summary:focus-visible { outline: 3px solid var(--merk); outline-offset: 4px; }
.kgjx .kgj-faq__item p { margin: -6px 0 20px; max-width: 700px; font-size: 16px; line-height: 1.6; color: var(--tekst); }
@media (max-width: 640px) {
  .kgjx .kgj-faq__item summary { padding: 18px 40px 18px 0; font-size: 16px; }
}

/* ── digitale assistent (ChatAssistent.tsx, 28 sep) ──
   Knop rechtsonder; op de telefoon een ronde knop die boven de actiebalk
   schuift. Het venster is op de telefoon schermvullend. Kleuren van de
   pagina: donkerblauw voor de kop en de bezoeker, goud voor keuzes en de
   knop die iets doet. */
.kgjx .kgj-chatknop { position: fixed; right: 24px; bottom: 24px; z-index: 85; display: inline-flex; align-items: center;
  gap: 8px; height: 54px; padding: 0 20px 0 16px; border: 0; border-radius: 999px; background: var(--merk); color: var(--wit);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; font-size: 15px; cursor: pointer;
  box-shadow: 0 10px 28px -8px rgba(10, 22, 40, .5); transition: bottom .25s ease, background .18s ease; }
.kgjx .kgj-chatknop:hover { background: var(--merk-diep); }
.kgjx .kgj-chatknop svg { width: 22px; height: 22px; }
@media (max-width: 1000px) {
  .kgjx .kgj-chatknop.is-hoog { bottom: calc(86px + env(safe-area-inset-bottom)); }
}
@media (max-width: 640px) {
  .kgjx .kgj-chatknop { right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); width: 56px; height: 56px;
    padding: 0; justify-content: center; }
  .kgjx .kgj-chatknop span { display: none; }
}

.kgjx .kgj-chat { position: fixed; right: 24px; bottom: 24px; z-index: 220; display: flex; flex-direction: column;
  width: 390px; height: min(660px, calc(100dvh - 48px)); overflow: hidden; background: var(--wit); border-radius: 16px;
  box-shadow: 0 24px 60px -12px rgba(10, 22, 40, .4), 0 0 0 1px rgba(10, 22, 40, .06); }
@media (max-width: 640px) {
  .kgjx .kgj-chat { inset: 0; width: auto; height: 100dvh; border-radius: 0; }
}
.kgjx .kgj-chat__kop { display: flex; align-items: center; gap: 10px; padding: 14px 12px 14px 16px; background: var(--merk); color: var(--wit); }
.kgjx .kgj-chat__merk { flex: none; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 999px;
  background: var(--accent); color: var(--merk-diep); font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 800; font-size: 14px; }
.kgjx .kgj-chat__naam { margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; font-size: 15px; line-height: 1.2; }
.kgjx .kgj-chat__sub { margin: 2px 0 0; font-size: 12.5px; opacity: .75; }
.kgjx .kgj-chat__dicht { margin-left: auto; display: grid; place-items: center; width: 38px; height: 38px; border: 0; border-radius: 999px;
  background: transparent; color: var(--wit); cursor: pointer; }
.kgjx .kgj-chat__dicht:hover { background: rgba(255, 255, 255, .12); }
.kgjx .kgj-chat__dicht svg { width: 20px; height: 20px; }

.kgjx .kgj-chat__lijst { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 16px 14px;
  background: #f5f6f8; overscroll-behavior: contain; }
.kgjx .kgj-chat__beurt { display: flex; flex-direction: column; gap: 8px; }
.kgjx .kgj-chat__bel { max-width: 86%; padding: 10px 13px; border-radius: 14px; font-size: 14.5px; line-height: 1.45;
  white-space: pre-wrap; overflow-wrap: break-word; }
.kgjx .kgj-chat__bel--ai { align-self: flex-start; background: var(--wit); color: var(--inkt); border: 1px solid var(--lijn); border-top-left-radius: 4px; }
.kgjx .kgj-chat__bel--mens { align-self: flex-end; background: var(--merk); color: var(--wit); border-top-right-radius: 4px; }

.kgjx .kgj-chat__snel { display: grid; gap: 6px; }
.kgjx .kgj-chat__snel button, .kgjx .kgj-chat__snel a { display: flex; align-items: center; gap: 10px; min-height: 46px; padding: 10px 12px;
  border: 1px solid var(--lijn); border-radius: 10px; background: var(--wit); color: var(--inkt); text-align: left; text-decoration: none;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 600; font-size: 14.5px; cursor: pointer; }
.kgjx .kgj-chat__snel svg { flex: none; width: 19px; height: 19px; color: var(--accent-diep); }
@media (hover: hover) and (pointer: fine) {
  .kgjx .kgj-chat__snel button:hover, .kgjx .kgj-chat__snel a:hover { border-color: var(--merk); }
  .kgjx .kgj-chat__vaak button:hover { border-color: var(--merk); }
  .kgjx .kgj-chat__keuzes button:hover { background: var(--accent); }
}

.kgjx .kgj-chat__vaak { display: flex; flex-wrap: wrap; gap: 6px; }
.kgjx .kgj-chat__vaak p { flex-basis: 100%; margin: 4px 0 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 12.5px; font-weight: 700; color: var(--zacht); }
.kgjx .kgj-chat__vaak button { padding: 7px 12px; border: 1px solid var(--lijn); border-radius: 999px; background: var(--wit);
  color: var(--merk); font-size: 13.5px; line-height: 1.3; text-align: left; cursor: pointer; }
.kgjx .kgj-chat__keuzes { display: flex; flex-wrap: wrap; gap: 6px; }
.kgjx .kgj-chat__keuzes button { padding: 8px 14px; border: 1.5px solid var(--accent); border-radius: 999px; background: var(--accent-licht);
  color: var(--merk-diep); font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; }
.kgjx .kgj-chat__actie { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border: 0;
  border-radius: 10px; background: var(--accent); color: var(--merk-diep); font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-weight: 700; font-size: 14px; cursor: pointer; }
.kgjx .kgj-chat__actie:hover { background: var(--accent-diep); }
.kgjx .kgj-chat__actie svg { width: 17px; height: 17px; }

.kgjx .kgj-chat__typt { display: inline-flex; gap: 4px; padding: 13px 14px; }
.kgjx .kgj-chat__typt i { width: 7px; height: 7px; border-radius: 999px; background: #a3a8b1; animation: kgj-typt 1s infinite ease-in-out; }
.kgjx .kgj-chat__typt i:nth-child(2) { animation-delay: .15s; }
.kgjx .kgj-chat__typt i:nth-child(3) { animation-delay: .3s; }
@keyframes kgj-typt { 0%, 80%, 100% { opacity: .35; transform: none; } 40% { opacity: 1; transform: translateY(-3px); } }

.kgjx .kgj-chat__kaart { display: grid; gap: 10px; padding: 14px; background: var(--wit); border: 1px solid var(--lijn); border-radius: 14px;
  box-shadow: 0 6px 18px -10px rgba(10, 22, 40, .25); }
.kgjx .kgj-chat__kaartkop { margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 700; font-size: 15.5px; color: var(--merk); }
.kgjx .kgj-chat__velden { margin: 0; border-top: 1px solid var(--lijn); }
.kgjx .kgj-chat__velden div { display: flex; justify-content: space-between; gap: 12px; padding: 7px 0; border-bottom: 1px solid var(--lijn); }
.kgjx .kgj-chat__velden dt { font-size: 13px; color: var(--zacht); }
.kgjx .kgj-chat__velden dd { margin: 0; font-size: 13.5px; font-weight: 600; color: var(--inkt); text-align: right; }
.kgjx .kgj-chat__kaart label { display: block; font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 13px; font-weight: 600; color: var(--tekst); }
.kgjx .kgj-chat__kaart input, .kgjx .kgj-chat__kaart textarea { display: block; width: 100%; margin-top: 5px; padding: 10px 12px;
  border: 1px solid var(--lijn); border-radius: 8px; background: var(--wit); color: var(--inkt); font: 16px/1.4 Lato, system-ui, sans-serif; resize: vertical; }
.kgjx .kgj-chat__kaart input:focus, .kgjx .kgj-chat__kaart textarea:focus { outline: 2px solid var(--merk); outline-offset: 1px; }
.kgjx .kgj-chat__rij { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.kgjx .kgj-chat__verstuur { width: 100%; height: 50px; gap: 8px; border-radius: 10px; background: var(--accent); border-color: var(--accent); color: var(--merk-diep); }
.kgjx .kgj-chat__verstuur:hover { background: var(--accent-diep); border-color: var(--accent-diep); color: var(--merk-diep); }
.kgjx .kgj-chat__verstuur svg { width: 18px; height: 18px; }
.kgjx .kgj-chat__klein { margin: 0; font-size: 12.5px; color: var(--zacht); }

.kgjx .kgj-chat__invoer { display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px 6px; background: var(--wit); border-top: 1px solid var(--lijn); }
.kgjx .kgj-chat__invoer textarea { flex: 1; min-height: 42px; max-height: 120px; padding: 10px 14px; border: 1px solid var(--lijn); border-radius: 21px;
  font: 16px/1.35 Lato, system-ui, sans-serif; color: var(--inkt); resize: none; }
.kgjx .kgj-chat__invoer textarea:focus { outline: none; border-color: var(--merk); box-shadow: 0 0 0 1px var(--merk); }
.kgjx .kgj-chat__invoer button { flex: none; display: grid; place-items: center; width: 42px; height: 42px; border: 0; border-radius: 999px;
  background: var(--merk); color: var(--wit); cursor: pointer; }
.kgjx .kgj-chat__invoer button:disabled { opacity: .35; cursor: default; }
.kgjx .kgj-chat__invoer button svg { width: 20px; height: 20px; }
.kgjx .kgj-chat__voet { margin: 0; padding: 0 12px calc(8px + env(safe-area-inset-bottom)); background: var(--wit); text-align: center;
  font-size: 11.5px; color: var(--zacht); }
.kgjx .kgj-chat__voet a { color: inherit; text-decoration: underline; }
@media (prefers-reduced-motion: reduce) { .kgjx .kgj-chat__typt i { animation: none; } }

/* ── vraag na de aanvraag: mag Google meten dat ze via een advertentie kwam ── */
.kgjx .kgj-toestemming { display: grid; gap: 12px; }
.kgjx .kgj-toestemming__ok { display: flex; align-items: center; gap: 8px; margin: 0; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-weight: 700; font-size: 18px; color: var(--kop); }
.kgjx .kgj-toestemming__ok svg { flex: none; width: 22px; height: 22px; color: #1f7a52; }
.kgjx .kgj-toestemming__tekst { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--tekst); }
.kgjx .kgj-toestemming__tekst a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
/* Beide knoppen even zwaar: weigeren moet even makkelijk zijn als aanvaarden. */
.kgjx .kgj-toestemming__knoppen { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.kgjx .kgj-toestemming__knoppen button { min-height: 52px; padding: 10px 12px; border: 2px solid var(--merk); border-radius: var(--r);
  background: var(--wit); color: var(--merk); font: 700 16px/1.2 "Plus Jakarta Sans", system-ui, sans-serif; cursor: pointer; }
.kgjx .kgj-toestemming__knoppen button:disabled { opacity: .5; cursor: default; }

/* ══ 5 okt 2026: de renovatiepagina's volgens Mohammeds blauwdruk ══════════════════════════ */

/* Smalle donkere balk boven de kop, met het telefoonnummer. Hij zit in de vaste kop en blijft
   dus staan bij het scrollen. */
.kgjx .kgj-topbalk { background: var(--merk-diep); color: #fff; }
.kgjx .kgj-topbalk__in { display: flex; align-items: center; justify-content: center; gap: 9px; min-height: 38px;
  padding-block: 7px; font-size: 14px; line-height: 1.35; text-align: center; }
.kgjx .kgj-topbalk svg { flex: none; width: 15px; height: 15px; color: #e59819; }
.kgjx .kgj-topbalk a { color: #fff; font-weight: 800; text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }
html:has(.kgjx .kgj-topbalk) { scroll-padding-top: 132px; }
@media (max-width: 640px) {
  .kgjx .kgj-topbalk__in { font-size: 13px; min-height: 0; padding-block: 6px; }
  .kgjx .kgj-topbalk svg { display: none; }
}

/* Hero met een knop in plaats van de rekenaar: één kolom, de kop breder, de knop groot. */
.kgjx .kgj-hero--knop .kgj-hero__raster { grid-template-columns: minmax(0, 760px); }
.kgjx .kgj-hero--knop h1 { max-width: 22ch; font-size: clamp(34px, 4.4vw, 58px); }
.kgjx .kgj-hero--knop .kgj-hero__sub { max-width: 58ch; }
.kgjx .kgj-hero__actie { margin-top: 30px; }
.kgjx .kgj-hero__knop { height: 60px; padding: 0 34px; font-size: 17px; background: #e59819; color: var(--merk-diep); }
.kgjx .kgj-hero__knop:hover { background: #cf8812; color: var(--merk-diep); }
.kgjx .kgj-hero__micro { margin-top: 12px; color: rgba(255, 255, 255, .88); font-size: 14px; }
@media (max-width: 1000px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs { display: grid; }
  .kgjx .kgj-hero--knop .kgj-hero__knop { width: 100%; }
}

/* Frustratie tegenover oplossing: links een donker vak, rechts de oplossing met drie iconen. */
.kgjx .kgj-tegenover { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 26px; align-items: stretch; }
.kgjx .kgj-tegenover__probleem { background: var(--merk); color: #fff; border-radius: var(--r-vak); padding: 38px 36px; }
.kgjx .kgj-tegenover__teken { display: inline-grid; place-items: center; width: 46px; height: 46px; border-radius: 999px;
  background: rgba(229, 72, 77, .16); color: #ff8a8d; }
.kgjx .kgj-tegenover__probleem p { margin-top: 20px; color: rgba(255, 255, 255, .9); font-size: 18px; line-height: 1.62; }
.kgjx .kgj-tegenover__oplossing { background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r-vak); padding: 34px 34px 30px; }
.kgjx .kgj-tegenover__intro { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 800; font-size: 18px;
  line-height: 1.35; color: var(--kop); }
.kgjx .kgj-tegenover__oplossing ul { margin: 22px 0 0; padding: 0; list-style: none; display: grid; gap: 22px; }
.kgjx .kgj-tegenover__oplossing li { display: flex; gap: 16px; align-items: flex-start; }
.kgjx .kgj-tegenover__icoon { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 999px;
  background: var(--accent-licht); color: var(--accent-diep); }
.kgjx .kgj-tegenover__oplossing h3 { font-size: 18px; }
.kgjx .kgj-tegenover__oplossing li p { margin-top: 5px; font-size: 15.5px; line-height: 1.55; }
@media (max-width: 900px) {
  .kgjx .kgj-tegenover { grid-template-columns: 1fr; gap: 16px; }
  .kgjx .kgj-tegenover__probleem, .kgjx .kgj-tegenover__oplossing { padding: 26px 22px; }
  .kgjx .kgj-tegenover__probleem p { font-size: 16.5px; }
}

/* Het vangnet: een rustig licht vlak met een tweede, zachtere knop. */
.kgjx .kgj-vangnet { background: #f8f2e7; }
.kgjx .kgj-vangnet .kgj-kopblok { margin-bottom: 0; }
.kgjx .kgj-vangnet .kgj-kopblok h2 { max-width: 26ch; margin-inline: auto; }
.kgjx .kgj-vangnet__knop { margin-top: 24px; gap: 10px; background: transparent; border: 2px solid var(--merk); color: var(--merk); cursor: pointer; }
.kgjx .kgj-vangnet__knop:hover { background: var(--merk); color: #fff; }

/* Slotblok met een regel onder de kop en zonder punten. */
.kgjx .kgj-cta__onderkop { margin-top: 12px; color: #fff; font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 21px; font-weight: 700; line-height: 1.3; }
.kgjx .kgj-cta--ruim .kgj-cta__tekst > p.kgj-cta__onderkop + p { margin-top: 14px; }

/* Het formulier: de uitleg bij het gsm-veld en de geruststellingen onder de knop. */
.kgjx .kgj-reken__uitleg { font-weight: 400; color: var(--zacht); font-size: 13px; }
.kgjx .kgj-reken__gerustlijst { margin: 16px 0 0; padding: 0; list-style: none; display: grid; gap: 9px; }
.kgjx .kgj-reken__gerustlijst li { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; line-height: 1.45; color: var(--tekst); }
.kgjx .kgj-reken__gerustlijst svg { flex: none; margin-top: 1px; color: var(--accent-diep); }
/* De voor/na hoort bij het uitgevoerde werk erboven: zelfde wit vlak, zonder de bovenlucht van een
   nieuwe sectie. Frustratie en oplossing staan op het grijze vlak, zodat de witte kaart opvalt. */
.kgjx.kgj-lp--totaalrenovatie .kgj-uitgevoerd + .kgj-voorna { background: var(--wit); padding-top: 0; }
.kgjx.kgj-lp--totaalrenovatie .kgj-uitgevoerd + .kgj-voorna .kgj-kopblok { margin-bottom: 22px; }
.kgjx .kgj-waarom--tegenover { background: var(--band); }
.kgjx .kgj-tegenover__probleem { display: flex; flex-direction: column; justify-content: center; }
/* Dienstkaarten met foto op de renovatiepagina's: drie per rij (3 of 6 kaarten), geen gat rechts. */
@media (min-width: 1001px) { .kgjx.kgj-lp--totaalrenovatie .kgj-dienstraster { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 26px; } }
/* Gestripte totaalrenovatie (5 okt): drie zekerheden in kolommen, icoon, kop en een regel. */
.kgjx .kgj-kolommen { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 26px; margin: 0; padding: 0; list-style: none; }
.kgjx .kgj-kolommen li { background: var(--wit); border: 1px solid var(--lijn); border-radius: var(--r-vak); padding: 30px 28px; text-align: center; }
.kgjx .kgj-kolommen .kgj-tegenover__icoon { margin: 0 auto 16px; width: 54px; height: 54px; }
.kgjx .kgj-kolommen h3 { font-size: 19px; }
.kgjx .kgj-kolommen p { margin-top: 8px; font-size: 15.5px; line-height: 1.55; }
@media (max-width: 900px) { .kgjx .kgj-kolommen { grid-template-columns: 1fr; gap: 14px; } .kgjx .kgj-kolommen li { padding: 22px 20px; } }
/* Diensten in korte blokken: de regel onder de naam iets groter, er staat maar een paar woorden. */
.kgjx.kgj-lp--totaalrenovatie .kgj-dienst__body p { font-size: 15.5px; }

/* 5 okt, derde versie (Mohammed: "visueel sterker en cleaner ... zowel op mobiel als desktop").
   Alleen de drie renovatiepagina's; /lp/dakwerken blijft zoals hij is. */

/* Ritme: grijs en wit wisselen af. Twee witte banden na elkaar gaven 172px leegte zonder grens. */
.kgjx.kgj-lp--totaalrenovatie .kgj-werkwijze { background: var(--band); --ring: var(--band); }
.kgjx.kgj-lp--totaalrenovatie .kgj-band--grijs + .kgj-werkwijze { background: var(--wit); --ring: var(--wit); }
.kgjx.kgj-lp--totaalrenovatie .kgj-band--grijs + .kgj-werkwijze + .kgj-faq { background: var(--band); }

/* Werkwijze: vijf bolletjes op één lijn met een rechte verbinding, in plaats van de golf met
   stippelpijlen. Het nummer is leesbaar vóór de stap oplicht. */
.kgjx.kgj-lp--totaalrenovatie .kgj-stap { margin-top: 0; }
.kgjx.kgj-lp--totaalrenovatie .kgj-boog { display: none; }
.kgjx.kgj-lp--totaalrenovatie .kgj-stap__bol { box-shadow: 0 0 0 7px var(--ring), 0 0 0 8px var(--lijn); }
.kgjx.kgj-lp--totaalrenovatie .kgj-stap:is(.is-aan, :hover) .kgj-stap__bol { box-shadow: 0 0 0 7px var(--ring), 0 0 0 8px var(--merk), 0 10px 22px rgba(50, 80, 140, .28); }
.kgjx.kgj-lp--totaalrenovatie .kgj-stap__nr { color: #9aa1ab; }
.kgjx.kgj-lp--totaalrenovatie .kgj-stap.is-aan .kgj-stap__nr { color: var(--accent-diep); }
.kgjx.kgj-lp--totaalrenovatie .kgj-stap:not(:last-child)::after { content: ""; position: absolute; background: #d9dce1; transition: background .38s ease; }
.kgjx.kgj-lp--totaalrenovatie .kgj-stap.is-aan:not(:last-child)::after { background: #9aa6b8; }
@media (min-width: 1001px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap:not(:last-child)::after { top: 30px; left: calc(50% + 46px); width: calc(100% + 22px - 92px); height: 2px; }
}
/* Telefoon en tablet: een tijdlijn. Bolletje links, tekst rechts, een lijn naar het volgende
   bolletje. Vijf stappen in de helft van de hoogte, en links uitgelijnd leest sneller. */
@media (max-width: 1000px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-stappen { grid-template-columns: 1fr; gap: 0; max-width: 560px; margin-inline: auto; padding: 0; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap { display: grid; grid-template-columns: 52px minmax(0, 1fr); column-gap: 18px; align-content: start; text-align: left; padding-bottom: 26px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap:last-child { padding-bottom: 0; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap__bol { grid-column: 1; grid-row: 1 / span 3; width: 52px; height: 52px; margin: 0; box-shadow: 0 0 0 5px var(--ring), 0 0 0 6px var(--lijn); }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap:is(.is-aan, :hover) .kgj-stap__bol { transform: none; box-shadow: 0 0 0 5px var(--ring), 0 0 0 6px var(--merk); }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap__bol svg { width: 22px; height: 22px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap__nr { grid-column: 2; margin: 3px 0 1px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap h3 { grid-column: 2; font-size: 17.5px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap p { grid-column: 2; margin: 5px 0 0; max-width: none; font-size: 15px; line-height: 1.55; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap:not(:last-child)::after { left: 25px; top: 64px; bottom: 0; width: 2px; }
}

/* Drie zekerheden: op de computer drie kaarten, op de telefoon een compacte rij per zekerheid
   (icoon links, kop en regel rechts) in plaats van drie gecentreerde kaarten onder elkaar. */
.kgjx .kgj-kolommen p { max-width: 32ch; margin-inline: auto; }
@media (max-width: 900px) {
  .kgjx .kgj-kolommen { gap: 12px; }
  .kgjx .kgj-kolommen li { display: grid; grid-template-columns: 48px minmax(0, 1fr); column-gap: 16px; align-items: start; text-align: left; padding: 18px; }
  .kgjx .kgj-kolommen .kgj-tegenover__icoon { grid-row: 1 / span 2; margin: 0; width: 48px; height: 48px; }
  .kgjx .kgj-kolommen h3 { font-size: 17.5px; margin-top: 2px; }
  .kgjx .kgj-kolommen p { margin: 4px 0 0; max-width: none; font-size: 15px; }
}

/* Vangnet: de zin onder de kop op leesbare breedte; op de telefoon een volle knop zonder een
   los woord op de tweede regel. */
.kgjx .kgj-vangnet .kgj-kopblok p { max-width: 50ch; }
@media (max-width: 640px) {
  .kgjx .kgj-vangnet__knop { display: flex; width: 100%; height: auto; min-height: 54px; padding: 12px 18px; line-height: 1.3; text-align: center; text-wrap: balance; }
}

/* Slotblok (definitief: "witte card met subtiele schaduw, massieve actieknop in de accentkleur"):
   een licht vlak zonder de foto onder 90% donker (dat gaf een troebel grijs vlak), donkere tekst,
   de formulierkaart wit met een rand en een zachte schaduw. Op de rekenaarpagina staat de
   vragenlijst al op grijs, daar is het slotblok wit. */
.kgjx.kgj-lp--totaalrenovatie .kgj-cta { background: var(--band); color: var(--tekst); }
.kgjx.kgj-lp--totaalrenovatie .kgj-band--grijs + .kgj-werkwijze + .kgj-faq + .kgj-cta { background: var(--wit); }
.kgjx.kgj-lp--totaalrenovatie .kgj-cta__foto { display: none; }
.kgjx.kgj-lp--totaalrenovatie .kgj-cta::after { content: none; }
.kgjx.kgj-lp--totaalrenovatie .kgj-cta__tekst h2 { color: var(--kop); }
.kgjx.kgj-lp--totaalrenovatie .kgj-cta__tekst > p { font-size: 18px; line-height: 1.65; color: var(--tekst); max-width: 40ch; }
.kgjx.kgj-lp--totaalrenovatie .kgj-cta--lp .kgj-reken { border: 1px solid var(--lijn); box-shadow: 0 22px 48px -28px rgba(10, 22, 40, .32); }
.kgjx.kgj-lp--totaalrenovatie .kgj-reken__knop { gap: 10px; }
@media (max-width: 1000px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-cta__tekst > p { font-size: 16.5px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap__bol { box-shadow: 0 0 0 4px var(--ring), 0 0 0 5px var(--lijn); }
  .kgjx.kgj-lp--totaalrenovatie .kgj-stap:is(.is-aan, :hover) .kgj-stap__bol { box-shadow: 0 0 0 4px var(--ring), 0 0 0 5px var(--merk); }
}

/* De belofte onder de heroknop met een klokje, zoals de geruststellingen onder het formulier. */
.kgjx .kgj-hero__micro { display: flex; align-items: center; gap: 8px; }
.kgjx .kgj-hero__micro svg { flex: none; color: #e59819; }

/* Hero (definitief, 5 okt: "hoge kwaliteit achtergrondfoto, strak wit of lichtgrijs tekstvlak met
   veel witruimte", en "de knop in het eerste scherm", "de hoofdkop een fractie kleiner of dunner",
   "meer witruimte tussen de regels", "de gele streep dunner en strakker"). De foto staat zonder
   donkere laag; de tekst staat op een wit vlak. Alleen de renovatiepagina's met een heroknop. */
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop::after { content: none; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__in { padding-block: 56px; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__raster { grid-template-columns: minmax(0, 660px); }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero__vlak { background: var(--wit); border-radius: 18px; padding: 50px 54px 44px;
  box-shadow: 0 30px 70px -34px rgba(10, 22, 40, .45); }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop h1 { color: var(--kop); font-weight: 600; font-size: clamp(32px, 3.3vw, 48px);
  line-height: 1.16; letter-spacing: -.024em; max-width: none; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__accent { color: var(--accent-diep); }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__accent::after { bottom: -0.1em; height: 0.16em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'%3E%3Cpath d='M3 8 C 60 4.5, 140 3.5, 197 5' fill='none' stroke='%23e59819' stroke-width='3.2' stroke-linecap='round'/%3E%3C/svg%3E"); }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__sub { color: var(--tekst); font-size: 17.5px; line-height: 1.7; margin-top: 20px; max-width: none; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs { margin-top: 24px; gap: 14px; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs li { color: var(--tekst); text-shadow: none; font-size: 15.5px; line-height: 1.5; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs strong { color: var(--kop); }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs li:has(strong) svg { margin-top: 0; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__actie { margin-top: 30px; }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__micro { color: var(--zacht); }
.kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__streep { left: auto; right: var(--zij); }
/* Lage laptopschermen (1366 x 680, 1536 x 730): een breder en compacter vlak, zodat de knop in het
   eerste scherm blijft. */
@media (min-width: 1001px) and (max-height: 820px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__in { padding-block: 28px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__raster { grid-template-columns: minmax(0, 720px); }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero__vlak { padding: 32px 40px 28px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop h1 { font-size: 40px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__sub { font-size: 16px; line-height: 1.6; margin-top: 14px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs { margin-top: 16px; gap: 10px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs li { font-size: 15px; line-height: 1.45; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__actie { margin-top: 22px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__knop { height: 56px; }
}
@media (max-width: 1000px) {
  /* Telefoon: de tekst op wit, de foto als afgeronde strook onder de knop (als achtergrond onder een
     kaart toonde de strook onder de kaart alleen de vloer). Kop, tekst, vinkjes én de knop staan in
     het eerste scherm (390 x 844). */
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop { flex-direction: column; align-items: stretch; background: var(--wit); }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__foto { position: relative; inset: auto; order: 2; height: 230px;
    margin: 0 16px 28px; border-radius: 14px; overflow: hidden; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__in { order: 1; padding: 22px 22px 24px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero__vlak { background: none; border-radius: 0; padding: 0; box-shadow: none; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__micro { text-wrap: balance; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop h1 { font-size: clamp(26px, 7vw, 40px); max-width: none; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop h1 br { display: inline; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__sub { font-size: 15.5px; line-height: 1.6; margin-top: 12px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs { margin-top: 16px; gap: 10px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs li { font-size: 14.5px; line-height: 1.45; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__bewijs svg { width: 22px; height: 22px; padding: 4px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__actie { margin-top: 20px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__knop { height: 56px; font-size: 16px; padding: 0 16px; }
  .kgjx.kgj-lp--totaalrenovatie .kgj-hero--knop .kgj-hero__micro { margin-top: 10px; font-size: 13.5px; }
}

/* Zekerheden: de alinea onder de kop. */
.kgjx .kgj-waarom--kolommen .kgj-kopblok p { max-width: 62ch; }

/* Voor/na: de hint onder de schuif, klein en grijs. */
.kgjx .kgj-schuif__hint { margin: 12px 0 0; text-align: center; font-size: 14px; color: var(--zacht); }

/* Formulier: de uitleg bij het gsm-veld op een eigen regel, zodat "premie-check" niet breekt. */
.kgjx.kgj-lp--totaalrenovatie .kgj-reken__uitleg { display: block; margin-top: 1px; }
/* Smalle telefoon: de pijl achter "Bevestig mijn gratis plaatsbezoek" duwt de tekst naar twee regels. */
@media (max-width: 420px) { .kgjx.kgj-lp--totaalrenovatie .kgj-reken__knop svg { display: none; } }

/* Onze expertises: vier foto's op één rij op de computer, twee per rij op een tablet. */
@media (min-width: 1001px) {
  .kgjx.kgj-lp--totaalrenovatie .kgj-dienstraster:has(> :nth-child(4):last-child) { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; }
}
.kgjx.kgj-lp--totaalrenovatie .kgj-dienst--foto h3 { font-size: 18.5px; }
`;
