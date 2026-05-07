import { makeDivision } from './_division';
import bg from '@/assets/home/svc-gevel.jpg';
import storyImg from '@/assets/home/why.jpg';

export default makeDivision({
  slug: 'gevel', num: '06', title: 'AB Gevelbekleding', eyebrow: 'Gevels & bekleding',
  heroBg: bg, storyImg,
  heroTitle: 'Strakke crepi-gevels,<br/>tijdloos en onderhoudsarm.',
  heroLede: 'Witte of grijze crepi, sierpleister of steenstrips. We adviseren eerlijk welke afwerking past bij uw woning, budget en onderhoudswens.',
  storyTitle: 'Een nieuwe crepi-gevel<br/>verandert alles.',
  storyLede: 'Een gevelrenovatie is vaak hét moment om in één keer ook gevelisolatie aan te pakken. We rekenen de E-peil-winst en premies vooraf door, zo weet u zeker dat de investering loont.',
  features: [
    { n: '01', t: 'Witte crepi', d: 'Tijdloos, helder en frisse uitstraling. Mineraal of siliconen, in elke gewenste tint.' },
    { n: '02', t: 'Grijze crepi', d: 'Modern en strak. Antraciet, parelgrijs of steengrijs, perfect bij donkere ramen.' },
    { n: '03', t: 'Steenstrips & sierpleister', d: 'Bakstenen look of fijne structuurpleister, voor wie net iets meer karakter wil.' },
  ],
  whatWeDo: [
    { n: '01', t: 'Gevelrenovatie', d: 'Reiniging, herstel en nieuwe crepi-afwerking.' },
    { n: '02', t: 'Buitenisolatie + crepi', d: 'EPS of minerale wol, afgewerkt met witte of grijze crepi.' },
    { n: '03', t: 'Steenstrips', d: 'Geïsoleerde steenstrips voor een baksteen-look met topisolatie.' },
  ],
  process: [
    { n: '01', t: 'Inspectie', d: 'Gevelinspectie en advies.', time: 'Week 1' },
    { n: '02', t: 'Materiaalkeuze', d: 'Stalen ter plaatse vergelijken.', time: 'Week 2' },
    { n: '03', t: 'Stelling', d: 'Plaatsing stelling, voorbereiding.', time: 'Week 3' },
    { n: '04', t: 'Uitvoering', d: '2-6 weken afhankelijk van techniek.', time: 'Variabel' },
    { n: '05', t: 'Oplevering', d: 'Eindcontrole + onderhoudsadvies.', time: 'Sleutelmoment' },
  ],
  faqs: [
    { q: 'Welke geveltechniek is het meest onderhoudsvrij?', a: 'Siliconen-crepi en steenstrips vragen het minst onderhoud. Een goede crepi gaat 25+ jaar mee zonder herschilderen.' },
    { q: 'Krijg ik premie voor gevelisolatie?', a: 'Ja, tot €30/m² via Mijn VerbouwPremie. Wij regelen de aanvraag.' },
    { q: 'Hoeveel verdient een geveloplossing energetisch op?', a: 'Buitenisolatie kan uw stookkost met 25-40% verlagen, afhankelijk van de bestaande situatie.' },
    { q: 'Garantie?', a: '10 jaar op stabiliteit van bekleding, fabrieksgarantie op materialen (vaak 25+ jaar).' },
  ],
  meta: 'AB Gevelbekleding, witte en grijze crepi, sierpleister en steenstrips voor gevels in Vlaanderen.',
});
