/**
 * Inhoud van de landingspagina's in de KGJ-vormtaal.
 *
 * De opmaak staat in LpKgj.tsx, de stijl in stijl.ts (gegenereerd uit de demo).
 * Wat per dienst verschilt staat hier: koppen, calculatorvragen, redenen,
 * stappen, foto's en de leadbron.
 *
 * De tekst van de dakwerkenpagina is getoetst met de copy-guard van de
 * norvo-copy-skill (copy-dakwerken.txt, groen op 22 sep 2026). Wijzig je hier
 * een zin, zet hem dan ook in dat bestand en draai de guard opnieuw.
 *
 * Waar de invalshoek vandaan komt (Google Ads Transparency Center, 22 sep):
 * de langstlopende beeldadvertentie van Recotex (601 dagen) zegt "Dak
 * vernieuwen? Reken vooraf. Snel, eenvoudig en zonder verplichtingen." met een
 * knop "Bereken nu". Geen van de vijf grootste spelers zet de calculator zelf
 * boven de vouw; hier staat de eerste vraag er meteen.
 */
import type { Divisie } from '@/lib/leads';

import panRood from '@/assets/dak/lp-dak-panrood.jpg';
import antraciet from '@/assets/dak/lp-real-det-2.jpg';
import waaromDakwerker from '@/assets/dak/waarom-dakwerker.jpg';
import waaromPannendak from '@/assets/dak/waarom-pannendak.jpg';
import antraciet3 from '@/assets/dak/lp-real-det-3.jpg';
import platdak from '@/assets/dak/platdak-tegel.jpg';
/* Stockfoto's (sfeerbeeld), DICTAAT MOHAMMED 13 okt 2026: "die stock photos ook op landingspagina dakwerken aub".
   Bron, fotograaf en licentie: bovenaan src/pages/abbouw/bf/fotoplan.ts. Alleen in hero.dias en cta.foto, nooit in een
   blok dat eigen werk toont (waarom, werk, voor/na, reviews, diensten). Guard: scripts/check-stock.cjs.
   De 1600-webp-varianten (scripts/bf-beelden.cjs) en niet de jpg's uit src/assets/dak-stock: betaald advertentieverkeer,
   de laadtijd van dia 1 telt meer dan de laatste scherpte (13 okt: 4 dia's samen 802 KB i.p.v. 2.699 KB). */
import stockDaklijn from '@/assets/bf/stock-daklijn-1600.webp';
import stockZinkwerk from '@/assets/bf/stock-zinkwerk-1600.webp';
import stockPannenStapels from '@/assets/bf/stock-pannen-stapels-1600.webp';
import stockPanlatten from '@/assets/bf/stock-panlatten-1600.webp';
import dakVoor from '@/assets/lp-diensten/dak-voor.jpg';
import dakNa from '@/assets/lp-diensten/dak-na.jpg';
/* Foto's bij de eerste calculatorvraag (Mohammed, 24 sep). Hellend: de
   dakwerkenfoto van getnorvo.com (norvo-website sectoren/niche-dak.jpg).
   Plat: een plat dak op de achterbouw van een rijwoning
   (generated-final/set/platdak-na.jpg). Uitsneden 16:9, 640x360. */
import keuzeHellend from '@/assets/dak/keuze-hellend.jpg';
import keuzePlat from '@/assets/dak/keuze-plat.jpg';

import type { IcoonNaam } from './Iconen';

/** foto: optioneel beeld boven het label; icoon: optioneel icoon links van het label.
    Het label zegt al wat er te zien is, dus geen alt-tekst. */
export type Keuze = { label: string; uitleg?: string; foto?: string; icoon?: IcoonNaam;
  /** Afvinkvraag: de groep waaronder de keuze als knopje staat (Ruimtes, Werken). */
  groep?: string };
/** als: de vraag verschijnt alleen als elke genoemde eerdere vraag één van de
    opgesomde antwoorden kreeg ({ Dak: ['Hellend dak'], Werk: ['Renovatie'] }).
    tip: na een van de antwoorden in `bij` staat `tekst` klein onder de volgende vraag. */
export type Vraag = {
  sleutel: string; vraag: string; keuzes: Keuze[];
  als?: Record<string, string[]>;
  tip?: { bij: string[]; tekst: string };
  /** Op een telefoon twee tegels naast elkaar in plaats van één kolom (alleen voor korte labels). */
  raster?: boolean;
  /** Altijd één kolom, ook op de computer (lange labels zoals bedragen breken anders midden in "€ 25.000"). */
  lijst?: boolean;
  /** Afvinkvraag: meerdere keuzes, met een knop Volgende. `alles` is het label van
      het vakje bovenaan dat alle keuzes in één keer aanvinkt. */
  afvinken?: { alles: string; tip?: { bij: string[]; tekst: string } };
  /** Een zekerheid als bulletpoint onder de keuzes van deze vraag (zelfde stijl als de
      troeven op de laatste stap). De regel onderaan de kaart valt dan weg, anders staat
      hij er twee keer. */
  punt?: string;
};
export type Foto = { src: string; alt: string };
export type Review = { tekst: string; naam: string; bron: string };

export type StapIcoon = 'pin' | 'offerte' | 'agenda' | 'helm' | 'sleutel';
export type Sectie = 'waarom' | 'voordelen' | 'diensten' | 'werkwijze' | 'uitgevoerd' | 'voorna' | 'reviews' | 'vangnet' | 'faq';

