/**
 * Nepmodel voor de chatassistent: alleen voor de dev-server (CHAT_NEP=1) en
 * scripts/check-chat.mjs. Geeft antwoorden in exact het schema van api/chat.js,
 * zodat de widget volledig te doorlopen is zonder API-sleutel en zonder kosten.
 * Het echte gedrag (taal, feiten) toetst scripts/check-chat-live.mjs met de
 * echte sleutel.
 */
const leeg = { klaar: false, titel: '', velden: [], bericht: '' };
const uit = (o) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ keuzes: [], suggesties: [], actie: 'geen', aanvraag: leeg, ...o }) }] });

const DAK = [
  ['Werk', 'Wat moet er aan uw dak gebeuren?', ['Dakrenovatie', 'Herstelling of lek', 'Dakisolatie', 'Nieuw dak']],
  ['Soort dak', 'Gaat het om een hellend of een plat dak?', ['Hellend dak', 'Plat dak']],
  ['Gemeente', 'In welke gemeente ligt de woning?', []],
  ['Grootte', 'Hoe groot is het dak ongeveer?', ['Kleiner dan 50 m²', '50 tot 100 m²', '100 tot 150 m²', 'Groter dan 150 m²', 'Weet ik niet']],
  ['Start', 'Wanneer wilt u beginnen?', ['Zo snel mogelijk', 'Binnen drie maanden', 'Later dit jaar', 'Ik verken nog']],
];
const RENO = [
  ['Woning', 'Wat voor woning wilt u renoveren?', ['Appartement', 'Rijwoning', 'Halfopen bebouwing', 'Open bebouwing']],
  ['Renoveren', 'Wat wilt u renoveren?', ['Alles (totaalrenovatie)', 'Keuken', 'Badkamer', 'Meerdere ruimtes']],
  ['Gemeente', 'In welke gemeente ligt de woning?', []],
  ['Grootte', 'Hoe groot is de woning ongeveer?', ['Kleiner dan 100 m²', '100 tot 150 m²', '150 tot 200 m²', 'Groter dan 200 m²', 'Weet ik niet']],
  ['Start', 'Wanneer wilt u beginnen?', ['Zo snel mogelijk', 'Binnen drie maanden', 'Later dit jaar', 'Ik verken nog']],
];

function antwoord(params) {
  const berichten = params.messages;
  /* Alleen het tweede systeemblok noemt de pagina; het eerste (de kennis) noemt ze allebei. */
  const reno = /totaalrenovatie/.test(params.system[1]?.text || '');
  const velden = reno ? RENO : DAK;
  const laatste = berichten[berichten.length - 1].content.toLowerCase();
  /* Een aanvraag loopt vanaf het laatste bericht dat er een startte. */
  const start = berichten.map((b) => b.role === 'user' && /aanvragen|inspectie|plaatsbezoek/i.test(b.content)).lastIndexOf(true);
  if (start >= 0) {
    const antwoorden = berichten.slice(start + 1).filter((b) => b.role === 'user').map((b) => b.content);
    const ingevuld = velden.slice(0, antwoorden.length).map(([label], i) => ({ label, waarde: antwoorden[i] }));
    if (antwoorden.length < velden.length) {
      const [, vraag, keuzes] = velden[antwoorden.length];
      return uit({ antwoord: (antwoorden.length === 0 ? 'Graag. Nog enkele korte vragen. ' : '') + vraag, keuzes, aanvraag: { ...leeg, velden: ingevuld } });
    }
    const g = ingevuld.find((v) => v.label === 'Gemeente')?.waarde || '';
    return uit({
      antwoord: 'Dank u. Uw aanvraag staat klaar. Vul hieronder uw telefoonnummer in, dan bellen wij u binnen één werkdag om een moment af te spreken.',
      aanvraag: {
        klaar: true,
        titel: reno ? `${ingevuld[1].waarde} – ${g}` : `${ingevuld[0].waarde} ${ingevuld[1].waarde.toLowerCase()} – ${g}`,
        velden: ingevuld,
        bericht: reno
          ? `Goedendag, ik wil mijn ${ingevuld[0].waarde.toLowerCase()} in ${g} laten renoveren (${ingevuld[1].waarde.toLowerCase()}). Graag een gratis plaatsbezoek.`
          : `Goedendag, ik zoek iemand voor ${ingevuld[0].waarde.toLowerCase()} van mijn ${ingevuld[1].waarde.toLowerCase()} in ${g}. Graag een gratis dakinspectie.`,
      },
    });
  }
  if (/prijs|kost|hoeveel|€|euro|budget/.test(laatste)) {
    return uit({
      antwoord: 'Een prijs geven wij niet in de chat: elk dak is anders. De prijs hangt af van onder meer de oppervlakte, de staat van het onderdak en het houtwerk, de dakbedekking en de isolatie. Met de prijsberekening op deze pagina bezorgen wij u een richtprijs op maat.',
      actie: 'rekenaar', suggesties: ['Wat zit er in de offerte?', 'Hoe verloopt een dakinspectie?'],
    });
  }
  if (/hoelang|duur|weken|dagen/.test(laatste)) {
    return uit({
      antwoord: 'Bij een gemiddeld hellend dak drie tot tien werkdagen. We werken per dakvlak en dekken elke avond af, dus uw woning staat nooit een nacht open.',
      suggesties: ['Welke garantie krijg ik?', 'Wat gebeurt er met het afval?', 'Hoe verloopt een dakinspectie?'],
      actie: 'aanvraag',
    });
  }
  if (/garantie/.test(laatste)) {
    return uit({
      antwoord: 'U krijgt tien jaar garantie op dakrenovatie. Wij zijn volledig verzekerd en VCA-gecertificeerd.',
      suggesties: ['Hoelang duren de werken aan mijn dak?', 'Krijg ik een premie voor dakisolatie?'],
    });
  }
  if (/premie/.test(laatste)) {
    return uit({
      antwoord: 'Voor dakisolatie krijgt u via Mijn VerbouwPremie bij inkomenscategorie 3 of 4 tot 50% van de factuur terug, maximaal € 5.750. Wij regelen de aanvraag en toetsen uw dossier bij het plaatsbezoek.',
      suggesties: ['Geldt het 6% btw-tarief ook voor mij?', 'Hoelang duren de werken aan mijn dak?'],
    });
  }
  if (/gemeente|regio|werken jullie in/.test(laatste)) {
    return uit({
      antwoord: 'Wij werken in de regio Antwerpen en omstreken. Zet uw gemeente gerust in uw aanvraag, dan bekijken wij het.',
      actie: 'aanvraag', suggesties: ['Hoe verloopt een dakinspectie?'],
    });
  }
  return uit({
    antwoord: 'Wij helpen u graag. Bij een gratis dakinspectie bekijken wij uw dak ter plaatse en overlopen wij de bevindingen samen met u. Daarna krijgt u een vrijblijvende offerte.',
    actie: 'aanvraag', suggesties: ['Hoelang duren de werken aan mijn dak?', 'Welke garantie krijg ik?', 'Krijg ik een premie voor dakisolatie?'],
  });
}

export const nepClient = () => ({
  beta: { messages: { create: async (p) => { await new Promise((r) => setTimeout(r, 450)); return antwoord(p); } } },
  messages: { create: async (p) => antwoord(p) },
});
