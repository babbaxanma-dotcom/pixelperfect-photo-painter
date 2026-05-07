import { makeDivision } from './_division';
import bg from '@/assets/home/svc-bad.jpg';
import storyImg from '@/assets/home/about.jpg';

export default makeDivision({
  slug: 'bad', num: '05', title: 'AB Bad & Wellness', eyebrow: 'Badkamers & wellness',
  heroBg: bg, storyImg,
  heroTitle: 'Sleutel-op-de-deur badkamers,<br/>klaar in vier weken.',
  heroLede: 'Premium tegels, sanitair en maatkasten, geplaatst door één vaste ploeg. Van strip tot eerste douche: één coördinatie, één eindfactuur.',
  storyTitle: 'Eén ploeg,<br/>één eindresultaat.',
  storyLede: 'In een badkamer komen alle vakgebieden samen: loodgieterij, elektriciteit, tegelwerk, schrijnwerk en sanitair. Wij houden alles in eigen hand, daardoor staat uw badkamer er na 4 weken, niet na 4 maanden.',
  features: [
    { n: '01', t: 'Eigen tegelzetter', d: 'Grootformaat tegels, mozaïek of natuursteen. Strak gevoegd.' },
    { n: '02', t: 'Sanitair', d: 'Premium merken: Geberit, Hansgrohe, Duravit. Of uw eigen keuze.' },
    { n: '03', t: 'Maatwerk', d: 'Inloopdouches, maatkasten en wellness-toepassingen.' },
  ],
  whatWeDo: [
    { n: '01', t: 'Badkamerrenovatie', d: 'Volledige renovatie van strip tot afwerking, in 4 weken.' },
    { n: '02', t: 'Wellness', d: 'Hammam, infraroodcabine, jacuzzi-installatie.' },
    { n: '03', t: 'Aanpasbaar bouwen', d: 'Inloopdouches en levensloopbestendig sanitair.' },
  ],
  process: [
    { n: '01', t: 'Plaatsbezoek', d: 'Opmeten en wensen bespreken.', time: 'Week 1' },
    { n: '02', t: '3D-ontwerp', d: 'Visualisatie van uw nieuwe badkamer.', time: 'Week 2' },
    { n: '03', t: 'Materialen', d: 'Tegels en sanitair gekozen in showroom.', time: 'Week 3' },
    { n: '04', t: 'Uitvoering', d: '4 weken, één doorlopende werf.', time: 'Variabel' },
    { n: '05', t: 'Oplevering', d: 'Eindcontrole + waterdichtingstest.', time: 'Sleutelmoment' },
  ],
  faqs: [
    { q: 'Echt klaar in 4 weken?', a: 'Ja, omdat alle disciplines (loodgieter, elektricien, tegelzetter) bij ons in huis zitten en parallel werken.' },
    { q: 'Wat kost een gemiddelde badkamer?', a: 'Vanaf €15.000 voor een standaard renovatie. Premium uitvoering tot €40.000+. Bij plaatsbezoek krijgt u een vaste prijs.' },
    { q: 'Mag ik mijn eigen tegels kiezen?', a: 'Uiteraard. We adviseren onze partners maar u bent vrij om bij eender welke leverancier te kopen.' },
    { q: 'Garantie?', a: '10 jaar waterdichtheid, 2 jaar afwerking, fabrieksgarantie op sanitair.' },
  ],
  meta: 'AB Bad & Wellness, sleutel-op-de-deur badkamers en wellness, klaar in vier weken.',
});
