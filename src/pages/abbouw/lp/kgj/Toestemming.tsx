import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { kiesMarketing } from '@/lib/consent';
import { herhaalConversie } from '@/lib/tracking';

/**
 * Eén vraag nadat de aanvraag goed is aangekomen, voor wie geen toestemming gaf voor
 * advertentiecookies.
 *
 * Gemeten op 1 okt 2026: zonder die toestemming vertrekt er na een aanvraag niets naar
 * Google Ads, dus de campagne ziet de lead niet. Met de cookiebanner alleen gaf maar een
 * deel van de aanvragers toestemming. De bezoeker beslist hier opnieuw, nu hij weet waarvoor:
 * bij "Ja" wordt de toestemming opgeslagen en vertrekt dezelfde conversie (zelfde
 * transaction_id, dus nooit dubbel geteld). We staan nog op de advertentiepagina, waar de
 * klik-ID van Google in het adres staat. Bij "Liever niet" gebeurt er niets meer.
 * Daarna gaat de bezoeker naar de bedankpagina, zoals voorheen.
 */
export default function Toestemming({ verder }: { verder: () => void }) {
  const [bezig, setBezig] = useState(false);
  const kies = (ja: boolean) => {
    if (bezig) return;
    setBezig(true);
    kiesMarketing(ja);
    if (ja) {
      /* Even wachten zodat gtag de nieuwe toestemming verwerkt heeft vóór de conversie. */
      window.setTimeout(() => { herhaalConversie(); window.setTimeout(verder, 700); }, 300);
    } else {
      verder();
    }
  };
  return (
    <div className="kgj-reken__stap kgj-toestemming" role="dialog" aria-live="polite" aria-label="Toestemming advertentiemeting">
      <p className="kgj-toestemming__ok"><CircleCheck aria-hidden="true" />Uw aanvraag is verstuurd</p>
      <p className="kgj-toestemming__tekst">
        Mag AB Bouw Groep aan Google doorgeven dat uw aanvraag via een advertentie kwam? Daarvoor gebruiken we een
        advertentiecookie. Zo tonen wij onze advertenties aan de juiste mensen. <a href="/cookies">Cookieverklaring</a>
      </p>
      <div className="kgj-toestemming__knoppen">
        <button type="button" onClick={() => kies(true)} disabled={bezig}>Ja, dat mag</button>
        <button type="button" onClick={() => kies(false)} disabled={bezig}>Liever niet</button>
      </div>
    </div>
  );
}
