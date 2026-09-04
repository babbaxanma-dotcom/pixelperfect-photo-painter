import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadFoutmelding, submitLead } from '@/lib/leads';
import { trackFormStart } from '@/lib/tracking';
import { CONTACT } from '@/data/contact';
import { IcCamera, IcPijl } from './Iconen';

import kWcBeton from '@/assets/schetser/k-wc-beton.jpg';
import kWcAntraciet from '@/assets/schetser/k-wc-antraciet.jpg';
import kWcMarmer from '@/assets/schetser/k-wc-marmer.jpg';
import kWcZandsteen from '@/assets/schetser/k-wc-zandsteen.jpg';
import kWcHout from '@/assets/schetser/k-wc-hout.jpg';
import kWcMicro from '@/assets/schetser/k-wc-micro.jpg';
import kGwcBeton from '@/assets/schetser/k-gwc-beton.jpg';
import kGwcAntraciet from '@/assets/schetser/k-gwc-antraciet.jpg';
import kGwcMarmer from '@/assets/schetser/k-gwc-marmer.jpg';
import kGwcZandsteen from '@/assets/schetser/k-gwc-zandsteen.jpg';
import kGwcHout from '@/assets/schetser/k-gwc-hout.jpg';
import kGwcMicro from '@/assets/schetser/k-gwc-micro.jpg';
import mWcBeton from '@/assets/schetser/m-wc-beton.jpg';
import mWcAntraciet from '@/assets/schetser/m-wc-antraciet.jpg';
import mWcMarmer from '@/assets/schetser/m-wc-marmer.jpg';
import mWcZandsteen from '@/assets/schetser/m-wc-zandsteen.jpg';
import mWcHout from '@/assets/schetser/m-wc-hout.jpg';
import mWcMicro from '@/assets/schetser/m-wc-micro.jpg';
import mGwcBeton from '@/assets/schetser/m-gwc-beton.jpg';
import mGwcAntraciet from '@/assets/schetser/m-gwc-antraciet.jpg';
import mGwcMarmer from '@/assets/schetser/m-gwc-marmer.jpg';
import mGwcZandsteen from '@/assets/schetser/m-gwc-zandsteen.jpg';
import mGwcHout from '@/assets/schetser/m-gwc-hout.jpg';
import mGwcMicro from '@/assets/schetser/m-gwc-micro.jpg';
import rWcBeton from '@/assets/schetser/r-wc-beton.jpg';
import rWcAntraciet from '@/assets/schetser/r-wc-antraciet.jpg';
import rWcMarmer from '@/assets/schetser/r-wc-marmer.jpg';
import rWcZandsteen from '@/assets/schetser/r-wc-zandsteen.jpg';
import rWcHout from '@/assets/schetser/r-wc-hout.jpg';
import rWcMicro from '@/assets/schetser/r-wc-micro.jpg';
import rGwcBeton from '@/assets/schetser/r-gwc-beton.jpg';
import rGwcAntraciet from '@/assets/schetser/r-gwc-antraciet.jpg';
import rGwcMarmer from '@/assets/schetser/r-gwc-marmer.jpg';
import rGwcZandsteen from '@/assets/schetser/r-gwc-zandsteen.jpg';
import rGwcHout from '@/assets/schetser/r-gwc-hout.jpg';
import rGwcMicro from '@/assets/schetser/r-gwc-micro.jpg';

/**
 * Ontwerp uw eigen badkamer.
 *
 * De bezoeker geeft eerst op hoe groot zijn badkamer is en of het toilet erin
 * zit. Daarmee verschijnt de voorbeeldruimte die het dichtst bij zijn situatie
 * ligt, met standaarduitrusting erin. Daarna vult hij zelf aan.
 *
 * Waarom het beeld op grootte en toilet reageert en niet op elke keuze: elk
 * beeld moet vooraf gemaakt en nagekeken worden. Grootte maal toilet is zes
 * beelden; daar de vier smaakassen bij optellen zou 192 beelden vragen. Die
 * keuzes gaan daarom mee in de aanvraag in plaats van in het beeld. De
 * samenvatting rechts laat elke klik wél meteen landen, zodat de bezoeker ziet
 * dat zijn keuze geregistreerd is.
 *
 * In elke keuzelijst staat onderaan "staat er niet tussen". Wie dat kiest,
 * beschrijft het zelf in het veld eronder — dat is precies de bezoeker die het
 * meest waard is om te bellen.
 */
