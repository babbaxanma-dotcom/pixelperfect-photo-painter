import { makeDivision } from './_division';
import bg from '@/assets/home/svc-interieur.jpg';
import storyImg from '@/assets/home/skills.jpg';

export default makeDivision({
  slug: 'interieur', num: '03', title: 'AB Interieurwerken', eyebrow: 'Interieurafwerking',
  heroBg: bg, storyImg,
  heroTitle: 'Strak afgewerkt<br/>tot in de plint.',
  heroLede: 'Maatwerk in gyproc, vloeren, schrijnwerk en plafonds. Onze interieurploeg zet de finale toets op uw woning, daar waar het verschil zichtbaar wordt.',
  storyTitle: 'Het verschil zit<br/>in de afwerking.',
  storyLede: 'Een ruwbouw kan iedereen leveren. Een woning die klopt tot in elke hoek vraagt vakmensen die weken aan dezelfde werf staan en oog hebben voor het detail dat niemand opmerkt, behalve uzelf, elke dag.',
  features: [
    { n: '01', t: 'Eigen schrijnwerker', d: 'Maatkasten, deuren, trappen, in eigen atelier op maat gemaakt.' },
    { n: '02', t: 'Gyproc & pleisterwerk', d: 'Strakke wanden en plafonds, klaar voor schilder of behang.' },
    { n: '03', t: 'Vloeren', d: 'Parket, laminaat, vinyl of gietvloer. Inclusief egalisatie.' },
  ],
  whatWeDo: [
    { n: '01', t: 'Gyproc & plafonds', d: 'Akoestische plafonds, verlaagde plafonds, scheidingswanden.' },
    { n: '02', t: 'Vloeren leggen', d: 'Houten parket, click-laminaat, PVC en gietvloer.' },
    { n: '03', t: 'Maatwerk', d: 'Inbouwkasten, dressings, keukens en trappen.' },
  ],
  process: [
    { n: '01', t: 'Plaatsbezoek', d: 'Opmeten en luisteren naar uw smaak.', time: 'Week 1' },
    { n: '02', t: 'Moodboard', d: 'Materialen en kleuren voorgesteld.', time: 'Week 2' },
    { n: '03', t: 'Productie', d: 'Maatwerk in eigen atelier.', time: 'Week 3-6' },
    { n: '04', t: 'Plaatsing', d: 'Door eigen ploeg, in één doorgaande werf.', time: 'Variabel' },
    { n: '05', t: 'Oplevering', d: 'Eindcontrole tot in de plint.', time: 'Sleutelmoment' },
  ],
  faqs: [
    { q: 'Hoe lang duurt een interieurrenovatie?', a: 'Afhankelijk van de omvang: een woonkamer 2-3 weken, een volledig appartement 6-10 weken.' },
    { q: 'Doen jullie ook keukens?', a: 'Ja, maatwerk-keukens uit eigen atelier of in samenwerking met onze vaste keukenpartner.' },
    { q: 'Welke vloeren raden jullie aan?', a: 'Dat hangt af van vocht, slijtage en budget. Bij het plaatsbezoek bespreken we de opties eerlijk.' },
    { q: 'Werken jullie ook in bewoonde woningen?', a: 'Ja, met dagelijkse opkuis en plastic afscherming om stof te beperken.' },
  ],
  meta: 'AB Interieurwerken, gyproc, vloeren, maatkasten en schrijnwerk door eigen vakmensen.',
});
