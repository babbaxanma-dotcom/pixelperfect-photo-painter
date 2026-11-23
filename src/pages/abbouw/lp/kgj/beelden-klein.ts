/* Kleine varianten van de zware beelden op de dak-LP (uitvoeringsplan 24 nov 2026, AB stap 13: "Afbeeldingen kleiner aanleveren, 661 KiB te winnen").
   Tot nu laadde elke bezoeker elk beeld op volle breedte (1.200 tot 1.600 px), ook op een gsm waar het 300 tot 400 px breed staat. Hier staat per
   beeld welke kleinere bestanden er zijn; `kleiner(src, sizes)` geeft src, srcSet en sizes voor de <img>, de browser kiest het kleinste bestand dat
   scherp genoeg is. Een beeld dat hier niet staat, blijft zoals het was. De bestanden komen uit scripts/maak-kleine-beelden.mjs; de stockbeelden
   hadden al een variant van 800 px (in gebruik op /dakwerken). De twee jpg's (herofoto, slotfoto) worden WebP. */
import heroNok from '@/assets/dak/hero-antraciet-nok.jpg';
import heroNok800 from '@/assets/dak/hero-antraciet-nok-800.webp';
import heroNok1200 from '@/assets/dak/hero-antraciet-nok-1200.webp';
import slot from '@/assets/dak/hellend-pannen.jpg';
import slot800 from '@/assets/dak/hellend-pannen-800.webp';
import slot1200 from '@/assets/dak/hellend-pannen-1200.webp';
import werf from '@/assets/dak/waarom-werf-ab.webp';
import werf800 from '@/assets/dak/waarom-werf-ab-800.webp';
import stapels from '@/assets/bf/stock-pannen-stapels-1600.webp';
import stapels800 from '@/assets/bf/stock-pannen-stapels-800.webp';
import panlatten from '@/assets/bf/stock-panlatten-1600.webp';
import panlatten800 from '@/assets/bf/stock-panlatten-800.webp';
import daklijn from '@/assets/bf/stock-daklijn-1600.webp';
import daklijn800 from '@/assets/bf/stock-daklijn-800.webp';
import zinkwerk from '@/assets/bf/stock-zinkwerk-1600.webp';
import zinkwerk800 from '@/assets/bf/stock-zinkwerk-800.webp';
import dakOpen from '@/assets/realisaties/hoeve/hoeve-dak-open-169.webp';
import dakOpen800 from '@/assets/realisaties/hoeve/hoeve-dak-open-169-800.webp';
import dakkapel from '@/assets/realisaties/dakkapel/dakkapel-aanbouw.webp';
import dakkapel800 from '@/assets/realisaties/dakkapel/dakkapel-aanbouw-800.webp';
import dHerstel from '@/assets/bf/stock-dienst-herstelling-900.webp';
import dHerstel480 from '@/assets/bf/stock-dienst-herstelling-480.webp';
import dIsolatie from '@/assets/bf/stock-dienst-isolatie-900.webp';
import dIsolatie480 from '@/assets/bf/stock-dienst-isolatie-480.webp';
import dNieuw from '@/assets/bf/stock-dienst-nieuw-dak-900.webp';
import dNieuw480 from '@/assets/bf/stock-dienst-nieuw-dak-480.webp';

/* origineel -> [bestand, breedte in px] van klein naar groot; het laatste is het bestand voor een browser zonder srcset */
const VARIANTEN: Record<string, [string, number][]> = {
  [heroNok]: [[heroNok800, 800], [heroNok1200, 1200]],
  [slot]: [[slot800, 800], [slot1200, 1200]],
  [werf]: [[werf800, 800], [werf, 1178]],
  [stapels]: [[stapels800, 800], [stapels, 1600]],
  [panlatten]: [[panlatten800, 800], [panlatten, 1600]],
  [daklijn]: [[daklijn800, 800], [daklijn, 1600]],
  [zinkwerk]: [[zinkwerk800, 800], [zinkwerk, 1600]],
  [dakOpen]: [[dakOpen800, 800], [dakOpen, 1280]],
  [dakkapel]: [[dakkapel800, 800], [dakkapel, 1179]],
  [dHerstel]: [[dHerstel480, 480], [dHerstel, 900]],
  [dIsolatie]: [[dIsolatie480, 480], [dIsolatie, 900]],
  [dNieuw]: [[dNieuw480, 480], [dNieuw, 900]],
};

/** Voor <img {...kleiner(src, sizes)} />: `sizes` zegt hoe breed het beeld op het scherm staat (bv. "(max-width: 1000px) 92vw, 400px"). */
export function kleiner(src: string, sizes: string): { src: string; srcSet?: string; sizes?: string } {
  const v = VARIANTEN[src];
  if (!v) return { src };
  return { src: v[v.length - 1][0], srcSet: v.map(([f, b]) => `${f} ${b}w`).join(', '), sizes };
}
