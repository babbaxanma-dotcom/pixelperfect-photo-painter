/**
 * Doorgeefroute naar de schetser-agent.
 *
 * De agent draait op de pc van Mohammed en is via een tunnel bereikbaar. Dat
 * adres staat hier in een omgevingsvariabele en NOOIT in de browser: anders kan
 * iedereen die de pagina opent rechtstreeks op zijn machine schieten.
 *
 * Deze functie doet drie dingen en niets meer: hij remt, hij geeft door, en hij
 * vertaalt een storing naar een melding waar een bezoeker iets aan heeft. Hij
 * verzint nooit een beeld.
 *
 * Nodig bij Vercel:
 *   AGENT_URL      het tunnel-adres, bijvoorbeeld https://iets.trycloudflare.com
 *   AGENT_GEHEIM   dezelfde waarde als op de pc
 */
const RAAM_MS = 60 * 60 * 1000;
const PER_IP_PER_UUR = 6;

/* Eenvoudige rem in het geheugen van de instantie. Genoeg om een enkeling te
   stoppen die de knop blijft indrukken; het is geen bescherming tegen een
   verdeelde aanval. Voor dat laatste hoort er een echte teller (KV) te komen
   zodra de sectie op betaald verkeer staat. */
const bezoeken = new Map();

function magNog(ip) {
  const nu = Date.now();
  const rij = (bezoeken.get(ip) || []).filter((t) => nu - t < RAAM_MS);
  if (rij.length >= PER_IP_PER_UUR) return false;
  rij.push(nu);
  bezoeken.set(ip, rij);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ fout: 'alleen POST' });
    return;
  }

  const adres = process.env.AGENT_URL;
  if (!adres) {
    res.status(503).json({
      fout: 'De ontwerper staat even uit. Bel ons gerust, dan bekijken we het samen.',
    });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'onbekend';
  if (!magNog(ip)) {
    res.status(429).json({
      fout: 'U hebt er al een paar gemaakt. Probeer het later opnieuw, of laat uw nummer achter.',
    });
    return;
  }

  try {
    const antwoord = await fetch(`${adres.replace(/\/$/, '')}/schets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-agent-geheim': process.env.AGENT_GEHEIM || '',
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(180000),
    });

    const gegevens = await antwoord.json();
    if (!antwoord.ok) {
      res.status(502).json({ fout: gegevens.fout || 'Het ontwerpen lukte niet. Probeer het opnieuw.' });
      return;
    }
    res.status(200).json({ beeld: gegevens.beeld });
  } catch {
    /* Tunnel dicht, pc uit, of te traag. Eerlijk melden, met een uitweg. */
    res.status(503).json({
      fout: 'De ontwerper is even niet bereikbaar. Laat uw nummer achter, dan sturen we het ontwerp na.',
    });
  }
}
