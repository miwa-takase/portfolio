import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import AppWork from "./pages/AppWork";
import Feature from "./pages/Feature";

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
  return (
    <>
      <ScrollManager />
      <TopBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/apps/:appId" element={<AppWork />} />
          <Route path="/works/:slug" element={<Feature />} />
          <Route path="*" element={<Works />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