type Ruimte = { sleutel: string; naam: string; onder: string };
type Optie = { waarde: string; label: string };
type As = { sleutel: string; vraag: string; opties: Optie[] };

/*
 * De maten volgen de gangbare indeling voor badkamers, niet een schatting.
 * Klein is wat in een appartement of een ouder huis zit: douche, wastafel,
 * soms een compact bad, en het toilet meestal apart. Middelgroot is de
 * eengezinswoning: douche, ligbad, meubel en eventueel het toilet erbij.
 */
const RUIMTES: Ruimte[] = [
  { sleutel: 'klein', naam: 'Klein', onder: 'tot 6 m²' },
  { sleutel: 'middel', naam: 'Middelgroot', onder: '6 tot 10 m²' },
  { sleutel: 'ruim', naam: 'Groot', onder: 'meer dan 10 m²' },
];

/**
 * De beeldenbank.
 *
 * Elk beeld is AFGELEID van hetzelfde basisbeeld, niet los gemaakt. Alleen zo
 * blijven hoek, raam, bad, meubel en kranen exact gelijk en verandert er echt
 * maar één ding. Losse generaties gaven zes verschillende kamers — daar viel
 * niets mee te vergelijken.
 *
 * De sleutel is grootte + toilet + tegelkeuze, en alle drie zijn volledig: elke
 * look bestaat met en zonder toilet. Wie "geen toilet" koos zag eerder bij vijf
 * van de zes looks de betonlook-basis met een uitleg eronder; dat was eerlijk,
 * maar het beloofde iets anders dan het toonde.
 *
 * De terugval blijft in de code staan. Komt er een look bij zonder dat beide
 * beelden gemaakt zijn, dan toont de schetser liever een ander beeld met een
 * eerlijk onderschrift dan een gebroken plaatje.
 *
 * Elk beeld is gemaakt met onderzochte materiaalregels: tegelformaat, voegmaat
 * en -kleur, legverband, glansgraad en hoeveel de tegels onderling verschillen.
 * Zonder die regels tekent een generator marmer dat over de voegen doorloopt en
 * houtlook in plankbreedtes die niet bestaan.
 */
const STANDAARDTEGEL = 'Betonlook grijs';

const BEELDEN: Record<string, string> = {
  'klein|wc|Betonlook grijs': kWcBeton,
  'klein|wc|Antraciet': kWcAntraciet,
  'klein|wc|Marmerlook wit': kWcMarmer,
  'klein|wc|Beige zandsteen': kWcZandsteen,
  'klein|wc|Houtlook': kWcHout,
  'klein|wc|Microcement': kWcMicro,
  'klein|geenwc|Betonlook grijs': kGwcBeton,
  'klein|geenwc|Antraciet': kGwcAntraciet,
  'klein|geenwc|Marmerlook wit': kGwcMarmer,
  'klein|geenwc|Beige zandsteen': kGwcZandsteen,
  'klein|geenwc|Houtlook': kGwcHout,
  'klein|geenwc|Microcement': kGwcMicro,
  'middel|wc|Betonlook grijs': mWcBeton,
  'middel|wc|Antraciet': mWcAntraciet,
  'middel|wc|Marmerlook wit': mWcMarmer,
  'middel|wc|Beige zandsteen': mWcZandsteen,
  'middel|wc|Houtlook': mWcHout,
  'middel|wc|Microcement': mWcMicro,
  'middel|geenwc|Betonlook grijs': mGwcBeton,
  'middel|geenwc|Antraciet': mGwcAntraciet,
  'middel|geenwc|Marmerlook wit': mGwcMarmer,
  'middel|geenwc|Beige zandsteen': mGwcZandsteen,
  'middel|geenwc|Houtlook': mGwcHout,
  'middel|geenwc|Microcement': mGwcMicro,
  'ruim|wc|Betonlook grijs': rWcBeton,
  'ruim|wc|Antraciet': rWcAntraciet,
  'ruim|wc|Marmerlook wit': rWcMarmer,
  'ruim|wc|Beige zandsteen': rWcZandsteen,
  'ruim|wc|Houtlook': rWcHout,
  'ruim|wc|Microcement': rWcMicro,
  'ruim|geenwc|Betonlook grijs': rGwcBeton,
  'ruim|geenwc|Antraciet': rGwcAntraciet,
  'ruim|geenwc|Marmerlook wit': rGwcMarmer,
  'ruim|geenwc|Beige zandsteen': rGwcZandsteen,
  'ruim|geenwc|Houtlook': rGwcHout,
  'ruim|geenwc|Microcement': rGwcMicro,
};

