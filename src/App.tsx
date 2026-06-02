import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLenis } from "@/hooks/useLenis";
import "lenis/dist/lenis.css";
import "./styles/ab-bouw.css";

// LAZY-LOAD alle routes — initial bundle van 1MB -> ~150KB
// Eager-load alleen Home want LCP-critical (first paint)
import Home from "./pages/abbouw/Home";

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
const Bedankt = lazy(() => import("./pages/abbouw/Bedankt"));
const CalculatorDak = lazy(() => import("./pages/abbouw/calculator/CalculatorDak"));
const CalculatorGevel = lazy(() => import("./pages/abbouw/calculator/CalculatorGevel"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

// Minimal loading state — geen spinner, gewoon achtergrond zodat layout-shift minimaal blijft
const RouteLoading = () => (
  <div style={{ minHeight: "60vh", background: "var(--bg, #faf9f7)" }} aria-hidden="true" />
);

const App = () => {
  useLenis();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition>
        <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index" element={<Home />} />
          <Route path="/over" element={<OverOns />} />
          <Route path="/diensten" element={<Diensten />} />
          <Route path="/realisaties" element={<Realisaties />} />
          <Route path="/realisaties/dakwerken" element={<RealisatiesDakwerken />} />
          <Route path="/realisaties/gevel" element={<RealisatiesGevel />} />
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
          <Route path="/lp/dakwerken" element={<LpDakwerken />} />
          <Route path="/lp/gevel" element={<LpGevel />} />
          <Route path="/lp/velux" element={<LpDienst slug="velux" />} />
          <Route path="/lp/gevelreiniging" element={<LpDienst slug="gevelreiniging" />} />
          <Route path="/lp/hervoegen" element={<LpDienst slug="hervoegen" />} />
          <Route path="/lp/dakisolatie" element={<LpDienst slug="dakisolatie" />} />
          <Route path="/lp/platdak" element={<LpDienst slug="platdak" />} />
          <Route path="/lp/crepi" element={<LpDienst slug="crepi" />} />
          <Route path="/lp/steenstrips" element={<LpDienst slug="steenstrips" />} />
          <Route path="/lokaal/:slug" element={<LpLokaal />} />
          <Route path="/bedankt" element={<Bedankt />} />
          <Route path="/calculator/dakwerken" element={<CalculatorDak />} />
          <Route path="/calculator/gevel" element={<CalculatorGevel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
