import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";

function LandingLayout({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let animationFrameId;

    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const targetId = hash.slice(1);
    animationFrameId = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [pathname, hash]);

  return (
    <div className="landing-shell min-h-screen overflow-x-clip bg-white text-slate-900">
      <LandingHeader />
      {children}
      <LandingFooter />
    </div>
  );
}

export default LandingLayout;
