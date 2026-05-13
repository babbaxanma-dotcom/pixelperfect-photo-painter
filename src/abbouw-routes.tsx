import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';

// Lazy-loaded routes — splitst de monolitische ~800KB JS-bundle in per-route
// chunks. Eerste bezoek aan / laadt enkel Home + shared chunks (≈250KB),
// volgende pages on-demand. Vercel CDN cached ze daarna.
const Home = lazy(() => import('./pages/abbouw/Home'));
const OverOns = lazy(() => import('./pages/abbouw/OverOns'));
const Diensten = lazy(() => import('./pages/abbouw/Diensten'));
const Realisaties = lazy(() => import('./pages/abbouw/Realisaties'));
const Werkwijze = lazy(() => import('./pages/abbouw/Werkwijze'));
const Contact = lazy(() => import('./pages/abbouw/Contact'));
const Construct = lazy(() => import('./pages/abbouw/Construct'));
const Ecologisch = lazy(() => import('./pages/abbouw/Ecologisch'));
const Interieur = lazy(() => import('./pages/abbouw/Interieur'));
const Dakwerken = lazy(() => import('./pages/abbouw/Dakwerken'));
const Bad = lazy(() => import('./pages/abbouw/Bad'));
const Gevel = lazy(() => import('./pages/abbouw/Gevel'));
const Privacy = lazy(() => import('./pages/abbouw/Privacy'));
const Voorwaarden = lazy(() => import('./pages/abbouw/Voorwaarden'));
const Cookies = lazy(() => import('./pages/abbouw/Cookies'));
const Blog = lazy(() => import('./pages/abbouw/Blog'));
const BlogPost = lazy(() => import('./pages/abbouw/BlogPost'));

// Subtiele loading-state — geen flits, gewoon een rustige spinner-vrije fade.
const Fallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      border: '3px solid rgba(15,17,21,0.10)',
      borderTopColor: 'var(--accent, #d98c03)',
      animation: 'ab-spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes ab-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const wrap = (El: React.ComponentType) => (
  <Suspense fallback={<Fallback />}><El /></Suspense>
);

export const abBouwRoutes = (
  <>
  <Route path="/" element={wrap(Home)} />
  <Route path="/over" element={wrap(OverOns)} />
  <Route path="/diensten" element={wrap(Diensten)} />
  <Route path="/realisaties" element={wrap(Realisaties)} />
  <Route path="/werkwijze" element={wrap(Werkwijze)} />
  <Route path="/contact" element={wrap(Contact)} />
  <Route path="/construct" element={wrap(Construct)} />
  <Route path="/ecologisch" element={wrap(Ecologisch)} />
  <Route path="/interieur" element={wrap(Interieur)} />
  <Route path="/dakwerken" element={wrap(Dakwerken)} />
  <Route path="/bad" element={wrap(Bad)} />
  <Route path="/gevel" element={wrap(Gevel)} />
  <Route path="/blog" element={wrap(Blog)} />
  <Route path="/blog/:slug" element={wrap(BlogPost)} />
  <Route path="/privacy" element={wrap(Privacy)} />
  <Route path="/voorwaarden" element={wrap(Voorwaarden)} />
  <Route path="/cookies" element={wrap(Cookies)} />
  </>
);
