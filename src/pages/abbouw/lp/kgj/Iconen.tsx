import type { ReactNode } from 'react';

/**
 * Iconen bij de antwoorden van de dakcalculator.
 *
 * Mohammed, 24 sep: "maak super mooie en duidelijke iconen en voeg iconen toe
 * in de vragen". Eén lijnstijl voor allemaal (24 x 24, lijn 2, ronde uiteinden,
 * zoals lucide), zodat ze naast elkaar als één set lezen. Elk icoon toont het
 * ding zelf: het profiel van de pan, de rol roofing, het aantal vierkante
 * meter als gevulde vakjes, de kalender voor de start.
 */
export type IcoonNaam =
  | 'golfpan' | 'vlakkepan' | 'golfplaat' | 'bitumen' | 'roofing' | 'epdm'
  | 'maat1' | 'maat2' | 'maat3' | 'maat4'
  | 'isolatie' | 'geenisolatie' | 'asbest' | 'veilig' | 'twijfel'
  | 'snel' | 'drie' | 'later' | 'verken'
  | 'herstel' | 'nieuwdak' | 'jong' | 'midden' | 'oud' | 'platdak'
  | 'dienst-hellend' | 'dienst-plat' | 'dienst-isolatie' | 'dienst-herstel';

const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);

/* Vier vakjes, waarvan er n gevuld zijn: de oppervlakte in één oogopslag. */
const Maat = ({ n }: { n: number }) => (
  <Svg>
    {[[3, 3], [13, 3], [3, 13], [13, 13]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="8" height="8" rx="1.6"
        fill={i < n ? 'currentColor' : 'none'}
        strokeWidth={i < n ? 2 : 1.4} opacity={i < n ? 1 : 0.45} />
    ))}
  </Svg>
);

