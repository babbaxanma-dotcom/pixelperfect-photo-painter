/**
 * LpDienst — lichte, herbruikbare sub-service landingspagina.
 * Routes: /lp/velux, /lp/gevelreiniging, /lp/hervoegen
 *
 * Config-gedreven (DIENSTEN). Hergebruikt submitLead() uit @/lib/leads, dus
 * GHL-webhook + Google Ads conversie-tracking komen automatisch mee.
 * Split-panel hero (vast navy paneel links, foto rechts) + mini-form + offer +
 * reviews + FAQ + form. Bewust LEAN per Heath (één offer, één intentie).
 */
import { useEffect, useRef, useState } from 'react';
import { submitLead, type Divisie } from '@/lib/leads';
import { CONTACT } from '@/data/contact';
import logo from '@/assets/home/logo.png';

import imgVelux from '@/assets/dak/lp-velux.jpg';
import imgGevelReinig from '@/assets/gevel/stelling.jpg';
import imgHervoegen from '@/assets/gevel/intro.jpg';

type Dienst = {
  division: Divisie; typeWerk: string; bronLead: string;
  eyebrow: string; h1: string[]; sub: string; heroImg: string;
  offerTitle: string; offerMark: string; offerSub: string; offer: [string, string][];
  steps: [string, string][]; prijs: string;
  faq: [string, string][]; metaTitle: string; metaDesc: string;
};

