import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages（プロジェクトサイト）配信のため base を /works-portfolio/ に固定。
export default defineConfig({
  base: "/works-portfolio/",
  plugins: [react()],
});
