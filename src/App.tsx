import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import "./styles/ab-bouw.css";
// roofpro.css globaal, zoals op main (daar via de eager import van Home.tsx r.2). LpReplica/LpBadkamer
// (/totaalrenovatie, /badkamerrenovatie, /lp/badkamerrenovatie) gebruiken rp-klassen en importeren roofpro.css
// niet zelf: .rp-mob (gsm-menu), .rp-burger, .rp-fab/.rp-btn. NIET als "ongebruikt" schrappen.
// Op de BF-pagina's: 0 verschillen (div.bf in bf-ab.css zet roofpro r.651 .bf terug).
import "./styles/roofpro.css";

// LAZY-LOAD alle routes — initial bundle van 1MB -> ~150KB
// Eager-load alleen de homepage want LCP-critical (first paint).
// 11 okt 2026: "/" in de stijl van bfbouw.be (spec/bf-stijl.md). HomePc.tsx (LpReplica) en Home.tsx
// blijven staan als terugval; teruggaan is deze import en de route hieronder.
import HomeBf from "./pages/abbouw/bf/HomeBf";

// 11 okt 2026: de subpagina's in de stijl van bfbouw.be (spec/bf-stijl.md §10). De oude
// bestanden (OverOns, Diensten, Werkwijze, Contact, Construct, Ecologisch, Interieur,
// Dakwerken, Bad, Gevel, Privacy, Voorwaarden, Cookies, NotFound) blijven staan als terugval;
// teruggaan is hun lazy-import terugzetten en de route ernaar laten wijzen.
const OverBf = lazy(() => import("./pages/abbouw/bf/OverBf"));
const DienstenBf = lazy(() => import("./pages/abbouw/bf/DienstenBf"));
const WerkwijzeBf = lazy(() => import("./pages/abbouw/bf/WerkwijzeBf"));
const ContactBf = lazy(() => import("./pages/abbouw/bf/ContactBf"));
const DivisieBf = lazy(() => import("./pages/abbouw/bf/DivisieBf"));
const JuridischBf = lazy(() => import("./pages/abbouw/bf/JuridischBf"));
const NotFoundBf = lazy(() => import("./pages/abbouw/bf/NotFoundBf"));
const Realisaties = lazy(() => import("./pages/abbouw/Realisaties"));
const RealisatiesDakwerken = lazy(() => import("./pages/abbouw/realisaties/RealisatiesDakwerken"));
const RealisatiesGevel = lazy(() => import("./pages/abbouw/realisaties/RealisatiesGevel"));
const Blog = lazy(() => import("./pages/abbouw/Blog"));
const BlogPost = lazy(() => import("./pages/abbouw/BlogPost"));
const LpDakwerken = lazy(() => import("./pages/abbouw/lp/LpDakwerken"));
const LpGevel = lazy(() => import("./pages/abbouw/lp/LpGevel"));
const LpLokaal = lazy(() => import("./pages/abbouw/lp/LpLokaal"));
const LpDienst = lazy(() => import("./pages/abbouw/lp/LpDienst"));
const LpReplica = lazy(() => import("./pages/abbouw/lp/replica/LpReplica"));
const LpBadkamer = lazy(() => import("./pages/abbouw/lp/replica/LpBadkamer"));
const LpKgj = lazy(() => import("./pages/abbouw/lp/kgj/LpKgj"));
// /lp/dakwerken in de stijl van bfbouw.be (spec/bf-stijl.md §17); terugval = LpKgj (één regel hieronder terugzetten)
const LpBf = lazy(() => import("./pages/abbouw/lp/kgj/LpBf"));
// /lp/totaalrenovatie, /lp/aannemer-renovatiewerken en /lp/richtprijs-berekenen: hun eigen bestand rendert LpBf met hun
// inhoudsobject (12 okt 2026, spec §17); terugval = in dat bestand LpBf weer LpKgj maken (één regel per pagina)
const LpTotaalrenovatie = lazy(() => import("./pages/abbouw/lp/kgj/LpTotaalrenovatie"));
const LpRenovatiewerken = lazy(() => import("./pages/abbouw/lp/kgj/LpRenovatiewerken"));
const LpRichtprijs = lazy(() => import("./pages/abbouw/lp/kgj/LpRichtprijs"));
// 12 okt 2026: funnel in twee stappen in de stijl van bfbouw.be. Stap 1 = /bedankt (BedanktBf: drie keuzes, geen
// kalender), stap 2 = /afspraak en /dakinspectie (AfspraakBf: de GHL-kalender). Terugval = Bedankt.tsx en Afspraak.tsx
// (deze imports vervangen door die van ./pages/abbouw/Bedankt en ./pages/abbouw/Afspraak en de routes hieronder terugzetten)
const BedanktBf = lazy(() => import("./pages/abbouw/bf/BedanktBf"));
const AfspraakBf = lazy(() => import("./pages/abbouw/bf/AfspraakBf"));
const Status = lazy(() => import("./pages/abbouw/Status"));
const Beoordeling = lazy(() => import("./pages/abbouw/Beoordeling"));
const Review = lazy(() => import("./pages/abbouw/Review"));
const CalculatorDak = lazy(() => import("./pages/abbouw/calculator/CalculatorDak"));
const CalculatorGevel = lazy(() => import("./pages/abbouw/calculator/CalculatorGevel"));

const queryClient = new QueryClient();

/* Canonical per route. index.html levert een statische canonical naar de
   homepage; zonder deze update canonicaliseert elke organische pagina naar
   "/" (SEO-killer). LP-/lokaal-routes beheren hun eigen (soms bewust
   afwijkende) canonical en worden hier overgeslagen. */
