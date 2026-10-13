/**
 * STOCKFOTO'S — LICENTIELIJST (sfeerbeeld, alleen op /dakwerken en, GEWIJZIGD 13 okt 2026, op /lp/dakwerken alleen in de
 * hero-dia's en de slotblokfoto: lp/kgj/inhoud.ts, DICTAAT MOHAMMED "die stock photos ook op landingspagina dakwerken aub").
 * DICTAAT MOHAMMED 12 okt 2026: "zoek meer mooie dak stock photos ook, zonder dat het stock photo lijkt, echt perfecte
 * voor belgische daken achtig" en "en we gaan die bij dakwerken pagina van abgroep toevoegen".
 * Per foto: naam in beelden.ts · fotopagina · fotograaf · licentie · bewerking (bron in src/assets/dak-stock/, zonder
 * metadata, varianten via scripts/bf-beelden.cjs).
 *  - stock-pannen-stapels  · https://unsplash.com/photos/h8IxOnG6Sm4 · clement proust · Unsplash-licentie (gratis
 *    commercieel gebruik, geen naamsvermelding verplicht; geen Unsplash+) · uitsnede 4648x3099 vanaf (0, 2150) uit
 *    4648x6972: lucht met de STAR BLOCK-doos op de nok en de crepi-muur weg.
 *  - stock-panlatten       · https://unsplash.com/photos/OnwxQNEbPco · Sergej (skstrannik) · Unsplash-licentie (idem) ·
 *    uitsnede 2400x1500 vanaf (3600, 1300) uit 6000x4000: alleen houtvezelplaten, tengels, panlatten en gelegde pannen;
 *    0 personen, geen BRAAS-pallet, geen VELUX-opdruk (de GUTEX-bedrukking op de platen is gewone materiaalbedrukking).
 *  - stock-zinkwerk        · https://unsplash.com/photos/RW-5uoMziy4 · Filip Mishevski · Unsplash-licentie (idem) ·
 *    uitsnede 2642x1651 vanaf (1950, 800) uit 4592x3056, verkleind naar 2400x1500: 2 dakramen, een zinken dakkapel,
 *    een dakkapel met pannen, zinken en loden aansluitingen (locatie volgens de fotopagina: Maastricht).
 *  - stock-daklijn         · https://unsplash.com/photos/e6zMlgsemcU · Mitchel Lensink · Unsplash-licentie (idem) · geheel.
 * NIET MEER GEBRUIKT (13 okt 2026, keuring): stock-schouw-herstel (1V_WuotjRfI, een dakwerker bij de schouw) stond in
 * het traject recht boven stap 1 "We klimmen op het dak" en liet een bezoeker die man lezen als een dakwerker van AB;
 * stock-pannen-leggen (twee dakwerkers, BRAAS leesbaar op de pallet) en stock-dakramen (Pexels 20220498, Nederlands
 * huis met kunststof goten) vervangen door stock-panlatten en stock-zinkwerk.
 * Regels (regel 1 waarheid): een stockfoto staat NOOIT in een blok dat eigen werk toont of suggereert (realisaties,
 * "uitgevoerd werk", voor/na, rail met projecten, paginakop, de verhaalrij "Onze dakwerkers", het traject "Van offerte
 * tot oplevering" met de stappen in de wij-vorm, het onderste deel), en de alt beschrijft alleen wat te zien is: nooit
 * "door AB Bouw Groep", nooit "ons dak". Geen herkenbare dakwerker op een stockfoto. De eigen AB-dakfoto's (dak-na,
 * IMG_9019) blijven. Guard: scripts/check-stock.cjs.
 *
 * Fotoplan van de subpagina's in de BF-stijl (spec/bf-stijl.md §9 en §15).
 *
 * Eén plek voor elke beeldkeuze, zodat de pagina's dezelfde foto's tonen als de tabel
 * in de spec. Regels: alleen ECHTE AB-foto's (ab-fotos.md §3; uitzondering: de stockfoto's hierboven op /dakwerken), nooit een verboden beeld
 * (spec §9), op één pagina nooit dezelfde foto of een tweeling (ab-fotos.md §6), en een
 * paginakop is nooit een dia van de homehero. Een afdeling zonder eigen echte foto krijgt
 * een vlakke paginakop (kop: null) in plaats van een nepfoto.
 *
 * Alt-teksten: eerst uit HOME_BF (dezelfde foto op de home, één bron); anders woordelijk
 * uit de bestaande pagina waar die foto al staat, met de bron erbij. Een paginakopfoto is
 * versiering (alt="" in schil.paginakop) en heeft dus geen alt nodig.
 */
