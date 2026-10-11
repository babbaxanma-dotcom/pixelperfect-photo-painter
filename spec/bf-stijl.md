# abgroep.be in de stijl van bfbouw.be — gelockte bouwspec (11 okt 2026)

Dit bestand is voor Claude en agents. Lees het volledig vóór elke stap en opnieuw na elke compactie.
Bij twijfel wint dit bestand van het gespreksgeheugen. Memory: `project_abgroep_bfstijl_okt.md`.

## 1. Opdracht en regels van Mohammed (11 okt 2026, woordelijk)
- "kijk naar hoe we de website hebben gebouwt voor bfbouw.be, we gaan abgroep.be volledig ombouwen naar die stijl; maar natuurlijk omvormen voor abgroep.be"
- "je mag op abgroep.be eigenlijk ook google 5 sterren gebruiken" → Google-badge "5,0 op Google" + 5 sterren MAG.
  Gemeten 11 okt 2026 op Google Maps (cid 0x7d0fc6746e96d5bf): AB Bouw Groep 5,0. Aantal reviews NOOIT tonen.
  Link van de badge: `https://www.google.com/maps/place//data=!4m3!3m2!1s0x4a0341ae3b55ce5d:0x7d0fc6746e96d5bf` (zelfde plaats als src/pages/abbouw/Review.tsx, zonder !12e1).
- "maar gewoon geen review sectie aangezien ze dat niet hebben" → nergens een reviewsectie, reviewtekst, reviewnaam of avatar.
- "Doe maar die dingen later nazien" → alle pagina's in één ronde ombouwen; Mohammed keurt achteraf. NIETS pushen, niets live.

