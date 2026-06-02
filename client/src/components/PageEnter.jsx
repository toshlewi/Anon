import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function PageEnter({ children, showLogo = false }) {
  const location = useLocation();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <div className={entered ? "page-enter" : "opacity-0"}>
      {showLogo && (
        <div className="flex justify-center pt-2 pb-1 md:hidden" key={location.pathname}>
          <Logo size="lg" animation="bounce-spin" />
        </div>
      )}
      {children}
    </div>
  );
}