import type { Foto } from './blokken';
import { HOME_BF } from './inhoud';

export type DivisieSlug = 'construct' | 'dakwerken' | 'gevel' | 'bad' | 'interieur' | 'ecologisch';
export const DIVISIE_SLUGS: DivisieSlug[] = ['construct', 'dakwerken', 'gevel', 'bad', 'interieur', 'ecologisch'];
/** Foto van een paginakop: alleen naam en uitsnede (alt is leeg). */
export type KopFoto = { naam: string; pos?: string };

/* ---------- alt per beeld ---------- */
const ALT: Record<string, string> = {};
const neem = (f: Foto) => { if (f && f.alt && !ALT[f.naam]) ALT[f.naam] = f.alt; };
HOME_BF.hero.dias.forEach(neem);
neem(HOME_BF.over.foto);
HOME_BF.diensten.kaarten.forEach((k) => neem(k.foto));
neem(HOME_BF.zekerheid.inzet);
neem(HOME_BF.werkwijze.foto);
HOME_BF.werk.fotos.forEach(neem);
neem(HOME_BF.werk.voorNa.voor);
neem(HOME_BF.werk.voorNa.na);
// bron: lp/replica/inhoud.ts r.318 (aanbod-kaart met dezelfde foto)
ALT['pleisterwerk-g2'] = 'Gepleisterde ruimte tijdens de afwerking';
// bron: lp/replica/inhoud.ts r.729 (voor/na-schuif van de oude home, altVoor)
ALT['uitbreiding-voor'] = 'De aanbouw in ruwbouw: snelbouwstenen en de houten balken van het platte dak';

/** Foto met de alt uit de lijst hierboven; faalt luid als er geen alt is. */
const f = (naam: string, pos?: string): Foto => {
  const alt = ALT[naam];
  if (!alt) throw new Error('fotoplan: geen alt-tekst voor ' + naam);
  return pos ? { naam, alt, pos } : { naam, alt };
};

/* ---------- stockfoto's (licentielijst bovenaan): alt = neutrale beschrijving van wat te zien is ---------- */
const STOCK = {
  pannenStapels: { naam: 'stock-pannen-stapels', alt: 'Rode vlakke dakpannen op de panlatten: onderaan gelegd, bovenaan in stapeltjes over het dakvlak verdeeld' },
  panlatten: { naam: 'stock-panlatten', alt: 'Houtvezelplaten op het dakvlak met tengels en panlatten, waarop een baan zwarte dakpannen ligt' },
  zinkwerk: { naam: 'stock-zinkwerk', alt: 'Daken van rijwoningen met twee dakramen, een zinken dakkapel en een dakkapel met pannen' },
  // banner "Andere diensten" (achtergrond onder een donkere laag, alt leeg zoals elke banner): lucht bovenaan voor de kop
  daklijn: { naam: 'stock-daklijn', pos: '50% 100%' },
} satisfies Record<string, Foto | KopFoto>;

/* ---------- de kaarten van de home per afdeling (dezelfde foto als op de home) ---------- */
const kaartFoto = (slug: DivisieSlug): Foto => {
  const k = HOME_BF.diensten.kaarten.find((x) => x.href === '/' + slug);
  if (!k) throw new Error('fotoplan: geen homekaart voor ' + slug);
  return k.foto;
};