const DIENSTEN: Record<string, Dienst> = {
  velux: {
    division: 'ab_dakwerken', typeWerk: 'AB Dakwerken', bronLead: 'ads:velux',
    eyebrow: 'AB Dakwerken · Willebroek',
    h1: ['Velux dakraam', 'vakkundig', 'geplaatst.'],
    sub: 'Plaatsing en vervanging van Velux-dakramen in Mechelen, Antwerpen, Lier en heel Vlaanderen. Eigen ploeg, vaste prijs, waterdicht afgewerkt.',
    heroImg: imgVelux,
    offerTitle: 'Het ', offerMark: 'Velux', offerSub: 'Van opmeting tot waterdichte afwerking, alles door één ploeg. Vaste prijs, geen tussenpartij.',
    offer: [
      ['Gratis opmeting aan huis', 'Een vakman komt langs, meet op en adviseert het juiste type en formaat.'],
      ['Vaste prijs inclusief plaatsing', 'De prijs op uw offerte is de prijs die u betaalt. Geen meerkost.'],
      ['Erkend Velux-plaatser', 'Correcte plaatsing volgens de voorschriften, met behoud van garantie.'],
      ['Waterdicht afgewerkt', 'Inclusief gootstuk, isolatie en binnenafwerking. Netjes afgewerkt.'],
      ['Eigen dakdekkers', 'Geen onderaannemers. Onze eigen ploeg plaatst uw dakraam.'],
      ['Snel ingepland', 'Plaatsbezoek binnen 5 werkdagen, plaatsing op een afgesproken datum.'],
    ],
    steps: [
      ['Gratis opmeting', 'Een vakman komt langs, meet op en bespreekt welk type en formaat bij uw dak past.'],
      ['Vaste offerte', 'U krijgt een bindende prijs inclusief plaatsing en binnenafwerking.'],
      ['Plaatsing op afspraak', 'Onze eigen ploeg plaatst het dakraam waterdicht af, doorgaans op één dag.'],
    ],
    prijs: 'Een Velux-dakraam geplaatst start doorgaans rond €1.250 inclusief plaatsing en afwerking. De exacte prijs hangt af van het type, het formaat en uw dakopbouw. U krijgt een vaste prijs na de gratis opmeting.',
    faq: [
      ['Wat kost een Velux dakraam geplaatst?', 'Dat hangt af van het type, het formaat en de bestaande dakopbouw. Een standaardplaatsing start doorgaans rond €1.250 inclusief plaatsing. U krijgt een vaste prijs na de gratis opmeting.'],
      ['Plaatsen jullie ook in een bestaand pannendak?', 'Ja. Wij plaatsen Velux-dakramen in pannendaken en leien daken, met het juiste gootstuk zodat alles waterdicht blijft.'],
      ['Hoe lang duurt de plaatsing?', 'Een standaard dakraam plaatsen we doorgaans op één dag, inclusief binnenafwerking.'],
      ['Krijg ik garantie op de plaatsing?', 'Ja. U krijgt garantie op de waterdichtheid van de plaatsing, bovenop de fabrieksgarantie van Velux op het raam zelf.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen. Bij het plaatsbezoek bevestigen we de planning.'],
    ],
    metaTitle: 'Velux dakraam laten plaatsen — vaste prijs | AB Bouw Groep',
    metaDesc: 'Velux-dakramen plaatsen en vervangen in Vlaanderen. Erkend plaatser, eigen ploeg, vaste prijs inclusief plaatsing. Gratis opmeting binnen 5 werkdagen.',
  },
  gevelreiniging: {
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:gevelreiniging',
    eyebrow: 'AB Gevelbekleding · Willebroek',
    h1: ['Uw gevel', 'als nieuw,', 'zonder schade.'],
    sub: 'Professionele gevelreiniging in Mechelen, Antwerpen, Lier en heel Vlaanderen. Verwijdert vuil, mos en algen, met de juiste methode voor uw gevelsteen.',
    heroImg: imgGevelReinig,
    offerTitle: 'Het ', offerMark: 'Gevelreiniging', offerSub: 'De juiste reinigingsmethode voor uw type gevel, zonder de steen te beschadigen. Vaste prijs, eigen ploeg.',
    offer: [
      ['Gratis plaatsbezoek met advies', 'Een vakman bekijkt uw gevel en adviseert de juiste methode.'],
      ['Aangepaste methode per gevel', 'Lagedruk, nevel of chemisch, afgestemd op uw gevelsteen.'],
      ['Geen schade aan de voegen', 'Wij reinigen zonder de voeg of de steen aan te tasten.'],
      ['Optioneel impregneren', 'Wij kunnen de gevel nadien beschermen tegen nieuw vuil en vocht.'],
      ['Vaste prijs vooraf', 'Bindende offerte, geen verrassingen achteraf.'],
      ['Eigen ploeg', 'Onze eigen mensen voeren het werk uit, geen onderaannemers.'],
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman bekijkt uw gevel en bepaalt de juiste reinigingsmethode.'],
      ['Vaste offerte', 'U krijgt een bindende prijs per m², met of zonder impregnatie.'],
      ['Reiniging door eigen ploeg', 'Wij reinigen uw gevel zorgvuldig, zonder de voeg of steen te beschadigen.'],
    ],
    prijs: 'Gevelreiniging wordt geprijsd per m² en hangt af van de vervuiling, de gevelsteen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.',
    faq: [
      ['Wat kost gevelreiniging per m²?', 'Dat hangt af van de vervuiling, de gevelsteen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Beschadigt reinigen mijn gevel niet?', 'Niet als de juiste methode wordt gebruikt. Wij stemmen de druk en het middel af op uw gevelsteen, zodat voeg en steen intact blijven.'],
      ['Is impregneren nuttig?', 'Vaak wel. Een impregnatie houdt vocht en vuil tegen, waardoor uw gevel langer proper blijft. Wij adviseren of het zinvol is voor uw gevel.'],
      ['Hoe lang blijft mijn gevel proper?', 'Met een impregnatie blijft uw gevel jaren langer schoon. Zonder hangt het af van de ligging en de begroeiing rond de woning.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    metaTitle: 'Gevelreiniging — zonder schade aan uw gevel | AB Bouw Groep',
    metaDesc: 'Professionele gevelreiniging in Vlaanderen. Juiste methode per gevelsteen, geen schade aan de voegen, optioneel impregneren. Gratis plaatsbezoek.',
  },
  hervoegen: {
    division: 'ab_gevelbekleding', typeWerk: 'AB Gevelbekleding', bronLead: 'ads:hervoegen',
    eyebrow: 'AB Gevelbekleding · Willebroek',
    h1: ['Gevel', 'opnieuw', 'voegen.'],
    sub: 'Uitslijpen en hervoegen van uw gevel in Mechelen, Antwerpen, Lier en heel Vlaanderen. Lossende of verweerde voegen vakkundig vervangen.',
    heroImg: imgHervoegen,
    offerTitle: 'Het ', offerMark: 'Hervoegen', offerSub: 'Oude voegen uitslijpen en opnieuw voegen in de juiste kleur en techniek. Vaste prijs, eigen ploeg.',
    offer: [
      ['Gratis plaatsbezoek', 'Een vakman beoordeelt de staat van uw voegen en adviseert.'],
      ['Oude voegen volledig uitgeslepen', 'Wij slijpen de losse en verweerde voegen uit voor een duurzaam resultaat.'],
      ['Kleur en techniek op maat', 'De nieuwe voeg afgestemd op uw gevelsteen en stijl.'],
      ['Vaste prijs vooraf', 'Bindende offerte met duidelijke prijs per m².'],
      ['Nette werf', 'Wij ruimen alles op en laten uw woning proper achter.'],
      ['Eigen ploeg', 'Onze eigen mensen voeren het voegwerk uit.'],
    ],
    steps: [
      ['Gratis plaatsbezoek', 'Een vakman beoordeelt de staat van uw voegen en adviseert wat nodig is.'],
      ['Vaste offerte', 'U krijgt een bindende prijs per m² voor uitslijpen en hervoegen.'],
      ['Voegwerk door eigen ploeg', 'Wij slijpen de oude voegen uit en voegen opnieuw in de juiste kleur.'],
    ],
    prijs: 'Hervoegen wordt geprijsd per m² en hangt af van de staat van de voegen en de bereikbaarheid van de gevel. U krijgt een vaste prijs na het gratis plaatsbezoek.',
    faq: [
      ['Wanneer moet een gevel hervoegd worden?', 'Als de voegen loskomen, verbrokkelen of diep zijn uitgesleten. Dat laat vocht door en tast op termijn de muur aan. Een plaatsbezoek geeft uitsluitsel.'],
      ['Wat kost hervoegen per m²?', 'Dat hangt af van de staat van de voegen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Hoe lang gaat een nieuwe voeg mee?', 'Vakkundig uitgeslepen en opnieuw gevoegd gaat een gevel doorgaans decennia mee.'],
      ['Moet de hele gevel hervoegd worden?', 'Niet altijd. Soms volstaat een deel van de gevel. Bij het plaatsbezoek bekijken we wat echt nodig is.'],
      ['Werken jullie in mijn regio?', 'Wij werken in Mechelen, Antwerpen, Lier, Willebroek en heel Vlaanderen.'],
    ],
    metaTitle: 'Gevel hervoegen — uitslijpen en opnieuw voegen | AB Bouw Groep',
    metaDesc: 'Gevel laten hervoegen in Vlaanderen. Oude voegen uitslijpen, opnieuw voegen in de juiste kleur. Vaste prijs per m², eigen ploeg. Gratis plaatsbezoek.',
  },
};

export default function LpDienst({ slug }: { slug: string }) {
  const d = DIENSTEN[slug];
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!d) return;
    document.title = d.metaTitle;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    const prevDesc = m.getAttribute('content');
    m.setAttribute('content', d.metaDesc);
    document.body.classList.add('lp-page');
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove('lp-page');
      if (prevDesc) m!.setAttribute('content', prevDesc);
    };
  }, [d]);

  if (!d) { if (typeof window !== 'undefined') window.location.href = '/'; return null; }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const firstName = String(fd.get('firstName') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    if (!firstName || phone.replace(/\D/g, '').length < 8) { setState('err'); return; }
    setState('busy');
    const digits = phone.replace(/\D/g, '');
    const res = await submitLead({
      source: 'landing_page', landing_division: d.division, page_path: window.location.pathname,
      firstName, email: `lead-${digits}@abgroep.be`, phone, type_werk: d.typeWerk,
      aanvullende_info: `Sub-service LP: ${slug}`, bron_lead: d.bronLead,
    });
    setState(res.ok ? 'ok' : 'err');
  };

  const MiniForm = (
    <form ref={formRef} onSubmit={onSubmit} className="dienst-form" noValidate>
      {state === 'ok' ? (
        <div className="dienst-thanks">
          <strong>Bedankt, we hebben uw aanvraag.</strong>
          <span>Onze projectleider belt u binnen één werkdag.</span>
        </div>
      ) : (
        <>
          <input name="firstName" placeholder="Voornaam *" autoComplete="given-name" required />
          <input name="phone" type="tel" inputMode="tel" placeholder="Telefoon *" autoComplete="tel" required />
          <button type="submit" disabled={state === 'busy'}>
            {state === 'busy' ? 'Even bezig…' : 'Vraag gratis plaatsbezoek'}
          </button>
          {state === 'err' && <span className="dienst-err">Vul uw voornaam en geldig telefoonnummer in, of bel {CONTACT.phone.spaced}.</span>}
        </>
      )}
    </form>
  );

  return (
    <main className="dienst">
      <style>{DIENST_CSS}</style>
      <header className="dienst-header">
        <a href="/" className="dienst-brand"><img src={logo} alt="AB Bouw Groep" /></a>
        <div className="dienst-header-right">
          <a href={CONTACT.phone.href} className="dienst-phone">{CONTACT.phone.spaced}</a>
          <a href="#aanvraag" className="dienst-header-cta">Gratis offerte</a>
        </div>
      </header>

      <section className="dienst-hero" style={{ backgroundImage: `url(${d.heroImg})` }}>
        <div className="dienst-hero-inner">
          <div className="dienst-eyebrow">{d.eyebrow}</div>
          <h1>{d.h1.map((l, i) => <span key={i}>{l}<br /></span>)}</h1>
          <p>{d.sub}</p>
          <a href="#aanvraag" className="dienst-cta">Vraag gratis plaatsbezoek →</a>
          <div className="dienst-trust">
            <span>★★★★★ <b>4,9 / 5</b></span><span><b>124+</b> klanten</span><span><b>15 jaar</b> garantie</span>
          </div>
        </div>
      </section>

      <section className="dienst-quick"><div className="dienst-quick-card">
        <div className="dienst-quick-head"><strong>Vraag gratis plaatsbezoek</strong><span>Vakman langs binnen 5 werkdagen · vaste prijs · vrijblijvend</span></div>
        {MiniForm}
      </div></section>

      <section className="dienst-logos">
        <div className="dienst-logos-head">Wij werken met de beste merken</div>
        <div className="dienst-marquee">
          <div className="dienst-marquee-track">
            {[0, 1].map((s) => (
              <div className="dienst-marquee-set" key={s} aria-hidden={s === 1}>
                {['caparol', 'eternit', 'isover', 'knauf', 'isoproc', 'rectic', 'dorken', 'koramic', 'mato'].map((n) => (
                  <img key={n} src={`/assets/logos/${n}.png`} alt={s === 0 ? n : ''} loading="lazy" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dienst-offer">
        <div className="dienst-offer-head">
          <div className="dienst-eyebrow dark">Wat u bij ons krijgt</div>
          <h2>{d.offerTitle}<mark>{d.offerMark}</mark>-pakket</h2>
          <p>{d.offerSub}</p>
        </div>
        <div className="dienst-offer-grid">
          {d.offer.map(([t, sub], i) => (
            <div className="dienst-offer-item" key={i}>
              <span className="dienst-check">✓</span>
              <span><strong>{t}</strong>{sub}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dienst-steps">
        <h2>Zo verloopt het</h2>
        <div className="dienst-steps-grid">
          {d.steps.map(([t, sub], i) => (
            <div className="dienst-step" key={i}>
              <span className="dienst-step-num">{i + 1}</span>
              <strong>{t}</strong>
              <span className="dienst-step-desc">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dienst-why">
        <div className="dienst-why-inner">
          <h2>Waarom AB Bouw</h2>
          <div className="dienst-why-grid">
            <div><strong>Eigen ploeg</strong>Geen onderaannemers. Onze eigen mensen voeren het werk uit.</div>
            <div><strong>Geen tussenpartij</strong>U praat direct met de aannemer die het werk doet, niet met een doorverkoper.</div>
            <div><strong>Vaste prijs</strong>Een bindende offerte op papier. De prijs die u tekent, betaalt u.</div>
            <div><strong>Premie geregeld</strong>Wij dienen waar mogelijk uw Mijn VerbouwPremie-dossier voor u in.</div>
          </div>
        </div>
      </section>

      <section className="dienst-prijs">
        <h2>Wat kost het?</h2>
        <p>{d.prijs}</p>
        <a href="#aanvraag" className="dienst-cta dark">Vraag uw vaste prijs →</a>
      </section>

      <section className="dienst-reviews">
        {[['Stijn D.', 'Mechelen'], ['Greet V.', 'Lier'], ['Marc P.', 'Willebroek']].map(([naam, stad], i) => (
          <figure key={i}><figcaption><b>{naam}</b> uit {stad}<span>★★★★★</span></figcaption></figure>
        ))}
      </section>

      <section className="dienst-faq">
        <h2>Veelgestelde vragen</h2>
        {d.faq.map(([q, a], i) => (
          <details key={i}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </section>

      <section id="aanvraag" className="dienst-form-section">
        <h2>Vraag uw gratis plaatsbezoek aan</h2>
        <p>Antwoord binnen één werkdag. Vrijblijvend en gratis.</p>
        <div className="dienst-form-card">{MiniForm}</div>
        <a href={CONTACT.phone.href} className="dienst-call">of bel {CONTACT.phone.spaced}</a>
      </section>

      <footer className="dienst-footer">AB Bouw Groep · Industrieweg 14, 2830 Willebroek · {CONTACT.phone.spaced}</footer>
    </main>
  );
}

const DIENST_CSS = `
.dienst { font-family: var(--font-body, system-ui, sans-serif); color: var(--ink, #1a1f2b); background: #fff; }
.dienst-header { position: absolute; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px clamp(16px,4vw,48px); }
.dienst-brand { background: #fff; border-radius: 6px; padding: 7px 13px; box-shadow: 0 4px 14px rgba(8,12,22,0.18); display: inline-flex; }
.dienst-brand img { height: 28px; display: block; }
.dienst-phone { color: #fff; font-weight: 700; font-size: 14px; text-decoration: none; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); padding: 9px 16px; border-radius: 4px; backdrop-filter: blur(8px); }
.dienst-header-right { display: flex; align-items: center; gap: 12px; }
.dienst-header-cta { background: #d98c03; color: #fff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 10px 17px; border-radius: 4px; white-space: nowrap; transition: background .2s ease; }
.dienst-header-cta:hover { background: #c47a02; }
/* Bewegende merk-marquee (zoals homepage) */
.dienst-logos { background: #f6f4f0; border-top: 1px solid #e3e1db; border-bottom: 1px solid #e3e1db; padding: 26px 0 30px; margin-top: 44px; }
.dienst-logos-head { text-align: center; font-size: 11.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #8a93a0; margin-bottom: 18px; }
.dienst-marquee { overflow: hidden; position: relative; mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.dienst-marquee-track { display: flex; width: max-content; animation: dienst-marquee 42s linear infinite; }
.dienst-marquee:hover .dienst-marquee-track { animation-play-state: paused; }
.dienst-marquee-set { display: flex; align-items: center; gap: 56px; padding: 0 28px; flex-shrink: 0; }
.dienst-marquee-set img { height: 32px; width: auto; object-fit: contain; filter: grayscale(1) opacity(0.5); transition: filter .3s ease; }
.dienst-marquee-set img:hover { filter: grayscale(0) opacity(1); }
@keyframes dienst-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .dienst-marquee-track { animation: none; } }
.dienst-hero { position: relative; min-height: 86vh; background-size: cover; background-position: center; display: flex; align-items: center; }
.dienst-hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(9,14,24,0.97) 0%, rgba(9,14,24,0.95) 30%, rgba(9,14,24,0.78) 46%, rgba(9,14,24,0.30) 64%, rgba(9,14,24,0.04) 82%, rgba(9,14,24,0) 100%); }
.dienst-hero-inner { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 100px clamp(16px,4vw,48px) 80px; width: 100%; }
.dienst-hero-inner > * { max-width: 540px; }
.dienst-eyebrow { font-size: 12.5px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #f0a83a; margin-bottom: 18px; }
.dienst-eyebrow.dark { color: #d98c03; }
.dienst-hero h1 { font-family: var(--font-display, inherit); font-size: clamp(38px,4.6vw,60px); font-weight: 700; line-height: 1.0; letter-spacing: -0.022em; color: #fff; margin: 0 0 20px; }
.dienst-hero h1 br { display: block; }
.dienst-hero p { font-size: clamp(15px,1.15vw,17px); line-height: 1.6; color: rgba(255,255,255,0.82); margin: 0 0 28px; max-width: 470px; }
.dienst-cta { display: inline-flex; align-items: center; gap: 8px; background: #d98c03; color: #fff; font-weight: 700; font-size: 15px; padding: 15px 28px; border-radius: 4px; text-decoration: none; box-shadow: none; }
.dienst-cta:hover { background: #c47a02; }
.dienst-trust { display: flex; flex-wrap: wrap; gap: 26px; margin-top: 26px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 13.5px; }
.dienst-trust b { font-weight: 700; }
.dienst-quick { max-width: 880px; margin: -52px auto 0; padding: 0 16px; position: relative; z-index: 5; }
.dienst-quick-card { background: #fff; border-radius: 6px; padding: 24px 26px; box-shadow: 0 1px 2px rgba(15,17,21,.04), 0 14px 34px -26px rgba(10,22,40,0.16); border-top: 3px solid #d98c03; }
.dienst-quick-head { margin-bottom: 14px; }
.dienst-quick-head strong { display: block; font-family: var(--font-display, inherit); font-size: 18px; color: var(--navy, #0a1628); }
.dienst-quick-head span { font-size: 12.5px; color: #5a6473; }
.dienst-form { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; }
.dienst-form input { padding: 14px 15px; border: 1px solid #d7dce3; border-radius: 6px; font: inherit; font-size: 15px; }
.dienst-form input:focus { outline: none; border-color: #d98c03; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); }
.dienst-form button { background: #d98c03; color: #fff; border: none; border-radius: 6px; font: inherit; font-weight: 700; font-size: 14.5px; padding: 14px 22px; cursor: pointer; white-space: nowrap; }
.dienst-form button:hover { background: #c47a02; }
.dienst-form button:disabled { opacity: 0.6; }
.dienst-err { grid-column: 1/-1; color: #c4523f; font-size: 13px; }
.dienst-thanks { grid-column: 1/-1; text-align: center; padding: 14px; }
.dienst-thanks strong { display: block; font-size: 17px; color: var(--navy, #0a1628); }
.dienst-thanks span { font-size: 14px; color: #5a6473; }
.dienst-offer { max-width: 1180px; margin: 0 auto; padding: 56px clamp(16px,4vw,48px) 8px; }
.dienst-offer-head { max-width: 720px; margin-bottom: 28px; }
.dienst-offer-head h2 { font-family: var(--font-display, inherit); font-size: clamp(24px,3vw,34px); font-weight: 700; color: var(--navy, #0a1628); letter-spacing: -0.02em; line-height: 1.12; margin: 0 0 10px; }
.dienst-offer-head mark { background: linear-gradient(transparent 60%, rgba(217,140,3,0.3) 60%); color: inherit; }
.dienst-offer-head p { font-size: 15px; color: #5a6473; line-height: 1.6; margin: 0; }
.dienst-offer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 32px; background: #fff; border: 1px solid rgba(10,22,40,0.08); border-radius: 6px; padding: 30px 32px; box-shadow: 0 1px 2px rgba(15,17,21,.04), 0 14px 34px -26px rgba(10,22,40,0.16); }
.dienst-offer-item { display: flex; gap: 13px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; }
.dienst-offer-item strong { display: block; color: var(--navy, #0a1628); margin-bottom: 1px; }
.dienst-check { width: 24px; height: 24px; border-radius: 4px; background: rgba(217,140,3,0.12); color: #d98c03; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.dienst-steps { max-width: 1180px; margin: 0 auto; padding: 48px clamp(16px,4vw,48px) 8px; }
.dienst-steps h2 { font-family: var(--font-display, inherit); font-size: clamp(22px,2.6vw,30px); color: var(--navy, #0a1628); margin: 0 0 24px; }
.dienst-steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.dienst-step { background: #f7f8fa; border-radius: 6px; padding: 24px; }
.dienst-step-num { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: var(--navy, #0a1628); color: #fff; font-weight: 700; margin-bottom: 12px; }
.dienst-step strong { display: block; color: var(--navy, #0a1628); font-size: 16px; margin-bottom: 5px; }
.dienst-step-desc { font-size: 14px; color: #5a6473; line-height: 1.55; }
.dienst-why { background: var(--navy, #0a1628); color: #fff; margin-top: 48px; }
.dienst-why-inner { max-width: 1180px; margin: 0 auto; padding: 52px clamp(16px,4vw,48px); }
.dienst-why h2 { font-family: var(--font-display, inherit); font-size: clamp(22px,2.6vw,30px); margin: 0 0 24px; }
.dienst-why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
.dienst-why-grid div { font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.78); }
.dienst-why-grid strong { display: block; color: #fff; font-size: 16px; margin-bottom: 6px; }
.dienst-prijs { max-width: 760px; margin: 0 auto; padding: 52px clamp(16px,4vw,48px); text-align: center; }
.dienst-prijs h2 { font-family: var(--font-display, inherit); font-size: clamp(22px,2.6vw,30px); color: var(--navy, #0a1628); margin: 0 0 14px; }
.dienst-prijs p { font-size: 15.5px; color: #404a5a; line-height: 1.65; margin: 0 0 24px; }
.dienst-cta.dark { box-shadow: none; }
.dienst-reviews { max-width: 1180px; margin: 0 auto; padding: 8px clamp(16px,4vw,48px) 44px; display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.dienst-reviews figure { margin: 0; display: flex; align-items: center; gap: 12px; background: #f7f8fa; border-radius: 6px; padding: 14px; }
.dienst-reviews img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
.dienst-reviews figcaption { font-size: 14px; }
.dienst-reviews figcaption b { display: block; color: var(--navy, #0a1628); }
.dienst-reviews figcaption span { color: #f5b301; font-size: 12px; }
.dienst-faq { max-width: 760px; margin: 0 auto; padding: 16px clamp(16px,4vw,48px) 56px; }
.dienst-faq h2 { font-family: var(--font-display, inherit); font-size: clamp(22px,2.6vw,30px); color: var(--navy, #0a1628); margin: 0 0 20px; }
.dienst-faq details { border-bottom: 1px solid #e7eaef; padding: 14px 0; }
.dienst-faq summary { font-weight: 600; font-size: 15.5px; color: var(--navy, #0a1628); cursor: pointer; }
.dienst-faq p { font-size: 14.5px; color: #5a6473; line-height: 1.6; margin: 10px 0 0; }
.dienst-form-section { background: var(--navy, #0a1628); color: #fff; text-align: center; padding: 56px clamp(16px,4vw,48px); }
.dienst-form-section h2 { font-family: var(--font-display, inherit); font-size: clamp(24px,3vw,34px); margin: 0 0 8px; }
.dienst-form-section > p { color: rgba(255,255,255,0.75); margin: 0 0 24px; }
.dienst-form-card { background: #fff; max-width: 620px; margin: 0 auto; border-radius: 6px; padding: 24px; }
.dienst-call { display: inline-block; margin-top: 16px; color: #f0a83a; font-weight: 600; text-decoration: none; }
.dienst-footer { background: #070d16; color: rgba(255,255,255,0.6); text-align: center; padding: 24px; font-size: 13px; }
@media (max-width: 720px) {
  .dienst-hero { min-height: 78vh; }
  .dienst-hero::after { background: linear-gradient(0deg, rgba(9,14,24,0.94) 0%, rgba(9,14,24,0.74) 40%, rgba(9,14,24,0.3) 100%); }
  .dienst-form { grid-template-columns: 1fr; }
  .dienst-offer-grid { grid-template-columns: 1fr; gap: 14px; padding: 22px 20px; }
  .dienst-reviews { grid-template-columns: 1fr; }
  .dienst-steps-grid { grid-template-columns: 1fr; }
  .dienst-why-grid { grid-template-columns: 1fr 1fr; gap: 18px; }
  .dienst-phone { display: none; }
  .dienst-header-cta { padding: 9px 14px; font-size: 13px; }
  .dienst-marquee-set { gap: 40px; padding: 0 20px; }
  .dienst-marquee-set img { height: 28px; }
}
`;
