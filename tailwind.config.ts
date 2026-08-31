import type { Config } from "tailwindcss";

// カラートークンは意味ベース。旧 --gold（実体は青）は accent に改名。
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0e0d0b", 2: "#16140f" },
        panel: { DEFAULT: "#1c1a14", 2: "#211e17" },
        line: { DEFAULT: "#322e24", soft: "#262319" },
        paper: { DEFAULT: "#ece5d6", dim: "#b7ae9b" },
        muted: "#8a836f",
        accent: { DEFAULT: "#4f9dde", soft: "#93c6f2" },
        steel: "#6f97b3",
        teal: "#7fb0a3",
        rust: "#c66a3a",
      },
      fontFamily: {
        serif: ['"Zen Old Mincho"', '"Hiragino Mincho ProN"', "serif"],
        sans: ['"Zen Kaku Gothic New"', '"Hiragino Sans"', "sans-serif"],
      },
      maxWidth: { content: "1180px" },
    },
  },
  plugins: [],
} satisfies Config;
