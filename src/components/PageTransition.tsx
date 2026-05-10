import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Smooth, clean page transition wrapper.
 * - Resets scroll instantly on route change (so the fade starts at the top)
 * - Fades + slightly lifts the new page content in via CSS
 * - Respects prefers-reduced-motion
 */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const [displayKey, setDisplayKey] = useState(pathname);
  const [stage, setStage] = useState<"in" | "out">("in");
  const pendingChildren = useRef<ReactNode>(children);
  const pendingKey = useRef<string>(pathname);
  pendingChildren.current = children;
  pendingKey.current = pathname;

  useEffect(() => {
    if (pathname === displayKey) return;
    // start fade-out
    setStage("out");
    const t = window.setTimeout(() => {
      // jump to top before the new page paints in
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setDisplayKey(pendingKey.current);
      // double rAF -> ensures starting opacity is committed before fade-in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStage("in"));
      });
    }, 220);
    return () => window.clearTimeout(t);
  }, [pathname, displayKey]);

  return (
    <div
      key={displayKey}
      className={`page-transition ${stage === "in" ? "page-transition--in" : "page-transition--out"}`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
