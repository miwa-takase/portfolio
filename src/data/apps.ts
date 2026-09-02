// アプリカタログ（機能ページから「実装したアプリ」として参照）
export type App = {
  id: string;
  title: string;
  tech: string[];
  overview?: string;
  url?: string;
  media?: {
    screenshot?: string;
    capture?: string;
    alt?: string;
  };
  wip?: boolean;
};

export const OWNER = {
  name: "Miwa Takase",
  role: "AI・音声・映像を軸に、フルスタックで “試作” を開発中",
  email: "miwa.takase@gmail.com",
};

export const APPS: App[] = [
  {
    id: "reomni",
    title: "re-omni",
    tech: ["Next.js 16", "Clerk", "AWS S3", "CloudFront", "SWR"],
    overview: "AIでコメント動画の字幕ファイルを生成・多言語翻訳",
    url: "https://reomni.proto.edgetech.jp",
  },
  {
    id: "gentle",
    title: "ゆるやかなカーブ",
    tech: ["FastAPI", "PostgreSQL", "React", "TailwindCSS", "Zustand"],
    overview: "AIポッドキャストの生成・再生・分析を一元管理",
    url: "https://gentle-curve.proto.edgetech.jp",
  },
  {
    id: "brownies",
    title: "brownies",
    tech: ["Next.js", "Clerk", "Fluent UI", "Python"],
    overview: "UIモックをAIで自動生成",
    url: "https://brownies.proto.edgetech.jp",
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

// WIP のアプリは URL を入力しても公開しない
export function publicUrl(app: App): string | undefined {
  return app.wip ? undefined : app.url;
}