export type KgjInhoud = {
  /** Paginatitel in het tabblad. */
  titel: string;
  omschrijving: string;
  divisie: Divisie;
  /** Bron in GHL, zodat je in het CRM ziet van welke pagina een lead komt. */
  bronLead: string;
  bedanktSlug: string;
  /** ondertitel: eigen regel direct onder de kop, boven de subkop. */
  /** dias.pos: uitsnede in de brede hero (object-position), bijvoorbeeld om een nok in beeld te houden. */
  /** knop: een grote knop naar het formulier in plaats van de rekenaar in de hero, met een
      regel eronder (totaalrenovatie, 5 okt). De rekenaar staat dan in `vangnet`. */
  /** kop2: tweede deel van de kop als eigen regel in gedempt wit, zoals de kop op de homepage (bf-hero__kop2);
      zonder goud en zonder streep (totaalrenovatie, 13 okt). */
  hero: { kop: string; kop2?: string; ondertitel?: string; onder: string; bewijs: string[]; dias: (Foto & { pos?: string })[];
    knop?: { tekst: string; onder: string } };
  /** Smalle donkere balk boven de kop, gevolgd door het telefoonnummer (totaalrenovatie, 5 okt; weg sinds 13 okt). */
  topbalk?: string;
  /** Strakke hero (totaalrenovatie, 13 okt, Mohammed: "above the fold moet beter", "de cta moet duidelijk zijn,
      waarom nu doen, wat krijg je"): compactere kop, grotere knop met pijl, de regel onder de knop als vinkjes
      (delen gescheiden door " · ") en het eerstvolgende vrije plaatsbezoek live uit de agenda. */
  strak?: boolean;
  /** Het aanvraagformulier (Inspectie, zelfde als onderaan) in de hero in plaats van de knop: op de computer rechts
      naast de kop, op de telefoon direct onder de puntjes (13 okt, Mohammed: "is het niet slimmer om een form toe te
      voegen above the fold?"). */
  heroFormulier?: boolean;
  /** De rekenaar in de hero, ook als de pagina een knop heeft (knop verdwijnt uit de hero; #rekenaar springt naar de
      hero-rekenaar in plaats van het venster te openen). 13 okt, Mohammed: "gaat een rekenaar niet hoger converteren?",
      "nummer krijgen is oke, want ik wil voor ab groep een receptionist opbouwen", "na de rekenaar gaan ze toch naar
      bedankt pagina voor plaatsbezoek". Wint van heroFormulier. */
  heroRekenaar?: boolean;
  /** De aanvraagkaart in de hero (Aanvraag.tsx) in plaats van de rekenaar: eerst klikvragen, dan de contactstap, zoals
      bfbouw.be/lp/dakwerken. 19 okt 2026, Mohammed: "bouw de abgroep totaalrenovatie en dakwerken lp naar de nieuwe, dus
      rekenaar weg, en doe dat naar dakinspectie en gratis plaatsbezoek form bovenaan". Met deze vlag (en `aanvraag`) staat
      er nergens op de pagina een ingang naar de rekenaar: geen rekenaarknop, geen vangnet, geen venster, geen knop
      "Liever eerst een prijs?" in het formulier onderaan, geen rekenaarknop in de chat. Wint van heroRekenaar en heroFormulier. */
  heroAanvraag?: boolean;
  /** Belblok direct onder de hero (alleen /lp/dakwerken, 22 okt 2026): kop, de tekst vóór het nummer op de belknop en een
      rustige link naar de aanvraagkaart. Het nummer en de tel:-link komen uit CONTACT.phone, niet uit deze inhoud. */
  belBlok?: { kop: string; knop: string; link: string };
  /** De inhoud van de aanvraagkaart. titel + tijd: kop van de kaart; vragen: één tik = antwoord en meteen de volgende
      vraag (geen afvinkvragen); contactKop: kop van de laatste stap ("Bijna klaar! ..."); vertrouwen en trustrij: zoals op
      de rekenaarkaart; vrijMoment: het eerstvolgende vrije plaatsbezoek uit de agenda onder de kaartkop (sinds 22 okt 2026 op geen enkele
      pagina meer aan, Mohammed: "haal weg ... die volgende moment"; de vlag en VrijMoment in LpBf bestaan nog). */
  aanvraag?: { titel: string; tijd: string; vragen: Vraag[]; contactKop: string; vertrouwen?: string[];
    trustrij?: { b: string; s: string; icoon?: 'kalender' | 'gereedschap' | 'schild' }[]; vrijMoment?: boolean;
    /** Welke velden de contactstap heeft naast Naam* en Gsm* (22 okt 2026, renovatiepagina's: "verwijder email form,
        verwijder postcode form"; dezelfde dag ook /lp/dakwerken). Zonder deze instelling staan beide aan. */
    contactVelden?: { email?: boolean; postcode?: boolean };
    /** Rustig blokje met vinkje direct boven de verzendknop: wat de bezoeker precies krijgt. Het deel voor de eerste
        dubbele punt komt vet. */
    disclaimer?: string;
    /** Het slotblok onderaan (#contact) toont dezelfde klikkaart als de hero, in plaats van het formulier van Inspectie.tsx. */
    onder?: boolean;
    /** Regel direct onder de verzendknop, na "★★★★★ 5,0 op Google ·" (bfbouw.be rk__knopzeker, 23 okt 2026). */
    zeker?: string;
    /** Vertrouwensrij, vinkjes en Google-badge als duidelijke tegels met iconen (alleen vorm, zelfde teksten en cijfers). */
    badges?: boolean };
  /** titel + tijd: kop van de calculator boven de voortgang; zeker: de regel onderaan de kaart.
      trustrij: rij onderaan de kaart met Google 5,0 + sterren en daarnaast deze cijfers (zoals bfbouw.be rk__trust). */
  rekenaar: { trustrij?: { b: string; s: string }[]; titel: string; tijd: string; zeker: string; vragen: Vraag[]; gerust: string; uitkomstKop: string; uitkomstOnder: string; knop: string; troeven?: string[];
    /** Trust signals onderaan de kaart, met vinkje; vervangen de regel `zeker` (dakwerken, 4 okt). */
    vertrouwen?: string[] };
  /** tegenover: de zin boven de redenen; dan staat de tekst (de frustratie) links in een
      donker vak en de redenen (de oplossing) rechts, zonder foto's (totaalrenovatie, 5 okt). */
  /** kolommen: alleen de kop en de redenen, als drie kolommen met icoon (gestripte
      totaalrenovatie, 5 okt); gaat voor `tegenover`. */
  /** intro: alinea onder de kop bij de kolommen (definitieve totaalrenovatie, 5 okt). */
  waarom: { kop: string; tekst: string; redenen: { titel: string; tekst: string }[]; duo: [Foto, Foto]; tegenover?: string; kolommen?: boolean; intro?: string };
  /** Diensten onder "Waarom": id is het anker voor een sitelink (/lp/dakwerken#nieuw-dak). */
  /** onder: optionele zin onder de kop. Een lege tekst toont alleen icoon en naam (totaalrenovatie, 27 sep).
   *  foto: met een foto wordt de dienst een fotokaart zonder icoon (dakwerken, 2 okt).
   *  vlakken: kaarten met het icoon op een groot licht vlak, ook zonder foto (dakwerken, 3 okt). */
  diensten: { kop: string; onder?: string; vlakken?: boolean; lijst: { id: string; icoon: IcoonNaam; naam: string; tekst: string; foto?: Foto }[] };
  /** Voordelen tussen "Waarom" en de diensten: elk voordeel een gekleurde bol met icoon. */
  voordelen?: { kop: string; lijst: { icoon: IcoonNaam; kleur: 'oranje' | 'blauw' | 'groen'; titel: string; tekst: string }[] };
  /** Veelgestelde vragen vlak voor het slotblok; alleen op pagina's die ze invullen (29 sep). */
  faq?: { kop: string; lijst: { v: string; a: string }[] };
  /** meer: nog andere voor/na-paren; de schuif krijgt dan pijlen (29 sep). */
  /** hint: korte regel onder de schuif ("Sleep de balk over de foto"). */
  voorna: { kop: string; onder: string; voor: Foto; na: Foto; label: string; meer?: { voor: Foto; na: Foto; label?: string }[]; hint?: string };
  /** Uitgevoerd werk, direct boven de voor/na (totaalrenovatie, 28 sep): een doorlopend
      spoor met alleen echte foto's van AB, zonder namen (Mohammed: "zonder de namen").
      Optioneel: dakwerken vult het niet in en toont de sectie niet. pos: object-position
      van de vierkante uitsnede. De herkomst van elke foto staat in scripts/check-lp-reno.cjs. */
  uitgevoerd?: { kop: string; onder?: string; fotos: (Foto & { pos?: string })[] };
  /** Het vangnet (totaalrenovatie, 5 okt): een rustig blok met een knop die de rekenaar in
      een venster opent, voor wie nog geen plaatsbezoek wil. Draagt het anker #rekenaar. */
  /** href: de knop gaat naar die pagina (de losse rekenaar) in plaats van het venster te openen. */
  vangnet?: { kop: string; tekst: string; knop: string; href?: string };
  /** Volgorde van de secties tussen de hero en het slotblok. Leeg = de standaardvolgorde. */
  volgorde?: Sectie[];
  /* Foto's van uitgevoerd werk. Dit staat op de plek waar de demo reviews
     heeft: AB heeft één Google-review, dus tot er echte klantenstemmen zijn
     draagt het werk zelf het bewijs. */
  werk: { kop: string; onder: string; fotos: (Foto & { label: string })[] };
  reviews: { kop: string; beeld: Foto; lijst: Review[] };
  /** icoon per stap: leeg = de iconen van de dak-LP op volgorde (totaalrenovatie, 5 okt: eigen iconen
      zodat er geen twee huisjes in één rij staan). */
  werkwijze: { kop: string; onder: string; stappen: { titel: string; tekst: string; icoon?: StapIcoon }[] };
  /** punten: wat de klant bij de gratis inspectie krijgt, als vinkjes onder de kop. */
  /** naam: korte naam van de aanvraag, voor de knop in de vaste balk op de telefoon en voor het
      CRM ("Aanvraag gratis plaatsbezoek"); leeg = de kop. onderkop: regel onder de kop. */
  cta: { kop: string; tekst: string; punten: string[]; foto: Foto; naam?: string; onderkop?: string };
  /** Het formulier onderaan: de gratis dakinspectie, met een link terug naar de calculator. */
  /** extra: optionele keuzelijsten onder de verplichte velden (totaalrenovatie, 26 sep:
      "bij totaalrenovatie willen ze juist meer"). Nooit verplicht: alleen het telefoonnummer is dat. */
  /** plaatsbezoek: de velden in de volgorde naam, e-mail, gsm, postcode, met deze labels
      (totaalrenovatie, 5 okt). vertrouwen: regels met een icoon onder de knop; die vervangen
      onder, alt en de privacyregel. */
  /** knopPijl: een pijl achter de tekst van de verzendknop (zijn ➔). */
  inspectie: { kop: string; knop: string; onder: string; alt: string; bronLead: string; knopPijl?: boolean;
    extra?: { naam: string; label: string; opties: string[] }[];
    plaatsbezoek?: { naam: string; naamHint: string; email: string; emailHint: string; gsm: string; gsmUitleg: string; gsmHint: string; postcode: string; postcodeHint: string };
    vertrouwen?: { icoon: 'slot' | 'telefoon' | 'euro' | 'koffie'; tekst: string }[] };
  /** Message match (Mohammed, 26 sep): wie via een advertentie of sitelink komt, ziet een kop
      die past bij wat hij zocht. `zoek` is een regex, apart getoetst op dienst=, dak= en utm_term;
      voor de kop wint die volgorde (LpKgj.tsx). `voor` beantwoordt vraag 1 al (Terug blijft werken). */
  boodschap?: { zoek: string; kop: string; voor?: { sleutel: string; label: string } }[];
};

