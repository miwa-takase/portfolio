import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages（プロジェクトサイト）配信のため base を /portfolio/ に固定。
// ローカルは常に http://127.0.0.1:5173/portfolio/ で開く
//（Spotify の redirect_uri は http の場合 127.0.0.1 のみ許可のため）。
export default defineConfig({
  base: "/portfolio/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    open: true, // 起動時に http://127.0.0.1:5173/portfolio/ を自動で開く
  },
  preview: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