export const FOTOPLAN = {
  /* /over: kop = afgewerkt keukeneiland (resultaat), "Hoe wij werken" = werf in uitvoering,
     "De mensen op uw werf" = de vakman aan het werk (onderaan de foto, vandaar 85%). */
  over: {
    kop: { naam: 'IMG_9027', pos: '50% 55%' } as KopFoto,
    overSplit: f('pleisterwerk-g2'),
    belofte: f('IMG_0105', '50% 85%'),
  },
  /* /diensten: kop = zelfde beeld als de dienstenbanner van de home; de zes rijen tonen per
     afdeling de foto van haar homekaart (één vaste foto per afdeling over de hele site). */
  diensten: {
    kop: { naam: 'tegelwerken-p4-a' } as KopFoto,
    rijen: {
      construct: kaartFoto('construct'),
      ecologisch: f('IMG_9064', '50% 70%'),
      dakwerken: kaartFoto('dakwerken'),
      gevel: kaartFoto('gevel'),
      bad: kaartFoto('bad'),
      interieur: kaartFoto('interieur'),
    } as Record<DivisieSlug, Foto>,
  },
  /* /werkwijze: kop = aanbouw in ruwbouw (werf), traject = de doorbraak (zoals op de home). */
  werkwijze: {
    kop: { naam: 'uitbreiding-voor', pos: '50% 60%' } as KopFoto,
    traject: f('kaart-ruwbouw'),
  },
  /* /contact: kop = afgewerkte ruimte met glaspui; op gsm de glaspui in beeld (80%). */
  contact: {
    kop: { naam: 'IMG_9029', pos: '80% 50%' } as KopFoto,
  },
  /* Divisiepagina's: kop + dienstrij (+ voorstel traject). "Andere diensten" = de homekaarten
     van de vijf andere afdelingen met de banner van de home; geen enkel beeld hieronder is
     een tweeling van die kaarten. */
  divisie: {
    // kop = de vaste kaartfoto van de afdeling (IMG_9029, uitsnede zoals op /contact): woonkeuken-na is een zachte
    // videostill van 1178 px en oogt onscherp over 1265 px bij 150 %. De dienstrij toont een werf in ruwbouw.
    construct: { kop: { naam: 'IMG_9029', pos: '80% 50%' }, rij: f('woonkeuken-voor'), traject: f('kaart-ruwbouw') },
    // /dakwerken (12 okt, dictaat stockfoto's): kop, verhaalrij en traject blijven de eigen AB-foto's (traject = kaart-ruwbouw
    // zoals op de andere afdelingen; 13 okt: GEEN stock in het traject, de stappen staan in de wij-vorm). "Wat wij doen" krijgt
    // per tegel een stockfoto bij de dienst (01 Dakvernieuwing = pannen in stapeltjes en rij per rij gelegd, 02 Dakisolatie =
    // houtvezelplaten op het dakvlak onder de panlatten (sarking), 03 Dakvensters en dakkapellen = dakramen en dakkapellen).
    dakwerken: { kop: { naam: 'dak-na' }, rij: f('IMG_9019'), traject: f('kaart-ruwbouw'), watWijDoen: [STOCK.pannenStapels, STOCK.panlatten, STOCK.zinkwerk] },
    gevel: { kop: { naam: 'uitbreiding-na' }, rij: f('uitbreiding-voor'), traject: f('kaart-ruwbouw') },
    bad: { kop: { naam: 'IMG_0106', pos: '50% 45%' }, rij: kaartFoto('bad'), traject: f('kaart-ruwbouw') },
    interieur: { kop: { naam: 'IMG_0111' }, rij: kaartFoto('interieur'), traject: f('kaart-ruwbouw') },
    // geen echte foto van isolatie, warmtepomp of zonnepanelen: vlakke kop; de enige verwante echte foto (vloerverwarming) staat in de dienstrij
    ecologisch: { kop: null, rij: f('IMG_9064', '50% 70%'), traject: f('kaart-ruwbouw') },
  } as Record<DivisieSlug, { kop: KopFoto | null; rij: Foto; traject: Foto; watWijDoen?: Foto[] }>,
  /* "Andere diensten" op een divisiepagina. /dakwerken: banner = daklijn (stock, 12 okt) i.p.v. de vloerwerf
     tegelwerken-p4-a van de home; de kaarten blijven de vaste homekaarten. */
  andereDiensten: (eigen: DivisieSlug) => ({
    banner: eigen === 'dakwerken' ? STOCK.daklijn : HOME_BF.diensten.banner,
    kaarten: HOME_BF.diensten.kaarten.filter((k) => k.href !== '/' + eigen),
  }),
};