import sTegelBeton from '@/assets/schetser/s-tegel-beton.jpg';
import sTegelAntraciet from '@/assets/schetser/s-tegel-antraciet.jpg';
import sTegelMarmer from '@/assets/schetser/s-tegel-marmer.jpg';
import sTegelZandsteen from '@/assets/schetser/s-tegel-zandsteen.jpg';
import sTegelHout from '@/assets/schetser/s-tegel-hout.jpg';
import sTegelMicro from '@/assets/schetser/s-tegel-micro.jpg';
import sMeubelEiken from '@/assets/schetser/s-meubel-eiken.jpg';
import sMeubelWalnoot from '@/assets/schetser/s-meubel-walnoot.jpg';
import sMeubelWit from '@/assets/schetser/s-meubel-wit.jpg';
import sMeubelAntraciet from '@/assets/schetser/s-meubel-antraciet.jpg';
import sMeubelDubbel from '@/assets/schetser/s-meubel-dubbel.jpg';
import sKraanZwart from '@/assets/schetser/s-kraan-zwart.jpg';
import sKraanChroom from '@/assets/schetser/s-kraan-chroom.jpg';
import sKraanGoud from '@/assets/schetser/s-kraan-goud.jpg';
import sKraanRvs from '@/assets/schetser/s-kraan-rvs.jpg';

const NIET_ERTUSSEN = 'anders';
/* Niet iedereen heeft een voorkeur, en dan is doorklikken zonder te kiezen
   vervelender dan kunnen zeggen dat wij het invullen. Deze waarde gaat mee in
   de aanvraag, zodat de ploeg weet waar hij vrij is en waar niet. */
const AAN_ONS = 'aanons';

/**
 * Stalen per keuze, zoals in een badkamerzaak.
 *
 * Het hoofdbeeld reageert op de ruimte, het toilet en de tegel. Het meubel en
 * de kraan kunnen daar niet bij: dat zou zevenhonderdtwintig beelden vragen.
 * Deze stalen zijn uit dezelfde ruimte gesneden, dus licht en omgeving kloppen
 * met wat ernaast staat.
 */
const STALEN: Record<string, Record<string, string>> = {
  Tegels: {
    'Betonlook grijs': sTegelBeton,
    'Antraciet': sTegelAntraciet,
    'Marmerlook wit': sTegelMarmer,
    'Beige zandsteen': sTegelZandsteen,
    'Houtlook': sTegelHout,
    'Microcement': sTegelMicro,
  },
  Meubel: {
    'Eiken': sMeubelEiken,
    'Walnoot': sMeubelWalnoot,
    'Mat wit': sMeubelWit,
    'Antraciet': sMeubelAntraciet,
    'Dubbele lavabo': sMeubelDubbel,
  },
  Kranen: {
    'Mat zwart': sKraanZwart,
    'Chroom': sKraanChroom,
    'Geborsteld goud': sKraanGoud,
    'RVS': sKraanRvs,
  },
};

/**
 * Welk beeld hoort bij deze keuze, en klopt het met wat er gevraagd werd.
 *
 * Apart en puur, zodat het vangnet toetsbaar blijft. In de pagina bestaat elke
 * combinatie, dus valt er niets terug en kan een browsercheck niet bewijzen dat
 * de terugval nog werkt. Met een onvolledige beeldenbank kan dat hier wel.
 */
/** Alleen voor de test: zo kan die de echte bank toetsen zonder hem te kopieren. */
export const BEELDEN_TEST = BEELDEN;

export function kiesBeeld(
  grootte: string,
  toiletdeel: string,
  tegelkeuze: string | undefined,
  bank: Record<string, string> = BEELDEN,
) {
  const gevraagd = tegelkeuze && tegelkeuze !== NIET_ERTUSSEN ? tegelkeuze : STANDAARDTEGEL;
  const getoond = bank[`${grootte}|${toiletdeel}|${gevraagd}`] ? gevraagd : STANDAARDTEGEL;
  return { gevraagd, getoond, beeld: bank[`${grootte}|${toiletdeel}|${getoond}`] };
}

