import { useEffect } from "react";

/**
 * 404 in AB Bouw-huisstijl: Nederlandstalig, navy/accent, duidelijke wegen
 * terug (home, diensten, contact + telefoon). Bewust zelfstandig en licht —
 * geen shell-afhankelijkheid, geen animatie.
 */
const NotFound = () => {
  useEffect(() => {
    document.title = "Pagina niet gevonden | AB Bouw Groep";
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f7", padding: "24px", fontFamily: "Archivo, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 560, width: "100%", background: "#fff", border: "1px solid #e7e2d9", borderRadius: 16, padding: "48px 40px", textAlign: "center", boxShadow: "0 24px 60px -32px rgba(10,22,40,0.18)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#d98c03", marginBottom: 10 }}>FOUT 404</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", color: "#0a1628", margin: "0 0 12px" }}>Deze pagina bestaat niet.</h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "#4a5568", margin: "0 0 28px" }}>
          De pagina is verplaatst of het adres klopt niet. Via onderstaande knoppen vindt u meteen de juiste weg.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 22 }}>
          <a href="/" style={{ background: "#d98c03", color: "#fff", padding: "13px 26px", borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Naar de homepage</a>
          <a href="/diensten" style={{ background: "#fff", color: "#0a1628", border: "1.5px solid #dcd6cb", padding: "13px 26px", borderRadius: 999, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Onze diensten</a>
        </div>
        <p style={{ fontSize: 14, color: "#4a5568", margin: 0 }}>
          Liever iemand aan de lijn? Bel <a href="tel:+32460207788" style={{ color: "#0a1628", fontWeight: 600 }}>+32 460 20 77 88</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
