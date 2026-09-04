// アプリカタログ（機能ページから「実装したアプリ」として参照）

// Media パネルのスライド1枚分（画像 / 動画 / 音声）
export type MediaSlide = {
  type: "image" | "video" | "audio";
  src: string;
  alt?: string;
  /** 動画・音声のサムネイル画像（音声は背景として表示） */
  poster?: string;
  /** 音声スライドに表示するタイトル */
  label?: string;
};

export type App = {
  id: string;
  title: string;
  tech: string[];
  /** 概要文：1要素＝1行として <br /> 区切りで表示する */
  overview?: string[];
  url?: string;
  media?: {
    /** スライド表示するメディア（1枚ずつ表示） */
    slides?: MediaSlide[];
    screenshot?: string;
    capture?: string;
    alt?: string;
  };
  wip?: boolean;
};

export const OWNER = {
  name: "Miwa Takase",
  email: "miwa.takase@gmail.com",
};

export const APPS: App[] = [
  {
    id: "reomni",
    title: "re-omni",
    tech: ["Next.js 16", "Clerk", "AWS S3", "CloudFront", "SWR"],
    overview: [
      "動画の字幕ファイルをAIで生成・多言語翻訳",
      "コメント動画の文字起こしを支援",
    ],
    url: "https://reomni.proto.edgetech.jp",
    media: {
      slides: [
        {
          type: "video",
          src: "/media/reomni-capture-1.mp4",
          poster: "/media/reomni-capture-1-poster.jpg",
          alt: "操作キャプチャ",
        },
        {
          type: "video",
          src: "/media/reomni-capture-2.mp4",
          poster: "/media/reomni-capture-2-poster.jpg",
          alt: "操作キャプチャ",
        },
      ],
    },
  },
  {
    id: "brownies",
    title: "brownies",
    tech: ["Next.js", "Clerk", "Fluent UI", "Python"],
    overview: [
      "ExcelやスクショからUIモックをAIで生成",
      "ExcelやPNGで出力し、要件定義・実装を支援",
    ],
    url: "https://brownies.proto.edgetech.jp",
    media: {
      slides: [
        {
          type: "video",
          src: "/media/brownies-capture.mp4",
          poster: "/media/brownies-capture-poster.jpg",
          alt: "操作キャプチャ",
        },
        {
          type: "image",
          src: "/media/brownies-mock-lead.png",
          alt: "生成したUIモック（リード登録フォーム）",
        },
      ],
    },
  },
  {
    id: "gentle",
    title: "ゆるやかなカーブ",
    tech: ["FastAPI", "PostgreSQL", "React", "TailwindCSS"],
    overview: [
      "ポッドキャストの台本作成・エピソード生成・分析までAIで一元化",
      "定期的なニュースの収集業務などを楽しく支援",
    ],
    url: "https://gentle-curve.proto.edgetech.jp",
    media: {
      slides: [
        {
          type: "audio",
          src: "/media/gentle-episode-sample.mp3",
          label:
            "AIで [King Gnu] のSNSバズ投稿を週次集計 → 台本作成 → 音声生成",
        },
      ],
    },
  },
  {
    id: "links",
    title: "link-parfait",
    tech: ["FastAPI", "React 19", "MySQL", "Gemini", "MUI"],
    overview: [
      "音楽・イベント・チケットの公開URLを1ページで一元管理",
      "マーケティング材料の収集などを支援",
    ],
    wip: true,
  },
];

export const APPS_BY_ID: Record<string, App> = Object.fromEntries(
  APPS.map((a) => [a.id, a]),
);

export function canTryApp(app: App): boolean {
  return !app.wip;
}

// 概要文の行一覧（未入力ならプレースホルダ1行）
export function overviewLines(app: App): string[] {
  return app.overview?.length ? app.overview : ["概要文が未入力です"];
}

// Media パネルに表示するスライド一覧
// （slides 未指定なら従来の screenshot / capture から組み立てる）
export function appSlides(app: App): MediaSlide[] {
  const media = app.media;
  if (!media) return [];
  if (media.slides?.length) return media.slides;

  const slides: MediaSlide[] = [];
  if (media.screenshot)
    slides.push({ type: "image", src: media.screenshot, alt: media.alt });
  if (media.capture)
    slides.push({ type: "video", src: media.capture, alt: media.alt });
  return slides;
}

// WIP のアプリは URL を入力しても公開しない
export function publicUrl(app: App): string | undefined {
  return app.wip ? undefined : app.url;
}