const ASSEN: As[] = [
  /* De waarde blijft "Betonlook grijs" en zo: daar draaien de beeldsleutels en
     de aanvraag op. Het label is wat de bezoeker leest, en daar is "look" uit:
     in Vlaanderen leest dat als een woord over knoflook. */
  { sleutel: 'Tegels', vraag: 'Tegels', opties: [
    { waarde: 'Betonlook grijs', label: 'Beton grijs' },
    { waarde: 'Antraciet', label: 'Antraciet' },
    { waarde: 'Marmerlook wit', label: 'Marmer wit' },
    { waarde: 'Beige zandsteen', label: 'Beige zandsteen' },
    { waarde: 'Houtlook', label: 'Hout' },
    { waarde: 'Microcement', label: 'Microcement (naadloos)' },
  ] },
  { sleutel: 'Meubel', vraag: 'Wastafelmeubel', opties: [
    { waarde: 'Eiken', label: 'Eiken' },
    { waarde: 'Walnoot', label: 'Walnoot' },
    { waarde: 'Mat wit', label: 'Mat wit' },
    { waarde: 'Antraciet', label: 'Antraciet' },
    { waarde: 'Dubbele lavabo', label: 'Dubbele lavabo' },
  ] },
  { sleutel: 'Kranen', vraag: 'Kranen en douchewand', opties: [
    { waarde: 'Mat zwart', label: 'Mat zwart' },
    { waarde: 'Chroom', label: 'Chroom' },
    { waarde: 'Geborsteld goud', label: 'Geborsteld goud' },
    { waarde: 'RVS', label: 'RVS' },
  ] },
  { sleutel: 'Douche of bad', vraag: 'Douche of bad', opties: [
    { waarde: 'Inloopdouche', label: 'Inloopdouche' },
    { waarde: 'Bad', label: 'Ligbad' },
    { waarde: 'Bad en douche', label: 'Bad én aparte douche' },
    { waarde: 'Indeling houden', label: 'Indeling houden zoals ze is' },
  ] },
  { sleutel: 'Verwarming', vraag: 'Verwarming', opties: [
    { waarde: 'Handdoekradiator', label: 'Handdoekradiator' },
    { waarde: 'Vloerverwarming', label: 'Vloerverwarming' },
    { waarde: 'Beide', label: 'Allebei' },
    { waarde: 'Weet ik niet', label: 'Weet ik nog niet' },
  ] },
];

/** Verkleint een foto in de browser: sneller op 4G en genoeg om te beoordelen. */
async function verklein(bestand: File): Promise<string> {
  const beeld = await createImageBitmap(bestand, { imageOrientation: 'from-image' });
  const schaal = Math.min(1, 1400 / Math.max(beeld.width, beeld.height));
  const doek = document.createElement('canvas');
  doek.width = Math.round(beeld.width * schaal);
  doek.height = Math.round(beeld.height * schaal);
  doek.getContext('2d')!.drawImage(beeld, 0, 0, doek.width, doek.height);
  return doek.toDataURL('image/jpeg', 0.8);
}

