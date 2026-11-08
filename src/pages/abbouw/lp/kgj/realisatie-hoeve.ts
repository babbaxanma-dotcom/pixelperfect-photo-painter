/**
 * Realisatie in de kijker: de verbouwing van een hoeve (8 nov 2026).
 *
 * Opdracht Mohammed (8 nov 2026): "bij ab, ga naar whatsapp, hij heeft van de hoeve realisatie nog een paar goede fotos en paar videos",
 * "op zijn whatsapp profiel staat het", "ik wil graag op de pagina zo een realisatie sectie maken met die realisatie mooi zo", "als in, je
 * ziet een video, before after, tijdens de werken snapje, dan heb je zo een wow gevoel, doe dit volgens de norm aub", "ab enkel lokaal, maar
 * werk helemaal uit, elk detail".
 *
 * Bron van de beelden: de WhatsApp Business-catalogus van "Bardh - AB Construct" (A&B construct), product "Ecologische verbouwingen hoeve"
 * (8 foto's en 2 video's, opgehaald 8 nov 2026; ruwe bestanden in de scratchpad van die sessie). Eigen werk van AB, geen stock, geen AI.
 * Omzetting: scratchpad hoeve-assets.cjs (webp 1600/640, video's zonder geluid: de inhoud van het geluid is niet nagekeken).
 *
 * Tekst: de projectnaam is die van Bardh ("Ecologische verbouwingen hoeve"). De uitgevoerde werken staan alleen hier omdat ze op de beelden
 * te zien zijn (dak open tot op de balken, nieuw pannendak met dakvensters, binnen gestript, rode staalstructuur, nieuwe schuiframen). Geen
 * plaats, duur of prijs: daar is geen bron voor. De norm (concurrentieonderzoek 6 nov, NORVO-KENNIS/concurrentie-6nov2026): sectiekop
 * "Realisaties"/"Onze realisaties" (16x), "Project in de kijker", per project een titel, beelden tijdens en na de werken en een knop.
 *
 * 8 nov 2026, Mohammed (localhost): "behoud alleen die na en tijdens die video en foto zo", "dat is genoeg": alleen de dronevideo na de
 * werken en de dronefoto tijdens de werken; de galerij (7 foto's) en de rondgang zijn weg, hun bestanden ook.
 */
import droneNa from '@/assets/realisaties/hoeve/hoeve-drone-na.mp4';
import droneNaPoster from '@/assets/realisaties/hoeve/hoeve-drone-na-poster.webp';
import dakOpen169 from '@/assets/realisaties/hoeve/hoeve-dak-open-169.webp';

import type { Realisatie } from './inhoud';

export const HOEVE: Realisatie = {
  kop: 'Onze realisaties',
  project: 'Ecologische verbouwing van een hoeve',
  werkenKop: 'Uitgevoerde werken',
  werken: ['Nieuw dak met pannen en dakvensters', 'Binnenkant gestript tot op de structuur', 'Nieuwe staalstructuur', 'Nieuwe ramen en schuiframen'],
  na: { label: 'Na de werken', video: droneNa, poster: droneNaPoster, alt: 'Dronebeeld van de hoeve na de werken: een nieuw rood pannendak met drie dakvensters' },
  tijdens: { label: 'Tijdens de werken', src: dakOpen169, alt: 'Dronebeeld van de hoeve tijdens de werken: het dak ligt open tot op de balken, met een minigraver op het erf' },
};
