/* Prijsmodel renovatierekenaar (14 okt 2026, Mohammed: "veilige richtprijzen, realistisch, en heel accuraat").
   Alle bedragen excl. btw; richtprijs.ts zet er de btw op (6 % of 21 %) en rondt af op € 500.

   Bronnen: Belgische prijsgidsen 2025-2026, op 14 okt 2026 per bedrag woordelijk nagelezen (onderzoek + adversariële
   natrekking, workflow wf_d2a5e302-558). "excl" = de pagina zegt excl. btw; zonder vermelding is het bedrag als excl.
   gelezen (dat maakt het maximum met btw hoger, dus veiliger); incl.-bedragen alleen als ze binnen de gekozen vork vallen.

   Twee manieren:
   1. "Alles (totaalrenovatie)": prijs per m² woonoppervlakte volgens de staat (hoeveel er vernieuwd wordt).
   2. Een keuze uit de lijst: de som van de aangevinkte posten. Posten per m² rekenen met de woonoppervlakte.

   Aannames (geen bron, rekenregel; staan ook in het verslag aan Mohammed):
   - woonoppervlakte bij "Weet ik niet": per woningtype, uit renovatie-calculator.be (studio/appartement 50-80, rijhuis
     100-140, halfopen 140-200, vrijstaand 180-300); appartement opgerekt naar 100 zoals de keuze "Kleiner dan 100 m²";
   - muren = 2,5 tot 3 x de vloeroppervlakte, plafonds = 1 x; dakvlak ≈ 0,6 x, buitenmuur ≈ 0,8 x en gelijkvloers ≈ 0,5 x
     de woonoppervlakte (woning met twee bouwlagen);
   - gevelvlak per woningtype: appartement 0,3, rijwoning 0,55, halfopen 0,9, open bebouwing 1,15 x de woonoppervlakte;
   - aantal slaapkamers per grootte (rijhuis 2 en halfopen 3 slaapkamers volgens renovatie-calculator.be). */
import DAK from '@/data/dakprijzen.json';
import type { Antwoorden } from '@/lib/richtprijs';

type V = [number, number];
const DAKTABEL = DAK.tabel as unknown as Record<string, V>;

/* Woonoppervlakte in m² per keuze; "Groter dan 200 m²" tot 300 (renovatie-calculator.be: vrijstaand 180-300). */
const GROOTTE: Record<string, V> = {
  'Kleiner dan 100 m²': [50, 100], '100 tot 150 m²': [100, 150], '150 tot 200 m²': [150, 200], 'Groter dan 200 m²': [200, 300],
};
const GROOTTE_TYPE: Record<string, V> = {
  Appartement: [50, 100], Rijwoning: [100, 140], 'Halfopen bebouwing': [140, 200], 'Open bebouwing': [180, 300],
};
const SLAAPKAMERS: Record<string, V> = {
  'Kleiner dan 100 m²': [1, 2], '100 tot 150 m²': [2, 3], '150 tot 200 m²': [3, 4], 'Groter dan 200 m²': [3, 5],
  Appartement: [1, 2], Rijwoning: [2, 3], 'Halfopen bebouwing': [3, 4], 'Open bebouwing': [3, 5],
};
const GEVEL: Record<string, number> = { Appartement: 0.3, Rijwoning: 0.55, 'Halfopen bebouwing': 0.9, 'Open bebouwing': 1.15 };

/* 1. Totaalrenovatie per m² woonoppervlakte. */
const TOTAAL_M2: Record<string, V> = {
  /* renovatiefverbouwen.be 2026: 1.500-2.800 excl.; bouwinfo.be sep 2026: 2.500-3.000 excl.; velux.be en
     blog.trustup.be: ingrijpend/volledig 1.500-3.000 */
  Alles: [1500, 3000],
  /* blog.trustup.be "gemiddelde renovatie" 800-1.500; heylenvastgoed.be 800-1.500; renovatiewerken.be 800-1.500;
     housing-service.be 800-1.300 */
  'Een groot deel': [800, 1500],
  /* blog.trustup.be "schilderwerken en vloerbekleding" 300-800; bobex.be opfrissen 300-750 */
  'Enkel de afwerking': [300, 800],
  /* niet gekend: van een groot deel tot alles */
  'Weet ik niet': [800, 3000],
};

