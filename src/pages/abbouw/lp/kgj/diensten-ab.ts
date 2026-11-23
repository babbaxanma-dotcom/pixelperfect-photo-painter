/* Dienstpagina's onder de landingspagina (/lp/dakwerken/diensten/<slug>), zoals bfbouw.be (bouw/lp-dak.cjs DIENST_INFO en dienstPagina, 22 nov 2026).
   23 nov 2026, Mohammed: "en bij de diensten die lees meer", "zelfde zoals bega", "zodat het multi page wordt".
   Bron van de teksten:
   - Dakrenovatie, Nieuw dak, Dakisolatie: woordelijk bfbouw.be DIENST_INFO (algemene vakkennis over het werk, geen beweringen over het bedrijf).
   - Dakherstelling (BF heeft die dienst niet): de werkwijze uit de AB-tekst van de dienstkaart (inhoud.ts, meer: "Dan zoeken we eerst waar het water
     echt binnenkomt, want dat is vaak een eind verwijderd van de vlek. Zo herstellen we de oorzaak"), de rest algemene vakkennis zonder cijfers.
   De sleutel is de id van de dienst in inhoud.ts (DAKWERKEN.diensten.lijst). */
export type DienstInfo = { slug: string; wanneerKop: string; wanneer: string[]; aanpakKop: string; aanpak: string[]; prijs: string[] };

export const DIENST_INFO_AB: Record<string, DienstInfo> = {
  renovatie: {
    slug: 'dakrenovatie',
    wanneerKop: 'Wanneer is uw dak aan renovatie toe?',
    wanneer: ['Er liggen pannen of leien los, en het worden er elk jaar meer.', 'U ziet vochtplekken op zolder of rond een dakraam.', 'Op zolder ziet u de achterkant van de pannen: het onderdak ontbreekt.', 'Het dak is niet of nauwelijks geïsoleerd.'],
    aanpakKop: 'Wat de werken omvatten',
    aanpak: ['De oude pannen of roofing eraf halen en afvoeren', 'Het hout van uw dak nakijken en rot hout vervangen', 'Een nieuwe waterdichte laag onder de pannen', 'Isolatie, zodat uw zolder warm blijft in de winter en koel in de zomer', 'Nieuwe pannen, leien of roofing', 'Alles rond de schouw, de dakramen en de goten waterdicht afwerken'],
    prijs: ['De oppervlakte en de vorm van het dak: een dakkapel, een schouw of een kilgoot vraagt meer werk.', 'De dakbedekking die u kiest: pannen, leien of roofing.', 'De staat van het hout onder de pannen.', 'De isolatie: het materiaal en de dikte.', 'De bereikbaarheid van het dak en de steiger die nodig is.'],
  },
  'nieuw-dak': {
    slug: 'nieuw-dak',
    wanneerKop: 'Wanneer kiest u voor een nieuw dak?',
    wanneer: ['U bouwt een nieuwe woning of een aanbouw.', 'De dakstructuur buigt door of het hout is aangetast.', 'U wilt de vorm van het dak veranderen, bijvoorbeeld met een dakkapel.', 'Een groot deel van het dak is versleten: dan vernieuwt u het beter in één keer.'],
    aanpakKop: 'Zo bouwen wij uw dak op',
    aanpak: ['De dakstructuur opbouwen of vervangen', 'Het onderdak plaatsen: de waterdichte laag onder de pannen', 'Isolatie en dampscherm', 'Panlatten en de dakbedekking die u kiest, bijvoorbeeld keramische pannen of leien', 'Goten, afvoeren en de afwerking rond de schouw en de dakramen'],
    prijs: ['De oppervlakte en de vorm van het dak.', 'De dakstructuur: nieuw opbouwen of een deel vervangen.', 'De dakbedekking die u kiest.', 'De isolatie: het materiaal en de dikte.', 'Dakramen, een dakkapel en het zinkwerk.'],
  },
  isolatie: {
    slug: 'dakisolatie',
    wanneerKop: 'Wanneer loont dakisolatie?',
    wanneer: ['Uw zolder is koud in de winter en warm in de zomer.', 'Het dak is nog niet geïsoleerd, of er ligt alleen een dunne oude laag.', 'U laat uw dak renoveren: de isolatie komt dan mee in hetzelfde werk.', 'U vraagt Mijn VerbouwPremie aan: de nieuwe isolatie haalt dan een Rd-waarde van minstens 4,5 m²K/W.'],
    aanpakKop: 'Drie manieren om een dak te isoleren',
    aanpak: ['Langs buiten: isolatieplaten bovenop het dakhout, onder de nieuwe pannen. Dat gebeurt bij een dakrenovatie.', 'Langs binnen: isolatie tussen en onder het dakhout, met een dampscherm aan de warme kant.', 'Plat dak: isolatie bovenop de dakvloer, onder de nieuwe dakbedekking.'],
    prijs: ['De oppervlakte van het dak.', 'Het isolatiemateriaal en de dikte.', 'Isoleren langs buiten of langs binnen.', 'De afwerking aan de binnenkant.'],
  },
  herstelling: {
    slug: 'dakherstelling',
    wanneerKop: 'Wanneer laat u uw dak herstellen?',
    /* 23 nov 2026 (keuring tekst-AB-10): de inleiding noemt al de vochtplek en de verschoven pan; hier andere tekens */
    wanneer: ['Bij regen druppelt er water op zolder.', 'Er liggen stukken pan of mortel in de goot.', 'Na een storm zijn de nok, de dakrand of de goot beschadigd.', 'Het zink rond de schouw of het dakraam laat los.'],
    aanpakKop: 'Zo verloopt een herstelling',
    aanpak: ['Het lek opsporen, op het dak en op zolder', 'De oorzaak herstellen: de pannen of leien, het zinkwerk of de roofing op die plek', 'Aangetast hout onder de pannen vervangen', 'Alles opnieuw waterdicht afwerken'], // de inleiding (meer) zegt al dat we eerst zoeken waar het water binnenkomt
    prijs: ['De plek en de omvang van de schade.', 'De bereikbaarheid van het dak: met een ladder, een hoogwerker of een steiger.', 'Het materiaal dat vervangen wordt.'],
  },
};

export const DIENST_PAD = '/lp/dakwerken/diensten/';
