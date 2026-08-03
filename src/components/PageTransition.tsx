import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route-wrapper zonder overgangsanimatie: nieuwe pagina rendert direct,
 * scroll springt instant naar boven bij een route-wissel (behalve bij een
 * #anchor in de URL — die wordt door de pagina zelf afgehandeld).
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return <>{children}</>;
};

export default PageTransition;
