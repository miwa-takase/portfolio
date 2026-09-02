// 技術スタック（Works ページ上部で表示）
// 件数は Home の統計でも参照
export const SKILLS: Array<{ h: string; items: string[] }> = [
  {
    h: "フロントエンド",
    items: ["React", "Next.js", "TypeScript", "MUI / Fluent UI", "Tailwind"],
  },
  {
    h: "バックエンド",
    items: ["FastAPI / Python", "Clerk / OAuth 認証", "SQLAlchemy 2.0"],
  },
  {
    h: "クラウド / インフラ",
    items: ["AWS", "MySQL", "PostgreSQL", "Docker"],
  },
  {
    h: "AI / 連携",
    items: ["Claude", "Gemini", "ElevenLabs", "Spotify API"],
  },
];

export const SKILL_COUNT = SKILLS.reduce((n, s) => n + s.items.length, 0);
