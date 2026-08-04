import { useEffect } from 'react';
import '@/styles/roofpro.css';
import { ic, rpNav, rpFooter, wireMobielMenu } from './_rp';
import { CONTACT } from '@/data/contact';
import hero from '@/assets/home/hero-realisaties.jpg';
import logo from '@/assets/home/logo.png';
import svcBad from '@/assets/home/svc-bad.jpg';
import svcDak from '@/assets/home/svc-dak.jpg';
import svcInterieur from '@/assets/home/svc-interieur.jpg';
import svcGevel from '@/assets/home/svc-gevel.jpg';
import svcConstruct from '@/assets/home/svc-construct.jpg';
import svcEco from '@/assets/home/svc-eco.jpg';
import about from '@/assets/home/about.jpg';
import skills from '@/assets/home/skills.jpg';
import why from '@/assets/home/why.jpg';
// dakwerken
import dakPannen from '@/assets/dak/hellend-pannen.jpg';
import dakLeien from '@/assets/dak/leien.jpg';
import dakEpdm from '@/assets/dak/plat-epdm.jpg';
import dakIso from '@/assets/dak/dakisolatie.jpg';
import dakZink from '@/assets/dak/zinkwerk.jpg';
import dakRaam from '@/assets/dak/dakraam.jpg';
import dakBitumen from '@/assets/dak/bitumen.jpg';
import dakIntro from '@/assets/dak/intro-overview.jpg';
// construct
import cAanbouw from '@/assets/construct/aanbouw.jpg';
import cAfwerking from '@/assets/construct/afwerking.jpg';
import cHalfopen from '@/assets/construct/halfopen.jpg';
import cVilla from '@/assets/construct/intro-villa.jpg';
import cNieuw from '@/assets/construct/nieuwbouw.jpg';
import cRuwbouw from '@/assets/construct/ruwbouw.jpg';
import cTotaal from '@/assets/construct/totaal.jpg';
// eco
import eHout from '@/assets/eco/houtskelet.jpg';
import eIso from '@/assets/eco/isolatie.jpg';
import eKalk from '@/assets/eco/kalk.jpg';
import eWarmte from '@/assets/eco/warmtepomp.jpg';
import eZon from '@/assets/eco/zonnepanelen.jpg';
import eVent from '@/assets/eco/ventilatie.jpg';
// extra renovation hero
import projVilla from '@/assets/project-villa.jpg';
import projReno from '@/assets/project-renovatie.jpg';
import projUtil from '@/assets/project-utiliteit.jpg';
// interieur
import intWoonkamer from '@/assets/interieur/woonkamer-eik.jpg';
import intKeuken from '@/assets/interieur/keuken-noten.jpg';
import intTrap from '@/assets/interieur/trap-staal-eik.jpg';
// realisaties — extra realistische foto's
import rzGevelCrepi from '@/assets/realisaties/gevel-grijze-crepi.jpg';
import rzGevelStrips from '@/assets/realisaties/gevel-steenstrips.jpg';
import rzNbVrij from '@/assets/realisaties/nieuwbouw-vrijstaand.jpg';
import rzRenoHoek from '@/assets/realisaties/reno-hoekwoning.jpg';
import rzBadGast from '@/assets/realisaties/bad-gastentoilet.jpg';
import rzIntDressing from '@/assets/realisaties/int-dressing-eik.jpg';
import rzStadswoningBrussel from '@/assets/realisaties/stadswoning-brussel.jpg';
import rzBadEnsuite from '@/assets/realisaties/bad-ensuite.jpg';
import rzBadGroen from '@/assets/realisaties/bad-inloopdouche-groen.jpg';
import rzNbStad from '@/assets/realisaties/nieuwbouw-stadswoning.jpg';
import rzGevelLariks from '@/assets/realisaties/gevel-lariks-aanbouw.jpg';
import rzGevelHervoegd from '@/assets/realisaties/gevel-hervoegd-rijwoning.jpg';
// realisaties — nieuwe portfolio uitbreidingen mei 2026
import rzVillaMechelen from '@/assets/realisaties/01_extra_villa-modern-mechelen.jpg';
import rzVillaVrij from '@/assets/realisaties/extra-22_villa-vrijstaand.jpg';
import rzBeigeBalcony from '@/assets/realisaties/extra-23_beige-balcony.jpg';
import rzGeelRij from '@/assets/realisaties/extra-24_geel-rijwoning.jpg';
import rzRodeVilla from '@/assets/realisaties/extra-25_rode-baksteen-villa.jpg';
import rzGeleVillaZij from '@/assets/realisaties/extra-26_gele-villa-zijaanzicht.jpg';
import rzZonFermette from '@/assets/realisaties/extra-27_zonnepaneel-fermette.jpg';

