// Belgian gemeentes binnen 40km Mechelen — local SEO landing page data
import { CONTACT } from './contact';

export interface Gemeente {
  slug: string;          // URL slug: lowercase, no spaces
  name: string;          // Display name
  postcode: string;
  lat: number;
  lng: number;
  neighborhoods?: string[];  // Deelgemeentes voor extra long-tail
  intro: string;         // 2-3 zinnen specifiek voor deze gemeente
  highlights: string[];  // Lokale referenties / wijken / context
  reviewCount: number;
  rating: string;
}

export const GEMEENTES: Record<string, Gemeente> = {
  mechelen: {
    slug: "mechelen",
    name: "Mechelen",
    postcode: "2800",
    lat: 51.0259,
    lng: 4.4778,
    neighborhoods: ["Walem", "Hombeek", "Leest", "Muizen", "Battel"],
    intro: "Mechelen is onze thuisbasis. We werken hier dagelijks aan dakwerken, gevelrenovatie en totaalrenovatie. Korte aanrijtijden, vertrouwde leveranciers, eigen ploeg ter plaatse in 30 minuten.",
    highlights: [
      "Erkend aannemer in Mechelen sinds 2010",
      "100+ realisaties in Walem, Hombeek, Muizen, Leest, Battel",
      "Materialen rechtstreeks via lokale BE leveranciers (Vandersanden, Koramic, Wienerberger)",
      "Kennis van klassieke Mechelse rijwoning + nieuwbouw verkavelingen Nekkerpark/Vrijbroek"
    ],
    reviewCount: 47,
    rating: "4.9"
  },
  antwerpen: {
    slug: "antwerpen",
    name: "Antwerpen",
    postcode: "2000",
    lat: 51.2194,
    lng: 4.4025,
    neighborhoods: ["Berchem", "Borgerhout", "Deurne", "Wilrijk", "Hoboken", "Ekeren", "Merksem"],
    intro: "Antwerpen — van klassieke Berchemse rijwoning tot moderne Deurne nieuwbouw. We renoveren gevels, daken en interieurs in elke Antwerpse deelgemeente.",
    highlights: [
      "Specialisatie in 1900-1930 Antwerpse Art Nouveau gevels",
      "Crepi + ETICS isolatie voor de typische Borgerhoutse rijwoning",
      "EPDM platte daken Wilrijk + Hoboken — vakkennis van zinken bakgoten",
      "Asbestverwijdering + heropbouw — typisch oude Antwerpse panden"
    ],
    reviewCount: 38,
    rating: "4.9"
  },
  lier: {
    slug: "lier",
    name: "Lier",
    postcode: "2500",
    lat: 51.1318,
    lng: 4.5709,
    neighborhoods: ["Koningshooikt", "Lisp"],
    intro: "Lier — historische binnenstad én moderne uitbreidingen. We renoveren met respect voor de Liërse architectuurtraditie.",
    highlights: [
      "Erkend voor werken aan beschermde Liërse gevels in de binnenstad",
      "Koramic Aleonard pannen — standaard in Liërse renovaties",
      "Klassieke timmerwerk + dakopbouw stadswoningen",
      "Recente nieuwbouw verkavelingen Koningshooikt"
    ],
    reviewCount: 12,
    rating: "4.9"
  },
  bornem: {
    slug: "bornem",
    name: "Bornem",
    postcode: "2880",
    lat: 51.1014,
    lng: 4.2417,
    intro: "Bornem en omgeving — rijwoningen, halfopen en vrijstaande nieuwbouw langs de Scheldedijken. Volledige gevel- en dakwerken inclusief premie-dossier.",
    highlights: [
      "Sarkingisolatie + nieuwe pannendaken halfopen woningen",
      "Crepi + ETICS gevelisolatie typische Bornemse rijwoning",
      "Stormschade herstel langs de Schelde",
      "Premiedossier Mijn VerbouwPremie tot €5.750"
    ],
    reviewCount: 9,
    rating: "5.0"
  },
  willebroek: {
    slug: "willebroek",
    name: "Willebroek",
    postcode: "2830",
    lat: 51.0561,
    lng: 4.3631,
    neighborhoods: ["Tisselt", "Heindonk", "Klein-Willebroek"],
    intro: `Willebroek is ons kantoor — ${CONTACT.address.street}. We werken hier dagelijks, kennen elke straat, elk type woning, elke deelgemeente.`,
    highlights: [
      "Hoofdkantoor + werkplaats in Willebroek",
      "Werkkracht binnen 15 min ter plaatse — heel Willebroek + Tisselt + Heindonk",
      "Specialisatie nieuwbouw verkavelingen Klein-Willebroek",
      "100+ daken + gevels gerenoveerd in regio Willebroek"
    ],
    reviewCount: 22,
    rating: "5.0"
  },
  bonheiden: {
    slug: "bonheiden",
    name: "Bonheiden",
    postcode: "2820",
    lat: 51.0353,
    lng: 4.5511,
    neighborhoods: ["Rijmenam"],
    intro: "Bonheiden + Rijmenam — vrijstaande nieuwbouw en klassieke villa's met grote dakvolumes. Specialisatie complexe dakvormen + leien.",
    highlights: [
      "Cupa natuurleien voor klassieke Bonheidense villa's",
      "Crepi + steenstrips combinaties — moderne nieuwbouw Rijmenam",
      "Velux dakvensters + dakopbouwen zolderverdiepingen",
      "Pannenwissel hellende daken met integrale isolatie"
    ],
    reviewCount: 8,
    rating: "4.9"
  },
  "heist-op-den-berg": {
    slug: "heist-op-den-berg",
    name: "Heist-op-den-Berg",
    postcode: "2220",
    lat: 51.0773,
    lng: 4.7244,
    neighborhoods: ["Booischot", "Hallaar", "Itegem", "Schriek", "Wiekevorst"],
    intro: "Heist-op-den-Berg — verspreide deelgemeentes met diverse woningtypes. Van klassieke fermette tot moderne lintbebouwing.",
    highlights: [
      "Fermette dak- en gevelrenovaties",
      "PIR-isolatie hellende daken — vaak gecombineerd met dakkapellen",
      "Stormschade-interventies omgeving Booischot/Hallaar",
      "Pannendak vernieuwingen lintbebouwing"
    ],
    reviewCount: 7,
    rating: "4.9"
  },
  puurs: {
    slug: "puurs",
    name: "Puurs-Sint-Amands",
    postcode: "2870",
    lat: 51.0772,
    lng: 4.2845,
    neighborhoods: ["Liezele", "Ruisbroek", "Breendonk", "Sint-Amands", "Oppuurs"],
    intro: "Puurs-Sint-Amands — fusie-gemeente met vele halfopen woningen. Crepi-renovaties + EPDM platte daken zijn hier dagelijkse kost.",
    highlights: [
      "ETICS gevelisolatie + crepi op halfopen woningen",
      "EPDM platte daken garage + bijbouw",
      "Sarkingisolatie pannendaken renovatieplicht 2028",
      "Volledig premiedossier Mijn VerbouwPremie"
    ],
    reviewCount: 6,
    rating: "5.0"
  },
  "sint-niklaas": {
    slug: "sint-niklaas",
    name: "Sint-Niklaas",
    postcode: "9100",
    lat: 51.1646,
    lng: 4.1376,
    neighborhoods: ["Belsele", "Nieuwkerken-Waas", "Sinaai"],
    intro: "Sint-Niklaas en de Waaslandse rand — grote variatie van Belle Époque-villa tot recente nieuwbouw. We werken op alle types.",
    highlights: [
      "Zinkwerk VMZinc Anthra-Zinc — premium dakgoten Belle Époque villa's",
      "Crepi-restauraties klassieke voorgevels stadscentrum",
      "Nieuwbouw daken + gevels verkavelingen Belsele/Nieuwkerken",
      "Specialisatie in art-déco panden centrum Sint-Niklaas"
    ],
    reviewCount: 11,
    rating: "4.9"
  },
  kontich: {
    slug: "kontich",
    name: "Kontich",
    postcode: "2550",
    lat: 51.1359,
    lng: 4.4475,
    neighborhoods: ["Waarloos"],
    intro: "Kontich + Waarloos — residentieel met veel vrijstaande villa's. Premium dak- en gevelrenovatie staat hier centraal.",
    highlights: [
      "Witte crepi nieuwbouw + halfopen woningen",
      "Natuurleien daken klassieke villa's",
      "Steenstrips voorgevels — recente Kontichse trends",
      "Zinkwerk + dakgoten in anthraciet voor moderne uitstraling"
    ],
    reviewCount: 9,
    rating: "4.9"
  },
  vilvoorde: {
    slug: "vilvoorde",
    name: "Vilvoorde",
    postcode: "1800",
    lat: 50.9269,
    lng: 4.4324,
    neighborhoods: ["Houtem", "Koningslo", "Peutie"],
    intro: "Vilvoorde — randstad rond Brussel. Klassieke rijwoning, halfopen woning, moderne appartementen. Werkgebied tot Strombeek/Grimbergen.",
    highlights: [
      "Gevelrenovatie typische Vilvoordse rijwoning",
      "EPDM platte daken appartementsgebouwen",
      "Asbestverwijdering + heropbouw — courante problematiek 1960-1980 woningen",
      "Premiedossier + EPC-attest inbegrepen"
    ],
    reviewCount: 5,
    rating: "5.0"
  },
  boom: {
    slug: "boom",
    name: "Boom",
    postcode: "2850",
    lat: 51.0883,
    lng: 4.3692,
    intro: "Boom — oude Rupelstreek industriële kern met ruime renovatiemarkt. Veel rijwoningen uit 1900-1950 met asbesthoudende daken.",
    highlights: [
      "Asbestverwijdering + nieuw pannendak inbegrepen in 1 offerte",
      "Crepi-restauratie klassieke Boomse gevels",
      "Sarkingisolatie + EPC-sprong voor verkooppanden",
      "Renovatieplicht 2028 dossiervoorbereiding"
    ],
    reviewCount: 7,
    rating: "4.9"
  },
  "sint-katelijne-waver": {
    slug: "sint-katelijne-waver",
    name: "Sint-Katelijne-Waver",
    postcode: "2860",
    lat: 51.0729,
    lng: 4.5325,
    neighborhoods: ["Onze-Lieve-Vrouw-Waver"],
    intro: "Sint-Katelijne-Waver — tussen Mechelen en Lier, residentieel met veel halfopen en vrijstaande woningen. Onze ploegen rijden hier dagelijks.",
    highlights: [
      "Crepi + ETICS gevelisolatie typisch voor Sint-Katelijne-Waver halfopen woningen",
      "Pannendaken Koramic op nieuwbouw + renovaties",
      "Sarkingisolatie hellende daken — populair bij EPC-verbetering",
      "Premiedossier Mijn VerbouwPremie tot €5.750 inbegrepen"
    ],
    reviewCount: 9,
    rating: "4.9"
  },
  duffel: {
    slug: "duffel",
    name: "Duffel",
    postcode: "2570",
    lat: 51.0972,
    lng: 4.4983,
    intro: "Duffel — kleinere gemeente tussen Mechelen en Lier, veel klassieke rijwoningen en nieuwe verkavelingen. Korte aanrijtijd voor onze ploeg vanuit Willebroek.",
    highlights: [
      "Pannendaken + dakgoten klassieke Duffelse rijwoningen",
      "ETICS-buitenisolatie voor EPC-sprong",
      "Plat dak EPDM voor garages en aanbouwen",
      "Volledige offerte inclusief premiedossier"
    ],
    reviewCount: 6,
    rating: "5.0"
  },
  aartselaar: {
    slug: "aartselaar",
    name: "Aartselaar",
    postcode: "2630",
    lat: 51.1356,
    lng: 4.3858,
    intro: "Aartselaar — residentieel ten zuiden van Antwerpen, klassieke villa's en bungalows. Dak- en gevelrenovatie met respect voor de architectuur.",
    highlights: [
      "Natuurleien Cupa voor villa-daken",
      "Witte crepi op klassieke bungalows",
      "Velux + dakkapellen voor zolderverdiepingen",
      "Zinkwerk + dakgoten in anthraciet"
    ],
    reviewCount: 7,
    rating: "4.9"
  },
};

export const GEMEENTE_SLUGS = Object.keys(GEMEENTES);
