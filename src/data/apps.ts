// アプリカタログ（機能ページから「実装したアプリ」として参照）
export type App = {
  id: string;
  dir: string;
  title: string;
  year: string;
  tech: string[];
  wip?: boolean;
};

export const OWNER = {
  name: "Miwa Takase",
  role: "個人開発者。AI・音声・映像を軸に、フルスタックで“試作”を量産しています。",
  email: "miwa.takase@gmail.com",
};

export const APPS: App[] = [
  {
    id: "reomni",
    dir: "works_reomni",
    title: "reomni – 文字起こし & 翻訳管理",
    year: "2026",
    tech: ["Next.js 16", "Clerk", "AWS S3", "CloudFront", "SWR"],
  },
  {
    id: "brownies",
    dir: "works_brownies",
    title: "自然言語 → DSL レンダラー",
    year: "2026",
    tech: ["Next.js", "Clerk", "Fluent UI", "Python"],
  },
  {
    id: "links",
    dir: "works_links",
    title: "Link-parfait",
    year: "2026",
    tech: ["FastAPI", "React 19", "MySQL", "Gemini", "MUI"],
  },
  {
    id: "spotify",
    dir: "works_spotify",
    title: "Spotify Social App",
    year: "2025",
    tech: ["Spotify API", "React", "FastAPI"],
    wip: true,
  },
  {
    id: "gentle",
    dir: "works_gentle",
    title: "ゆるやかなカーブ",
    year: "2026",
    tech: ["FastAPI", "PostgreSQL", "React", "TailwindCSS", "Zustand"],
  },
];

export const APPS_BY_ID: Record<string, App> = Object.fromEntries(
  APPS.map((a) => [a.id, a]),
);
