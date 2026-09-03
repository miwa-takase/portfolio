// 技術スタック（Works ページ上部で表示）
// 件数は Home の統計でも参照
export const SKILLS: Array<{ h: string; items: string[] }> = [
  {
    h: "Front-end",
    items: [
      "React (Next.js)",
      "Vue.js",
      "TypeScript",
      "MUI",
      "Fluent UI",
      "Tailwind",
    ],
  },
  {
    h: "Server-end",
    items: [
      "Python (FastAPI, Django, Flask)",
      "SQLAlchemy 2.0",
      "PHP (Laravel, CakePHP)",
      "Ruby (Rails)",
    ],
  },
  {
    h: "Cloud / Infrastructure",
    items: ["AWS", "MySQL", "PostgreSQL", "Docker"],
  },
  {
    h: "AI / LLM",
    items: ["Claude", "Gemini", "ElevenLabs"],
  },
  {
    h: "Others",
    items: ["Clerk / OAuth", "Spotify API"],
  },
  {
    h: "Certifications",
    items: [
      "基本情報技術者試験 (2024/09)",
      "PHP8 技術者認定初級試験 (2024/12)",
      "AWS Solution Architect - Accociate (2026/??)",
    ],
  },
];

export const SKILL_COUNT = SKILLS.reduce((n, s) => n + s.items.length, 0);
