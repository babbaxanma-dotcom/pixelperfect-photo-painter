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
 */
import droneNa from '@/assets/realisaties/hoeve/hoeve-drone-na.mp4';
import droneNaPoster from '@/assets/realisaties/hoeve/hoeve-drone-na-poster.webp';
import dakOpen169 from '@/assets/realisaties/hoeve/hoeve-dak-open-169.webp';
import dakOpenGroot from '@/assets/realisaties/hoeve/hoeve-dak-open-1600.webp';
import binnenGestript from '@/assets/realisaties/hoeve/hoeve-binnen-gestript-640.webp';
import binnenGestriptGroot from '@/assets/realisaties/hoeve/hoeve-binnen-gestript-1600.webp';
import staalBinnen from '@/assets/realisaties/hoeve/hoeve-staal-binnen-640.webp';
import staalBinnenGroot from '@/assets/realisaties/hoeve/hoeve-staal-binnen-1600.webp';
import staalZolder from '@/assets/realisaties/hoeve/hoeve-staal-zolder-640.webp';
import staalZolderGroot from '@/assets/realisaties/hoeve/hoeve-staal-zolder-1600.webp';
import zolder from '@/assets/realisaties/hoeve/hoeve-zolder-640.webp';
import zolderGroot from '@/assets/realisaties/hoeve/hoeve-zolder-1600.webp';
import staalGevel from '@/assets/realisaties/hoeve/hoeve-staal-gevel-640.webp';
import staalGevelGroot from '@/assets/realisaties/hoeve/hoeve-staal-gevel-1600.webp';
import gelijkvloers from '@/assets/realisaties/hoeve/hoeve-gelijkvloers-640.webp';
import gelijkvloersGroot from '@/assets/realisaties/hoeve/hoeve-gelijkvloers-1600.webp';
import dakDicht from '@/assets/realisaties/hoeve/hoeve-dak-dicht-640.webp';
import dakDichtGroot from '@/assets/realisaties/hoeve/hoeve-dak-dicht-1600.webp';
import rondgang from '@/assets/realisaties/hoeve/hoeve-rondgang.mp4';
import rondgangPoster from '@/assets/realisaties/hoeve/hoeve-rondgang-poster.webp';

import type { Realisatie } from './inhoud';

export const HOEVE: Realisatie = {
  kop: 'Onze realisaties',
  project: 'Ecologische verbouwing van een hoeve',
  werkenKop: 'Uitgevoerde werken',
  werken: ['Nieuw dak met pannen en dakvensters', 'Binnenkant gestript tot op de structuur', 'Nieuwe staalstructuur', 'Nieuwe ramen en schuiframen'],
  na: { label: 'Na de werken', video: droneNa, poster: droneNaPoster, alt: 'Dronebeeld van de hoeve na de werken: een nieuw rood pannendak met drie dakvensters' },
  tijdens: { label: 'Tijdens de werken', src: dakOpen169, groot: dakOpenGroot, alt: 'Dronebeeld van de hoeve tijdens de werken: het dak ligt open tot op de balken, met een minigraver op het erf' },
  galerijKop: 'Tijdens de werken',
  fotos: [
    { src: binnenGestript, groot: binnenGestriptGroot, alt: 'Binnenkant van de hoeve gestript: open plafond met balken, kabels en emmers op de vloer' },
    { src: staalBinnen, groot: staalBinnenGroot, alt: 'Stalen kolommen tegen de oude zijgevel, met het dakgebinte erboven' },
    { src: staalZolder, groot: staalZolderGroot, alt: 'Rode stalen balk onder het dakgebinte, met materiaal op de vloer' },
    { src: zolder, groot: zolderGroot, alt: 'Zolder met een nieuwe houten vloer onder het open dakgebinte en een oude schouw' },
    { src: staalGevel, groot: staalGevelGroot, alt: 'Hoek van de hoeve opengewerkt met een rood stalen frame' },
    { src: gelijkvloers, groot: gelijkvloersGroot, alt: 'Gelijkvloers in ruwbouw met nieuwe muren, balken en een stelling' },
    { src: dakDicht, groot: dakDichtGroot, alt: 'Dronebeeld van de hoeve met het dak weer dicht en stellingen rond de gevel' },
  ],
  rondgang: { label: 'Rondgang tijdens de werken', video: rondgang, poster: rondgangPoster, alt: 'Rondgang door de hoeve tijdens de werken, tot aan de nieuwe schuiframen' },
};