/* 2. Posten. Vast bedrag per stuk, of per m² (x de oppervlakte die erbij staat). */
const KEUKEN: V = [8000, 20000];      // bobex.be gemiddeld 8.000-15.000; velux.be en bouwinfo.be 8.000-20.000
const BADKAMER: V = [6000, 15000];    // bobex.be standaard (sanitair + tegels) 6.000-15.000; renovatiekampioen.be 7.500-15.000 excl.
const KAMER_M2: V = [40, 120];        // renovatiewerken.be, de-woongids.be: vloer, pleisteren, schilderen 40-120/m²
const SLAAPKAMER: V = [1000, 4000];   // bobex.be slaapkamer vernieuwen (vloer, verf, verlichting) 1.000-4.000
const VLOER_M2: V = [40, 130];        // bobex.be excl.: keramische tegels vanaf 40, massief parket tot 130
const VLOER_UITBREKEN_M2: V = [35, 65]; // bobex.be excl.: oude vloer uitbreken 15-30 + nieuwe chape 20-35
const MUUR_M2: V = [16, 40];          // bobex.be excl.: bepleisteren 8-25 + schilderen 8-15
const PLAFOND_M2: V = [24, 53];       // bobex.be excl.: bepleisteren 14-35 + schilderen 10-18
const VERWARMING: V = [6000, 16000];  // bobex.be cv met radiatoren 6.000 en 8.000-13.500 excl.; renocheck.be warmtepomp tot 16.000
const SANITAIR: V = [3000, 9000];     // vakmanindebuurt.be leidingwerk 3.000-8.000; blog.trustup.be huis 100 m² 7.000-9.000
const DAKISOLATIE_M2: V = [25, 60];   // isolatie-info.be 25-50 excl.; blog.trustup.be 30-60 (langs binnen)
const SPOUW_M2: V = [15, 30];         // bobex.be, isolatie-info.be excl. 15-30
const VLOERISOLATIE_M2: V = [15, 55]; // bobex.be excl. 15-55
const ELEKTRICITEIT_M2: V = [35, 100];// callmepower.be 35-45 incl. (nieuw); renocheck.be 80-120; lump-sommen 4.000-15.000 (bobex.be, blog.trustup.be)
const GEVEL_M2: V = [35, 150];        // verbouw-prijzen.be reinigen + voegen 35; bobex.be, vakmanindebuurt.be, blog.trustup.be isolatie + crepi tot 140-150
/* Ramen en deuren, hele woning: bouwinfo.be rijwoning of halfopen 9.000-20.000, vrijstaand 15.000-25.000;
   appartement: blog.trustup.be 5 pvc-ramen vanaf 1.500, tot 8 aluminium draaikiepramen à 1.000 (solvari.be 800-1.100). */
const RAMEN: Record<string, V> = {
  Appartement: [1500, 8000], Rijwoning: [9000, 20000], 'Halfopen bebouwing': [9000, 20000], 'Open bebouwing': [15000, 25000],
};
/* Dak: dezelfde tabel als de dakrekenaar (Norvo-kostenmotor), renovatie met isolatie, bedekking nog niet gekozen.
   Dakvlak ≈ 0,6 x de woonoppervlakte: minimum uit de kleinste dakklasse (plat of hellend), maximum hellend uit de grootste. */