export const DAKWERKEN: KgjInhoud = {
  /* Mohammed, 25 sep: de tekst in het tabblad "moet gaan over het vak", niet over prijs. */
  titel: 'Dé specialist voor uw dakwerk | AB Bouw Groep',
  /* 24 sep: "zes antwoorden" klopt niet meer (6 tot 8 vragen per pad) en
     "binnen één werkdag" is als belofte van de pagina gehaald. */
  /* 19 okt 2026: zonder "Bereken in 2 minuten de prijs van uw dak." (rekenaar weg, opdracht Mohammed); de rest woordelijk. */
  omschrijving: 'Gratis dakinspectie en offerte, werken aan 6% btw.',
  divisie: 'ab_dakwerken',
  bronLead: 'lp:dakwerken:rekenaar',
  bedanktSlug: 'dakwerken',

  hero: {
    /* De calculator staat ernaast en zegt zelf wat hij doet. Mohammed: 'de
       berekening is toch ernaast dat hoef je niet te verwoorden'. De kop gaat
       over het resultaat aan zijn huis. */
    /* 4 okt, Mohammed: "headline, bereken in 2 minuten de richtprijs van uw dak, met 2 minuten in kleur".
       Tussen [ ] = in de accentkleur. */
    /* 4 okt, plan mobiele hero: "Bereken in 1 minuut de richtprijs van uw dak" (maak "1 minuut" oranje/goud). */
    /* 19 okt 2026, opdracht Mohammed: "rekenaar weg, en doe dat naar dakinspectie ... form bovenaan en andere headline en
       subheadline". Kop en subkop waren mijn tekst ("Laat uw dak gratis inspecteren").
       20 okt 2026, Mohammed: "Laat uw dak gratis inspecteren??? wat is dat voor een headline" en "je kan toch zelf ook
       redeneren dat dit niet goed is". De kop was een opdracht over de werkwijze (de inspectie) in plaats van over zijn dak,
       en herhaalde het aanbod dat de kaart ernaast al noemt. Nu: wie AB is + zijn dak, zoals bfbouw.be ("De nr. 1 in
       dakwerken" + het aanbod in de subkop) en het tabblad van 25 sep. Het aanbod staat in de subkop en in de kaart. */
    kop: 'Dé specialist voor [uw nieuwe dak]',
    /* Mohammeds eigen zin, letterlijk (24 sep): "doe daar gewoon subheadline
       van de specialisatie". De vorige subkop ("u weet direct wat het kost",
       daarna "wij bellen u met de prijs") ging over de calculator, die ernaast
       staat en zichzelf uitlegt. */
    /* 4 okt, Mohammed: "subheadline, beantwoord 8 korte vragen voor een heldere en vrijblijvende
       prijsindicatie van uw dakrenovatie". Het pad van een dakrenovatie telt 8 vragen. */
    /* 4 okt, plan mobiele hero: subheadline "Snel, gratis en 100% vrijblijvend." (vervangt de zin met het aantal vragen). */
    /* 22 okt 2026, Mohammed: "subheadline ... moet eerst zijn, Specialist in platte en hellende daken, renovatie, isolatie, ... (zoiets)
       kies zelf een mooie zin, pas daarna moet komen, vraag uw gratis dakinspectie aan, u weet daarna precies ... mag eruit".
       "Expert" in plaats van "Specialist": de kop erboven zegt al "Dé specialist voor uw nieuwe dak". Renovatie, isolatie en
       herstellingen zijn de keuzes van de vraag "Wat moet er aan uw dak gebeuren?" in de kaart. */
    onder: 'Expert in platte en hellende daken: renovatie, isolatie en herstellingen. Vraag uw gratis dakinspectie aan.',
    /* Drie controleerbare feiten onder de kop. Een bezoeker die uit een
       advertentie komt, kent AB niet; dit is het enige bewijs dat boven de
       vouw past zolang er geen geverifieerde Google-score is.
       Volgorde op wat de Belgische markt blijkt te belonen: de langstlopende
       tekstadvertentie van Dural (1462 dagen, 45 van zijn 60 leesbare ads)
       zet "gratis en vrijblijvend" vooraan. Het VCA-attest staat nu in het
       waarom-blok: een certificaat overtuigt lager op de pagina, een
       toezegging overtuigt boven de vouw. */
    /* 4 okt: leeg. Premie, 6% btw en 10 jaar garantie staan als trust signals in de rekenaar;
       twee keer op het eerste scherm "ziet er niet uit" (Mohammed). Zo staat de rekenaar op de
       telefoon hoger. */
    bewijs: [],
    /* 13 okt 2026 (dictaat hierboven bij de imports): de vier stockfoto's van /dakwerken vervangen de gegenereerde
       dia's (heroNok, panRood, droneAntraciet, pannenDicht). Alt = neutrale beschrijving van wat te zien is; de laatste
       drie woordelijk uit fotoplan.ts (STOCK). Daklijn: lucht bovenaan voor de kop; pos 75% 100% houdt de daklijn in
       beeld (1265: de onderkant met de daken; 390: de oranje dakhelling met de schouwen). */
    dias: [
      { src: stockDaklijn, pos: '75% 100%', alt: 'Daken van oude rijwoningen met rode en grijze pannen, bakstenen schouwen en witte dakkapellen onder een grijze lucht' },
      { src: stockZinkwerk, alt: 'Daken van rijwoningen met twee dakramen, een zinken dakkapel en een dakkapel met pannen' },
      { src: stockPannenStapels, alt: 'Rode vlakke dakpannen op de panlatten: onderaan gelegd, bovenaan in stapeltjes over het dakvlak verdeeld' },
      { src: stockPanlatten, alt: 'Houtvezelplaten op het dakvlak met tengels en panlatten, waarop een baan zwarte dakpannen ligt' },
    ],
  },

  /* 19 okt 2026 (opdracht Mohammed, zie hero): bovenaan de aanvraagkaart voor de gratis dakinspectie, zoals
     bfbouw.be/lp/dakwerken: vier klikvragen, dan naam, gsm, postcode of gemeente en e-mail. De rekenaar hieronder staat op
     deze pagina nergens meer (de inhoud blijft voor LpKgj, de terugval). */
  heroAanvraag: true,
  /* 22 okt 2026, Mohammed: "op de dakwerken-pagina's een visueel mooi en clean blok 'Nood? Bel ....', maar niet letterlijk 'nood'",
     met de kop "Lekt uw dak?" en daaronder de gratis dakinspectie. Letterlijk zijn teksten; geen termijn, geen "24/7". */
  /* 22 okt 2026, Mohammed: "Lekt uw dak pas aan naar, in nood?", "en die ding geen haast haal dat weg", "doe gewoon, of". */
  belBlok: { kop: 'In nood?', knop: 'Bel direct', link: 'Of vraag uw gratis dakinspectie aan' },
  aanvraag: {
    titel: 'Gratis dakinspectie',
    tijd: 'Klaar in 1 minuut, vrijblijvend',
    /* De vragen en antwoorden van de opdracht, woordelijk. Vraag 1 met de foto's van de eerste rekenaarvraag; de sleutel
       Dak is die van de message match (boodschap.voor). De sleutels staan zo in aanvullende_info ("Dak: ... · Werk: ..."). */
    vragen: [
      { sleutel: 'Dak', vraag: 'Wat voor dak heeft u?', keuzes: [
        { label: 'Hellend dak', foto: keuzeHellend },
        { label: 'Plat dak', foto: keuzePlat },
      ] },
      { sleutel: 'Werk', vraag: 'Wat moet er aan uw dak gebeuren?', keuzes: [
        { label: 'Dakrenovatie / Nieuw dak', icoon: 'dienst-nieuw' }, { label: 'Herstelling', icoon: 'herstel' },
        { label: 'Ik wil dat een expert mijn dak inspecteert', icoon: 'verken' },
      ] },
      { sleutel: 'Isolatie', vraag: 'Wilt u ook isoleren?', keuzes: [
        { label: 'Ja', icoon: 'isolatie' }, { label: 'Nee', icoon: 'geenisolatie' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Asbest', vraag: 'Zit er asbest in uw dak?', keuzes: [
        { label: 'Ja', icoon: 'asbest' }, { label: 'Nee', icoon: 'veilig' }, { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      /* 22 okt 2026, Mohammed: "voeg 1 extra vraag toe dat nuttig is", voor /lp/dakwerken en /lp/totaalrenovatie ("EN TIS ENKEL lp
         dakwerken en lp totaalrenovatie"). Renovatie kreeg het budget; bij een dak is de start het nuttigst: een lek of "Zo snel
         mogelijk" belt AB eerst. Vraag, keuzes en iconen woordelijk van de startvraag van de dakrekenaar hieronder (sleutel Start). */
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', keuzes: [
        { label: 'Zo snel mogelijk', icoon: 'snel' }, { label: 'Dit jaar', icoon: 'drie' },
        { label: 'Volgend jaar', icoon: 'later' }, { label: 'Ik verken nog', icoon: 'verken' },
      ] },
    ],
    contactKop: 'Bijna klaar! Bevestig uw gratis dakinspectie',
    /* De vinkjes en de trustrij van de rekenaarkaart die hier stond (13 okt). Alleen "Gratis & vrijblijvende richtprijs"
       werd "... dakinspectie": er is geen richtprijs meer, wel de gratis dakinspectie (kop van de kaart en van het slotblok). */
    vertrouwen: ['Gratis & vrijblijvende dakinspectie', 'Vakmanschap tot in de details', '6% btw-tarief (woningen > 10 jaar)'],
    /* 22 okt 2026, Mohammed (21 okt gevraagd, toen alleen op de renovatiepagina's gezet; 22 okt: "je hebt veel vergeten", "DIE FORMS",
       "die visuele dingetjes", "EN TIS ENKEL lp dakwerken en lp totaalrenovatie"): hetzelfde als op /lp/totaalrenovatie.
       Trust badges: tegels met iconen, zelfde teksten en cijfers; schild bij de garantie, kalender bij de jaren ervaring. */
    trustrij: [{ b: '10 jaar', s: 'garantie', icoon: 'schild' }, { b: '15 jaar', s: 'ervaring', icoon: 'kalender' }],
    badges: true,
    /* "verwijder email form, verwijder postcode form": de contactstap heeft alleen nog Naam* en Gsm*. */
    contactVelden: { email: false, postcode: false },
    /* "een disclaimer zo wat ze precies krijgen, krijg vrijblijvend advies en weet waar u aan toe bent". Volgt het slotblok
       ("We bekijken uw dak ter plaatse", "Samen overlopen we de bevindingen", "U ontvangt een vrijblijvende offerte"). */
    /* 22 okt 2026, Mohammed: "die disclaimer bedoelde ik van wat er al was visueel verbeteren", "laat uw dak vakkundig controleren en
       vermijd onnodige kosten", "dat wat er stond": woordelijk de zin onder de contactkop van bfbouw.be/lp/dakwerken (zijn dictaat van
       17 okt, bouw/lp-dak.cjs contactSub), nu in een vlak met vinkje direct onder "Bijna klaar! Bevestig uw gratis dakinspectie". */
    disclaimer: 'Laat uw dak vakkundig controleren. Voorkom onvoorziene kosten en weet exact wat er moet gebeuren.',
    /* "onderaan ... de form zo dat je makkelijk kan klikken": onderaan dezelfde klikkaart in plaats van het formulier van Inspectie. */
    onder: true,
    /* 23 okt 2026 (Mohammed: "algemene psychologie cro optimalisatie toepassen"): onder de verzendknop bewijs en risico weg op het
       moment van beslissen. Woordelijk bfbouw.be (LP.kaart.zeker, rk__knopzeker) en het vinkje "Gratis & vrijblijvende dakinspectie". */
    zeker: 'Gratis en vrijblijvend',
  },

  rekenaar: {
    /* Overgenomen van de calculator van Recotex (calculator.recotex.be/dakwerken,
       23 sep 2026): soort dak, bedekking, grootte, isolatie, asbest. Simpeler
       gemaakt: de grootte als knoppen in plaats van een schuifbalk, geen
       tussenvraag naar het type pan of isolatie. Als zesde vraag de start,
       zodat AB de dringende aanvragen eerst kan bellen.
       Bij plat dak Mohammeds eigen keuzes (bitumen, roofing, EPDM).
       Kop en slotregel (24 sep, Mohammed: "duidelijk voor de bezoeker dat ze
       daar de prijs kunnen berekenen in 2 minuten"; referentie Airadvisor:
       de uitkomst zichtbaar aan het einde van de balk, een geruststelling
       bij de knop). */
    titel: 'Bereken uw dakprijs',
    /* 4 okt, Mohammed: "de calculator, bereken uw dakprijs, klaar in 2 minuten, vrijblijvend",
       daarna "trust signals erbij": "gratis & vrijblijvende richtprijs", "begeleiding bij premie-aanvragen". */
    tijd: 'Klaar in 2 minuten, vrijblijvend',
    zeker: 'Gratis en vrijblijvend',
    /* 13 okt, Mohammed: "google logo in de rekenaar form, en 10j garantie, 15 jaar ervaring in de blokje van dakwerken
       rekenaar, zoals bij bfbouw". 10 jaar garantie staat nu in de trustrij, dus niet meer bij de vinkjes. Premiepuntje ->
       "Vakmanschap tot in de details" (zijn keuze, doorgegeven via de BF-chat). Bron 15 jaar: Mohammed ("meer dan 15 jaar
       ervaring in dakwerken", waarom-tekst hieronder). */
    vertrouwen: ['Gratis & vrijblijvende richtprijs', 'Vakmanschap tot in de details', '6% btw-tarief (woningen > 10 jaar)'],
    trustrij: [{ b: '10 jaar', s: 'garantie' }, { b: '15 jaar', s: 'ervaring' }],
    vragen: [
      /* Geen hellingshoek meer onder hellend en plat (Mohammed, 24 sep: "mensen
         weten wat een hellend dak is en plat dak"); de foto zegt het al. */
      { sleutel: 'Dak', vraag: 'Welk soort dak heeft u?', keuzes: [
        { label: 'Hellend dak', foto: keuzeHellend },
        { label: 'Plat dak', foto: keuzePlat },
      ] },
      /* Mohammed, 24 sep: "na vraag 1 moet er eerst zijn: herstelling,
         renovatie, isolatie, en dan pas de rest". Elk antwoord heeft een eigen
         vervolg: bij herstelling vragen we wat er NU op het dak ligt, bij
         isolatie vervalt de bedekking en de vraag of er isolatie nodig is. */
      /* Volgorde (Mohammed, 1 okt 2026): renovatie, isolatie, herstelling. */
      /* 6 okt, Mohammed: "voeg optie toe nieuw dak ... moet je dus hebben, nieuw dak, renovatie,
         isolatie, herstelling". Nieuw dak volgt het pad van renovatie: met of zonder isolatie, en
         welke bedekking hij wenst. Icoon: het huis met de plus van de dienstkaart "Nieuw dak". */
      { sleutel: 'Werk', vraag: 'Wat moet er aan uw dak gebeuren?', keuzes: [
        { label: 'Nieuw dak', icoon: 'dienst-nieuw' }, { label: 'Renovatie', icoon: 'nieuwdak' },
        { label: 'Isolatie', icoon: 'isolatie' }, { label: 'Herstelling', icoon: 'herstel' },
      ] },
      /* Mohammed, 27 sep: "als je klikt op herstelling of renovatie, dat je kan kiezen, met
         isolatie of zonder", want "nu is isolatie enkel en alleen apart". De keuze staat dus meteen
         na herstelling of renovatie; wie "Isolatie" koos, krijgt ze niet.
         Premie (26 sep): de melding verschijnt bij "Met isolatie", want isolatie is de voorwaarde
         (Rd 4,5). Bron: vlaanderen.be, Mijn VerbouwPremie voor dak, aanvragen vanaf 1 maart 2026:
         categorie 4 50% (max. 5.750 euro), categorie 3 35% (max. 4.025 euro), 1 en 2 niets meer. */
      { sleutel: 'Isolatie', vraag: 'Wilt u het dak ook laten isoleren?', als: { Werk: ['Herstelling', 'Renovatie', 'Nieuw dak'] },
        tip: { bij: ['Met isolatie'], tekst: 'Met isolatie komt uw dak in aanmerking voor Mijn VerbouwPremie: bij inkomenscategorie 3 of 4 tot 50% van de factuur terug, maximaal € 5.750.' }, keuzes: [
        { label: 'Met isolatie', uitleg: 'het dak wordt mee geïsoleerd', icoon: 'isolatie' },
        { label: 'Zonder isolatie', uitleg: 'enkel de dakwerken', icoon: 'geenisolatie' },
      ] },
      /* Mohammed, 24 sep: "doe ook vraag hoe oud is uw dak", met na het antwoord
         de btw-melding klein in het formulier, "zodat ze verder gaan met de
         vragen". Een dak ouder dan tien jaar ligt op een woning ouder dan tien
         jaar, en dat is de voorwaarde voor 6% btw bij renovatie. De melding zegt
         "15% minder btw" (21% wordt 6%); "15% op uw totale factuur" klopt niet:
         op €10.000 werk is het verschil €1.500, 12,4% van de factuur. */
      /* Twee keuzes (Mohammed, 24 sep: "jonger dan 10 jaar en ouder dan 10
         jaar, meer moeten we niet weten"): de grens is die van de 6% btw. */
      { sleutel: 'Leeftijd', vraag: 'Hoe oud is uw dak?', keuzes: [
        { label: 'Jonger dan 10 jaar', icoon: 'jong' }, { label: 'Ouder dan 10 jaar', icoon: 'oud' },
      ], tip: { bij: ['Ouder dan 10 jaar'], tekst: 'Dankzij de wettelijke 6% btw-regeling betaalt u 15% minder btw op uw factuur.' } },
      { sleutel: 'Bedekking', vraag: 'Welke dakbedekking wenst u?', als: { Dak: ['Hellend dak'], Werk: ['Renovatie', 'Nieuw dak'] }, keuzes: [
        { label: 'Gegolfde pannen', icoon: 'golfpan' }, { label: 'Vlakke pannen of leien', icoon: 'vlakkepan' },
        { label: 'Golfplaten', icoon: 'golfplaat' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Wat wilt u op uw plat dak?', als: { Dak: ['Plat dak'], Werk: ['Renovatie', 'Nieuw dak'] }, keuzes: [
        { label: 'Bitumen', icoon: 'bitumen' }, { label: 'Roofing', icoon: 'roofing' },
        { label: 'EPDM', icoon: 'epdm' }, { label: 'Weet ik nog niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Welke dakbedekking ligt er nu?', als: { Dak: ['Hellend dak'], Werk: ['Herstelling'] }, keuzes: [
        { label: 'Gegolfde pannen', icoon: 'golfpan' }, { label: 'Vlakke pannen of leien', icoon: 'vlakkepan' },
        { label: 'Golfplaten', icoon: 'golfplaat' }, { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Bedekking', vraag: 'Wat ligt er nu op uw plat dak?', als: { Dak: ['Plat dak'], Werk: ['Herstelling'] }, keuzes: [
        { label: 'Bitumen', icoon: 'bitumen' }, { label: 'Roofing', icoon: 'roofing' },
        { label: 'EPDM', icoon: 'epdm' }, { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Grootte', vraag: 'Hoe groot is het dak?', keuzes: [
        { label: 'Kleiner dan 50 m²', icoon: 'maat1' }, { label: '50 tot 100 m²', icoon: 'maat2' },
        { label: '100 tot 150 m²', icoon: 'maat3' }, { label: 'Groter dan 150 m²', icoon: 'maat4' },
        { label: 'Weet ik niet', icoon: 'twijfel' },
      ] },
      { sleutel: 'Asbest', vraag: 'Is er asbest aanwezig in het dak?', keuzes: [
        { label: 'Ja, vermoedelijk', icoon: 'asbest' }, { label: 'Nee', icoon: 'veilig' }, { label: 'Weet ik niet zeker', icoon: 'twijfel' },
      ] },
      /* 1 okt, Mohammed: "doe bij deze stap duidelijk een puntje gratis en vrijblijvend". */
      { sleutel: 'Start', vraag: 'Wanneer wilt u beginnen?', punt: 'Gratis en vrijblijvend', keuzes: [
        /* 30 sep, Mohammed: "duidelijker, zo snel mogelijk, dit jaar, volgend jaar".
           1 okt: "verwijder aub de optie ik verken nog", dus drie keuzes.
           3 okt: "voeg de optie ik verken nog ook gewoon terug toe". */
        { label: 'Zo snel mogelijk', icoon: 'snel' }, { label: 'Dit jaar', icoon: 'drie' },
        { label: 'Volgend jaar', icoon: 'later' }, { label: 'Ik verken nog', icoon: 'verken' },
      ] },
    ],
    gerust: 'Weet u het niet zeker? Een schatting volstaat.',
    /* Mohammed, 26 sep: "waar mogen we de berekening naartoe verzenden?", ook op dakwerken. */
    uitkomstKop: 'Waar mogen we de berekening naartoe verzenden?',
    uitkomstOnder: 'Wij bezorgen u uw richtprijs zo snel mogelijk.',
    knop: 'Ontvang mijn richtprijs',
    /* Drie zekerheden net boven de knop (Mohammed, 28 sept). Bron: 10 jaar garantie
       en vaste prijs staan op deze pagina en de bedankpagina. */
    troeven: ['Gratis en vrijblijvend', 'Vaste prijs, geen verrassingen', '10 jaar garantie'],
  },

  waarom: {
    kop: 'Waarom AB Bouw Groep',
    /* Mohammeds eigen zin (22 sep 2026), alleen het open woord ingevuld
       ("van topkwaliteit"; "waterdicht" kon letterlijk gelezen
       worden, "degelijk" overtuigde niet). Vier eigen varianten met beeldspraak zijn afgekeurd:
       een zakelijke belofte hier, geen zin die moet "landen".
       "meer dan 15 jaar" komt van Mohammed zelf. */
    tekst: 'Een dak vernieuwt u één keer en vervolgens moet het decennia meegaan. Daarom is het belangrijk dat u een aannemer kiest die het vak kent. Met meer dan 15 jaar ervaring in dakwerken staan we garant voor een eindresultaat van topkwaliteit. U kan rekenen op een zorgeloos traject van A tot Z.',
    redenen: [
      { titel: '10 jaar garantie', tekst: 'Tien jaar garantie op dakrenovatie. We zijn volledig verzekerd en VCA-gecertificeerd.' },
      /* 13 okt, Mohammed: de kaart "Vrijblijvende offerte en dakinspectie" weg ("haal dat puntje weg zelfs, eigenlijk twee is genoeg"). */
      /* Mohammed, 23 sep 2026: 'volledige premiebegeleiding, Mijn VerbouwPremie, zoals
         Kijzer ook doet'. Kijzer noemt het 'Premieservice' en 'volledige omkadering
         met hulp bij premie aanvragen'. Geen bedragen: die hangen af van inkomen en
         werk, en de regels veranderen (gevelpremie weg sinds 1 maart 2026). */
      { titel: 'Volledige premiebegeleiding', tekst: 'Wij regelen de aanvraag van uw Mijn VerbouwPremie. Wordt uw dak mee geïsoleerd, dan krijgt u bij inkomenscategorie 3 of 4 tot 50% van de factuur terug, maximaal € 5.750.' },
    ],
    /* Boven: de dakwerker zelf aan het werk. Dit blok verkoopt de mensen, dus
       hoort er een mens in beeld en geen vierde gevelfoto. Hier stond eerst
       lp-real-det-1, en dat bestand bleek op een pixelvergelijking hetzelfde
       frame als de eerste hero-dia (verschil 1,8 van 255): dezelfde woning
       stond dus twee keer op één pagina. */
    /* Mohammed, 1 okt 2026: "dakwerken als bovenste, dakwerken roof als onderste"
       (Downloads/dakwerken.jpg en dakwerkenroof.jpg). */
    duo: [
      { src: waaromDakwerker, alt: 'Dakwerker die nieuwe antraciet pannen legt op de panlatten' },
      { src: waaromPannendak, alt: 'Pannendak met rode keramische pannen en zinken goot' },
    ],
  },

  /* Mohammed, 26 sep: "voeg ... net onder waarom en boven diensten sectie een sectie,
     voordelen van dakrenovatie, minder stookkost, vermijd schade aan uw dak en
     investering in de waarde van uw woning en wooncomfort", "met de nodige juiste
     iconen, graag in bolvorm en met verschillende bijpassende kleuren", "bij elk
     bolletje een korte uitleg erbij".
     27 sep: titel 2 is zijn zin ("vermijd duizenden euros aan schade"); punt 3 "is echt niet
     overtuigend", dus een feit met bron: Nationale Bank met KU Leuven en UAntwerpen
     (VRT NWS, 14 jan 2025, cijfers 2016-2022): label F gaat 10% goedkoper van de hand,
     label A 13% duurder. De drie teksten zijn even lang, zodat de kaarten gelijk lopen. */
  voordelen: {
    kop: 'Voordelen van dakrenovatie',
    lijst: [
      { icoon: 'voordeel-stook', kleur: 'oranje', titel: 'Minder stookkost', tekst: 'Warme lucht stijgt en verdwijnt langs het dak. Met een goed geïsoleerd dak blijft die warmte binnen en stookt u minder.' },
      { icoon: 'voordeel-schade', kleur: 'blauw', titel: "Vermijd duizenden euro's aan schade", tekst: 'Een verschoven pan of een barst in de roofing laat regenwater binnen. Renoveert u op tijd, dan vermijdt u vocht en verdere schade aan uw dak.' },
      { icoon: 'voordeel-waarde', kleur: 'groen', titel: 'Meer waarde voor uw woning', tekst: 'Een dakrenovatie verhoogt de waarde van uw woning en verbetert, met isolatie, de EPC-score aanzienlijk.' },
    ],
  },

  /* Mohammed, 25 sep: "onder de sectie waarom ab bouw groep 1 korte diensten sectie,
     diensten met mooie iconen gewoon, naam, en de nodige tekst", daarna "de
     diensten moeten zijn, nieuw dak, dakrenovatie, dakisolatie, dakherstelling"
     en "er zijn genoeg mensen dat nieuw dak willen ipv renovatie".
     Bron van de teksten: de dakwerkenpagina van AB zelf (_divisies.ts: "volledig
     afgebroken en opnieuw opgebouwd, met nieuw onderdak"; "onderdak, tengels en
     panlatten"). De bedekkingen van een plat dak zijn de keuzes uit de calculator.
     Nieuw dak: Mohammeds woorden "Volledig nieuw dak" (25 sep: "want anders haal
     je nieuwbouw eruit"). Bij een renovatie blijft de dakstructuur staan.
     Elke id is een anker voor een sitelink (/lp/dakwerken#nieuw-dak).
     2 okt, Mohammed: "nu zijn het gewoon zo lelijke vierkantjes op een scherm",
     "visueel mooier en beter, clean", "wees creatief". Elke dienst kreeg een foto
     (de conventie van de dienstkaarten op de homepage); het icoon valt dan weg.
     3 okt, Mohammed: "haal die fotos weg bij diensten, laat enkel die van dakrenovatie
     en isolatie". Nieuw dak en dakherstelling tonen hun icoon op een licht vlak.
     3 okt, Mohammed: "doe maar die twee fotos bij diensten ook weg". Alle vier tonen
     hun icoon op een licht vlak (vlakken: true). */
  diensten: {
    kop: 'Onze diensten',
    vlakken: true,
    lijst: [
      { id: 'nieuw-dak', icoon: 'dienst-nieuw', naam: 'Nieuw dak', tekst: 'Volledig nieuw dak, met pannen of leien, of als plat dak in EPDM, roofing of bitumen.' },
      { id: 'renovatie', icoon: 'dienst-renovatie', naam: 'Dakrenovatie', tekst: 'Uw dakstructuur blijft staan. Wij vernieuwen de pannen of leien, samen met het onderdak en de panlatten.' },
      { id: 'isolatie', icoon: 'dienst-isolatie', naam: 'Dakisolatie', tekst: 'Wij isoleren uw dak tijdens de renovatie of als aparte opdracht.' },
      { id: 'herstelling', icoon: 'dienst-herstel', naam: 'Dakherstelling', tekst: 'Wij herstellen een lek of schade aan uw hellend of plat dak.' },
    ],
  },

  voorna: {
    kop: 'Hetzelfde dak voor en na de werken',
    onder: 'Sleep de balk over de foto.',
    voor: { src: dakVoor, alt: 'Het dak met de pannen eraf: alleen het houten gebint staat er nog' },
    na: { src: dakNa, alt: 'Hetzelfde dak na de werken, met nieuwe pannen en dakvensters' },
    label: 'Hellend dak',
  },

  werk: {
    /* Geen kop: de foto's spreken voor zich (Mohammed, 23 sep). */
    kop: '',
    onder: '',
    fotos: [
      { src: antraciet, label: 'Antraciet pannendak', alt: 'Halfopen woning in rode baksteen met een nieuw antraciet pannendak' },
      { src: panRood, label: 'Rood pannendak', alt: 'Rijwoning met een nieuw rood pannendak en een dakvenster' },
      { src: platdak, label: 'Plat dak met EPDM', alt: 'Plat dak met EPDM en een lichtkoepel op een aanbouw achter een woning' },
      /* Drie tegels, één per daktype. De overige beelden tonen dezelfde
         woningen vanuit een andere hoek en lezen als herhaling. */
    ],
  },

  /* De reviews die al op de dakpagina's van abgroep.be staan (LpDienst:
     dakisolatie, velux, platdak) stonden hier. Ze staan NIET op het
     Google-profiel van AB (dat heeft één review, 5,0, van Tarik Azarkan,
     gecontroleerd 22 sep 2026). Zolang dat zo is blijft deze lijst leeg en
     toont de pagina de sectie niet. Echte reviews erin zetten is één regel. */
  reviews: {
    kop: 'Wat klanten schrijven',
    beeld: { src: antraciet3, alt: 'Nieuw antraciet dak op een halfopen woning in rode baksteen' },
    lijst: [],
  },

  werkwijze: {
    kop: 'Zo verloopt uw dakwerk',
    onder: 'U weet vooraf wat er gebeurt en wanneer.',
    stappen: [
      { titel: 'Aanvraag', tekst: 'U doet uw aanvraag via het formulier hieronder of rechtstreeks telefonisch.' },
      /* 22 okt 2026, Mohammed: "weg" (de termijn "Binnen enkele werkdagen"). "Ter plaatse" staat al in het slotblok. */
      { titel: 'Dakinspectie', tekst: 'We inspecteren uw dak ter plaatse en bekijken samen de bevindingen.' },
      /* Stond eerst "Elke post staat apart op papier": dat is nu de derde
         reden in het waarom-blok. Twee keer dezelfde belofte op één pagina
         leest als vulling, dus deze stap draagt het geruststellende deel. */
      { titel: 'Offerte', tekst: 'U krijgt een vrijblijvende offerte.' },
      /* Mohammed: 'wij beginnen aan de werken, meestal duurt dakwerk ...'. De duur
         (één tot twee weken) is door Claude ingevuld: nog te bevestigen door AB. */
      { titel: 'Uitvoering', tekst: 'Wij beginnen aan de werken. Meestal duurt dakwerk één tot twee weken.' },
      { titel: 'Oplevering', tekst: 'Wij ruimen alles netjes op. Het enige wat we achterlaten is een perfect dak.' },
    ],
  },

  cta: {
    kop: 'Gratis dakinspectie en offerte', // 25 okt, Mohammed: 'gratis dakinspectie en offerte', 'enkel onderaan', 'letterlijk 2 woorden toevoegen'
    naam: 'Gratis dakinspectie', // vaste balk op de gsm en de regel in het CRM blijven zoals ze waren
    /* Mohammed: 'gratis dakinspectie onderaan moet duidelijker'. Wat de klant
       bij de inspectie krijgt, staat nu als drie vinkjes in plaats van in één
       lopende zin. Alles komt uit de werkwijze en de redenen hierboven. */
    tekst: '',
    punten: [
      'We bekijken uw dak ter plaatse',
      'Samen overlopen we de bevindingen',
      'U ontvangt een vrijblijvende offerte',
    ],
    /* 13 okt 2026: stock in plaats van het gegenereerde pannenDicht. Niet daklijn: die is dia 1. Vier stockfoto's op
       vijf plekken (4 dia's + slotblok) geeft precies één herhaling, zoals voorheen (pannenDicht stond in dia 4 én hier).
       Zinkwerk: bestaande daken van rijwoningen ("we bekijken uw dak"), geen dak in opbouw dat als een eigen werf leest. */
    foto: { src: stockZinkwerk, alt: 'Daken van rijwoningen met twee dakramen, een zinken dakkapel en een dakkapel met pannen' },
  },

  inspectie: {
    kop: 'Plan uw dakinspectie',
    /* 23 okt 2026, Mohammed: "doe ook optimalisatie van de knoppen, wat de knoppen zeggen, om meer inzendingen te krijgen", "ga na WAT
       DE BESTE is", "doe goede research op alles". Onderzoek 23 okt (54 sites letterlijk gelezen + A/B-tests): de infinitief "aanvragen"
       zoals de Vlaamse bouwbedrijven (18 van 43; Dakrubbercentrale exact zo), het werkwoord is wat er echt gebeurt (aanvragen, daarna belt
       AB), "gratis" erin. "Bevestig" en "Plan" beloven een vast moment (0 van 54 sites met "Bevestig"); "Vraag mijn ... aan" mengt twee
       stemmen (0 van 46 Belgische sites). Ook de knop in het waarom-blok en de vaste knop (LpBf) dragen deze tekst. */
    knop: 'Gratis dakinspectie aanvragen',
    /* 21 okt 2026, Mohammed, woordelijk: "onze dakexpert ... neemt zo snel mogelijk contact met u op" (zoals op bfbouw.be). */
    onder: 'Onze dakexpert neemt zo snel mogelijk contact met u op.',
    alt: 'Liever eerst een prijs? Bereken hem in 2 minuten',
    bronLead: 'lp:dakwerken:inspectie',
  },

  /* Message match (Mohammed, 26 sep: "voor de mensen die bijvoorbeeld klikken, bij die koppen,
     dat ze denken, ah, ik ben op de juiste website"). Volgorde telt: isolatie vóór plat, want
     "plat dak isoleren" is een isolatievraag. Isolatie, renovatie en nieuw vragen het woord
     dak erbij: "badkamer renoveren" of "gevel isoleren" houdt de standaardkop. */
  boodschap: [
    /* 4 okt: de varianten volgen Mohammeds nieuwe kop; alleen het dakwoord wisselt. */
    /* 20 okt 2026: de varianten volgen de kop "Dé specialist voor [uw nieuwe dak]"; alleen het dakwoord wisselt.
       voor (vraag 1 van de aanvraagkaart) blijft. */
    { zoek: 'dak.*isol|isol.*dak|sarking', kop: 'Dé specialist voor [uw dakisolatie]' },
    { zoek: 'plat|epdm|roofing|bitumen', kop: 'Dé specialist voor [uw platte dak]', voor: { sleutel: 'Dak', label: 'Plat dak' } },
    { zoek: 'hellend|pannen|leien|sarking', kop: 'Dé specialist voor [uw hellende dak]', voor: { sleutel: 'Dak', label: 'Hellend dak' } },
    { zoek: 'dak.*renov|^renovatie$', kop: 'Dé specialist voor [uw dakrenovatie]' },
    { zoek: 'dak.*(nieuw|vervang)|(nieuw|vervang).*dak', kop: 'Dé specialist voor [uw nieuwe dak]' },
  ],
};