## 2. Bron en doel
- Stijlbron: `C:/Users/Mohammed/bfbouw-website` (live: https://www.bfbouw.be). Markup: `build.cjs` + `bouw/paginas.cjs`; CSS: `src/css/site.css`; gedrag: `src/js/site.js`; copy BF: `bouw/inhoud.cjs`.
  Manifesten (regelnummers): `C:/Users/Mohammed/AppData/Local/Temp/claude/C--Users-Mohammed/d2e48715-4f5c-4bda-9fb4-d09a10f23089/scratchpad/kaart/*.md`
  (bf-markup, bf-css, bf-js, ab-repo, ab-guards, ab-copy, ab-fotos, ab-paginas). LET OP: die manifesten zeggen op enkele plaatsen dat de Google-badge weg moet. Dat is FOUT; deze spec wint (badge MAG).
- Referentieschermen BF (1265 en 390): `.../scratchpad/shots/bf-1265-vol-0N.png`, `bf-390-vol-0N.png`. Huidige abgroep: `ab-1265-*`, `ab-390-*`.
- Doel: worktree `C:/Users/Mohammed/abgroep-bfstijl`, branch `bf-stijl`. Nooit `npm install` (node_modules = junction). Nooit `git push`. Nooit `git stash`. Lokaal committen mag alleen de hoofdsessie.
- Dev-server van de hoofdsessie: http://127.0.0.1:4610 (vite, HMR). Niet stoppen, geen tweede vite-server op 4610 starten. `vite build` NIET draaien terwijl andere agents werken (dist-botsing); typecheck (`npx tsc --noEmit -p tsconfig.app.json`) mag altijd.
- Puppeteer: `createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json')('puppeteer-core')`, Chrome `C:/Program Files/Google/Chrome/Application/chrome.exe`, headless 'new', `--hide-scrollbars --disable-lcd-text`. Tests openen nooit een programma (geen echte tel:/mailto-navigatie, geen echte leads: onderschep `services.leadconnectorhq.com` en `api.web3forms.com` met request interception).

## 3. Scope
OMBOUWEN (BF-stijl, gedeelde schil): `/` · `/over` · `/diensten` · `/werkwijze` · `/contact` · `/dakwerken` `/gevel` `/bad` `/interieur` `/construct` `/ecologisch` · `/privacy` `/voorwaarden` `/cookies` · 404 (`*`).
Plus: `/index` → `<Navigate to="/" replace />` (de oude home toont 8 verzonnen reviews).
NIET AANRAKEN: `LpReplica.tsx`, `stijl.ts`, `Onderdelen.tsx`, `Iconen.tsx`, alles onder `src/pages/abbouw/lp/` (advertentieverkeer), `/bedankt`, `/afspraak`, `/dakinspectie`, `/status`, `/beoordeling`, `/review`, `/calculator/*`, `/totaalrenovatie`, `/badkamerrenovatie`, `src/lib/leads.ts`, `src/lib/tracking.ts`, `ab-bouw.css`, `roofpro.css`, `_rp.ts` (LpReplica importeert eruit), `index.css`.
Oude paginabestanden (HomePc, OverOns, Diensten, Werkwijze, Contact, _division, Privacy, Voorwaarden, Cookies, NotFound) blijven staan als terugval; alleen de routes in App.tsx wijzen naar de nieuwe componenten. `HOME` in `lp/replica/inhoud.ts` blijft bestaan (guards lezen het).

## 4. Architectuur
Nieuwe map `src/pages/abbouw/bf/`:
- `bf.css` — geporteerde BF-CSS. Methode (verplicht, scriptmatig, niet met de hand samenvatten):
  `scripts/bf-css-port.cjs` leest `bfbouw-website/src/css/site.css` met postcss (staat in node_modules), houdt de regels die bij de gebruikte componenten horen IN DE OORSPRONKELIJKE VOLGORDE (de cascade van BF is gelaagd: latere regels overschrijven eerdere), en:
  1. hernoemt ELKE klasse `.x` naar `.bf-x` (ook toestandsklassen: is-on → bf-is-on, menu-open → bf-menu-open, is-gescrold → bf-is-gescrold, …), ook in `:not()`, `:is()`, `:where()`, en @keyframes-namen krijgen `bf-`;
  2. zet `.bf ` vóór elke selector (scope: na een SPA-navigatie blijft de CSS geladen en mag ze nooit een LP raken); `:root`, `html`, `body` worden `.bf`;
  3. vervangt de tokens door AB-waarden (§5) en de BF-hexwaarden die kleur van het merk zijn;
  4. laat @font-face weg (Plus Jakarta Sans komt al via Google Fonts in index.html).
  Het script is herhaalbaar (`node scripts/bf-css-port.cjs` schrijft `bf.css` opnieuw). AB-specifieke aanvullingen staan in een apart bestand `bf-ab.css` dat NA bf.css laadt.
- `bf-ab.css` — (a) scoped reset tegen de globale AB-CSS die op elke pagina meedraait: ab-bouw.css (`*{margin:0;padding:0}`, `section{background:var(--bg);color:var(--ink)}`, `img{display:block}`, `h1..h5{font-family:Poppins;color:var(--ink)}`, …) en Tailwind preflight. Binnen `.bf` moeten font-family, kleur, achtergrond, marges en img-gedrag exact die van BF zijn. (b) componenten die BF niet heeft (FAQ, voor/na-schuif, 5-stappenraster). (c) kleurtokens AB.
- `schil.ts` — HTML-stringbouwers: `kop(pad)`, `voet()`, `belzweef()`, `paginakop({...})`, iconen (`ICOON`), `beeld(src, {...})`. Kopieer de BF-markup (bf-markup.md) met `bf-`-klassen.
- `blokken.ts` — gedeelde secties als stringbouwers: `overSplit`, `cijferband`, `dienstenSlider`, `zekerheid`, `inspectieBand`, `traject(n stappen)`, `realisatieRail`, `voorNa`, `faq`, `plaatsBlok` (contactblok + formulierkaart met tabs), `dienstRij`, `waardenRaster`, `beloftelijst`, `lees` (juridische tekst).
- `gedrag.ts` — `wireBf(root, {navigate, bron})` → geeft één cleanup-functie terug. Gedrag uit bf-js.md, met `bf-`-klassen: kop transparant→vast (scrollY>24), gsm-menu (+ Escape sluit, klik op link sluit, body scrollslot), hero-carrousel (6 s, fade 1,4 s, uit bij reduced motion en `?shoot=1`), diensten-slider (start op middelste kaart, pijlen, stippen, muis-slepen, toetsen), realisatie-rail (pijlen; autoplay 4 s alleen in beeld, uit bij reduced motion en navigator.webdriver), veeghint-stippen op gsm (zekerheid), traject `is-in-beeld` op gsm, zwevende belknop (scrollY > 0,6 × innerHeight), formuliertabs + elke `[data-kies]` (zet tab Plaatsbezoek en scrolt naar de formulierkaart, zonder focus), formulierverzending (§8), sprong naar `#anker` na de render (zoals LpReplica.tsx:322-341), voor/na-schuif.
- `inhoud.ts` — alle tekst van de BF-pagina's met bronopmerking per blok (woordelijk uit de bestaande bestanden, zie §6-7). Divisiedata IMPORTEREN uit `_divisies.ts` (één bron), niet kopiëren.
- `BfPagina.tsx` — wrapper: `<div class="bf" dangerouslySetInnerHTML>` + useEffect met `wireBf` + document.title/meta description/canonical (zoals LpReplica.tsx:435-452) + `scrollTo(0,0)`.
- Pagina's: `HomeBf.tsx`, `OverBf.tsx`, `DienstenBf.tsx`, `WerkwijzeBf.tsx`, `ContactBf.tsx`, `DivisieBf.tsx` (één sjabloon, 6 routes), `JuridischBf.tsx` (privacy/voorwaarden/cookies; de juridische tekst WOORDELIJK uit de bestaande bestanden), `NotFoundBf.tsx`.
- Schaal: zoals BF. `.bf` krijgt op ≥1001 px `container-type:inline-size; --u:min(1px, calc(100cqw / 1440))`; desktopmaten in `calc(N*var(--u))`. Gemeten 11 okt: op bfbouw.be blijft de vaste kop staan met container-type op body. Toets dat hier ook (kop na scrollen op top 0 bij 1265).
- Beelden: alleen ECHTE AB-foto's (§9). Maak webp-varianten met sharp (`scripts/bf-beelden.cjs` → `src/assets/bf/<naam>-<breedte>.webp`, 800/1440/2048 waar het origineel groot genoeg is, nooit opschalen boven het origineel), metadata (EXIF/GPS) weg. Elke `<img>`: width, height, alt, decoding="async", lazy behalve de eerste herodia (fetchpriority high).
- Geen scroll-reveal, geen parallax, geen optellende cijfers, geen hover-lift: Mohammeds gelockte regel voor abgroep (3 aug: "heel die scroll efect dingetje ... mag allemaal weg"). De carrousel mag (zijn vraag 1 okt). De uitgelichte dienstkaart mag haar BF-stand houden (translateY -8u + ring), dat is toestand, geen hover.

## 5. Kleuren en letters (BF → AB)
| BF-token | BF | AB |
|---|---|---|
| --merk | #fc6607 | #d98c03 (AB-goud, vlakken en knoppen) |
| --merk-ui | #ef6107 | #d98c03 |
| --merk-tekst (merkkleur als tekst op licht) | #bd4d05 | #915e02 (4,99:1 op wit) |
| merkkleur als tekst op donker | — | #e0a83c |
| --merk-diep (hover knop) | #b54905 | #c27c02 (navy erop 5,3:1) |
| --op-merk (tekst op merkkleur) | #1c1c1c | #0a1628 (navy, 6,6:1 op #d98c03) |
| --ink (koppen) | #0b0b0c | #0a1628 |
| donkere vlakken (#1c1c1c: hero-grond, cijferband, dienstenbanner) | #1c1c1c | #0a1628 |
| verloop cijferband | #1c1c1c → #3a2414 | #0a1628 → een donkere goudtint; ziet het modderig uit, dan #0a1628 → #16294a |
| verloop inspectieband | #ff8a3d → #e85a05 | #e9a531 → #c98303 |
| stippen | #f3c2a3 | #efd59b |
| Google-sterren | #f4b400 | #f4b400 |
| grijzen, wit, lijnen | BF | BF (ongewijzigd) |
Wit op goud is 2,7:1 en zakt door AA: tekst op goud is ALTIJD navy. Letter: Plus Jakarta Sans (zit in index.html), gewichten zoals BF.

## 6. Gedeelde schil
- **Kop** (BF `kop--over`): transparant over de hero/paginakop, na 24 px scrollen wit met blur en het donkere logo. Logo wit-goud `src/assets/home/logo-wit-goud.png` (gemaakt 11 okt uit logo-trim.png: navy → wit, goud blijft) en donker `src/assets/home/logo-trim.png` (1071×305). Menu: Over ons `/over` · Diensten `/diensten` · Werkwijze `/werkwijze` · Contact `/contact` (aria-current op de actieve). Rechts: belknop met icoon + "0460 20 77 88" (`CONTACT.phone`), knop "Gratis offerte" → `#offerte` op pagina's met plaatsblok, anders `/contact`.
  Gsm (≤1000): logo, vierkante belknop 48 px, hamburger 48 px; na scrollen vervangt de pil "Gratis plaatsbezoek" (`data-kies`) de belknop; op pagina's zonder plaatsblok linkt de pil naar `/contact#offerte`. Menu-paneel zoals BF + Escape + sluit bij linkklik.
  De oude regel "kop bovenaan weg" (5 okt) hoorde bij het oude ontwerp; de BF-kop staat bovenaan transparant in beeld (aanname A1).
- **Zwevende belknop** op gsm (BF `belzweef`), `tel:` uit CONTACT, aria-label "Bel AB Bouw Groep op 0460 20 77 88". Niet op /contact.
- **Voet** (BF `voet--sub`, grijs, 4 kolommen): donker logo + "Bouw en renovatie voor dak, gevel, badkamer en interieur. Actief in Vlaanderen en Brussel." · "Snel naar": Over ons, Diensten, Werkwijze, Contact · "Onze diensten": de 6 `DIENST_LINKS`-teksten/routes uit `_rp.ts:151-158` (importeren, niet kopiëren) · "Contact": telefoon, adres (`CONTACT.address`), e-mail, "BTW " + `CONTACT.btw.display` · onderregel "© {jaar} AB Bouw Groep · BTW {CONTACT.btw.display}" + Privacy · Voorwaarden · Cookies. Geen sociale iconen.
- **Paginakop** (BF `paginas.cjs:103`): echte foto + donkere laag + kruimelpad + h1 op 2 regels (2e regel lichter, zoals de hero) + subkop. Vlakke variant (geen foto) voor juridisch en 404.
- Eén h1 per pagina. `id="offerte"` op het plaatsblok; ankers krijgen `scroll-margin-top` = kophoogte.

## 7. Homepage `/` (volgorde, tekst, beeld)
Bron van de tekst: `src/pages/abbouw/lp/replica/inhoud.ts` HOME (r.598-793) = dictaat Mohammed 4 okt. WOORDELIJK overnemen; niet inkorten, niet herschrijven.
1. **Kop** (§6).
2. **Hero** (BF hero): 4 dia's (§9). h1 = "Uw bouw- of renovatieproject," + `<span class="bf-hero__kop2">perfect geregeld</span>`. Tekst = HOME.hero.sub (inh:662). Knop 1 "Vraag een plaatsbezoek aan" (`data-kies`, pijl). Knop 2 (rand-wit) "Bel 0460 20 77 88" (`tel:`; vervangt zijn "Of bel direct"-regel als gelijkwaardige knop, regel geen-of-bel). Pijl omlaag naar `#over`.
3. **Over-split** `id="over"` (BF `.over`): kop "Alle vakmensen onder één dak" (h2, zoals BF één kopregel), alinea 1 en 2 = HOME.over (inh:674-675) woordelijk; knop "Meer over ons" → `/over`; Google-badge (G-icoon, 5 sterren, "5,0 op Google", link §1, target _blank rel noopener). Foto rechts §9.
4. **Cijferband** (BF `.cijfers`, donker, 4 tegels, statische getallen): "6" · "Vakdisciplines onder één dak" | "5,0" · "Op Google" | "10 jaar" · "Wettelijke aansprakelijkheid" | "Gratis" · "Plaatsbezoek en offerte". Iconen in BF-stijl (gereedschap/huis, ster, schild, huis-met-vergrootglas). `data-claimbron` per tegel: dictaat 4 okt /over · Google Maps 11 okt · wet · FAQ dictaat 4 okt.
5. **Diensten** `id="diensten"` (BF `.dsectie` + slider): kop "Onze diensten"; rechts "Eén betrouwbare partner voor al uw bouw- en renovatieplannen." (dictaat /diensten) + knop "Bekijk alle diensten" → `/diensten`. 6 kaarten in deze volgorde (middelste uitgelicht bij start = Gevelrenovatie of Badkamer volgens BF-start floor((n-1)/2)=2):
   Totaalrenovatie en nieuwbouw `/construct` · Dakwerken `/dakwerken` · Gevelrenovatie `/gevel` · Badkamer en wellness `/bad` · Interieurwerken `/interieur` · Ecologisch en energetisch `/ecologisch`.
   Kaarttekst = HOME.diensten.kaarten (inh:687-706) woordelijk, BEHALVE ecologisch: "Installatie van warmtepompen en efficiënte technieken." (dictaat /diensten, past bij de enige echte foto: vloerverwarming). Link "Lees meer over <titel in kleine letters>". Icoon per afdeling in BF-lijnstijl.
6. **Zekerheid** (BF `.waarom`, huisvorm + 4 kaarten; gsm = swipe-rail met stippen): h2 midden "Bouwen op zekerheid" + streep + lede HOME.aanbod.lede (inh:760) woordelijk. 4 kaarten = HOME.aanbod (VCA-gecertificeerd · Tienjarige aansprakelijkheid · 6% btw-tarief · Attesten voor uw premies) woordelijk.
7. **Inspectieband** (BF `.inspectie`, goud verloop, navy tekst): kop "Laat uw nummer achter"; tekst "Wij bellen u terug om een plaatsbezoek in te plannen. Dat bezoek en de offerte erna zijn kosteloos." (live tekst eindband); knoppen "Vraag een plaatsbezoek aan" (`data-kies`) en "Bel 0460 20 77 88".
8. **Traject** `id="werkwijze"` (BF `.proces`): kop "Van het eerste gesprek" / "tot de laatste afwerking" (HOME.werkwijze, 2 regels), geen introtekst, knop "Bekijk onze werkwijze" → `/werkwijze`, foto rechts §9. Stapkaarten: de 5 stappen van HOME.werkwijze woordelijk (titel + tekst, pil "Stap N", icoon in goud vierkant). Raster desktop: 6 kolommen, stap 1-3 elk 2 kolommen, stap 4-5 elk 3 kolommen. Gsm: onder elkaar, `is-in-beeld`.
9. **Uitgevoerd werk** `id="realisaties"` (BF `.rslider-sectie`): kop "Uitgevoerd werk", geen knop, rail met pijlen, onderschrift = één categoriewoord (afdeling). Daaronder de voor/na-schuif (breedte 1200u, radius 18u, labels uit de LP-bron van dat fotopaar).
10. **Veelgestelde vragen** `id="vragen"`: h2 midden + streep, HOME.faq (4 vragen) woordelijk, `<details>`/`<summary>` (werkt zonder JS), eerste open, BF-kaartstijl (wit, radius 14u, lijn #ececec, plusje in cirkel, goud als open).
11. **Plaatsblok** `id="offerte"` (BF `.plaats`, goud blok, navy tekst): kop "Laten we uw plannen bespreken" (HOME.contact), pil-knop "Vraag een gratis plaatsbezoek aan" (`data-kies`), lede HOME.contact.tekst woordelijk, tegels Telefoon / E-mail / Adres (CONTACT), logokaart (donker logo op wit). Formulierkaart §8.
12. **Voet** + zwevende belknop.
Weg ten opzichte van BF: reviews, blog ("Tips en uitleg"), knop "alle realisaties". Weg ten opzichte van de huidige AB-home: losse formulierbalk onder de hero, lijst met 6 afdelingslinks in de over-sectie (de diensten-slider vervangt hem), tegel "Werkgebied", ronde foto en achtergrond van de eindband (AI-beelden).

## 8. Formulier (plaatsblok, alle pagina's met plaatsblok)
- Tabs (BF `fwissel`): "Offerte aanvragen" | "Gratis plaatsbezoek". Panelen zoals BF (`hidden` op het inactieve).
- Velden: "Voornaam en naam" (naam) · "Telefoonnummer" (telefoon, type tel) · "E-mailadres" (email) · "Om welk werk gaat het?" (werk: Totaalrenovatie en nieuwbouw · Dakwerken · Gevelrenovatie · Badkamer en wellness · Interieurwerken · Ecologisch en energetisch · Combinatie van werken · Weet ik nog niet) · "Postcode" (4 cijfers) · "Beschrijf kort uw project" (plaatshouder "Type werken, gewenste startdatum, …").
- Uitleg boven de velden: "Vul uw telefoonnummer of e-mailadres in." Validatie zoals de huidige AB-home: telefoon (≥8 cijfers) OF geldig e-mailadres verplicht; naam en werk optioneel; foutmelding in `role=status`, focus op het veld. Een lead met alleen telefoon gaat ALTIJD door.
- Verzenden: `submitLead` uit `src/lib/leads.ts` (GHL + Web3Forms parallel, conversie bij levering): `{ source: 'landing_page', page_path: location.pathname, landing_division: <key>, firstName, lastName, email, phone, type_werk: <key>, aanvullende_info: [tab, werk, 'Postcode: x', project].filter(Boolean).join('\n'), bron_lead: '<pagina>:<offerte|plaatsbezoek>' }` met key via `divisieKey()` of de vaste map: Totaalrenovatie→ab_construct, Dakwerken→ab_dakwerken, Gevelrenovatie→ab_gevelbekleding, Badkamer→ab_bad__wellness, Interieur→ab_interieurwerken, Ecologisch→ab_ecologisch, Combinatie→combinatie_meerdere_divisies, Weet ik nog niet/leeg→nog_te_bepalen. Op een divisiepagina is de standaardkeuze die afdeling.
- `trackFormStart('<pagina>:plaatsblok')` bij de eerste focus. Knop uit tijdens verzenden (geen dubbele lead). Na succes: `navigate('/bedankt?dienst=totaalrenovatie')`. Bij fout: `leadFoutmelding(res, CONTACT.phone.display)`.
- NOOIT mailto, nooit een mailprogramma. Privacyregel onder de knop: "We gebruiken uw gegevens enkel om uw aanvraag te behandelen. Lees ons privacybeleid." (link /privacy).
- Knoptekst: tab 1 "Offerte aanvragen", tab 2 "Plaatsbezoek aanvragen".

## 9. Beelden (alleen echt; tweelingen nooit samen op één pagina, zie ab-fotos.md §6)
Home:
- Hero: 1 `C:/Users/Mohammed/Downloads/IMG_9019 (1).jpeg` (drone, dak gestript; kopiëren via sharp naar `src/assets/lp-diensten/eigen/IMG_9019.jpg`, metadata weg) · 2 `eigen/IMG_0102.jpg` · 3 `realisaties/totaalrenovatie-p5-a.jpg` · 4 `eigen/IMG_9028.jpg` (object-position 60% center).
- Over-split: `eigen/IMG_0105.jpg` (vakman aan het werk; past bij "Alle vakmensen onder één dak").
- Dienstenbanner: `realisaties/tegelwerken-p4-a.jpg` (onder donkere laag).
- Kaarten: Totaalrenovatie `eigen/IMG_9029.jpg` (80% center) · Dak `dak-na.jpg` · Gevel `gevel/uitbreiding-gevel.jpg` · Bad `eigen/IMG_9025.jpg` · Interieur `eigen/IMG_9065.jpg` · Ecologisch `eigen/IMG_9064.jpg`.
- Zekerheid huisvorm: `pleisterwerk-g2.jpg` · inzet: `realisaties/terras-p4-b.jpg`.
- Traject: `kaart-ruwbouw.jpg`.
- Rail (8): `eigen/IMG_0106` · `eigen/IMG_9027` · `eigen/IMG_0114` · `eigen/IMG_9069` (75% center) · `eigen/IMG_0111` · `eigen/IMG_9014` · `eigen/IMG_0100` · `eigen/IMG_0110`.
- Voor/na: `woonkeuken-voor.jpg` / `woonkeuken-na.jpg` (zoals op de LP, kgj/inhoud-totaalrenovatie.ts:306-307).
VERBODEN overal: `realisaties/*-p1/p2/p3`, `lp-diensten/totaalrenovatie-hero.jpg`, `badkamer-nieuw.jpg`, `tegelwerken-hero.jpg`, `badkamer-hero.jpg`, `home/svc-*`, `kaart-technieken`, `kaart-vloeren`, `badkamer-werf`, `totaalrenovatie-what`, mappen `interieur/`, `bad/`, `construct/`, `eco/*`, `home/hero-steenstrips`, `dak/drone-antraciet`, elke AI- of stockfoto.
Subpagina's: kies per pagina uit dezelfde echte lijst (ab-fotos.md §3), nooit een tweeling op dezelfde pagina; een afdeling zonder eigen foto krijgt geen nepfoto maar een vlakke paginakop.

## 10. Subpagina's (BF-tegenhanger → AB-inhoud, tekst woordelijk uit het bestaande bestand)
- `/over` (OverOns.tsx): paginakop "Het bedrijf achter" / "uw verbouwing" · cijferband met 2 tegels (16 jaar ervaring, 6 vakdisciplines onder één dak: zijn tekst, live) · over-split "Hoe wij werken" (r.65-73) + Google-badge · belofte-lijst "De mensen op uw werf" (r.82-83, punten r.25-30) · waarden-raster "Officieel erkend en verzekerd" (r.94-95, erkenningen r.34-37) · plaatsblok met kop "Zullen we uw plannen bespreken?" en tekst r.111.
- `/diensten` (Diensten.tsx): paginakop "Onze diensten" + sub r.97 + lede r.98 · 6 dienstrijen (foto, nummer, titel, lede, 3 vinkpunten r.23-78, knop "Meer over <afdeling>") · inspectieband · belofte-lijst "Onze belofte bij elk project" (r.130, punten r.81-83) · plaatsblok (kop "Bespreek uw project met ons", r.136).
- `/werkwijze` (Werkwijze.tsx): paginakop "Onze werkwijze" + r.56 · traject met de 8 stappen r.18-33 (titel, tekst, tijdregel klein onder de titel) en kop r.62 · plaatsblok (kop "Klaar voor stap 1?" is een vraag als kop: gebruik HOME.contact-kop; tekst r.99).
- `/contact` (Contact.tsx): paginakop "Contact" + één zin uit de bestaande pagina · plaatsblok (tabs). Openingsuren NIET (aanname zonder bron). Geen zwevende belknop.
- 6 divisiepagina's (`_division.tsx` + `_divisies.ts`): paginakop (heroTitle 2 regels, heroLede, kruimelpad Home › Diensten › afdeling, knoppen "Vraag een plaatsbezoek aan" + "Bel 0460 20 77 88") · dienstrij met het verhaal + 3 features · waarden-raster "Wat wij doen" (3) · traject met de 4 processtappen ZONDER tijdlabels ("binnen 5 werkdagen" e.d. heeft geen bron) · FAQ (4) · "Andere diensten": dienstenslider met de 5 andere afdelingen · plaatsblok (standaardkeuze = deze afdeling).
  CORRECTIE gevel-FAQ (`_divisies.ts`, vraag "Hoe zit het met de premie voor gevelisolatie?"), bron ruwe HTML vlaanderen.be gelezen 11 okt 2026: "Sinds 1 maart 2026 krijgen alleen eigenaar-bewoners uit inkomenscategorie 3 en 4 nog Mijn VerbouwPremie voor de buitenmuur: tot 35% (maximaal € 3.500) of tot 50% (maximaal € 5.000) van de factuur zonder btw, voor isolatie en renovatie samen. Voor categorie 1 en 2 is er geen premie meer. Wat voor iedereen blijft: 6% btw als uw woning ouder is dan tien jaar. Bij het plaatsbezoek rekenen wij door wat de isolatie u oplevert." Daarna `node scripts/maak-chat-kennis.mjs` (check:chat).
- `/privacy`, `/voorwaarden`, `/cookies`: vlakke paginakop + BF `.lees`-tekst, WOORDELIJK de bestaande juridische tekst (exporteer de tekst uit het oude bestand of verplaats ze naar een gedeelde module; geen woord wijzigen; btw via CONTACT.btw). Geen plaatsblok.
- 404: vlakke paginakop "Deze pagina bestaat niet" in BF-stijl, knoppen naar `/` en `tel:` uit CONTACT.

## 11. Kopregels en SEO
- document.title en meta description per pagina = de huidige waarden (LpReplica/OverOns/... zetten ze nu). Canonical `https://abgroep.be<pad>`.
- index.html: JSON-LD-adres "Industrieweg 14" → `CONTACT`-adres (August van Landeghemstraat 63, 2830 Willebroek); "15 jaar garantie, gefixeerde offertes" uit description/og/twitter (geen bron).

## 12. Verboden (grep vóór elke oplevering, met positieve controle)
reviews/reviewnamen/avatars · "4,9" · aantallen klanten/werven/realisaties ("120+", "100+") · "binnen vijf werkdagen" en andere termijnen op de home · "of bel" · mailto in formulierlogica · AI/stockbeelden uit §9 · uppercase met letter-spacing ≥ 2px als label boven een kop · nieuwe claims die niet in deze spec staan.

## 13. Keuring (alles groen, anders niet "klaar")
Breedtes: 1265 (Mohammeds venster: 1920×1080 op 150 %), 1440, 1001, 1000, 390. Per route: geen horizontale overflow, console leeg, geen gebroken beeld, precies 1 h1, alle links 200, font Plus Jakarta Sans geladen, contrast AA (DOM + tekst op foto gemeten tegen pixels), knoppen ≥ 44 px op gsm, bodytekst ≥ 16 px op gsm, kop blijft vast na scrollen. Visueel naast BF op dezelfde breedte (zelfde sectie). Gedrag: alle onderdelen van §4 gedrag. Formulier: met onderschepping, nul echte leads.

## 14. Aannameregister (Mohammed vetoot)
A1 BF-kop bovenaan zichtbaar (transparant), i.p.v. "kop bovenaan weg" van 5 okt.
A2 Cijferband zonder "16 jaar" op de home (btw-nummer 1010.… dateert van ~2024; als het Bardhs persoonlijke ervaring is, mag het terug). Op /over blijft zijn tekst staan.
A3 Herorij "Of bel direct" wordt de tweede heroknop "Bel 0460 20 77 88".
A4 Geen scroll-animaties, parallax of optellende cijfers (lock 3 aug), wel carrousel en sliders.
A5 FAQ blijft op de home (BF heeft er geen; zijn tekst).
A6 Contact zonder openingsuren en zonder tegel "Werkgebied".
A7 Tijdlabels "binnen 5 werkdagen" e.d. van de divisiepagina's vallen weg.
A8 Kaarttekst ecologisch = zijn dienstenzin over warmtepompen (foto = vloerverwarming).
A9 Bedankpagina, LP's, CRM-pagina's en calculators blijven in hun huidige stijl.