function dakklasse(m2: number) {
  return m2 < 50 ? 'Kleiner dan 50 m²' : m2 < 100 ? '50 tot 100 m²' : m2 < 150 ? '100 tot 150 m²' : 'Groter dan 150 m²';
}
function dak([wMin, wMax]: V): V {
  const laag = dakklasse(wMin * 0.6), hoog = dakklasse(wMax * 0.6);
  const plat = DAKTABEL[`Plat dak|Renovatie|Met isolatie|Weet ik nog niet|${laag}`];
  const hellendLaag = DAKTABEL[`Hellend dak|Renovatie|Met isolatie|Weet ik nog niet|${laag}`];
  const hellendHoog = DAKTABEL[`Hellend dak|Renovatie|Met isolatie|Weet ik nog niet|${hoog}`];
  return [Math.min(plat[0], hellendLaag[0]), hellendHoog[1]];
}

const PER_M2 = (v: V, [wMin, wMax]: V, f: V = [1, 1]): V => [v[0] * wMin * f[0], v[1] * wMax * f[1]];

export function renovatieExcl(a: Antwoorden): V | null {
  if (!a.Renoveren || !a.Woning || !a.Staat) return null;
  const w = GROOTTE[a.Grootte ?? ''] ?? GROOTTE_TYPE[a.Woning];
  if (!w) return null;

  if (a.Renoveren === 'Alles (totaalrenovatie)') return PER_M2(TOTAAL_M2[a.Staat] ?? TOTAAL_M2['Weet ik niet'], w);

  const gekozen = new Set(a.Renoveren.split(', '));
  /* Vloeren en muren samen dekken woonkamer en slaapkamers al: dan die kamers niet nog eens tellen. */
  const kamersGedekt = gekozen.has('Vloeren') && gekozen.has('Muren en plafonds');
  const vloer: V = a.Staat === 'Enkel de afwerking' ? VLOER_M2
    : a.Staat === 'Weet ik niet' ? [VLOER_M2[0], VLOER_M2[1] + VLOER_UITBREKEN_M2[1]]
    : [VLOER_M2[0] + VLOER_UITBREKEN_M2[0], VLOER_M2[1] + VLOER_UITBREKEN_M2[1]];
  const posten: Record<string, () => V> = {
    Keuken: () => KEUKEN,
    Badkamer: () => BADKAMER,
    Woonkamer: () => (kamersGedekt ? [0, 0] : PER_M2(KAMER_M2, w, [0.25, 0.3])),
    Slaapkamers: () => {
      if (kamersGedekt) return [0, 0];
      const n = SLAAPKAMERS[a.Grootte ?? ''] ?? SLAAPKAMERS[a.Woning!];
      return [SLAAPKAMER[0] * n[0], SLAAPKAMER[1] * n[1]];
    },
    Vloeren: () => PER_M2(vloer, w),
    'Muren en plafonds': () => [w[0] * (2.5 * MUUR_M2[0] + PLAFOND_M2[0]), w[1] * (3 * MUUR_M2[1] + PLAFOND_M2[1])],
    'Verwarming en sanitair': () => [VERWARMING[0] + SANITAIR[0], VERWARMING[1] + SANITAIR[1]],
    Isolatie: () => [
      w[0] * (0.6 * DAKISOLATIE_M2[0] + 0.8 * SPOUW_M2[0] + 0.5 * VLOERISOLATIE_M2[0]),
      w[1] * (0.6 * DAKISOLATIE_M2[1] + 0.8 * SPOUW_M2[1] + 0.5 * VLOERISOLATIE_M2[1]),
    ],
    'Ramen en deuren': () => RAMEN[a.Woning!],
    Elektriciteit: () => PER_M2(ELEKTRICITEIT_M2, w),
    Dak: () => dak(w),
    Gevel: () => PER_M2(GEVEL_M2, w, [GEVEL[a.Woning!], GEVEL[a.Woning!]]),
  };
  let min = 0, max = 0, geteld = 0;
  for (const p of gekozen) {
    const f = posten[p];
    if (!f) continue;
    const [l, h] = f();
    min += l; max += h; geteld++;
  }
  return geteld ? [Math.round(min), Math.round(max)] : null;
}