const CanonicalUpdater = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/lp/") || pathname.startsWith("/lokaal/")) return;
    const pad = pathname === "/index" ? "/" : pathname;
    const url = `https://abgroep.be${pad === "/" ? "/" : pad.replace(/\/$/, "")}`;
    let el = document.querySelector('link[rel="canonical"]:not([hreflang])');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.setAttribute("href", url);
    const og = document.querySelector('meta[property="og:url"]');
    if (og) og.setAttribute("content", url);
  }, [pathname]);
  return null;
};

// Minimal loading state — geen spinner, gewoon achtergrond zodat layout-shift minimaal blijft
const RouteLoading = () => (
  <div style={{ minHeight: "60vh", background: "var(--bg, #faf9f7)" }} aria-hidden="true" />
);

const App = () => {
  return (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CanonicalUpdater />
        <PageTransition>
        <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<HomeBf />} />
          {/* de oude home toonde 8 reviews zonder bron (spec §3) */}
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/over" element={<OverBf />} />
          <Route path="/diensten" element={<DienstenBf />} />
          <Route path="/realisaties" element={<Navigate to="/" replace />} />
          <Route path="/realisaties/dakwerken" element={<Navigate to="/" replace />} />
          <Route path="/realisaties/gevel" element={<Navigate to="/" replace />} />
          <Route path="/werkwijze" element={<WerkwijzeBf />} />
          <Route path="/contact" element={<ContactBf />} />
          <Route path="/construct" element={<DivisieBf slug="construct" />} />
          <Route path="/ecologisch" element={<DivisieBf slug="ecologisch" />} />
          <Route path="/interieur" element={<DivisieBf slug="interieur" />} />
          <Route path="/dakwerken" element={<DivisieBf slug="dakwerken" />} />
          <Route path="/bad" element={<DivisieBf slug="bad" />} />
          <Route path="/gevel" element={<DivisieBf slug="gevel" />} />
          <Route path="/privacy" element={<JuridischBf soort="privacy" />} />
          <Route path="/voorwaarden" element={<JuridischBf soort="voorwaarden" />} />
          <Route path="/cookies" element={<JuridischBf soort="cookies" />} />
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
          {/* Alleen /totaalrenovatie en /badkamerrenovatie blijven als landingspagina
              online. De rest verwijst door naar de dienstpagina over hetzelfde
              onderwerp; NIET verwijderd, want er kan advertentieverkeer op staan en
              een betaalde klik op een 404 is weggegooid geld. Zijn de advertenties
              omgezet naar de nieuwe bestemming, dan kunnen deze regels weg. */}
          <Route path="/lp/dakwerken" element={<LpBf />} />
          <Route path="/lp/gevel" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/velux" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/gevelreiniging" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/hervoegen" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/dakisolatie" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/platdak" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/crepi" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/steenstrips" element={<Navigate to="/gevel" replace />} />
          {/* /lp/totaalrenovatie is de advertentiepagina in de vorm van
              /lp/dakwerken (26 sep 2026). /totaalrenovatie blijft de
              sitepagina op de replica-opzet. */}
          <Route path="/lp/totaalrenovatie" element={<LpTotaalrenovatie />} />
          {/* 5 okt 2026 ("de drie paginas"): de kopie voor renovatiewerken en de losse rekenaar. */}
          <Route path="/lp/aannemer-renovatiewerken" element={<LpRenovatiewerken />} />
          <Route path="/lp/richtprijs-berekenen" element={<LpRichtprijs />} />
          {/* 13 okt 2026 (Mohammed: "DE TOTAALRENOVATIE landingspagina nu aanpassen, je hebt daar niets in de nieuwe
              stijl gezet"): /totaalrenovatie toont dezelfde nieuwe pagina als /lp/totaalrenovatie (LpBf). LpReplica
              blijft in de code als terugval. */}
          <Route path="/totaalrenovatie" element={<LpTotaalrenovatie />} />
          <Route path="/lp/badkamerrenovatie" element={<LpBadkamer />} />
          <Route path="/badkamerrenovatie" element={<LpBadkamer />} />
          <Route path="/lp/tegelwerken" element={<Navigate to="/interieur" replace />} />
          <Route path="/lp/pleisterwerk" element={<Navigate to="/interieur" replace />} />
          <Route path="/lp/terrasaanleg" element={<Navigate to="/construct" replace />} />
          <Route path="/lp/oprit" element={<Navigate to="/construct" replace />} />
          <Route path="/lp/zwembad" element={<Navigate to="/bad" replace />} />
          <Route path="/lokaal/:slug" element={<Navigate to="/" replace />} />
          <Route path="/bedankt" element={<BedanktBf />} />
          <Route path="/bedankt/:dienst" element={<BedanktBf />} />
          <Route path="/afspraak" element={<AfspraakBf />} />
          <Route path="/dakinspectie" element={<AfspraakBf soort="dakinspectie" />} />
          <Route path="/status/:tel/:stap?" element={<Status />} />
          <Route path="/beoordeling/:tel/:score" element={<Beoordeling />} />
          <Route path="/review" element={<Review />} />
          <Route path="/calculator/dakwerken" element={<CalculatorDak />} />
          <Route path="/calculator/gevel" element={<CalculatorGevel />} />
          <Route path="*" element={<NotFoundBf />} />
        </Routes>
        </Suspense>
        </PageTransition>
      </BrowserRouter>
  </QueryClientProvider>
  );
};

export default App;
