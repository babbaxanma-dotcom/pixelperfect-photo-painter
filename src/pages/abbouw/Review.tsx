import { useEffect } from 'react';

/**
 * abgroep.be/review: korte link naar de Google-reviewpagina van AB Bouw Groep.
 *
 * Voor de sms-versie van de reviewvraag (klanten zonder e-mailadres). De
 * volledige Google-link is een lange reeks tekens; in een sms oogt dat
 * slordig (Mohammed, 28 sept: "duidelijker, cleaner").
 */
const GOOGLE_REVIEW = 'https://www.google.com/maps/place//data=!4m3!3m2!1s0x4a0341ae3b55ce5d:0x7d0fc6746e96d5bf!12e1';

export default function Review() {
  useEffect(() => {
    window.location.replace(GOOGLE_REVIEW);
  }, []);
  return (
    <p style={{ padding: 24, textAlign: 'center', fontFamily: 'sans-serif' }}>
      U gaat naar Google. Gebeurt er niets? <a href={GOOGLE_REVIEW}>Klik hier</a>.
    </p>
  );
}
