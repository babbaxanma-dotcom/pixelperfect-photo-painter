/**
 * dakCalcConfigs — dienst-specifieke vraag-flows voor de CalculatorWizard.
 *
 * Per dak-dienst-LP (velux, dakisolatie, platdak) een EIGEN, relevante set
 * vragen i.p.v. één blanket-calculator. Sober Vlaams, mobiel-first, en elke
 * moeilijke vraag heeft een "weet ik niet"-uitweg die naar het gratis
 * plaatsbezoek leidt. Geen premie-beloftes (regels 2026 gewijzigd).
 *
 * Gegrond op de echte AB-dienst-data in LpDienst.tsx (DIENSTEN).
 */
import type { CalcConfig } from './CalculatorWizard';

import imgVx1 from '@/assets/dak/lp-veluxg-1.jpg';
import imgVx3 from '@/assets/dak/lp-veluxg-3.jpg';
import imgIsolSarking from '@/assets/dak/lp-isol-sarking.jpg';
import imgIsolBalken from '@/assets/dak/lp-isol-2.jpg';
import imgPlatNieuw from '@/assets/dak/lp-plat-dak.jpg';
import imgPlatVernieuw from '@/assets/dak/lp-platdak-2.jpg';
import imgEPDM from '@/assets/dak/plat-epdm.jpg';
import imgRoofing from '@/assets/dak/lp-roofing-1.jpg';

