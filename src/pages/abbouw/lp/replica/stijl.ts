/**
 * Stijl voor de replica-landingspagina.
 *
 * Alle getallen komen uit een pixelmeting van de referentie (1200x8408), niet
 * uit een schatting. Waar een maat afwijkt van de referentie staat erbij waarom.
 *
 * Lettertype: Poppins. Dat is gemeten, niet geraden — de cijfers "25+" zijn
 * 147px hoog en Poppins 600 haalt daar 95,5% vormoverlap, de eerstvolgende
 * familie 91,2%. Grootte en letterspatie per tekstsoort zijn gepast op de
 * gemeten inktbreedtes:
 *   H1  600  53,2px  -0,055em   (drie regels binnen 1px)
 *   H2  600  35,5px   0         (beide regels exact)
 *   tekst 400 14,3px  0         (exact)
 *
 * Kleuren: de referentie gebruikt terracotta #b5532a en bijna-zwart #131614.
 * Die twee zijn vervangen door AB-goud en AB-navy. De neutralen (warm wit,
 * tekstgrijs, lijnen) zijn merkloos en blijven staan, anders valt de vormtaal om.
 */

export const REPLICA_CSS = `
.pcx {
  --pc-accent: #d98c03;
  --pc-accent-h: #b87502;
  --pc-dark: #0a1628;
  --pc-dark-2: #14233a;
  --pc-cream: #f6f4f0;
  --pc-ink: #131311;
  --pc-grijs: #51514c;
  --pc-grijs-2: #56534f;
  --pc-lijn: #dddddd;
  --pc-lijn-2: #e7e7e7;
  --pc-container: 974px;

  font-family: Poppins, 'Archivo', system-ui, -apple-system, sans-serif;
  color: var(--pc-ink);
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
}
/* Afschermen tegen de sitebrede regels in src/styles/ab-bouw.css. Die zet
   "section { color: var(--ink) }", "h1,h2,h3 { color: var(--ink);
   text-wrap: balance }" en "p { color: var(--ink-soft) }". Een elementselector
   wint van een overgeërfde waarde, dus zonder deze regel kleurt de halve
   pagina AB-navy #14233a en herschikt de browser de kopregels.
   De uitzonderingen staan in :where() omdat een gewone :not()-keten vier
   elementselectors optelt (0,1,4) en dan zwaarder weegt dan .pc-over-tekst p
   (0,1,1) — die regel verloor daardoor zijn eigen tekstkleur. */
.pcx, .pcx *:not(:where(svg, path, circle, rect)) {
  font-family: Poppins, 'Archivo', system-ui, -apple-system, sans-serif;
  color: inherit;
  text-wrap: wrap;
  letter-spacing: normal;
}
.pcx { color: var(--pc-ink); }
.pcx *, .pcx *::before, .pcx *::after { box-sizing: border-box; }
/* De basisregels staan in :where() en wegen daardoor niets. Zonder dat wint
   ".pcx h1 { margin: 0 }" van ".pc-h1 { margin-top: 18px }" — een elementregel
   binnen de wortel is zwaarder dan een losse klasse. Diezelfde botsing zette
   eerder de knopvulling en de kopmarge stil. */
.pcx :where(img) { display: block; max-width: 100%; }
.pcx :where(p) { margin: 0; }
.pcx :where(h1, h2, h3) { margin: 0; font-weight: 600; }
.pcx :where(a) { color: inherit; text-decoration: none; }
.pcx :where(button) { font: inherit; color: inherit; border: 0; background: none; cursor: pointer; }

.pc-vat { width: 100%; max-width: var(--pc-container); margin: 0 auto; padding: 0; }

/* Toetsenbordfocus. De browserstandaard verdwijnt achter onze eigen
   achtergronden; deze ring staat overal los van de vorm eromheen. */
.pcx :where(a, button, input, select, textarea):focus-visible {
  outline: 3px solid var(--pc-accent);
  outline-offset: 3px;
  border-radius: 6px;
}
.pcx :where(a, button, input, select, textarea):focus:not(:focus-visible) { outline: none; }

/* ─────────────────────────────────────────────────────────────
   Kop van de pagina: 137px hoog, drie kolommen, haarlijn op y=59
   die alleen onder de middenkolom loopt (x294-901 in de referentie).
   De kop ligt OVER de herofoto: die begint al op y=0 en wordt bovenaan
   met een wegvallende witte sluier bedekt.
   ───────────────────────────────────────────────────────────── */
.pc-kop { position: absolute; inset: 0 0 auto 0; height: 137px; z-index: 3; }
.pc-kop-vat { display: flex; align-items: stretch; height: 137px; }
.pc-kop-logo { width: 181px; display: flex; align-items: center; }
.pc-kop-logo img { height: 43px; width: auto; }
.pc-kop-streep { width: 1px; align-self: center; height: 100px; background: var(--pc-lijn); }
.pc-kop-midden { flex: 1; display: flex; flex-direction: column; }
/* De inhoud van rij 1 staat in de referentie gecentreerd op y=33, niet op het
   midden van de rij (29,5). Vandaar de 7px bovenmarge. */
.pc-kop-rij1 { height: 59px; display: flex; align-items: center; padding: 7px 21px 0 18px;
  border-bottom: 1px solid var(--pc-lijn-2); }
/* 6px onderpadding: de knop staat in de referentie op y=73, niet op het
   midden van de rij (76). */
.pc-kop-rij2 { height: 78px; display: flex; align-items: center; padding: 0 20px 6px 21px; }
/* 193 in plaats van 185: 'Bel ons vandaag' en 0460 20 77 88 zijn samen breder
   dan 'Call Us Today' en 775-329-1531, en de middenkolom heeft de ruimte over
   sinds de socialrij eruit is. */
.pc-kop-tel { width: 193px; display: flex; align-items: center; gap: 14px; padding-left: 20px; }

.pc-soc { display: flex; align-items: center; gap: 3px; }
.pc-soc a { width: 30px; height: 30px; border-radius: 50%; background: #f3f4ef;
  display: grid; place-items: center; color: var(--pc-ink); transition: background-color .18s ease; }
.pc-soc a:first-child { width: 31px; height: 31px; background: var(--pc-accent); color: var(--pc-dark); }
.pc-soc a:hover { background: #e8e9e2; }
.pc-soc a:first-child:hover { background: var(--pc-accent-h); color: #fff; }
.pc-soc svg { display: block; }

.pc-kop-contact { margin-left: auto; display: flex; align-items: center; gap: 20px; }
.pc-kop-contact span { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  font-size: 14px; line-height: 1; color: var(--pc-ink); }
.pc-kop-contact svg { flex: 0 0 auto; }

/* 20px in plaats van 23: de Nederlandse navlabels zijn samen 67px breder dan
   de Engelse, en met 23px stond de offerteknop tegen "Contact" aan. */
.pc-nav { display: flex; align-items: center; gap: 18px; }
.pc-nav > a, .pc-nav > button { font-size: 14px; font-weight: 500; line-height: 1;
  display: inline-flex; align-items: center; gap: 9px; }
.pc-nav > a:hover, .pc-nav > button:hover { color: var(--pc-accent-h); }

.pc-teltegel { width: 47px; height: 47px; border-radius: 12px; background: var(--pc-accent);
  color: var(--pc-dark); display: grid; place-items: center; flex: 0 0 auto;
  box-shadow: 0 0 0 2px #fff; }
/* De referentie meet cap 10 voor het label en cijferhoogte 12 voor het nummer.
   In Poppins is dat 14,3px en 16,3px — niet de 14/17 die de uitmeting noemt,
   want die ging uit van Inter met een andere kapitaalverhouding. Het label
   staat op 13px omdat 'Bel ons vandaag' anders 6px te breed is voor de kolom. */
.pc-telblok { display: flex; flex-direction: column; }
.pc-tellabel { font-size: 13px; line-height: 1; color: var(--pc-grijs-2); white-space: nowrap; }
.pc-telnr { font-size: 16.3px; font-weight: 700; line-height: 1; margin-top: 9px;
  display: block; white-space: nowrap; }
.pc-telnr:hover { color: var(--pc-accent-h); }

/* ─────────────────────────────────────────────────────────────
   Knoppen. In de hele referentie is er precies één knophoogte (44px)
   en één pijlmaat (8px); de uitmeting van blok 2 gaf daar 47px en 13px
   voor, maar de controle mat 44 en 7. 44/8 aangehouden.
   ───────────────────────────────────────────────────────────── */
.pc-knop { display: inline-flex; align-items: center; height: 44px; border-radius: 10px;
  padding: 0 21px 0 18px; gap: 12px; font-size: 14px; font-weight: 600; line-height: 1;
  transition: background-color .18s ease, color .18s ease; }
.pc-knop svg { flex: 0 0 auto; }
.pcx .pc-knop--donker { background: var(--pc-dark); color: #fff; }
.pcx .pc-knop--donker:hover { background: var(--pc-dark-2); }
.pcx .pc-knop--accent { background: var(--pc-accent); color: var(--pc-dark); }
.pcx .pc-knop--accent:hover { background: var(--pc-accent-h); color: #fff; }
.pcx .pc-knop--wit { background: #fff; color: var(--pc-ink); }
.pcx .pc-knop--wit:hover { background: var(--pc-cream); }
.pcx .pc-knop--rand { background: transparent; color: var(--pc-ink); box-shadow: inset 0 0 0 1px var(--pc-lijn); }
.pcx .pc-knop--rand:hover { background: var(--pc-cream); }

/* ─────────────────────────────────────────────────────────────
   Hero: 812px hoog. Links een gebroken wit paneel tot x=636 (53%),
   rechts de foto die tot de paginarand doorloopt.
   ───────────────────────────────────────────────────────────── */
.pc-hero { position: relative; height: 812px; background: var(--pc-cream); overflow: hidden; }
.pc-hero-foto { position: absolute; top: 0; right: 0; bottom: 0; left: 53%; }
.pc-hero-foto img { width: 100%; height: 100%; object-fit: cover; }
.pc-hero-sluier { position: absolute; top: 0; right: 0; left: 53%; height: 160px; z-index: 2;
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0) 100%); pointer-events: none; }
.pc-hero-vlak { position: absolute; top: 0; bottom: 0; left: 0; width: 53%; background: var(--pc-cream); }
/* De tekst hangt aan de ONDERKANT van de hero, niet aan de bovenkant.
   Met padding-top: 247px stond hij vast op een afstand die alleen klopte bij een
   hero van 812px; werd die korter, dan zakte de kop tot tegen de formulierbalk
   en liep de tekst erachter. Vanaf onderen gemeten blijft de afstand tot die
   balk altijd gelijk, ongeacht de hoogte van de hero. */
.pc-hero-vat { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column;
  justify-content: flex-end; padding-bottom: 370px; }

.pc-chip { display: inline-flex; align-items: center; gap: 9px; align-self: flex-start;
  height: 31px; padding: 0 13px 0 8px; border-radius: 15.5px; background: #ffffff;
  font-size: 14px; line-height: 1; }
.pc-chip b { display: inline-flex; align-items: center; height: 17px; padding: 0 7px;
  border-radius: 8.5px; background: var(--pc-accent); color: var(--pc-dark);
  font-size: 11px; font-weight: 600; letter-spacing: .02em; }
.pc-chip--grijs { background: var(--pc-cream); }

/* Kader 488 in plaats van de gemeten 483: de langste Nederlandse regel is
   487px en de referentie geeft haar eigen tekst daar ook maar 7px speling —
   er lijnt niets aan die rand uit. */
/* 18px, niet de 27 uit de uitmeting: die 27 is gemeten van de chip tot de
   KAPLIJN van de kop, en het regelkader begint 8px boven die kaplijn. Met 18
   komt de kaplijn op y=304 te staan, precies als in de referentie. */
.pcx .pc-h1 { margin-top: 18px; font-size: 53.2px; font-weight: 600; letter-spacing: -0.055em;
  line-height: 57px; max-width: 488px; }
/* Alleen de heroknop, niet de knop in de kop: die staat ook binnen .pc-hero. */
/* 26 in plaats van 36: de 36 uit de uitmeting loopt van de BASISLIJN van de
   laatste kopregel (457) tot de knop, en het kader van de kop loopt nog 11px
   door onder die basislijn. */
.pc-hero-vat > .pc-knop { margin-top: 26px; align-self: flex-start; }

/* De capsule rechts in de foto: 68x132, radius 34, binnenmarge 9, twee cirkels
   van 50 met 12 ertussen. De onderste is in de referentie accentgevuld. */
.pc-scroll { position: absolute; right: 14px; top: 340px; z-index: 3;
  width: 68px; padding: 9px; border-radius: 34px; background: rgba(255,255,255,.92);
  display: flex; flex-direction: column; gap: 12px; }
.pcx .pc-scroll button { width: 50px; height: 50px; border-radius: 50%; background: #fff;
  display: grid; place-items: center; color: var(--pc-ink); transition: background-color .18s ease; }
.pcx .pc-scroll button:hover { background: var(--pc-cream); }
.pcx .pc-scroll button.is-accent { background: var(--pc-accent); color: var(--pc-dark); }
.pcx .pc-scroll button.is-accent:hover { background: var(--pc-accent-h); color: #fff; }

/* ─────────────────────────────────────────────────────────────
   Formulierbalk: witte kaart die over de onderrand van de hero valt.
   974x124, radius 20, vier velden van 180 en een knop van 124.
   ───────────────────────────────────────────────────────────── */
/* -324 in plaats van -164: de balk schuift 160px verder de hero in, zodat de
   calculator eronder nog boven de vouw van een laptopscherm valt. De hero zelf
   en de foto blijven onaangeroerd op 812px. */
.pc-balk { position: relative; z-index: 4; margin-top: -324px; }
.pc-balk form { background: #fff; border-radius: 20px; padding: 40px 38px;
  display: flex; align-items: center; gap: 13px;
  box-shadow: 0 2px 6px rgba(10,22,40,.04), 0 24px 60px -30px rgba(10,22,40,.22); }
.pc-veld { flex: 1 1 0; min-width: 0; height: 44px; border-radius: 10px; background: var(--pc-cream);
  display: flex; align-items: center; gap: 12px; padding: 0 14px 0 18px; }
.pc-veld input { flex: 1; min-width: 0; border: 0; background: none; outline: none;
  font: 400 14px/1 Poppins, system-ui, sans-serif; color: var(--pc-ink); }
.pc-veld input::placeholder { color: var(--pc-grijs); }
.pc-veld svg { flex: 0 0 auto; color: var(--pc-grijs); }
.pc-balk .pc-knop { margin-left: 7px; flex: 0 0 auto; justify-content: center; padding: 0 20px; }
.pc-balk-fout { padding: 8px 38px 0; font-size: 13px; color: #a3231a; }
.pc-balk-ok { padding: 8px 38px 0; font-size: 13px; color: #1d6b3f; }

/* ─────────────────────────────────────────────────────────────
   Over ons. Twee kolommen 559 / 376 met een goot van 41, twee rijen
   met een goot van 42. Rij 2 is ONDER uitgelijnd: de onderkant van de
   foto (1556) en van de avatarrij vallen samen.
   ───────────────────────────────────────────────────────────── */
.pc-balk { margin-bottom: 41px; }
.pc-over { padding: 84px 0 82px; background: #fff; }
/* minmax(0,..) is nodig: zonder dat duwt het grote getal (min-content) de
   rechterkolom breder en klopt de kolomverhouding niet meer. Rij 1 staat vast
   op de gemeten 206px, anders schuift rij 2 omhoog omdat het Nederlandse
   cijferblok korter is dan het Amerikaanse. */
.pc-over-grid { display: grid; grid-template-columns: minmax(0, 559fr) minmax(0, 376fr);
  grid-template-rows: 206px auto; gap: 42px 41px; align-items: start; }
/* De foto blijft onder uitgelijnd; de tekstkolom start weer bovenaan nu de
   avatarrij eruit is, anders zakt de tekst naar de onderkant van de rij. */
.pc-over-grid > .pc-rij2 { align-self: end; }
.pc-over-grid > .pc-over-tekst { align-self: start; margin-top: 22px; }

.pc-chip--vlak { display: inline-flex; align-items: center; gap: 6px; height: 29px;
  padding: 0 13px 0 8px; border-radius: 6px; background: var(--pc-cream);
  font-size: 14px; font-weight: 600; line-height: 1; color: var(--pc-ink); }

/* H2 van een sectie: cap 25, dus 35,5px in Poppins. De uitmeting noemt 36px,
   maar die ging uit van Inter; gemeten op de referentie-inkt klopt 35,5. */
.pcx .pc-h2 { font-size: 35.5px; font-weight: 600; line-height: 44px;
  letter-spacing: -0.02em; color: var(--pc-ink); margin-top: 15px; }
.pc-over-knop { margin-top: 25px; }

/* Het grote getal is met foto gevuld: elke glyph krijgt een eigen beeld,
   net als de drie glyphs in de referentie. */
/* 158px, niet de 210 van de referentie: "120+" heeft vier glyphs waar "25+"
   er drie heeft, en bij 210px zou het 60% buiten de kolom van 376 vallen. */
.pc-getal { display: flex; align-items: flex-start; }
.pc-getal span { font-size: 158px; font-weight: 700; line-height: .84;
  background-size: cover; background-position: center;
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.pc-getal-label { font-size: 20px; font-weight: 700; line-height: 28px; margin-top: 13px; }

.pc-over-foto { position: relative; }
.pc-over-foto > img { width: 100%; height: 411px; object-fit: cover; border-radius: 8px; }
/* De score-kaart ligt in de rechterbovenhoek van de foto, met een witte goot
   van 8px links en onder — de kaart raakt de boven- en rechterrand wel. */
.pc-score { position: absolute; top: 0; right: 0; width: 157px; height: 178px;
  border-radius: 10px; background: var(--pc-cream); text-align: center;
  box-shadow: -8px 0 0 #fff, 0 8px 0 #fff, -8px 8px 0 #fff; }
.pc-score-sterren { display: flex; justify-content: center; gap: 11px; padding-top: 25px;
  color: var(--pc-accent); }
.pc-score-cijfer { font-size: 78px; font-weight: 700; line-height: 55px; margin-top: 31px; }
.pc-score-bij { font-size: 16px; font-weight: 400; line-height: 1; margin-top: 23px; }

.pc-over-tekst p { font-size: 16px; line-height: 21.6px; color: #444444; }
.pc-over-tekst p + p { margin-top: 13px; }

/* De zes divisies als lijst in twee kolommen: als doorlopende zin was het
   één regel van 250 tekens, en dan lees je niet wat er onder één dak zit. */
.pc-divisies { list-style: none; margin: 20px 0 0; padding: 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
.pc-divisies li { position: relative; padding-left: 17px; font-size: 16px; line-height: 22px;
  color: var(--pc-ink); }
.pc-divisies li::before { content: ""; position: absolute; left: 0; top: 8px;
  width: 7px; height: 7px; border-radius: 50%; background: var(--pc-accent); }
.pc-over-slot { margin-top: 20px; }

/* ─────────────────────────────────────────────────────────────
   Diensten: donkere sectie over een foto. Vijf fotokaarten in drie
   kolommen van 309, getrapt: kolom 1 kort-hoog, kolom 2 over de volle
   585, kolom 3 hoog-kort. Alleen de middelste pijlknop is gevuld.
   ───────────────────────────────────────────────────────────── */
.pc-diensten { position: relative; padding: 75px 0 81px; overflow: hidden;
  background: var(--pc-dark); }
.pc-diensten-bg { position: absolute; inset: 0; z-index: 0; }
.pc-diensten-bg img { width: 100%; height: 100%; object-fit: cover; }
/* De sluier is zwaar: in de referentie blijft de foto net leesbaar op een
   gemiddelde luminantie van ongeveer 30/255. */
.pc-diensten-bg::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(10,22,40,.90) 0%, rgba(10,22,40,.93) 100%); }
.pc-diensten .pc-vat { position: relative; z-index: 1; }
.pc-midden { text-align: center; }

.pc-chip--donker { display: inline-flex; align-items: center; gap: 8px; height: 30px;
  padding: 0 13px 0 9px; border-radius: 8px; background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.20); font-size: 13px; font-weight: 600;
  line-height: 1; color: #fff; }
.pcx .pc-h2--donker { font-size: 37.6px; font-weight: 600; line-height: 43px;
  letter-spacing: -0.008em; color: #fff; margin-top: 17px; max-width: 660px;
  margin-left: auto; margin-right: auto; }

.pc-kaarten { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  margin-top: 47px; height: 585px; }
.pc-kaarten-kolom { display: flex; flex-direction: column; gap: 24px; }
.pc-kaart { position: relative; border-radius: 12px; overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.35); }
.pc-kaart > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.pc-kaart::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(0,0,0,.62) 100%); }
.pc-kaart-inhoud { position: absolute; inset: auto 20px 20px 20px; z-index: 1;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; }
.pc-kaart-tekst { max-width: 208px; }
.pc-kaart h3 { font-size: 17.6px; font-weight: 600; line-height: 24px; color: #fff; }
.pc-kaart p { font-size: 14px; line-height: 20px; color: #fff; margin-top: 18px; }
.pc-rond { width: 42px; height: 42px; border-radius: 50%; flex: 0 0 auto;
  display: grid; place-items: center; color: #fff;
  border: 1px solid rgba(255,255,255,.85); background: transparent;
  transition: background-color .18s ease, color .18s ease; }
.pc-rond:hover { background: rgba(255,255,255,.16); }
/* Eén gevulde knop, net als in de referentie. Navy pijl op goud: wit op
   #d98c03 haalt 2,7:1 en zakt door de ondergrens. */
.pcx .pc-rond--vol { background: var(--pc-accent); border-color: var(--pc-accent);
  color: var(--pc-dark); }
.pcx .pc-rond--vol:hover { background: var(--pc-accent-h); color: #fff; }

.pc-diensten-slot { font-size: 15px; line-height: 22px; color: #fff;
  max-width: 380px; margin: 39px auto 0; }
.pc-diensten .pc-knop { margin-top: 26px; }

/* ─────────────────────────────────────────────────────────────
   Aanbod: wit, met een horizontaal kaartenspoor dat rechts uit beeld
   loopt. De vierde kaart is in de referentie half zichtbaar; dat is geen
   fout maar het bewijs dat het een spoor is en geen raster.
   ───────────────────────────────────────────────────────────── */
/* min-height op de gemeten sectiehoogte: de Nederlandse kaarten zijn iets
   korter dan de Amerikaanse, en zonder deze regel schuift alles daaronder
   18px op ten opzichte van de referentie. */
.pc-aanbod { background: #fff; padding: 79px 0 82px; overflow: hidden; min-height: 812px; }
.pcx .pc-h2--midden { font-size: 37px; font-weight: 600; line-height: 44px;
  letter-spacing: -0.01em; text-align: center; }

.pc-spoor { display: flex; gap: 25px; margin-top: 82px; overflow-x: auto; scroll-behavior: smooth;
  scrollbar-width: none;
  padding-left: max(20px, calc((100% - var(--pc-container)) / 2)); }
.pc-spoor::-webkit-scrollbar { display: none; }
.pc-spoor-kaart { flex: 0 0 309px; align-self: flex-start;
  background: var(--pc-cream); border-radius: 8px; padding: 13px 13px 21px; }
.pc-spoor-foto { position: relative; }
.pc-spoor-foto > img { width: 283px; height: 281px; object-fit: cover; border-radius: 10px; }
.pc-spoor-kaart h3 { font-size: 20px; font-weight: 600; line-height: 28px; margin-top: 12px;
  padding: 0 4px; }
.pc-spoor-kaart p { font-size: 16px; line-height: 22px; margin-top: 12px; padding: 0 4px; }
/* 1px: de referentie meet 27px van de basislijn van de subtitel tot de
   bovenkant van de knop, en het tekstkader loopt nog 26px door onder die
   basislijn. Gemeten stond de knop met 18px marge 17px te laag. */
.pc-spoor-kaart .pc-knop { margin-top: 1px; height: 43px; }

/* De zonnestraal-sticker rechtsboven op de foto, 20px van de rechterrand en
   18px van de bovenrand. Navy tekst op goud: wit haalt daar 2,7:1. */
.pc-badge { position: absolute; top: 18px; right: 20px; width: 76px; height: 63px;
  display: grid; place-items: center; color: var(--pc-dark); text-align: center; }
.pc-badge svg { position: absolute; inset: 0; width: 100%; height: 100%; }
/* De ster erft currentColor voor zijn vulling; de tekst moet daar juist
   tegen afsteken, anders staat er goud op goud. */
.pc-badge span { position: relative; line-height: 1; color: var(--pc-dark); }
.pc-badge b { display: block; font-size: 16px; font-weight: 700; }
.pc-badge i { display: block; font-size: 10px; font-weight: 500; font-style: normal; margin-top: 5px; }

/* ─────────────────────────────────────────────────────────────
   Marquee-band: 100px hoog, volle breedte, doorlopende tekst.
   ───────────────────────────────────────────────────────────── */
.pc-marquee { height: 100px; background: var(--pc-accent); color: var(--pc-dark);
  display: flex; align-items: center; overflow: hidden; }
.pc-marquee-spoor { display: flex; align-items: center; flex: 0 0 auto;
  animation: pc-schuif 42s linear infinite; }
.pc-marquee-eenheid svg { width: 40px; height: 39px; }
.pc-marquee-eenheid { display: flex; align-items: center; gap: 14px; padding-right: 23px;
  font-size: 41px; font-weight: 700; line-height: 1; white-space: nowrap; }
.pc-marquee-punt { width: 13px; height: 13px; border-radius: 50%;
  background: currentColor; margin-right: 24px; flex: 0 0 auto; }
@keyframes pc-schuif { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .pc-marquee-spoor { animation: none; } }

/* ─────────────────────────────────────────────────────────────
   Werkwijze: vijf stappen in 3 + 2, met gebogen pijlen ertussen.
   Het raster is hier 1024 breed en dus breder dan de vaste container
   van 976; de tweede rij staat een halve kolom verschoven.
   ───────────────────────────────────────────────────────────── */
.pc-werkwijze { background: #fff; padding: 84px 0 84px; min-height: 734px; }
/* In de aanbodsectie staat deze kop direct onder de sectiepadding, hier onder
   een chip: 21px van de chiponderkant tot de kaplijn. */
.pcx .pc-werkwijze .pc-h2--midden { margin-top: 12px; }
.pc-stappen { position: relative; width: 1024px; max-width: 100%; margin: 50px auto 0; }
.pc-stappen-rij { display: grid; grid-template-columns: repeat(3, 1fr); }
.pc-stappen-rij--twee { grid-template-columns: repeat(2, 1fr); width: 683px; max-width: 100%;
  margin: 39px auto 0; }
.pc-stap { text-align: center; display: flex; flex-direction: column; align-items: center; }
.pc-stap-badge { position: relative; width: 62px; height: 62px; border-radius: 50%;
  background: var(--pc-cream); border: 1px solid #edece9; display: grid; place-items: center;
  color: var(--pc-ink); }
/* De tweede stap is de actieve: witte ring, accentschijf, licht icoon. */
.pc-stap--actief .pc-stap-badge { background: #fff; border: 1.5px solid var(--pc-ink); }
.pc-stap--actief .pc-stap-schijf { position: absolute; inset: 5px; border-radius: 50%;
  background: var(--pc-accent); }
.pc-stap-badge svg { position: relative; }
.pc-stap--actief .pc-stap-badge svg { color: var(--pc-dark); }
.pc-stap-pil { position: absolute; top: 1px; left: 50%; height: 13px; padding: 0 6px;
  border-radius: 6.5px; background: var(--pc-accent); color: var(--pc-dark);
  font-size: 8px; font-weight: 600; line-height: 13px; white-space: nowrap;
  box-shadow: 0 0 0 2px #fff; }
.pc-stap--actief .pc-stap-pil { background: #fff; color: var(--pc-ink); }
.pc-stap h3 { font-size: 20px; font-weight: 600; line-height: 26px; margin-top: 18px; }
.pc-stap p { font-size: 15px; line-height: 20px; color: #565656; max-width: 300px; margin-top: 11px; }

.pc-boog { position: absolute; color: var(--pc-accent); pointer-events: none; }

/* ─────────────────────────────────────────────────────────────
   Ons werk: kop, witte tabbalk met vier pillen, en een fotoraster
   van drie kaarten boven en een grote plus vier kleine eronder.
   ───────────────────────────────────────────────────────────── */
.pc-werk { background: var(--pc-cream); padding: 80px 0 81px; }
.pcx .pc-werk .pc-h2--midden { line-height: 41px; }
/* Eén spoor met even grote vierkante tegels. De vaste breedte (geen 1fr) houdt
   elke tegel exact even groot, ook als er een foto bijkomt; aspect-ratio 1/1
   met object-fit cover snijdt elke verhouding tot hetzelfde vierkant. */
.pc-werk-spoor { display: flex; gap: 24px; margin-top: 50px; overflow-x: auto;
  scroll-behavior: smooth; scrollbar-width: none; padding-bottom: 4px; }
.pc-werk-spoor::-webkit-scrollbar { display: none; }
.pc-werk-foto { flex: 0 0 309px; margin: 0; }
.pc-werk-foto img { width: 100%; aspect-ratio: 1 / 1; height: auto; object-fit: cover;
  border-radius: 14px; display: block; }
/* De vullijn: vier seconden vol, dan schuift het spoor een tegel op. Met
   transform in plaats van width, zodat de browser er geen layout voor hoeft
   te herberekenen en de lijn ook op een telefoon vloeiend loopt. */
.pc-werk-lijn { height: 3px; border-radius: 999px; background: rgba(10, 22, 40, .10);
  margin-top: 22px; overflow: hidden; }
.pc-werk-vul { display: block; height: 100%; width: 100%; border-radius: inherit;
  background: var(--pc-accent); transform-origin: left center;
  animation: pc-werk-vullen 4s linear infinite; }
.pc-werk-vul--stil { animation-play-state: paused; }
@keyframes pc-werk-vullen { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .pc-werk-lijn { display: none; } }

/* Voor/na-schuif. De bediening is een onzichtbare range over het hele beeld:
   slepen, tikken en de pijltjestoetsen werken daardoor alle drie, en de
   focusring hangt aan de greep zodat toetsenbordgebruik zichtbaar blijft. */
.pc-vgl { margin: 44px 0 8px; }
.pc-vgl-vat { position: relative; aspect-ratio: 16 / 9; border-radius: 14px; overflow: hidden;
  background: var(--pc-dark); touch-action: pan-y; }
.pc-vgl-vat img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.pc-vgl-bedien { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; padding: 0;
  opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
.pc-vgl-bedien::-webkit-slider-thumb { -webkit-appearance: none; width: 56px; height: 100%; }
.pc-vgl-bedien::-moz-range-thumb { width: 56px; height: 100%; border: 0; background: none; }
.pc-vgl-lijn { position: absolute; top: 0; bottom: 0; width: 2px; margin-left: -1px;
  background: #fff; box-shadow: 0 0 0 1px rgba(10, 22, 40, .18); pointer-events: none; }
.pc-vgl-greep { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 46px; height: 46px; border-radius: 50%; background: #fff; color: var(--pc-dark);
  display: flex; align-items: center; justify-content: center; gap: 2px;
  box-shadow: 0 6px 20px rgba(10, 22, 40, .3); }
.pc-vgl-bedien:focus-visible ~ .pc-vgl-lijn .pc-vgl-greep { outline: 3px solid var(--pc-accent); outline-offset: 3px; }
.pc-vgl-label { position: absolute; bottom: 16px; padding: 7px 14px; border-radius: 999px;
  font-size: 13px; line-height: 16px; font-weight: 600; color: #fff;
  background: rgba(10, 22, 40, .72); pointer-events: none; }
.pc-vgl-label--l { left: 16px; }
.pc-vgl-label--r { right: 16px; }
.pc-vgl figcaption { margin-top: 14px; font-size: 14px; line-height: 20px; color: #575757; text-align: center; }

/* Richtprijs-calculator onder de balk in de hero. Zelfde taal als de rest:
   witte kaart, 14px radius, accentknop. Eén vraag per scherm, want acht velden
   onder elkaar leest als huiswerk. */
.pc-calc-vat { margin-top: 10px; }

/* Prijsindicatie-wizard. De kaart is wit op een witte band, dus de rand moet
   het werk doen: een zichtbare lijn plus een accentrand bovenaan. Zonder die
   twee loopt het kaartvlak over in de pagina en scrolt de bezoeker er langs —
   precies wat er gebeurde. */
.pc-calc { background: #fff; border: 1px solid #ddd8cf; border-top: 3px solid var(--pc-accent);
  border-radius: 14px; padding: 26px 30px 28px; box-shadow: 0 14px 34px rgba(10, 22, 40, .09); }
.pc-calc--dicht { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.pc-calc-badge { display: inline-block; padding: 5px 11px; border-radius: 999px;
  background: #f6f1e4; color: var(--pc-dark); font-size: 12px; line-height: 15px; font-weight: 600; }
.pc-calc--dicht h2 { margin-top: 10px; font-size: 23px; line-height: 29px; font-weight: 600; }
.pc-calc--dicht p { margin-top: 5px; font-size: 14px; line-height: 20px; color: #565656; }
.pc-calc-kop { display: flex; align-items: center; justify-content: space-between; }
.pc-calc-tel { font-size: 13px; line-height: 16px; font-weight: 600; color: #565656; }
.pc-calc-terug { display: inline-flex; align-items: center; gap: 6px; padding: 8px 4px;
  min-height: 44px; background: none; border: 0; cursor: pointer;
  font-size: 13px; font-weight: 600; color: var(--pc-dark); }
.pc-calc-balk { margin-top: 10px; height: 4px; border-radius: 999px; background: #eceae5; overflow: hidden; }
.pc-calc-balk i { display: block; height: 100%; background: var(--pc-accent); transition: width .25s ease; }
.pc-calc-vraag h2, .pc-calc-uitkomst h2 { margin-top: 20px; font-size: 24px; line-height: 31px; font-weight: 600; }
.pc-calc-keuzes { margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.pc-calc-keuzes button { display: block; min-height: 62px; padding: 13px 18px; text-align: left; cursor: pointer;
  background: #f6f4f0; border: 1px solid #e4e1da; border-radius: 12px;
  transition: border-color .15s ease, background .15s ease; }
.pc-calc-keuzes strong { display: block; font-size: 15px; line-height: 21px; font-weight: 600; color: var(--pc-ink); }
.pc-calc-keuzes span { display: block; margin-top: 2px; font-size: 13px; line-height: 18px; color: #6d6d6d; }
.pc-calc-keuzes button:hover { background: #fff; border-color: var(--pc-accent); }
.pc-calc-keuzes button:focus-visible { outline: 3px solid var(--pc-accent); outline-offset: 2px; }
.pc-calc-gerust strong { font-weight: 600; color: var(--pc-ink); }
.pc-calc-gerust { margin-top: 14px; font-size: 13px; line-height: 19px; color: #767676; }
.pc-calc-samenvatting { margin-top: 14px; padding: 0; list-style: none;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 4px 22px; }
.pc-calc-samenvatting li { display: flex; justify-content: space-between; gap: 12px;
  padding: 7px 0; border-bottom: 1px solid #efece6; font-size: 13px; line-height: 19px; }
.pc-calc-samenvatting li span:first-child { color: #767676; }
.pc-calc-samenvatting li span:last-child { font-weight: 600; color: var(--pc-ink); text-align: right; }
.pc-calc-uitkomst form { margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 12px; align-items: center; }
.pc-calc-fout { margin-top: 10px; font-size: 13px; color: #a8321e; }

@media (max-width: 760px) {
  .pc-calc { padding: 20px 18px 22px; }
  .pc-calc-keuzes { grid-template-columns: 1fr; }
  .pc-calc-vraag h2, .pc-calc-uitkomst h2 { font-size: 21px; line-height: 28px; }
  .pc-calc-uitkomst form { grid-template-columns: 1fr; }
}

/* ─────────────────────────────────────────────────────────────
   Keurmerken: kop, twee regels tekst en de merkenrail.
   ───────────────────────────────────────────────────────────── */
.pc-merken { background: #fff; padding: 80px 0 103px; }
.pc-merken-sub { font-size: 14px; line-height: 20px; color: #575757; text-align: center;
  margin-top: 10px; }
/* De rail loopt rustig door in plaats van stil te staan: twaalf merken passen
   niet naast elkaar in 974px, en in de referentie loopt de rij ook door tot
   voorbij de paginarand. De rij staat twee keer in de DOM zodat de lus naadloos
   is; bij prefers-reduced-motion staat hij stil. */
.pc-merkenrail { margin-top: 51px; height: 172px; display: flex; align-items: center;
  overflow: hidden; }
.pc-merkenrail-spoor { display: flex; flex: 0 0 auto; animation: pc-schuif 55s linear infinite; }
.pc-merkenrail-rij { display: flex; align-items: center; gap: 64px; padding-right: 64px; }
.pc-merkenrail img { max-height: 58px; max-width: 190px; width: auto; object-fit: contain;
  flex: 0 0 auto; }
.pc-merkenrail:hover .pc-merkenrail-spoor { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .pc-merkenrail-spoor { animation: none; } }

/* ─────────────────────────────────────────────────────────────
   Reviews: scoreblok links, kaartenspoor rechts dat uit beeld loopt.
   ───────────────────────────────────────────────────────────── */
/* Onderpadding 59 in plaats van 83: de echte klantquotes zijn langer dan de
   Amerikaanse en maken de kaarten 22px hoger. Zo blijft de sectie toch 607
   hoog en staan alle secties eronder nog op hun gemeten y. */
.pc-reviews { background: var(--pc-cream); padding: 82px 0 73px; overflow: hidden; }
.pc-chip--rand { display: inline-flex; align-items: center; gap: 6px; height: 31px;
  padding: 0 12px; border-radius: 15.5px; background: #fff;
  box-shadow: inset 0 0 0 1px rgba(19,19,17,.65);
  font-size: 14px; font-weight: 500; line-height: 1; color: var(--pc-ink); }
.pcx .pc-h2--groot { font-size: 38.6px; font-weight: 600; line-height: 44px;
  letter-spacing: -0.01em; text-align: center; margin-top: 11px; }

.pc-reviews-blok { display: flex; gap: 39px; margin-top: 43px; }
.pc-score-kolom { flex: 0 0 127px; text-align: center; }
.pc-score-woord { font-size: 20px; font-weight: 600; line-height: 1; }
.pc-score-rij { display: flex; justify-content: center; gap: 7px; margin-top: 18px;
  color: var(--pc-accent); }
.pc-score-rij svg { width: 18px; height: 17px; }
.pc-score-onder { font-size: 15px; line-height: 1; color: #5b5955; margin-top: 12px; }
.pc-score-bron { font-size: 26px; font-weight: 600; line-height: 1; margin-top: 13px; }

.pc-review-spoor { display: flex; gap: 25px; overflow-x: auto; scroll-behavior: smooth; scrollbar-width: none;
  padding-bottom: 4px; }
.pc-review-spoor::-webkit-scrollbar { display: none; }
/* min-width: 0 erbij: in een flexrij mag een item standaard niet kleiner
   worden dan zijn inhoud, en de reviewtekst duwde de kaart naar 386px. */
.pc-review { flex: 0 0 308px; min-width: 0; min-height: 264px; background: #fff; border-radius: 16px;
  padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,.05); display: flex; flex-direction: column; }
.pc-review-sterren { display: flex; gap: 7px; color: var(--pc-accent); }
.pc-review-sterren svg { width: 18px; height: 17px; }
.pc-review p { font-size: 16px; line-height: 22px; color: #3b3a37; margin-top: 21px; }
.pc-review-lijn { height: 1px; background: #e8e8e8; margin: auto 0 0; }
.pc-review-voet { display: flex; align-items: center; gap: 8px; margin-top: 25px; }
.pc-review-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--pc-cream);
  display: grid; place-items: center; font-size: 18px; font-weight: 600; flex: 0 0 auto; }
.pc-review-voet > span:nth-child(2) { min-width: 0; flex: 1; }
/* 16px in plaats van de gemeten 18: "Geert Vandenbussche" is 185px breed bij
   18px en de naamkolom in de kaart is er 172. Bij 16px past hij op één regel. */
.pc-review-naam { display: block; font-size: 16px; font-weight: 600; line-height: 1; white-space: nowrap; }
.pc-review-rol { display: block; font-size: 14px; line-height: 18px; color: #5b5955; margin-top: 8px; }
/* Een merkteken van 28px zoals de G in de referentie, maar als letter: het
   Google-beeldmerk staat niet in de repo en natekenen is namaken. Het woord
   "Google" voluit maakt de naamkolom 52px smaller en breekt "Vandenbussche". */
.pc-review-bron { margin-left: auto; flex: 0 0 auto; width: 24px; height: 24px;
  border-radius: 50%; background: var(--pc-cream); display: grid; place-items: center;
  font-size: 15px; font-weight: 600; color: #5b5955; }
/* ─────────────────────────────────────────────────────────────
   Bediening onder een horizontaal spoor: twee pijlknoppen en een
   voortgangsbalk. Zonder dit is op een telefoon niet te zien DAT er
   opzij te scrollen valt, en op een muis voelt zijwaarts scrollen raar.
   ───────────────────────────────────────────────────────────── */
.pc-bediening { display: flex; align-items: center; justify-content: center; gap: 16px;
  margin-top: 28px; }
.pcx .pc-bediening button { width: 44px; height: 44px; border-radius: 50%; background: #fff;
  display: grid; place-items: center; color: var(--pc-ink); flex: 0 0 auto;
  box-shadow: inset 0 0 0 1px var(--pc-lijn);
  transition: background-color .18s ease, color .18s ease, opacity .18s ease; }
.pcx .pc-bediening button:hover:not(:disabled) { background: var(--pc-accent); color: var(--pc-dark);
  box-shadow: none; }
.pcx .pc-bediening button:disabled { opacity: .35; cursor: default; }
.pc-bediening-rail { position: relative; width: 180px; height: 4px; border-radius: 2px;
  background: var(--pc-lijn); overflow: hidden; }
.pc-bediening-rail i { position: absolute; top: 0; bottom: 0; left: 0; border-radius: 2px;
  background: var(--pc-accent); transition: transform .18s ease, width .18s ease; }
.pc-bediening-tel { font-size: 14px; color: #5b5955; min-width: 44px; text-align: center; }

/* ─────────────────────────────────────────────────────────────
   Contact: drie infokaarten, formulierkaart links, foto rechts.
   ───────────────────────────────────────────────────────────── */
.pc-contact { background: #fff; padding: 81px 0 167px; position: relative; }
.pc-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-top: 42px; }
.pc-info-kaart { background: var(--pc-cream); border-radius: 12px; min-height: 111px;
  padding: 20px 16px 8px; display: flex; gap: 11px; }
.pc-info-cirkel { width: 46px; height: 46px; border-radius: 50%; background: var(--pc-accent);
  color: var(--pc-dark); display: grid; place-items: center; flex: 0 0 auto; }
.pc-info-kaart h3 { font-size: 18px; font-weight: 600; line-height: 1; margin-top: 5px; }
.pc-info-kaart > div { min-width: 0; }
/* 13px in plaats van de gemeten 16: "August van Landeghemstraat 63" is 230px
   breed bij 14px en 265 bij 16px, terwijl de tekstkolom in de kaart 219px is.
   Bij 13px is de regel 213px en blijft de kaartrij 111 hoog, zoals gemeten. */
.pc-info-kaart p { font-size: 13px; line-height: 27px; color: #5b5955; margin-top: 6px; }

.pc-contact-rij { display: grid; grid-template-columns: 474fr 434fr; gap: 66px; margin-top: 40px; }
.pc-form { background: #fff; border-radius: 14px; padding: 20px;
  box-shadow: 0 2px 12px rgba(10,22,40,.06), 0 24px 60px -30px rgba(10,22,40,.20); }
.pc-form h3 { font-size: 22px; font-weight: 600; line-height: 1; margin-top: 8px; }
.pc-form-sub { font-size: 14px; line-height: 1; color: #4a4945; margin-top: 12px; }
/* Het ritme uit de referentie: van kaplijn label tot bovenkant veld 25px,
   van onderkant veld tot volgende kaplijn 19px. Omgerekend naar kaders (de
   kaplijn ligt 2px onder de kaderrand) is dat 13px onder het label en 17px
   boven de volgende rij. */
.pc-form-paar { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 17px; }
.pc-form-sub + .pc-form-paar { margin-top: 26px; }
.pc-form-veld { display: block; }
.pc-form-veld span { display: block; font-size: 14px; font-weight: 600; line-height: 1;
  margin-bottom: 13px; }
.pc-form input, .pc-form select, .pc-form textarea { width: 100%; height: 42px; border: 0;
  border-radius: 8px; background: #f1f1f1; padding: 0 15px;
  font: 400 14px/42px Poppins, system-ui, sans-serif; color: var(--pc-ink); outline: none; }
.pc-form textarea { height: 125px; padding: 10px 15px; line-height: 20px; resize: vertical; }
.pc-form select { appearance: none; cursor: pointer;
  background-image: linear-gradient(45deg, transparent 49%, var(--pc-ink) 50%), linear-gradient(-45deg, transparent 49%, var(--pc-ink) 50%);
  background-position: calc(100% - 24px) 19px, calc(100% - 18px) 19px;
  background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.pc-form input::placeholder, .pc-form textarea::placeholder { color: #6f6d6a; }
.pc-form-enkel { margin-top: 17px; }
.pc-form .pc-knop { margin-top: 14px; padding: 0 16px; gap: 7px; }
.pc-form-melding { font-size: 13px; margin-top: 12px; }
.pc-contact-foto img { width: 100%; height: 603px; object-fit: cover; border-radius: 14px; }

/* ─────────────────────────────────────────────────────────────
   Eind-CTA: donkere band van 392px met een cirkelfoto die er 83px
   bovenuit steekt, in de witruimte van de contactsectie erboven.
   ───────────────────────────────────────────────────────────── */
.pc-eind { position: relative; height: 392px; overflow: visible; background: var(--pc-dark); }
.pc-eind-bg { position: absolute; inset: 0; overflow: hidden; }
.pc-eind-bg img { width: 100%; height: 100%; object-fit: cover; }
.pc-eind-bg::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(10,22,40,.82) 0%, rgba(10,22,40,.86) 100%); }
.pc-eind-vat { position: relative; z-index: 1; padding-top: 85px; max-width: 470px; }
.pcx .pc-eind h2 { font-size: 36px; font-weight: 600; line-height: 43px; color: #fff; }
.pc-eind p { font-size: 16px; line-height: 22px; color: #fff; margin-top: 18px; }
.pc-eind-knoppen { display: flex; gap: 13px; margin-top: 32px; }

/* De cirkel: Ø434 met een witte ring van 28, middelpunt 269px rechts van het
   paginamidden, bovenkant 83px boven de band. */
.pc-cirkel { position: absolute; top: -83px; left: calc(50% + 269px); transform: translateX(-50%);
  width: 434px; height: 434px; border-radius: 50%; background: #fff; padding: 28px;
  z-index: 2; box-shadow: 0 10px 30px -12px rgba(10,22,40,.35); }
.pc-cirkel img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

/* ─────────────────────────────────────────────────────────────
   Footer: vier kolommen met vaste startpunten, daaronder een
   scheidingslijn en de onderbalk.
   ───────────────────────────────────────────────────────────── */
.pc-footer { background: #fff; padding: 67px 0 20px; }
.pc-footer-grid { display: grid; grid-template-columns: 275px 188px 243px 1fr; gap: 0; }
.pc-footer-logo img { height: 48px; width: auto; }
.pc-footer p { font-size: 16px; line-height: 22px; margin-top: 24px; max-width: 275px; }
.pc-footer h3 { font-size: 24px; font-weight: 600; line-height: 1; }
.pc-footer-links { display: flex; flex-direction: column; gap: 19px; margin-top: 25px; }
.pc-footer-links a { font-size: 16px; line-height: 1; }
.pc-footer-links a:hover { color: var(--pc-accent-h); }
.pc-footer-contact { display: flex; flex-direction: column; gap: 14px; margin-top: 28px; }
.pc-footer-contact span { display: flex; gap: 8px; font-size: 16px; line-height: 21px; }
.pc-footer-contact svg { flex: 0 0 20px; margin-top: 3px; }
.pc-footer-soc { display: flex; gap: 12px; margin-top: 29px; }
.pc-footer-soc a { width: 41px; height: 41px; border-radius: 50%; background: #f6f6f6;
  display: grid; place-items: center; }
.pc-footer-soc a:first-child { background: var(--pc-accent); color: var(--pc-dark); }
.pc-footer-lijn { height: 1px; background: var(--pc-lijn-2); margin-top: 77px; }
.pc-footer-onder { display: flex; justify-content: space-between; align-items: baseline;
  margin-top: 17px; font-size: 15px; }
.pc-footer-onder a:hover { color: var(--pc-accent-h); }

/* ─────────────────────────────────────────────────────────────
   Mobiel: de referentie is een vaste 1200px-opzet. Onder 1000px
   stapelt alles; de maten hierboven blijven gelden op desktop.
   ───────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .pc-vat { padding: 0 20px; }
}
@media (max-width: 1000px) {
  /* Aanraakvlakken. Een link van 14px hoog is op een telefoon niet te raken;
     alles wat aanklikbaar is krijgt hier minstens 44px hoogte. */
  .pc-nav { flex-wrap: wrap; row-gap: 0; column-gap: 18px; }
  .pc-nav > a { padding: 13px 0; }
  /* De padding hoort op de LINK zelf, niet op de omhullende span: anders
     blijft het aanraakvlak de hoogte van de letters. */
  .pc-kop-contact span { padding: 6px 0; }
  .pc-kop-contact a, .pc-footer-contact a, .pc-info-kaart a { display: inline-block; padding: 13px 0; }
  .pc-telnr { padding: 12px 0; }
  .pc-nav > a { white-space: nowrap; }
  .pc-footer-links a { padding: 13px 0; }
  .pc-footer-contact span { padding: 11px 0; }
  .pc-footer-onder a, .pc-footer-onder span { padding: 12px 0; display: inline-block; }
  .pc-review-bron { width: 28px; height: 28px; }

  .pc-kop { position: static; height: auto; background: #fff; }
  /* padding-block, niet de shorthand: deze elementen dragen ook .pc-vat en
     die zet de zijmarge van 20px. Met "padding: 14px 0" viel die weg en
     plakte de hele kop tegen de schermrand. */
  .pc-kop-vat { flex-direction: column; height: auto; padding-block: 14px; }
  .pc-kop-logo { width: auto; }
  .pc-kop-streep { display: none; }
  .pc-kop-rij1, .pc-kop-rij2 { height: auto; padding: 12px 0; flex-wrap: wrap; gap: 14px; }
  .pc-kop-rij1 { border-bottom: 0; }
  .pc-kop-contact { margin-left: 0; flex-wrap: wrap; }
  .pc-kop-tel { width: auto; padding-left: 0; }
  /* Op mobiel staat de foto in de gewone stroom. Zonder deze volgorde komt hij
     bóven de kop te staan, want in de DOM staat hij vóór de header. */
  .pc-hero { height: auto; display: flex; flex-direction: column; }
  .pc-kop { order: 0; }
  .pc-hero-foto { order: 1; position: static; height: 300px; }
  .pc-hero-vat { order: 2; padding-block: 32px 44px; }
  .pc-hero-vlak, .pc-hero-sluier { display: none; }
  .pcx .pc-h1 { font-size: 36px; line-height: 40px; letter-spacing: -0.04em; }
  .pc-scroll { display: none; }
  .pc-balk { margin-top: 0; margin-bottom: 0; }
  .pc-over { padding: 44px 0 48px; }
  .pc-over-grid { grid-template-columns: 1fr; grid-template-rows: auto; gap: 28px; }
  .pc-over-grid > .pc-rij2 { align-self: start; }
  .pcx .pc-h2 { font-size: 27px; line-height: 33px; }
  .pc-getal span { font-size: 92px; }
  .pc-over-foto > img { height: 240px; }
  .pc-score { width: 124px; height: 140px; }
  .pc-score-sterren { gap: 6px; padding-top: 18px; }
  .pc-score-sterren svg { width: 12px; height: 11px; }
  .pc-score-cijfer { font-size: 56px; line-height: 40px; margin-top: 20px; }
  .pc-score-bij { margin-top: 16px; font-size: 14px; }
  .pc-divisies { grid-template-columns: 1fr; }
  .pc-diensten { padding: 44px 0 48px; }
  .pc-kaarten { grid-template-columns: 1fr; height: auto; gap: 16px; }
  .pc-kaarten-kolom { gap: 16px; }
  .pcx .pc-h2--donker, .pcx .pc-h2--midden { font-size: 27px; line-height: 33px; }
  .pc-aanbod { padding: 44px 0 48px; min-height: 0; }
  .pc-spoor { margin-top: 28px; padding-right: 40px; }
  .pc-spoor-kaart { flex: 0 0 78%; }
  .pc-bediening { margin-top: 20px; gap: 12px; }
  .pc-bediening-rail { width: 110px; }
  .pc-marquee { height: 64px; }
  .pc-marquee-eenheid { font-size: 24px; gap: 10px; padding-right: 16px; }
  .pc-marquee-eenheid svg { width: 24px; height: 24px; }
  .pc-marquee-punt { width: 8px; height: 8px; margin-right: 16px; }
  .pc-werkwijze { padding: 44px 0 48px; min-height: 0; }
  .pc-stappen { margin-top: 28px; }
  .pc-stappen-rij, .pc-stappen-rij--twee { grid-template-columns: 1fr; gap: 32px; width: 100%; margin-top: 32px; }
  .pc-boog { display: none; }
  .pc-werk { padding: 44px 0 48px; }
  /* Eén tegel bijna beeldvullend, met een streep van de volgende ernaast: dat
     is het teken dat er zijwaarts nog meer staat. */
  .pc-werk-spoor { gap: 12px; margin-top: 24px; padding-right: 40px; }
  .pc-werk-foto { flex: 0 0 78%; }
  .pc-werk-lijn { margin-top: 16px; }
  .pc-merken { padding: 44px 0 48px; }
  .pc-merkenrail { height: 96px; margin-top: 28px; }
  .pc-merkenrail-rij { gap: 40px; padding-right: 40px; }
  .pc-merkenrail img { max-height: 38px; max-width: 130px; }
  .pc-reviews { padding: 44px 0 40px; }
  .pc-reviews-blok { flex-direction: column; gap: 24px; margin-top: 28px; }
  .pc-score-kolom { flex: none; }
  .pc-review { flex: 0 0 82%; }
  .pc-review-spoor { padding-right: 40px; }
  .pc-contact { padding: 44px 0 60px; }
  .pc-info { grid-template-columns: 1fr; gap: 12px; margin-top: 28px; }
  .pc-contact-rij { grid-template-columns: 1fr; gap: 20px; margin-top: 24px; }
  .pc-contact-foto img { height: 260px; }
  .pc-eind { height: auto; padding: 44px 0 48px; }
  .pc-eind-vat { padding-top: 0; max-width: none; }
  .pcx .pc-eind h2 { font-size: 26px; line-height: 32px; }
  .pc-eind-knoppen { flex-wrap: wrap; }
  .pc-cirkel { display: none; }
  .pc-footer { padding: 40px 0 24px; }
  .pc-footer-grid { grid-template-columns: 1fr; gap: 28px; }
  .pc-footer p { max-width: none; }
  .pc-footer-onder { flex-direction: column; gap: 10px; }
  .pc-balk form { flex-wrap: wrap; padding: 20px; border-radius: 16px; }
  .pc-veld { flex: 1 1 240px; }
  .pc-balk .pc-knop { width: 100%; margin-left: 0; }
}

@media (max-width: 380px) {
  /* Onder 380px past "totaalrenovatie" niet meer op één regel bij 36px. */
  .pcx .pc-h1 { font-size: 29px; line-height: 34px; }
  .pcx .pc-h2--donker, .pcx .pc-h2--midden, .pcx .pc-h2--groot { font-size: 24px; line-height: 30px; }
  .pcx .pc-h2 { font-size: 24px; line-height: 30px; }
}

@media (max-width: 820px) {
  /* Boven de vouw hoort op een landingspagina het formulier te staan, niet de
     hele kop. Op 390x700 vulden de gestapelde koponderdelen 323px en de
     herofoto nog eens 300px; samen duwden die het formulier en de calculator
     eruit. Alles wat niet helpt om contact op te nemen wordt hier compact of
     verdwijnt: de links staan ook in de voettekst en in de pagina zelf. */
  /* de regel voor 1000px zet deze kop in een kolom; op de compacte stand moet
     hij juist op één rij, anders kost hij drie regels hoogte */
  .pc-kop-vat { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 10px; padding-block: 8px; height: auto; }
  .pc-kop-logo, .pc-kop-midden, .pc-kop-tel { flex: 0 0 auto; }
  .pc-kop-streep, .pc-nav, .pc-kop-rij1, .pc-tellabel { display: none; }
  .pc-kop-logo a { display: flex; align-items: center; min-height: 44px; }
  .pc-kop-logo img { max-height: 34px; width: auto; }
  .pc-kop-midden { margin-left: auto; }
  .pc-kop-midden { display: none; }
  .pc-kop-tel { display: flex; align-items: center; gap: 8px; }
  .pc-kop-tel .pc-teltegel { width: 36px; height: 36px; }
  .pc-telnr { display: inline-flex; align-items: center; min-height: 44px; font-size: 14px; }
  /* de herofoto duwt het formulier onder de vouw */
  .pc-hero { min-height: 0; }
  /* De foto stond boven de tekst en was 300px hoog; dat duwde het formulier
     onder de vouw. Nu staat hij ONDER de kop en is hij een band: zichtbaar,
     maar niet ten koste van het formulier. */
  .pc-hero-foto { display: block; order: 3; position: static; height: 170px; margin-top: 16px; }
  .pc-hero-vat { padding-block: 12px 16px; }
  .pc-hero-vat > .pc-chip { display: none; }
  .pcx .pc-h1 { font-size: 27px; line-height: 32px; }
  /* twee velden naast elkaar in plaats van vier onder elkaar */
  .pc-balk form { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; }
  .pc-balk form > .pc-knop { grid-column: 1 / -1; }
  .pc-balk .pc-veld { min-height: 42px; }
  .pc-balk .pc-veld input { padding-block: 10px; }
  /* De dichte calculator is boven de vouw een knop met een belofte, geen blok
     tekst: de uitleg staat een tik later toch op het eerste vraagscherm. */
  .pc-calc { padding: 12px 14px 14px; }
  .pc-calc--dicht { gap: 10px; }
  .pc-calc-badge { display: none; }
  .pc-calc--dicht h2 { margin-top: 0; font-size: 18px; line-height: 24px; }
  .pc-calc--dicht p { display: none; }
  .pc-calc--dicht .pc-knop { width: 100%; justify-content: center; }
}

/* Korte telefoonschermen (een iPhone SE is 640px hoog). Daar past de knop in de
   hero er niet meer bij, en die is ook de enige die niets toevoegt: het
   formulier eronder doet hetzelfde en staat al in beeld. */
@media (max-width: 820px) and (max-height: 740px) {
  .pc-hero-vat > .pc-knop { display: none; }
  /* op een kort scherm wordt de fotoband smaller in plaats van te verdwijnen */
  .pc-hero-foto { height: 120px; }
  .pcx .pc-h1 { font-size: 25px; line-height: 30px; }
}
`;