type Card = { img: string; tag: string; t: string; d: string };
type Filter = { key: string; label: string; imgs: [string, string, string, string]; cards: Card[] };

const dakwerken: Card[] = [
  { img: dakPannen, tag: 'Hellend dak', t: 'Pannendak', d: 'Volledige vervanging keramische pannen + onderdak + PIR-isolatie. 14 dagen.' },
  { img: dakEpdm, tag: 'Plat dak', t: 'EPDM aanbouw', d: 'EPDM in één stuk met afschot, slokkers en zinken kraal. 8 dagen.' },
  { img: dakLeien, tag: 'Leien', t: 'Natuurleien villa', d: 'Spaanse natuurleien met koperen kielgoten en nieuwe schouwbekleding.' },
  { img: dakZink, tag: 'Zinkwerk', t: 'Bakgoot herenhuis', d: 'Volledige bakgoot in zink VMZINC met EPDM-onderlaag. 3 dagen.' },
  { img: dakIso, tag: 'Dakisolatie', t: 'Sarking', d: 'Sarking-isolatie 24 cm PIR met behoud van bestaande dakstoel.' },
  { img: dakRaam, tag: 'Dakramen', t: 'VELUX-set', d: 'Drie nieuwe VELUX-ramen met aansluiting op bestaande pannen.' },
  { img: dakBitumen, tag: 'Bitumen', t: 'Plat dak garage', d: 'APP-bitumen 2-laags met grijze leislag, klaar in 2 dagen.' },
  { img: dakIntro, tag: 'Dakrenovatie', t: 'Volledige dakvernieuwing', d: 'Strip & rebuild dak: nieuwe spanten, isolatie en pannen.' },
];

const renovatie: Card[] = [
  { img: projReno, tag: 'Totaalrenovatie', t: 'Rijwoning', d: 'Strip & rebuild, nieuwe technieken, isolatie, dak, gevel en interieur. 18 weken.' },
  { img: rzRenoHoek, tag: 'Energetische renovatie', t: 'Hoekwoning', d: 'Naisolatie, nieuw schrijnwerk, warmtepomp en zonnepanelen. EPC C → A.' },
  { img: cAanbouw, tag: 'Aanbouw', t: 'Achterbouw', d: 'Aanbouw met plat dak, openslaande deuren en gietvloer. 10 weken.' },
  { img: rzStadswoningBrussel, tag: 'Renovatie', t: 'Stadswoning', d: 'Volledige binnenrenovatie met behoud van originele cement-tegels.' },
  { img: about, tag: 'Gevelrenovatie', t: 'Halfopen', d: 'Reiniging, nieuw voegwerk en geïsoleerde steenstrips. 4 weken.' },
  { img: projUtil, tag: 'Bedrijfspand', t: 'Kantoorrenovatie', d: 'Volledige interieurrenovatie met nieuwe technieken en glaswanden. 12 weken.' },
  { img: cVilla, tag: 'Villarenovatie', t: 'Villa', d: 'Behoud authentieke gevel, volledig nieuwe binneninrichting en buitenisolatie.' },
  { img: cAfwerking, tag: 'Renovatie', t: 'Rijwoning', d: 'Open keuken-leefruimte gecreëerd door dragende muur weg te halen.' },
  { img: rzGevelStrips, tag: 'Gevel + interieur', t: 'Hoekhuis', d: 'Nieuwe steenstrips-gevel gecombineerd met volledige binnenrenovatie.' },
  { img: rzGeelRij, tag: 'Gevelrestauratie', t: 'Rijwoning', d: 'Originele gele baksteen gereinigd en hervoegd, slim antraciet schrijnwerk vervangt oude PVC. 6 weken.' },
  { img: rzRodeVilla, tag: 'Karakterrenovatie', t: 'Vrijstaand huis', d: 'Behoud authentieke rode baksteengevel, nieuwe ramen met dunne profielen en moderne inkom. 8 weken.' },
];

