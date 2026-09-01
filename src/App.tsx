import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import AppWork from "./pages/AppWork";
import Feature from "./pages/Feature";
import {
  DESIGN_MODE_STORAGE_KEY,
  DESIGN_MODE_VERSION,
  DESIGN_MODE_VERSION_KEY,
  DesignMode,
  readDesignMode,
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
  const [designMode, setDesignMode] = useState<DesignMode>(readDesignMode);

  useEffect(() => {
    window.localStorage.setItem(DESIGN_MODE_STORAGE_KEY, designMode);
    window.localStorage.setItem(DESIGN_MODE_VERSION_KEY, DESIGN_MODE_VERSION);
  }, [designMode]);

  return (
    <div
      className={`site-shell ${designMode === "design1" ? "design-flow" : ""}`}
    >
      <ScrollManager />
      <TopBar designMode={designMode} onDesignModeChange={setDesignMode} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:appId" element={<AppWork />} />
          <Route path="/works/:appId/:slug" element={<Feature />} />
          <Route path="*" element={<Works />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
