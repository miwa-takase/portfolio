import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PageMenu from "./components/PageMenu";
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import AppWork from "./pages/AppWork";
import Feature from "./pages/Feature";
import Music from "./pages/Music";
import Mail from "./pages/Mail";
import Stack from "./pages/Stack";
import NotFound from "./pages/NotFound";
import {
  DESIGN_MODE_STORAGE_KEY,
  DESIGN_MODE_VERSION,
  DESIGN_MODE_VERSION_KEY,
  DesignMode,
} from "./lib/designMode";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const designMode: DesignMode = "design1";
  const shellClass =
    designMode === "design1"
      ? "site-shell design-flow"
      : "site-shell design-chaos";

  useEffect(() => {
    window.localStorage.setItem(DESIGN_MODE_STORAGE_KEY, designMode);
    window.localStorage.setItem(DESIGN_MODE_VERSION_KEY, DESIGN_MODE_VERSION);
  }, [designMode]);

  return (
    <div className={shellClass}>
      <ScrollManager />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/contact" element={<Mail />} />
          <Route path="/about" element={<About />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:appId" element={<AppWork />} />
          <Route path="/works/:appId/:slug" element={<Feature />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <PageMenu />
    </div>
  );
}