const nieuwbouw: Card[] = [
  { img: cHalfopen, tag: 'Halfopen', t: 'HOB', d: 'Ruwbouw winddicht in 14 weken, oplevering casco+. Eigen ploegen op alle loten.' },
  { img: rzNbVrij, tag: 'Vrijstaand modern', t: 'Vrijstaand', d: 'Moderne nieuwbouw met witte crepi en lariks-accent rond de inkom.' },
  { img: projVilla, tag: 'BEN-bouw', t: 'BEN-villa', d: 'Bijna-energieneutraal met warmtepomp, ventilatie D en 24 PV-panelen.' },
  { img: cRuwbouw, tag: 'Ruwbouw', t: 'Ruwbouw', d: 'Ruwbouw winddicht met houtskeletwanden op betonnen plint. 16 weken.' },
  { img: rzNbStad, tag: 'Stadswoning', t: 'Nieuwbouw', d: 'Smalle stadskavel, drie bouwlagen met dakterras tussen bestaande gevels.' },
  { img: rzVillaMechelen, tag: 'Hedendaagse villa', t: 'Hedendaagse villa', d: 'Strakke witte crepi met zwart aluminium schrijnwerk, BEN-norm en warmtepomp.' },
  { img: rzVillaVrij, tag: 'Vrijstaand', t: 'Vrijstaand', d: 'Klassieke vrijstaande woning met crepi en handvorm gevelsteenplint. 12 maanden.' },
  { img: rzBeigeBalcony, tag: 'Modern', t: 'Open bebouwing', d: 'Modern volume in lichtbeige gevelsteen met antraciet balkonleuning en groot raamoppervlak. 11 maanden.' },
  { img: rzGeleVillaZij, tag: 'BEN-villa', t: 'BEN-woning', d: 'Bijna-energieneutrale woning in gele Vlaamse gevelsteen, met PV en geothermische warmtepomp.' },
];

const interieur: Card[] = [
  { img: svcInterieur, tag: 'Maatwerk', t: 'Penthouse', d: 'Volledig maatwerk: keuken, dressing, TV-wand en bibliotheek in eik.' },
  { img: intKeuken, tag: 'Keuken', t: 'Maatkeuken', d: 'Gefineerde noten met composiet werkblad en geïntegreerde toestellen.' },
  { img: intWoonkamer, tag: 'Vloeren', t: 'Visgraat eik', d: 'Massief eik visgraat geolied, met vloerverwarming en ingebouwde bibliotheek.' },
  { img: intTrap, tag: 'Trappen', t: 'Stalen trap', d: 'Maatwerktrap in zwart staal met massieve eiken treden.' },
  { img: eKalk, tag: 'Kalkpleister', t: 'Cottage', d: 'Natuurlijke kalkpleister in alle leefruimtes, ademend en mat.' },
  { img: rzIntDressing, tag: 'Maatkasten', t: 'Maatkasten', d: 'Inbouw-dressing met geïntegreerde verlichting in licht eikenfineer.' },
];