const ICONEN: Record<IcoonNaam, () => JSX.Element> = {
  /* Golfpannen: rijen ronde pannenkoppen die elkaar half overlappen. */
  golfpan: () => (
    <Svg>
      <path d="M4 7.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M2 12.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M4 17.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </Svg>
  ),
  /* Vlakke pannen of leien: een schuin dakvlak met rijen platte stukken. */
  vlakkepan: () => (
    <Svg>
      <path d="M3 19 7.5 5h13.5L16.5 19z" />
      <path d="M5.9 10h13.6M4.4 14.6h13.6" />
      <path d="M11.2 5 9.6 10M15.7 5l-1.6 5M8.2 10l-1.5 4.6M12.7 10l-1.5 4.6M17.2 10l-1.5 4.6M9.5 14.6 8 19M14 14.6 12.5 19" />
    </Svg>
  ),
  /* Golfplaat: golvende bovenrand met de ribben die naar beneden lopen. */
  golfplaat: () => (
    <Svg>
      <path d="M3 7q1.5-3 3 0t3 0 3 0 3 0 3 0 3 0" />
      <path d="M3 17q1.5-3 3 0t3 0 3 0 3 0 3 0 3 0" />
      <path d="M3 7v10M21 7v10" />
      <path d="M4.5 5.6v10M10.5 5.6v10M16.5 5.6v10" strokeWidth={1.3} />
    </Svg>
  ),
  /* Bitumen: lagen op elkaar gebrand. */
  bitumen: () => (
    <Svg>
      <path d="M3 8.5 12 4l9 4.5-9 4.5z" />
      <path d="m3 12.5 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </Svg>
  ),
  /* Roofing: een rol die wordt uitgerold. */
  roofing: () => (
    <Svg>
      <circle cx="7" cy="9" r="4" />
      <circle cx="7" cy="9" r="1.2" />
      <path d="M7 13h13.5v6H5.5a2.5 2.5 0 0 1-2.5-2.5V9" />
    </Svg>
  ),
  /* EPDM: één doorlopend vel met een omgeslagen hoek. */
  epdm: () => (
    <Svg>
      <path d="M4 5h16v10l-5 5H4z" />
      <path d="M15 20v-5h5" />
    </Svg>
  ),
  maat1: () => <Maat n={1} />,
  maat2: () => <Maat n={2} />,
  maat3: () => <Maat n={3} />,
  maat4: () => <Maat n={4} />,
  /* Dak met een isolatielaag eronder (de zigzag van isolatiewol). */
  isolatie: () => (
    <Svg>
      <path d="M2.5 11 12 3.5l9.5 7.5" />
      <path d="M5.5 13.5l2 2.5 2-2.5 2 2.5 2-2.5 2 2.5 2-2.5" />
      <path d="M5 20h14" />
    </Svg>
  ),
  /* Alleen het dak, zonder isolatielaag. */
  geenisolatie: () => (
    <Svg>
      <path d="M2.5 11 12 3.5l9.5 7.5" />
      <path d="M5.5 11v9h13v-9" />
    </Svg>
  ),
  asbest: () => (
    <Svg>
      <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4.5M12 17.3h.01" />
    </Svg>
  ),
  veilig: () => (
    <Svg>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.8 12.2 2.3 2.3 4.2-4.6" />
    </Svg>
  ),
  twijfel: () => (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.2a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.4-2.6 4" />
      <path d="M12 17.3h.01" />
    </Svg>
  ),
  snel: () => (
    <Svg>
      <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z" />
    </Svg>
  ),
  /* Kalender met drie bolletjes: binnen drie maanden. */
  drie: () => (
    <Svg>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 15h.01M12 15h.01M16 15h.01" strokeWidth={2.6} />
    </Svg>
  ),
  /* Kalender met een pijl vooruit: later dit jaar. */
  later: () => (
    <Svg>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8.5 15.3h6.5M13 13.3l2 2-2 2" />
    </Svg>
  ),
  /* Herstelling: een steeksleutel. */
  herstel: () => (
    <Svg>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />
    </Svg>
  ),
  /* Renovatie: een huis met een volledig nieuw pannendak. */
  nieuwdak: () => (
    <Svg>
      <path d="M2.5 11.5 12 4l9.5 7.5z" />
      <path d="M8.3 8.4h7.4M5.8 10.4h12.4" strokeWidth={1.4} />
      <path d="M5.5 11.5V20h13v-8.5" />
      <path d="M10 20v-4.5h4V20" />
    </Svg>
  ),
  /* ── iconen van de dienstensectie (Mohammed 25 sep: "betere clean iconen") ──
     Ronde hoeken en één lijndikte, in de stijl van lucide, zodat de vier als
     één set lezen. */
  /* Hellend dak: een huis met een schuin dak en een deur. */
  'dienst-hellend': () => (
    <Svg>
      <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9.5 21v-6.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V21" />
    </Svg>
  ),
  /* Plat dak: een gebouw met een platte dakrand, twee ramen en een deur. */
  'dienst-plat': () => (
    <Svg>
      <path d="M3.5 5.5h17a.5.5 0 0 1 .5.5v2.5H3V6a.5.5 0 0 1 .5-.5z" />
      <path d="M5 8.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5" />
      <path d="M10 21v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" />
      <rect x="8" y="11" width="2.5" height="2.5" rx=".5" />
      <rect x="13.5" y="11" width="2.5" height="2.5" rx=".5" />
    </Svg>
  ),
  /* Dakisolatie: hetzelfde huis, gevuld met twee lagen isolatie. */
  'dienst-isolatie': () => (
    <Svg>
      <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M7 13c.8-.7 1.7-.7 2.5 0s1.7.7 2.5 0 1.7-.7 2.5 0 1.7.7 2.5 0" />
      <path d="M7 17c.8-.7 1.7-.7 2.5 0s1.7.7 2.5 0 1.7-.7 2.5 0 1.7.7 2.5 0" />
    </Svg>
  ),
  /* Dakherstelling: een hamer (lucide "hammer", v0.462). */
  'dienst-herstel': () => (
    <Svg>
      <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </Svg>
  ),
  /* Plat dak: een gebouw met een plat dak en een dakrand die iets uitsteekt. */
  platdak: () => (
    <Svg>
      <path d="M2.5 8h19" strokeWidth={2.4} />
      <path d="M4 8V6.5h16V8" />
      <path d="M4.5 8v12h15V8" />
      <path d="M8 20v-5h3v5M14 12h2.5v2.5H14z" />
    </Svg>
  ),
  /* Leeftijd van het dak: een jong plantje, een klok, een zandloper. */
  jong: () => (
    <Svg>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 2.5-6.5 7-6.5 0 4.5-2.8 6.5-7 6.5z" />
      <path d="M12 14.5C12 11 10 9 5.5 9c0 3.8 2.3 5.5 6.5 5.5z" />
    </Svg>
  ),
  midden: () => (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Svg>
  ),
  oud: () => (
    <Svg>
      <path d="M6 3h12M6 21h12" />
      <path d="M7.5 3v2.5c0 2.3 4.5 4.3 4.5 6.5s-4.5 4.2-4.5 6.5V21M16.5 3v2.5c0 2.3-4.5 4.3-4.5 6.5s4.5 4.2 4.5 6.5V21" />
    </Svg>
  ),
  /* Vergrootglas: ik verken nog. */
  verken: () => (
    <Svg>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.3 15.3 5.2 5.2" />
    </Svg>
  ),
};

export function Icoon({ naam }: { naam: IcoonNaam }) {
  const Teken = ICONEN[naam];
  return <Teken />;
}
