/**
 * LpLokaal — wrapper voor lokale SEO landingspagina's.
 * URL: /lokaal/:slug   bv. /lokaal/dakwerker-mechelen of /lokaal/gevelrenovatie-lier
 *
 * Rendert exact dezelfde pagina als /lp/dakwerken of /lp/gevel, met enkel de
 * stad-specifieke velden geswapt (title, meta, canonical, schema, hero-subline).
 */
import { useParams, Navigate } from 'react-router-dom';
import { GEMEENTES } from '@/data/gemeentes';
import LpDakwerken from './LpDakwerken';
import LpGevel from './LpGevel';

export default function LpLokaal() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/" replace />;

  let service: 'dakwerker' | 'gevelrenovatie' | null = null;
  let gemSlug = '';
  if (slug.startsWith('dakwerker-')) {
    service = 'dakwerker';
    gemSlug = slug.slice('dakwerker-'.length);
  } else if (slug.startsWith('gevelrenovatie-')) {
    service = 'gevelrenovatie';
    gemSlug = slug.slice('gevelrenovatie-'.length);
  }

  const local = gemSlug ? GEMEENTES[gemSlug] : undefined;
  if (!service || !local) return <Navigate to="/" replace />;

  if (service === 'dakwerker') return <LpDakwerken local={local} />;
  return <LpGevel local={local} />;
}
