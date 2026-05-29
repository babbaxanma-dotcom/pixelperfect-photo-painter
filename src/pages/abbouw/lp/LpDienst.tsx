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
import rev1 from '@/assets/reviews/stijn.jpg';
import rev2 from '@/assets/reviews/greet.jpg';
import rev3 from '@/assets/reviews/marc.jpg';

type Dienst = {
  division: Divisie; typeWerk: string; bronLead: string;
  eyebrow: string; h1: string[]; sub: string; heroImg: string;
  offerTitle: string; offerMark: string; offerSub: string; offer: [string, string][];
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
    faq: [
      ['Wat kost een Velux dakraam geplaatst?', 'Dat hangt af van het type, het formaat en de bestaande dakopbouw. Een standaardplaatsing start doorgaans rond €1.250 inclusief plaatsing. U krijgt een vaste prijs na de gratis opmeting.'],
      ['Plaatsen jullie ook in een bestaand pannendak?', 'Ja. Wij plaatsen Velux-dakramen in pannendaken en leien daken, met het juiste gootstuk zodat alles waterdicht blijft.'],
      ['Hoe lang duurt de plaatsing?', 'Een standaard dakraam plaatsen we doorgaans op één dag, inclusief binnenafwerking.'],
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
    faq: [
      ['Wat kost gevelreiniging per m²?', 'Dat hangt af van de vervuiling, de gevelsteen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Beschadigt reinigen mijn gevel niet?', 'Niet als de juiste methode wordt gebruikt. Wij stemmen de druk en het middel af op uw gevelsteen, zodat voeg en steen intact blijven.'],
      ['Is impregneren nuttig?', 'Vaak wel. Een impregnatie houdt vocht en vuil tegen, waardoor uw gevel langer proper blijft. Wij adviseren of het zinvol is voor uw gevel.'],
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
    faq: [
      ['Wanneer moet een gevel hervoegd worden?', 'Als de voegen loskomen, verbrokkelen of diep zijn uitgesleten. Dat laat vocht door en tast op termijn de muur aan. Een plaatsbezoek geeft uitsluitsel.'],
      ['Wat kost hervoegen per m²?', 'Dat hangt af van de staat van de voegen en de bereikbaarheid. U krijgt een vaste prijs per m² na het gratis plaatsbezoek.'],
      ['Hoe lang gaat een nieuwe voeg mee?', 'Vakkundig uitgeslepen en opnieuw gevoegd gaat een gevel doorgaans decennia mee.'],
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
        <a href={CONTACT.phone.href} className="dienst-phone">{CONTACT.phone.spaced}</a>
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

      <section className="dienst-reviews">
        {[[rev1, 'Stijn', 'Mechelen'], [rev2, 'Greet', 'Lier'], [rev3, 'Marc', 'Willebroek']].map(([img, naam, stad], i) => (
          <figure key={i}><img src={img as string} alt={naam as string} /><figcaption><b>{naam}</b> uit {stad}<span>★★★★★</span></figcaption></figure>
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
.dienst-brand { background: #fff; border-radius: 10px; padding: 7px 13px; box-shadow: 0 4px 14px rgba(8,12,22,0.18); display: inline-flex; }
.dienst-brand img { height: 28px; display: block; }
.dienst-phone { color: #fff; font-weight: 700; font-size: 14px; text-decoration: none; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); padding: 9px 16px; border-radius: 999px; backdrop-filter: blur(8px); }
.dienst-hero { position: relative; min-height: 86vh; background-size: cover; background-position: center; display: flex; align-items: center; }
.dienst-hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(9,14,24,0.97) 0%, rgba(9,14,24,0.95) 30%, rgba(9,14,24,0.78) 46%, rgba(9,14,24,0.30) 64%, rgba(9,14,24,0.04) 82%, rgba(9,14,24,0) 100%); }
.dienst-hero-inner { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 100px clamp(16px,4vw,48px) 80px; width: 100%; }
.dienst-hero-inner > * { max-width: 540px; }
.dienst-eyebrow { font-size: 12.5px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #f0a83a; margin-bottom: 18px; }
.dienst-eyebrow.dark { color: #d98c03; }
.dienst-hero h1 { font-family: var(--font-display, inherit); font-size: clamp(38px,4.6vw,60px); font-weight: 700; line-height: 1.0; letter-spacing: -0.022em; color: #fff; margin: 0 0 20px; }
.dienst-hero h1 br { display: block; }
.dienst-hero p { font-size: clamp(15px,1.15vw,17px); line-height: 1.6; color: rgba(255,255,255,0.82); margin: 0 0 28px; max-width: 470px; }
.dienst-cta { display: inline-flex; align-items: center; gap: 8px; background: #d98c03; color: #fff; font-weight: 700; font-size: 15px; padding: 15px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 10px rgba(9,14,24,0.3); }
.dienst-cta:hover { background: #c47a02; }
.dienst-trust { display: flex; flex-wrap: wrap; gap: 26px; margin-top: 26px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 13.5px; }
.dienst-trust b { font-weight: 700; }
.dienst-quick { max-width: 880px; margin: -52px auto 0; padding: 0 16px; position: relative; z-index: 5; }
.dienst-quick-card { background: #fff; border-radius: 16px; padding: 24px 26px; box-shadow: 0 18px 50px -22px rgba(15,23,42,0.30); border-top: 3px solid #d98c03; }
.dienst-quick-head { margin-bottom: 14px; }
.dienst-quick-head strong { display: block; font-family: var(--font-display, inherit); font-size: 18px; color: var(--navy, #0a1628); }
.dienst-quick-head span { font-size: 12.5px; color: #5a6473; }
.dienst-form { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; }
.dienst-form input { padding: 14px 15px; border: 1px solid #d7dce3; border-radius: 10px; font: inherit; font-size: 15px; }
.dienst-form input:focus { outline: none; border-color: #d98c03; box-shadow: 0 0 0 3px rgba(217,140,3,0.16); }
.dienst-form button { background: #d98c03; color: #fff; border: none; border-radius: 10px; font: inherit; font-weight: 700; font-size: 14.5px; padding: 14px 22px; cursor: pointer; white-space: nowrap; }
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
.dienst-offer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 32px; background: #fff; border: 1px solid rgba(10,22,40,0.08); border-radius: 16px; padding: 30px 32px; box-shadow: 0 18px 44px -28px rgba(10,22,40,0.18); }
.dienst-offer-item { display: flex; gap: 13px; align-items: flex-start; font-size: 14.5px; line-height: 1.5; }
.dienst-offer-item strong { display: block; color: var(--navy, #0a1628); margin-bottom: 1px; }
.dienst-check { width: 24px; height: 24px; border-radius: 50%; background: rgba(217,140,3,0.12); color: #d98c03; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.dienst-reviews { max-width: 1180px; margin: 0 auto; padding: 44px clamp(16px,4vw,48px); display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.dienst-reviews figure { margin: 0; display: flex; align-items: center; gap: 12px; background: #f7f8fa; border-radius: 14px; padding: 14px; }
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
.dienst-form-card { background: #fff; max-width: 620px; margin: 0 auto; border-radius: 16px; padding: 24px; }
.dienst-call { display: inline-block; margin-top: 16px; color: #f0a83a; font-weight: 600; text-decoration: none; }
.dienst-footer { background: #070d16; color: rgba(255,255,255,0.6); text-align: center; padding: 24px; font-size: 13px; }
@media (max-width: 720px) {
  .dienst-hero { min-height: 78vh; }
  .dienst-hero::after { background: linear-gradient(0deg, rgba(9,14,24,0.94) 0%, rgba(9,14,24,0.74) 40%, rgba(9,14,24,0.3) 100%); }
  .dienst-form { grid-template-columns: 1fr; }
  .dienst-offer-grid { grid-template-columns: 1fr; gap: 14px; padding: 22px 20px; }
  .dienst-reviews { grid-template-columns: 1fr; }
}
`;
