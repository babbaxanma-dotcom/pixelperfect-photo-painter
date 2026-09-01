import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import "./styles/ab-bouw.css";

// LAZY-LOAD alle routes — initial bundle van 1MB -> ~150KB
// Eager-load alleen Home want LCP-critical (first paint)
import Home from "./pages/abbouw/Home";
import HomePc from "./pages/abbouw/HomePc";

const OverOns = lazy(() => import("./pages/abbouw/OverOns"));
const Diensten = lazy(() => import("./pages/abbouw/Diensten"));
const Realisaties = lazy(() => import("./pages/abbouw/Realisaties"));
const RealisatiesDakwerken = lazy(() => import("./pages/abbouw/realisaties/RealisatiesDakwerken"));
const RealisatiesGevel = lazy(() => import("./pages/abbouw/realisaties/RealisatiesGevel"));
const Werkwijze = lazy(() => import("./pages/abbouw/Werkwijze"));
const Contact = lazy(() => import("./pages/abbouw/Contact"));
const Construct = lazy(() => import("./pages/abbouw/Construct"));
const Ecologisch = lazy(() => import("./pages/abbouw/Ecologisch"));
const Interieur = lazy(() => import("./pages/abbouw/Interieur"));
const Dakwerken = lazy(() => import("./pages/abbouw/Dakwerken"));
const Bad = lazy(() => import("./pages/abbouw/Bad"));
const Gevel = lazy(() => import("./pages/abbouw/Gevel"));
const Privacy = lazy(() => import("./pages/abbouw/Privacy"));
const Voorwaarden = lazy(() => import("./pages/abbouw/Voorwaarden"));
const Cookies = lazy(() => import("./pages/abbouw/Cookies"));
const Blog = lazy(() => import("./pages/abbouw/Blog"));
const BlogPost = lazy(() => import("./pages/abbouw/BlogPost"));
const LpDakwerken = lazy(() => import("./pages/abbouw/lp/LpDakwerken"));
const LpGevel = lazy(() => import("./pages/abbouw/lp/LpGevel"));
const LpLokaal = lazy(() => import("./pages/abbouw/lp/LpLokaal"));
const LpDienst = lazy(() => import("./pages/abbouw/lp/LpDienst"));
const LpReplica = lazy(() => import("./pages/abbouw/lp/replica/LpReplica"));
const LpBadkamer = lazy(() => import("./pages/abbouw/lp/replica/LpBadkamer"));
const Bedankt = lazy(() => import("./pages/abbouw/Bedankt"));
const CalculatorDak = lazy(() => import("./pages/abbouw/calculator/CalculatorDak"));
const CalculatorGevel = lazy(() => import("./pages/abbouw/calculator/CalculatorGevel"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

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
          <Route path="/" element={<HomePc />} />
          <Route path="/index" element={<Home />} />
          <Route path="/over" element={<OverOns />} />
          <Route path="/diensten" element={<Diensten />} />
          <Route path="/realisaties" element={<Navigate to="/" replace />} />
          <Route path="/realisaties/dakwerken" element={<Navigate to="/" replace />} />
          <Route path="/realisaties/gevel" element={<Navigate to="/" replace />} />
          <Route path="/werkwijze" element={<Werkwijze />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/construct" element={<Construct />} />
          <Route path="/ecologisch" element={<Ecologisch />} />
          <Route path="/interieur" element={<Interieur />} />
          <Route path="/dakwerken" element={<Dakwerken />} />
          <Route path="/bad" element={<Bad />} />
          <Route path="/gevel" element={<Gevel />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/voorwaarden" element={<Voorwaarden />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* Alleen /totaalrenovatie en /badkamerrenovatie blijven als landingspagina
              online. De rest verwijst door naar de dienstpagina over hetzelfde
              onderwerp; NIET verwijderd, want er kan advertentieverkeer op staan en
              een betaalde klik op een 404 is weggegooid geld. Zijn de advertenties
              omgezet naar de nieuwe bestemming, dan kunnen deze regels weg. */}
          <Route path="/lp/dakwerken" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/gevel" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/velux" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/gevelreiniging" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/hervoegen" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/dakisolatie" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/platdak" element={<Navigate to="/dakwerken" replace />} />
          <Route path="/lp/crepi" element={<Navigate to="/gevel" replace />} />
          <Route path="/lp/steenstrips" element={<Navigate to="/gevel" replace />} />
          {/* Totaalrenovatie draait op de replica-opzet; de andere dertien
              pagina's blijven op LpDienst. */}
          <Route path="/lp/totaalrenovatie" element={<LpReplica />} />
          <Route path="/totaalrenovatie" element={<LpReplica />} />
          <Route path="/lp/badkamerrenovatie" element={<LpBadkamer />} />
          <Route path="/badkamerrenovatie" element={<LpBadkamer />} />
          <Route path="/lp/tegelwerken" element={<Navigate to="/interieur" replace />} />
          <Route path="/lp/pleisterwerk" element={<Navigate to="/interieur" replace />} />
          <Route path="/lp/terrasaanleg" element={<Navigate to="/construct" replace />} />
          <Route path="/lp/oprit" element={<Navigate to="/construct" replace />} />
          <Route path="/lp/zwembad" element={<Navigate to="/bad" replace />} />
          <Route path="/lokaal/:slug" element={<Navigate to="/" replace />} />
          <Route path="/bedankt" element={<Bedankt />} />
          <Route path="/calculator/dakwerken" element={<CalculatorDak />} />
          <Route path="/calculator/gevel" element={<CalculatorGevel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </PageTransition>
      </BrowserRouter>
  </QueryClientProvider>
  );
};

export default App;