const badkamer: Card[] = [
  { img: svcBad, tag: 'Inloopdouche', t: 'Inloopdouche', d: 'Walk-in douche met grootformaat tegels en zwart matte kraanwerk. 3 weken.' },
  { img: rzBadGast, tag: 'Compact', t: 'Gastenbadkamer', d: 'Volledige strip & rebuild op 4 m² met zwevend meubel. 10 dagen.' },
  { img: rzBadEnsuite, tag: 'Master', t: 'Master ensuite', d: 'Dubbel wastafelmeubel in eik, microcementwanden en inloopdouche achter geribbeld glas. 5 weken.' },
  { img: rzBadGroen, tag: 'Inloopdouche', t: 'Douche met accentwand', d: 'Inloopdouche met groene accentstrook, verlichte nis en terrazzo-look vloer.' },
];

const gevel: Card[] = [
  { img: svcGevel, tag: 'Witte crepi', t: 'HOB', d: 'Geïsoleerde gevel met witte siliconen-crepi. 4 weken.' },
  { img: rzGevelCrepi, tag: 'Grijze crepi', t: 'Nieuwbouw', d: 'Antraciet siliconen-crepi met zwart aluminium schrijnwerk en magnolia voortuin.' },
  { img: rzGevelLariks, tag: 'Houten gevel', t: 'Lariks-aanbouw', d: 'Verticale lariks-bekleding op de uitbouw, vergrijst natuurlijk van boven naar onder.' },
  { img: rzGevelHervoegd, tag: 'Hervoegen', t: 'Rijwoning', d: 'Gevel gereinigd en hervoegd met kalkmortel, nieuwe blauwe hardsteen dorpels.' },
];

const ecologisch: Card[] = [
  { img: eHout, tag: 'Houtskelet', t: 'CLT-woning', d: 'Massief houtbouw (CLT) met houtvezel-isolatie en kalkpleister.' },
  { img: eWarmte, tag: 'Warmtepomp', t: 'Lucht-water', d: 'Hybride warmtepomp + bestaande condensatieketel als backup.' },
  { img: eZon, tag: 'Zonnepanelen', t: 'PV-installatie', d: '24 panelen oost-west met hybride omvormer en thuisbatterij.' },
  { img: eIso, tag: 'Isolatie', t: 'Houtvezel', d: 'Volledig na-isolatieproject met natuurlijke houtvezelplaten.' },
  { img: eVent, tag: 'Ventilatie D', t: 'Systeem D', d: 'Balansventilatie met warmteterugwinning, 92% rendement.' },
  { img: rzZonFermette, tag: 'Zonnepanelen', t: 'Fermette', d: '22 zwarte PV-panelen op het zuid-zadeldak van een gerenoveerde fermette met witte crepi. Met hybride omvormer.' },
];

/* "Alle projecten" round-robin uit alle categorieën: nooit vaste indexen
   (die crashten zodra een categorie kromp) en automatisch elk beeld uniek. */
const CATEGORIEEN: Card[][] = [nieuwbouw, renovatie, interieur, dakwerken, badkamer, gevel, ecologisch];
const alleKaarten: Card[] = [];
for (let rij = 0; rij < Math.max(...CATEGORIEEN.map(c => c.length)); rij++) {
  for (const cat of CATEGORIEEN) {
    if (cat[rij]) alleKaarten.push(cat[rij]);
  }
}

const filters: Filter[] = [
  { key: 'alle', label: 'Alle projecten',
    imgs: [projReno, dakPannen, svcInterieur, svcBad],
    cards: alleKaarten,
  },
  { key: 'dakwerken', label: 'Dakwerken',
    imgs: [dakPannen, dakEpdm, dakLeien, dakZink], cards: dakwerken },
  { key: 'renovatie', label: 'Renovatie',
    imgs: [projReno, rzRenoHoek, cAanbouw, cAfwerking], cards: renovatie },
  { key: 'nieuwbouw', label: 'Nieuwbouw',
    imgs: [cVilla, cHalfopen, rzNbVrij, projVilla], cards: nieuwbouw },
  { key: 'interieur', label: 'Interieur',
    imgs: [svcInterieur, intKeuken, intWoonkamer, intTrap], cards: interieur },
  { key: 'badkamer', label: 'Badkamer',
    imgs: [svcBad, dakRaam, cAfwerking, rzBadGast], cards: badkamer },
  { key: 'gevel', label: 'Gevelbekleding',
    imgs: [svcGevel, rzGevelCrepi, dakIso, rzGevelStrips], cards: gevel },
  { key: 'ecologisch', label: 'Ecologisch',
    imgs: [eHout, eWarmte, eZon, eIso], cards: ecologisch },
];