export default function Schetser() {
  const navigate = useNavigate();
  const [grootte, setGrootte] = useState<string | null>(null);
  const [wc, setWc] = useState<boolean | null>(null);
  const [keuzes, setKeuzes] = useState<Record<string, string>>({});
  /* Per vraag apart, niet één keer voor alles. Wie bij de tegels iets anders
     wil dan de zes stalen, bedoelt iets anders dan wie bij de kranen buiten het
     rijtje valt: één gedeeld tekstvak dwong hem die twee door elkaar te
     schrijven. Elk product heeft dus zijn eigen beschrijving, link en foto. */
  const [anders, setAnders] = useState<Record<string, { tekst: string; link: string; foto: string | null }>>({});
  const zetAnders = (sleutel: string, veld: 'tekst' | 'link' | 'foto', waarde: string | null) =>
    setAnders((v) => ({
      ...v,
      [sleutel]: { tekst: '', link: '', foto: null, ...v[sleutel], [veld]: waarde },
    }));
  const [foto, setFoto] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const gemeld = useRef(false);
  const camera = useRef<HTMLInputElement>(null);
  const galerij = useRef<HTMLInputElement>(null);
  /* Eén bestandskiezer voor alle voorbeeldfoto's. Welke vraag hem opende staat
     hier, want een aparte input per vraag zou er zeven in de pagina zetten die
     op één na altijd stilstaan. */
  const andersFoto = useRef<HTMLInputElement>(null);
  const andersVoor = useRef<string | null>(null);


  /**
   * De vragen als één rij stappen, in de volgorde waarin ze gesteld worden.
   *
   * De schetser toonde alle vragen onder elkaar: zeven blokken waar je doorheen
   * moest scrollen voor je bij het formulier kwam, met de kans om er halverwege
   * uit te stappen bij elke vraag die je niet meteen wist. Nu staat er één vraag
   * op het scherm en gaat het vanzelf door naar de volgende, met de stappen die
   * al beantwoord zijn erboven om op terug te klikken.
   */
  type Stap = { sleutel: string; vraag: string; as?: As };
  const STAPPEN: Stap[] = useMemo(() => [
    { sleutel: 'grootte', vraag: 'Hoe groot is uw badkamer?' },
    { sleutel: 'wc', vraag: 'Zit het toilet in de badkamer?' },
    ...ASSEN.map((as) => ({ sleutel: as.sleutel, vraag: as.vraag, as })),
    { sleutel: 'slot', vraag: 'Waar mogen wij uw ontwerp naartoe sturen?' },
  ], []);
  const [stap, setStap] = useState(0);
  const laatste = STAPPEN.length - 1;
  const huidige = STAPPEN[Math.min(stap, laatste)];

  /** Wat er op een stap gekozen is; leeg betekent nog niet beantwoord. */
  const antwoordVan = (sleutel: string): string | null => {
    if (sleutel === 'grootte') return grootte ? (RUIMTES.find((r) => r.sleutel === grootte)?.naam ?? grootte) : null;
    if (sleutel === 'wc') return wc === null ? null : (wc ? 'in de badkamer' : 'apart');
    if (sleutel === 'slot') return null;
    const v = keuzes[sleutel];
    if (!v) return null;
    if (v === NIET_ERTUSSEN) return 'iets anders';
    if (v === AAN_ONS) return 'wij kiezen';
    const as = ASSEN.find((a) => a.sleutel === sleutel);
    return as?.opties.find((o) => o.waarde === v)?.label ?? v;
  };

  /* Doorlopen gebeurt vanzelf, maar niet meteen: een korte tel laat de keuze
     eerst oplichten, zodat je ziet wat je aangeraakt hebt voor het scherm
     verspringt. Bij "staat er niet tussen" blijft de stap staan, want daar moet
     nog getypt worden. */
  /* De stappen die al een antwoord hebben, met een kort label. Dit is
     tegelijk het overzicht van wat er vaststaat en de weg terug: elke knop
     springt naar die stap zonder de rest te wissen. */
  const beantwoorde = useMemo(() => STAPPEN.map((s, index) => {
    const antwoord = antwoordVan(s.sleutel);
    if (antwoord === null) return null;
    /* De vraag zelf is te lang voor een knop; het kernwoord volstaat om te
       herkennen waar het over ging. */
    const kort = s.sleutel === 'grootte' ? 'Grootte'
      : s.sleutel === 'wc' ? 'Toilet'
      : (s.as?.vraag ?? s.vraag);
    return { sleutel: s.sleutel, vraag: s.vraag, kort, antwoord, index };
  }).filter((b): b is NonNullable<typeof b> => b !== null),
  [STAPPEN, grootte, wc, keuzes]);

  const gaVerder = (blijf = false) => {
    if (blijf) return;
    window.setTimeout(() => setStap((s) => Math.min(s + 1, laatste)), 260);
  };

  const gekozenRuimte = grootte !== null && wc !== null;


  /* Het onderschrift benoemt de ruimte die te zien is. De grootte is de eerste
     vraag; zonder die bevestiging leest het beeld als een willekeurige foto. */
  const gekozenRuimteNaam = RUIMTES.find((r) => r.sleutel === grootte);

  const meldStart = () => {
    if (gemeld.current) return;
    gemeld.current = true;
    trackFormStart('lp:badkamerrenovatie:schetser');
  };

  const neemAndersFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const bestand = e.target.files?.[0];
    const sleutel = andersVoor.current;
    e.target.value = '';
    andersVoor.current = null;
    if (!bestand || !sleutel) return;
    meldStart();
    try { zetAnders(sleutel, 'foto', await verklein(bestand)); }
    catch { setFout('Die foto konden we niet lezen. Probeer er een andere.'); }
  };

  const neemFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const bestand = e.target.files?.[0];
    e.target.value = '';
    if (!bestand) return;
    meldStart();
    try { setFoto(await verklein(bestand)); }
    catch { setFout('Die foto konden we niet lezen. Probeer er een met de camera.'); }
  };

  const verstuur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bezig) return;
    const f = new FormData(e.currentTarget);
    const telefoon = String(f.get('telefoon') || '').trim();
    /* Dezelfde drempel als de lead-pijplijn zelf: acht cijfers. Een voorkant
       die iets doorlaat wat de achterkant weigert, laat de bezoeker denken dat
       hij verstuurd heeft terwijl er niets aankomt. */
    if (telefoon.replace(/\D/g, '').length < 8) {
      setFout('Vul uw telefoonnummer in. Wij bellen u met het ontwerp.');
      return;
    }
    setFout(null);
    setBezig(true);

    const ruimte = RUIMTES.find((r) => r.sleutel === grootte);
    /* De samenvatting per vraag, zodat de ploeg weet wat waar bij hoort. Wie
       bij de tegels een link geeft en bij de kranen een beschrijving, kreeg dat
       vroeger als één brok tekst zonder te zeggen waar het over ging. */
    const perVraag = ASSEN.flatMap((a) => {
      const v = keuzes[a.sleutel];
      if (!v) return [];
      const eigen = anders[a.sleutel];
      const gekozenTekst = v === NIET_ERTUSSEN ? 'iets anders'
        : v === AAN_ONS ? 'laat AB kiezen' : v;
      const extra = v === NIET_ERTUSSEN ? [
        eigen?.tekst?.trim() && `wens: ${eigen.tekst.trim()}`,
        eigen?.link?.trim() && `voorbeeld: ${eigen.link.trim()}`,
        eigen?.foto && 'foto meegestuurd',
      ].filter(Boolean) : [];
      return [`${a.sleutel}: ${gekozenTekst}${extra.length ? ` (${extra.join(', ')})` : ''}`];
    });
    const samenvatting = [
      ruimte && `Grootte: ${ruimte.naam} (${ruimte.onder})`,
      wc !== null && `Toilet in de badkamer: ${wc ? 'ja' : 'nee'}`,
      ...perVraag,
      foto && 'Bezoeker heeft een foto van zijn badkamer meegestuurd.',
    ].filter(Boolean).join(' · ');

    const res = await submitLead({
      source: 'landing_page',
      page_path: window.location.pathname,
      landing_division: 'ab_bad__wellness',
      firstName: String(f.get('naam') || '').trim() || undefined,
      email: String(f.get('email') || '').trim(),
      phone: telefoon,
      type_werk: 'ab_bad__wellness',
      aanvullende_info: samenvatting,
      bron_lead: 'lp:badkamerrenovatie:schetser',
    });
    setBezig(false);
    if (res.ok) navigate('/bedankt?dienst=badkamerrenovatie');
    else setFout(leadFoutmelding(res, CONTACT.phone.display));
  };

  return (
    <section className="pc-schets" id="schetser">
      {/* De titel en de belofte staan bij de eerste vraag. Vanaf de tweede is
          de bezoeker binnen: dan vertelt de voortgangsbalk waar hij is, en
          kost een herhaalde kop alleen maar beeld dat de vraag nodig heeft. */}
      {stap === 0 && (
        <div className="pc-vat pc-midden">
          <h2 className="pc-h2--midden">Ontwerp uw<br />eigen badkamer</h2>
          <p className="pc-schets-sub">
            <strong>Gratis visueel ontwerp van uw eigen badkamer.</strong> Geef aan wat u in gedachten hebt.
          </p>
        </div>
      )}

      <div className="pc-vat pc-schets-doorloop">
        {/* De voortgang. Zonder dit is een reeks vragen een gat zonder bodem;
            met een balk die vult weet je hoever je bent en dat het eindigt. */}
        <div className="pc-schets-voort">
          <div className="pc-schets-voort__baan">
            <span style={{ width: `${(stap / laatste) * 100}%` }} />
          </div>
          <p className="pc-schets-voort__tel">Stap {stap + 1} van {STAPPEN.length}</p>
        </div>

        {/* Wat al beantwoord is, als knoppen. Terugklikken hoort te kunnen
            zonder de rest kwijt te raken: dit is een doorloop, geen formulier
            dat je in één keer goed moet invullen. */}
        {beantwoorde.length > 0 && (
          <div className="pc-schets-terug" aria-label="Uw antwoorden, klik om aan te passen">
            {beantwoorde.map((b) => (
              <button type="button" key={b.sleutel} onClick={() => setStap(b.index)}
                className={b.index === stap ? 'is-aan' : undefined}
                title={`${b.vraag} aanpassen`}>
                <span>{b.kort}</span><strong>{b.antwoord}</strong>
              </button>
            ))}
          </div>
        )}

        {/* De vraag zelf. De sleutel op de stap laat React dit blok opnieuw
            opbouwen, zodat de overgang telkens speelt en je voelt dat je een
            stap verder bent. */}
        <div className="pc-schets-vraag" key={stap}>
          <h3>{huidige.vraag}</h3>

          {huidige.sleutel === 'grootte' && (
            <div className="pc-schets-keuzes">
              {RUIMTES.map((r) => (
                <button key={r.sleutel} type="button"
                  className={grootte === r.sleutel ? 'is-aan' : undefined}
                  aria-pressed={grootte === r.sleutel}
                  onClick={() => { setGrootte(r.sleutel); meldStart(); gaVerder(); }}>
                  <strong>{r.naam}</strong>
                  <span>{r.onder}</span>
                </button>
              ))}
            </div>
          )}

          {huidige.sleutel === 'wc' && (
            <div className="pc-schets-keuzes pc-schets-keuzes--twee">
              {[true, false].map((v) => (
                <button key={String(v)} type="button"
                  className={wc === v ? 'is-aan' : undefined}
                  aria-pressed={wc === v}
                  onClick={() => { setWc(v); meldStart(); gaVerder(); }}>
                  <strong>{v ? 'Ja' : 'Nee'}</strong>
                  <span>{v ? 'toilet staat erin' : 'apart toilet'}</span>
                </button>
              ))}
            </div>
          )}

          {huidige.as && (() => {
            const as = huidige.as;
            const stalen = STALEN[as.sleutel];
            const gekozen = keuzes[as.sleutel];
            const kies = (waarde: string) => {
              setKeuzes((v) => ({ ...v, [as.sleutel]: waarde }));
              meldStart();
              /* Bij "staat er niet tussen" blijft de stap staan: daaronder komt
                 het vak waar hij beschrijft wat hij dan wel wil. */
              gaVerder(waarde === NIET_ERTUSSEN);
            };
            return (
              <>
                {stalen ? (
                  <div className="pc-schets-stalen__rij" role="group" aria-label={as.vraag}>
                    {as.opties.map((o) => (
                      <button type="button" key={o.waarde}
                        className={gekozen === o.waarde ? 'is-aan' : undefined}
                        aria-pressed={gekozen === o.waarde}
                        onClick={() => kies(o.waarde)}>
                        <img src={stalen[o.waarde]} alt="" width={560} height={420} loading="lazy" decoding="async" />
                        <span>{o.label}</span>
                      </button>
                    ))}
                    <button type="button"
                      className={`pc-schets-stalen__anders${gekozen === AAN_ONS ? ' is-aan' : ''}`}
                      aria-pressed={gekozen === AAN_ONS} onClick={() => kies(AAN_ONS)}>
                      Laat ons kiezen
                    </button>
                    <button type="button"
                      className={`pc-schets-stalen__anders${gekozen === NIET_ERTUSSEN ? ' is-aan' : ''}`}
                      aria-pressed={gekozen === NIET_ERTUSSEN} onClick={() => kies(NIET_ERTUSSEN)}>
                      Staat er niet tussen
                    </button>
                  </div>
                ) : (
                  <div className="pc-schets-keuzes">
                    {as.opties.map((o) => (
                      <button key={o.waarde} type="button"
                        className={gekozen === o.waarde ? 'is-aan' : undefined}
                        aria-pressed={gekozen === o.waarde}
                        onClick={() => kies(o.waarde)}>
                        <strong>{o.label}</strong>
                      </button>
                    ))}
                    <button type="button" className={gekozen === AAN_ONS ? 'is-aan' : undefined}
                      aria-pressed={gekozen === AAN_ONS} onClick={() => kies(AAN_ONS)}>
                      <strong>Laat ons kiezen</strong>
                    </button>
                    <button type="button" className={gekozen === NIET_ERTUSSEN ? 'is-aan' : undefined}
                      aria-pressed={gekozen === NIET_ERTUSSEN} onClick={() => kies(NIET_ERTUSSEN)}>
                      <strong>Staat er niet tussen</strong>
                    </button>
                  </div>
                )}

                {gekozen === NIET_ERTUSSEN && (
                  <div className="pc-schets-anders">
                    <label className="pc-schets-lijst">
                      <span>Wat had u in gedachten bij {as.vraag.toLowerCase()}?</span>
                      <textarea rows={3} value={anders[as.sleutel]?.tekst ?? ''}
                        onChange={(e) => zetAnders(as.sleutel, 'tekst', e.target.value)}
                        placeholder="Beschrijf het gerust in uw eigen woorden." />
                    </label>
                    <label className="pc-schets-lijst">
                      <span>Of een link naar een voorbeeld</span>
                      <input type="url" inputMode="url" value={anders[as.sleutel]?.link ?? ''}
                        onChange={(e) => zetAnders(as.sleutel, 'link', e.target.value)}
                        placeholder="https://" />
                    </label>
                    <button type="button" className="pc-schets-anders__foto"
                      onClick={() => { andersVoor.current = as.sleutel; andersFoto.current?.click(); }}>
                      {anders[as.sleutel]?.foto ? 'Andere foto kiezen' : 'Of stuur een foto mee'}
                    </button>
                    {anders[as.sleutel]?.foto && (
                      <figure className="pc-schets-anders__beeld">
                        <img src={anders[as.sleutel]!.foto!} alt={`Voorbeeld voor ${as.vraag.toLowerCase()}`} />
                        <figcaption>Uw voorbeeld voor {as.vraag.toLowerCase()}</figcaption>
                      </figure>
                    )}
                  </div>
                )}
              </>
            );
          })()}

          {/* De laatste stap: een foto van de eigen badkamer, en waar het
              ontwerp naartoe mag. */}
          {huidige.sleutel === 'slot' && (
            <>
              <div className="pc-schets-opname">
                <p className="pc-schets-opname__kop">
                  Foto van uw badkamer <span>(optioneel)</span>
                </p>
                <p className="pc-schets-opname__uitleg">
                  Stuurt u er een mee, dan tekenen wij het ontwerp op uw eigen ruimte.
                </p>
                <button type="button" className="pc-schets-cam" onClick={() => camera.current?.click()}>
                  <span aria-hidden="true"><IcCamera maat={22} /></span>
                  {foto ? 'Andere foto maken' : 'Foto maken'}
                </button>
                <button type="button" className="pc-schets-uit" onClick={() => galerij.current?.click()}>
                  of kies er een uit uw toestel
                </button>
              </div>
              {foto && (
                <figure className="pc-schets-beeld">
                  <img src={foto} alt="Uw badkamer" />
                  <figcaption>Uw foto</figcaption>
                </figure>
              )}

              <form className="pc-schets-form" onSubmit={verstuur} onFocusCapture={meldStart}>
                <label className="pc-veld"><input name="naam" type="text" placeholder="Naam" autoComplete="name" aria-label="Naam" /></label>
                <label className="pc-veld"><input name="telefoon" type="tel" placeholder="Telefoon *" autoComplete="tel"
                  aria-label="Telefoon (verplicht)" aria-required="true" /></label>
                <label className="pc-veld"><input name="email" type="email" placeholder="E-mail" autoComplete="email" aria-label="E-mail" /></label>
                <button className="pc-knop pc-knop--accent" type="submit" disabled={bezig}>
                  {bezig ? 'Bezig…' : 'Stuur mijn ontwerp'}<IcPijl />
                </button>
                {fout && <p className="pc-schets-fout">{fout}</p>}
                <p className="pc-schets-verplicht">Met * bedoelen wij: dit hebben wij nodig om u het ontwerp te bezorgen.</p>
                <p className="pc-schets-gerust">
                  <strong>Volledig vrijblijvend en kosteloos.</strong> Uw foto gebruiken wij alleen
                  om uw ontwerp te maken.
                </p>
              </form>

              <a className="pc-knop pc-knop--rand pc-schets-bezoek" href="#contact">
                Of vraag meteen een gratis plaatsbezoek aan<IcPijl />
              </a>
            </>
          )}
        </div>

        {/* Heen en terug. De knop vooruit staat uit tot er iets gekozen is:
            doorklikken zonder antwoord levert een leeg ontwerp op. */}
        <div className="pc-schets-nav">
          <button type="button" className="pc-schets-nav__terug" disabled={stap === 0}
            onClick={() => setStap((s) => Math.max(0, s - 1))}>
            Terug
          </button>
          {stap < laatste && (
            <button type="button" className="pc-knop pc-knop--accent"
              disabled={antwoordVan(huidige.sleutel) === null}
              onClick={() => setStap((s) => Math.min(laatste, s + 1))}>
              Volgende<IcPijl />
            </button>
          )}
        </div>

        <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={neemFoto} />
        <input ref={galerij} type="file" accept="image/*" hidden onChange={neemFoto} />
        <input ref={andersFoto} type="file" accept="image/*" hidden onChange={neemAndersFoto} />
      </div>
    </section>
  );
}