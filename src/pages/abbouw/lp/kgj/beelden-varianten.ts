/* Eigen beelden per subpagina van /lp/dakwerken. Stock = sfeerbeeld, nooit eigen werk van AB (geen label, geen "ons werk" in de alt).
   23 nov 2026, Mohammed: "bij plat dak moet je goede fotos op het internet zoeken van platte daken", "ik zie geen enkel plat dak foto".
   Bron, fotograaf, licentie en uitsnede per foto: src/pages/abbouw/bf/fotoplan.ts. Guard: scripts/check-stock.cjs rendert ook de subpagina's;
   alleen op /lp/dakwerken/plat-dak mag de hero deze stockfoto dragen (zijn vraag van 23 nov), de rest volgt de gewone LP-regels. */
import platdakWoning from '@/assets/bf/stock-platdak-woning-1600.webp';
import platdakLuchtfoto from '@/assets/bf/stock-platdak-luchtfoto-1600.webp';
import platdakDienst from '@/assets/bf/stock-dienst-platdak-900.webp';

export type VariantFoto = { src: string; alt: string };
export type VariantBeelden = { hero?: VariantFoto; band?: VariantFoto; dienst?: Record<string, VariantFoto> };

export const VARIANT_BEELDEN: Record<string, VariantBeelden> = {
  'plat-dak': {
    hero: { src: platdakWoning, alt: 'Moderne woning in rode baksteen met platte daken en een smalle donkere dakrand, onder een blauwe lucht' },
    /* achtergrond van de dienstenband (decoratief, alt leeg in de pagina) */
    band: { src: platdakLuchtfoto, alt: '' },
    dienst: { 'nieuw-dak': { src: platdakDienst, alt: 'Dakwerker in fluojas en helm brandt zwarte bitumen roofing vast rond een afvoerbuis op een plat dak' } },
  },
};