const HTML = () => `<div class="rp">
${rpNav('/realisaties')}

<section class="rp-phero rp-phero--foto">
  <div class="rp-phero__bg" aria-hidden="true">
    <img src="${hero}" alt="" width="1920" height="620" fetchpriority="high" decoding="async"/>
    <span class="rp-phero__veil"></span>
  </div>
  <div class="rp-wrap">
    <nav class="rp-crumbs" aria-label="Kruimelpad"><a href="/">Home</a> &rsaquo; <span>Realisaties</span></nav>
    <span class="rp-eyebrow">${ic.mark} Realisaties</span>
    <h1 class="rp-phero__t">Werk dat wij<span class="rp-dim">opgeleverd hebben</span></h1>
    <p class="rp-phero__lede">Een greep uit onze projecten, per vak gerangschikt. Klik een foto aan om ze groot te bekijken.</p>
  </div>
</section>


<section class="rp-section">
  <div class="rp-wrap">
    <div class="rp-tabs" role="tablist" aria-label="Filter realisaties op vak">
      ${filters.map((f, n) => `<button class="rp-tab${n === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${n === 0}" data-filter="${f.key}">${f.label}</button>`).join('')}
    </div>
    <div class="rp-galerij" data-galerij>
      ${alleKaarten.map((k, n) => {
        const cats = filters.filter((f) => f.key !== 'alle' && f.cards.includes(k)).map((f) => f.key).join(' ');
        return `
      <button class="rp-gcard" type="button" data-cat="${cats}" data-index="${n}" aria-label="Bekijk ${k.t} groot">
        <span class="rp-gcard__img"><img src="${k.img}" alt="${k.t}, ${k.tag}" width="420" height="240" loading="lazy" decoding="async"/></span>
        <span class="rp-gcard__body">
          <span class="rp-gcard__tag">${k.tag}</span>
          <span class="rp-gcard__t">${k.t}</span>
          <span class="rp-gcard__d">${k.d}</span>
        </span>
      </button>`;
      }).join('')}
    </div>
    <p class="rp-leeg" data-leeg hidden>Geen projecten in dit vak.</p>
  </div>
</section>

<section class="rp-cta">
  <div class="rp-wrap">
    <div class="rp-cta__box" style="min-height:270px">
      <div class="rp-cta__bg" aria-hidden="true">
        <img src="${hero}" alt="" width="1200" height="420" loading="lazy" decoding="async"/>
        <span class="rp-cta__veil"></span>
      </div>
      <div class="rp-cta__inner">
        <h2 class="rp-cta__t">Zoiets voor uw woning?</h2>
        <p class="rp-cta__p">Zeg ons welk project u aansprak, dan bekijken we bij het plaatsbezoek wat er bij u mogelijk is.</p>
        <div style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px">
          <a class="rp-btn rp-btn--primary" href="/contact">Plan een plaatsbezoek</a>
          <a class="rp-btn rp-btn--ghost" href="${CONTACT.phone.href}" style="color:#fff;border-color:rgba(255,255,255,.34)">${ic.phone(17)} ${CONTACT.phone.display}</a>
        </div>
      </div>
    </div>
  </div>
</section>

${rpFooter()}

<div class="rp-lightbox" data-lightbox hidden role="dialog" aria-modal="true" aria-label="Projectfoto">
  <button class="rp-lightbox__sluit" type="button" data-lb-sluit aria-label="Sluiten">${ic.close}</button>
  <button class="rp-lightbox__nav rp-lightbox__nav--prev" type="button" data-lb-prev aria-label="Vorige foto">${ic.left}</button>
  <button class="rp-lightbox__nav rp-lightbox__nav--next" type="button" data-lb-next aria-label="Volgende foto">${ic.right}</button>
  <figure class="rp-lightbox__fig">
    <img data-lb-img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""/>
    <figcaption class="rp-lightbox__cap"><b data-lb-titel></b><span data-lb-tekst></span></figcaption>
  </figure>
</div>
</div>`;

