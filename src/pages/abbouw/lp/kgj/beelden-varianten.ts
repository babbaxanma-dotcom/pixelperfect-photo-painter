/* Eigen beelden per subpagina van /lp/dakwerken. Stock = sfeerbeeld, nooit eigen werk van AB (geen label, geen "ons werk" in de alt).
   23 nov 2026, Mohammed: "bij plat dak moet je goede fotos op het internet zoeken van platte daken", "ik zie geen enkel plat dak foto".
   Later die dag: "je moet nog meer fotos vinden van platte daken afgewerkt en isolatie, goede fotos, dat passen bij belgie, mooi, aub zoek nog goed
   verder". Een brede zoekronde op gratis bronnen (Unsplash, Pexels, Pixabay, Openverse, Wikimedia Commons, Flickr) vond geen afgewerkt plat dakvlak
   op een Belgisch ogende woning. Daarom staan hier drie GEGENEREERDE beelden uit de eigen AB-fotobank (src/assets/dak, juni 2026, ook op /lp/platdak
   en in de calculator). "stock-gen-" in de bestandsnaam = gegenereerd, geen werk van AB: dezelfde regels als stock (nooit realisatie, nooit "ons werk").
   Bron en uitsnede per foto: src/pages/abbouw/bf/fotoplan.ts. Guard: scripts/check-stock.cjs rendert ook de subpagina's; alleen op
   /lp/dakwerken/plat-dak mag de hero een stockbeeld dragen (stock-gen-platdak-lichtstraat), de rest volgt de gewone LP-regels. */
import platdakLichtstraat from '@/assets/bf/stock-gen-platdak-lichtstraat-1200.webp';
import platdakLuchtfoto from '@/assets/bf/stock-platdak-luchtfoto-1600.webp';
import platdakDrone from '@/assets/bf/stock-gen-platdak-drone-900.webp';
import platdakDakrand from '@/assets/bf/stock-gen-platdak-dakrand-1200.webp';

export type VariantFoto = { src: string; alt: string };
export type VariantBeelden = { hero?: VariantFoto; band?: VariantFoto; dienst?: Record<string, VariantFoto>;
  /** achtergrond van het offerteblok onderaan (img.bf-lpinsp__beeld); zonder deze sleutel: de gewone slotfoto */
  slot?: VariantFoto };

export const VARIANT_BEELDEN: Record<string, VariantBeelden> = {
  'plat-dak': {
    hero: { src: platdakLichtstraat, alt: 'Afgewerkt plat dak in zwart EPDM met een lichtstraat en een aluminium muurkap, met daarachter de daken van de buren' },
    /* achtergrond van de dienstenband (decoratief, alt leeg in de pagina) */
    band: { src: platdakLuchtfoto, alt: '' },
    dienst: { 'nieuw-dak': { src: platdakDrone, alt: 'Woning in donkere baksteen met een plat dak in zwart EPDM en een aluminium dakrand, van bovenaf gezien' } },
    slot: { src: platdakDakrand, alt: 'Hoek van een plat dak in zwart EPDM met een aluminium dakrand en een afvoer' },
  },
};