export const DAK_CALC_CONFIGS: Record<string, CalcConfig> = {
  velux: {
    slug: 'velux',
    label: 'Dakraam prijs-indicatie',
    triggerLabel: 'Bereken uw dakraam',
    division: 'ab_dakwerken',
    bronLead: 'calculator:velux',
    contactSub: 'U krijgt <span class="calc-em">binnen één werkdag</span> een vrijblijvende prijs en een gratis opmeting ingepland.',
    steps: [
      {
        id: 'werk', kind: 'cards', summary: 'Werk',
        q: 'Een nieuw raam of een vervanging?',
        sub: 'Twijfelt u? Wij bekijken het samen bij de gratis opmeting.',
        options: [
          { key: 'nieuw', label: 'Nieuw dakraam', desc: 'Op een plek waar nu nog geen raam zit', img: imgVx1 },
          { key: 'vervang', label: 'Raam vervangen', desc: 'Een oud dakraam vervangen door een nieuw', img: imgVx3 },
        ],
      },
      {
        id: 'levering', kind: 'rows', summary: 'Levering',
        q: 'Levert u het raam zelf, of leveren wij het mee?',
        sub: 'Beide kan. Als erkend Velux-plaatser regelen wij het graag mee.',
        options: [
          { key: 'incl', label: 'Leveren én plaatsen', desc: 'Wij regelen het Velux-raam, plaatsing inbegrepen' },
          { key: 'eigen', label: 'Ik heb het raam al', desc: 'U levert het raam, wij plaatsen het waterdicht' },
          { key: 'weet', label: 'Weet ik niet', desc: 'We bespreken het bij de gratis opmeting' },
        ],
      },
      {
        id: 'aantal', kind: 'rows', summary: 'Aantal',
        q: 'Hoeveel ramen gaat het om?',
        sub: 'Een schatting volstaat.',
        options: [
          { key: '1', label: '1 dakraam', desc: 'Eén raam plaatsen of vervangen' },
          { key: '2', label: '2 dakramen', desc: 'Bijvoorbeeld twee slaapkamers' },
          { key: '3+', label: '3 of meer', desc: 'Wij bekijken het geheel ter plaatse' },
        ],
      },
      {
        id: 'maat', kind: 'rows', summary: 'Maat',
        q: 'Weet u de maat van het raam?',
        sub: 'Geen idee? Wij meten gratis exact op ter plaatse.',
        options: [
          { key: 'standaard', label: 'Standaardmaat (±78×118 cm)', desc: 'De meest voorkomende Velux-maat' },
          { key: 'groter', label: 'Een grotere maat', desc: 'Bijvoorbeeld 114×118 of 134×140 cm' },
          { key: 'weet', label: 'Weet ik niet', desc: 'Wij meten exact op bij de opmeting' },
        ],
      },
    ],
  },

  dakisolatie: {
    slug: 'dakisolatie',
    label: 'Dakisolatie prijs-indicatie',
    triggerLabel: 'Bereken uw isolatie',
    division: 'ab_dakwerken',
    bronLead: 'calculator:dakisolatie',
    contactSub: 'U krijgt <span class="calc-em">binnen één werkdag</span> contact en een gratis dakinspectie met fotorapport.',
    steps: [
      {
        id: 'methode', kind: 'rows', summary: 'Methode',
        q: 'Hoe wilt u isoleren?',
        sub: 'Niet zeker? Wij adviseren gratis wat bij uw dak past.',
        options: [
          { key: 'sarking', label: 'Sarking, van buitenaf', desc: 'Buitenop de balken, ideaal bij een dakrenovatie', img: imgIsolSarking },
          { key: 'balken', label: 'Tussen de balken', desc: 'Als het dak intact blijft, met dampscherm', img: imgIsolBalken },
          { key: 'zolder', label: 'Op de zoldervloer', desc: 'Zolder enkel als opslag? Dan volstaat dit' },
          { key: 'weet', label: 'Weet ik niet', desc: 'Wij adviseren op het gratis plaatsbezoek' },
        ],
      },
      {
        id: 'oppervlakte', kind: 'slider', summary: 'Oppervlakte',
        q: 'Hoe groot is het dakvlak?',
        sub: 'Een ruwe schatting volstaat, wij meten exact op.',
        min: 10, max: 300, step: 5, def: 60, unit: 'm²',
        tip: 'Niet zeker van de oppervlakte? <span class="calc-em">Geen probleem</span>, wij meten alles op tijdens de <span class="calc-em">gratis dakinspectie</span>.',
        tag: (v: number) => v < 40 ? 'Kleine zolder' : v < 100 ? 'Gemiddeld dak' : v < 200 ? 'Groot dak' : 'Zeer groot dak',
      },
      {
        id: 'situatie', kind: 'rows', summary: 'Situatie',
        q: 'Wat is de huidige situatie?',
        sub: 'Dit bepaalt mee de aanpak.',
        options: [
          { key: 'geen', label: 'Nog geen isolatie', desc: 'Het dak of de zolder is niet geïsoleerd' },
          { key: 'oud', label: 'Oude isolatie vervangen', desc: 'Bestaande isolatie is verouderd of te dun' },
          { key: 'weet', label: 'Weet ik niet', desc: 'Wij bekijken het bij de dakinspectie' },
        ],
      },
    ],
  },

  platdak: {
    slug: 'platdak',
    label: 'Plat dak prijs-indicatie',
    triggerLabel: 'Bereken uw plat dak',
    division: 'ab_dakwerken',
    bronLead: 'calculator:platdak',
    contactSub: 'U krijgt <span class="calc-em">binnen één werkdag</span> contact en een gratis plaatsbezoek. Lekt uw dak nu? Zeg het ons, dan komen we sneller.',
    steps: [
      {
        id: 'werk', kind: 'rows', summary: 'Werk',
        q: 'Wat heeft u nodig?',
        sub: 'Twijfelt u? Wij bekijken het bij het gratis plaatsbezoek.',
        options: [
          { key: 'nieuw', label: 'Nieuw plat dak', desc: 'Voor aanbouw, garage of bijgebouw', img: imgPlatNieuw },
          { key: 'vernieuw', label: 'Bestaand dak vernieuwen', desc: 'Oud plat dak vervangen', img: imgPlatVernieuw },
          { key: 'lek', label: 'Lek herstellen', desc: 'Plaatselijk nazicht en herstelling' },
          { key: 'weet', label: 'Weet ik niet', desc: 'Wij adviseren ter plaatse' },
        ],
      },
      {
        id: 'oppervlakte', kind: 'slider', summary: 'Oppervlakte',
        q: 'Hoe groot is het dak?',
        sub: 'Een ruwe schatting volstaat, wij meten exact op.',
        min: 5, max: 200, step: 5, def: 25, unit: 'm²',
        tip: 'Geen idee van de oppervlakte? <span class="calc-em">Wij meten alles op</span> tijdens het <span class="calc-em">gratis plaatsbezoek</span>.',
        tag: (v: number) => v < 20 ? 'Klein (garage)' : v < 60 ? 'Gemiddeld dak' : v < 120 ? 'Groot dak' : 'Zeer groot dak',
      },
      {
        id: 'bedekking', kind: 'rows', summary: 'Bedekking',
        q: 'Welke bedekking?',
        sub: 'Niet zeker? Wij adviseren eerlijk EPDM of roofing.',
        options: [
          { key: 'epdm', label: 'EPDM (rubber, naadloos)', desc: 'Eén stuk, 40 tot 50 jaar levensduur', img: imgEPDM },
          { key: 'roofing', label: 'Roofing (bitumen)', desc: 'Bewezen en voordeliger, 15 tot 25 jaar', img: imgRoofing },
          { key: 'weet', label: 'Weet ik niet', desc: 'Wij adviseren wat bij uw dak en budget past' },
        ],
      },
      {
        id: 'isolatie', kind: 'rows', summary: 'Isolatie',
        q: 'Moet de isolatie mee?',
        sub: 'Bij een nieuw of vernieuwd dak isoleren we volgens de normen.',
        options: [
          { key: 'ja', label: 'Ja, isolatie erbij', desc: 'Geïsoleerd volgens de huidige normen' },
          { key: 'nee', label: 'Nee, enkel de bedekking', desc: 'De isolatie is al in orde' },
          { key: 'weet', label: 'Weet ik niet', desc: 'Wij bekijken de opbouw ter plaatse' },
        ],
      },
    ],
  },
};