export default function Realisaties() {
  useEffect(() => {
    document.title = 'Realisaties — AB Bouw Groep';
    window.scrollTo(0, 0);
    const opruimers: Array<() => void> = [wireMobielMenu()];

    /* ── filters ─────────────────────────────────────────────────────── */
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const kaarten = Array.from(document.querySelectorAll<HTMLElement>('[data-galerij] .rp-gcard'));
    const leeg = document.querySelector<HTMLElement>('[data-leeg]');
    let zichtbaar: HTMLElement[] = kaarten.slice();

    const maakFilter = (b: HTMLButtonElement) => () => {
      const f = b.dataset.filter || 'alle';
      tabs.forEach((t) => {
        const actief = t === b;
        t.classList.toggle('is-active', actief);
        t.setAttribute('aria-selected', String(actief));
      });
      zichtbaar = [];
      kaarten.forEach((k) => {
        const toon = f === 'alle' || (k.dataset.cat || '').split(' ').includes(f);
        k.style.display = toon ? '' : 'none';
        if (toon) zichtbaar.push(k);
      });
      if (leeg) leeg.hidden = zichtbaar.length > 0;
    };
    tabs.forEach((b) => {
      const h = maakFilter(b);
      b.addEventListener('click', h);
      opruimers.push(() => b.removeEventListener('click', h));
    });

    /* ── lichtbak ────────────────────────────────────────────────────── */
    const lb = document.querySelector<HTMLElement>('[data-lightbox]');
    const lbImg = document.querySelector<HTMLImageElement>('[data-lb-img]');
    const lbTitel = document.querySelector<HTMLElement>('[data-lb-titel]');
    const lbTekst = document.querySelector<HTMLElement>('[data-lb-tekst]');
    let huidig = 0;

    const toon = (i: number) => {
      if (!zichtbaar.length || !lbImg) return;
      huidig = (i + zichtbaar.length) % zichtbaar.length;
      const kaart = zichtbaar[huidig];
      const img = kaart.querySelector('img');
      lbImg.src = img?.currentSrc || img?.src || '';
      lbImg.alt = img?.alt || '';
      if (lbTitel) lbTitel.textContent = kaart.querySelector('.rp-gcard__t')?.textContent || '';
      if (lbTekst) lbTekst.textContent = kaart.querySelector('.rp-gcard__d')?.textContent || '';
    };
    const open = (i: number) => {
      if (!lb) return;
      toon(i);
      lb.hidden = false;
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const sluit = () => {
      if (!lb) return;
      lb.hidden = true;
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    kaarten.forEach((k) => {
      const h = () => open(zichtbaar.indexOf(k));
      k.addEventListener('click', h);
      opruimers.push(() => k.removeEventListener('click', h));
    });

    const prev = document.querySelector<HTMLButtonElement>('[data-lb-prev]');
    const next = document.querySelector<HTMLButtonElement>('[data-lb-next]');
    const dicht = document.querySelector<HTMLButtonElement>('[data-lb-sluit]');
    const onPrev = () => toon(huidig - 1);
    const onNext = () => toon(huidig + 1);
    const onAchtergrond = (e: MouseEvent) => { if (e.target === lb) sluit(); };
    const onToets = (e: KeyboardEvent) => {
      if (lb?.hidden) return;
      if (e.key === 'Escape') sluit();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);
    dicht?.addEventListener('click', sluit);
    lb?.addEventListener('click', onAchtergrond);
    document.addEventListener('keydown', onToets);
    opruimers.push(() => {
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      dicht?.removeEventListener('click', sluit);
      lb?.removeEventListener('click', onAchtergrond);
      document.removeEventListener('keydown', onToets);
      document.body.style.overflow = '';
    });

    return () => opruimers.forEach((f) => f());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML() }} />;
}
