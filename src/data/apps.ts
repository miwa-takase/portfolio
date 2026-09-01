// アプリカタログ（機能ページから「実装したアプリ」として参照）
export type App = {
  id: string;
  title: string;
  tech: string[];
  overview?: string;
  media?: {
    screenshot?: string;
    capture?: string;
    alt?: string;
  };
  wip?: boolean;
};

export const OWNER = {
  name: "Miwa Takase",
  role: "AI・音声・映像を軸に、フルスタックで“試作”を量産しています",
  email: "miwa.takase@gmail.com",
};

export const APPS: App[] = [
  {
    id: "reomni",
    title: "reomni – 文字起こし & 翻訳管理",
    tech: ["Next.js 16", "Clerk", "AWS S3", "CloudFront", "SWR"],
  },
  {
    id: "brownies",
    title: "brownies",
    tech: ["Next.js", "Clerk", "Fluent UI", "Python"],
  },
  {
    id: "links",
    title: "Link-parfait",
    tech: ["FastAPI", "React 19", "MySQL", "Gemini", "MUI"],
  },
  {
    id: "gentle",
    title: "ゆるやかなカーブ",
    tech: ["FastAPI", "PostgreSQL", "React", "TailwindCSS", "Zustand"],
  },
];

export const APPS_BY_ID: Record<string, App> = Object.fromEntries(
  APPS.map((a) => [a.id, a]),
);
