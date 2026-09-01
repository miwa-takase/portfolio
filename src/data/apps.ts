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
  firstName: "Miwa",
  lastName: "Takase",
  role: "AI・音声・映像を軸に、フルスタックで“試作”を量産しています",
  email: "miwa.takase@gmail.com",
};

export const APPS: App[] = [
  {
    id: "reomni",
    title: "re-omni",
    tech: ["Next.js 16", "Clerk", "AWS S3", "CloudFront", "SWR"],
    overview: "AIでコメント動画の字幕ファイルを生成・多言語翻訳",
  },
  {
    id: "gentle",
    title: "ゆるやかなカーブ",
    tech: ["FastAPI", "PostgreSQL", "React", "TailwindCSS", "Zustand"],
    overview: "AIポッドキャストの生成・再生・分析を一元管理",
  },
  {
    id: "brownies",
    title: "brownies",
    tech: ["Next.js", "Clerk", "Fluent UI", "Python"],
    overview: "UIモックをAIで自動生成",
  },
  {
    id: "links",
    title: "link-parfait",
    tech: ["FastAPI", "React 19", "MySQL", "Gemini", "MUI"],
    overview: "音楽・イベント・チケットのURLを一元管理",
    wip: true,
  },
];

export const APPS_BY_ID: Record<string, App> = Object.fromEntries(
  APPS.map((a) => [a.id, a]),
);

export function canTryApp(app: App): boolean {
  return !app.wip;
}
