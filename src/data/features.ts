// 機能カタログ（このサイトの主役 = 「機能軸」）
export type Accent = "accent" | "steel" | "teal" | "rust";
export type Status = "live" | "sample" | "soon";
export type DemoType = "live" | "widget" | "recorded" | "diagram";

export type DemoConfig = {
  type: DemoType;
  widget?: string;
  api?: string;
  note?: string;
};

export type Feature = {
  slug: string;
  no: string;
  title: string;
  en: string;
  tagline: string;
  accent: Accent;
  status: Status;
  summary: string;
  capabilities: string[];
  tech: string[];
  apps: string[];
  demo: DemoConfig;
};

export const FEATURES: Feature[] = [
  {
    slug: "transcription",
    no: "01",
    title: "文字起こし & 翻訳",
    en: "Transcribe & Translate",
    tagline: "話した言葉を、タイムコード付き字幕にして、そのまま多言語へ。",
    accent: "accent",
    status: "live",
    summary:
      "動画・音声から発話を抽出し、単語ごとのタイムスタンプ付きで文字起こし。ElevenLabs で認識し、Claude で自然な句読点と改行を補ってSRT字幕に仕上げ、続けてタイムコードと行数を保ったまま多言語へ翻訳する。文字起こしから翻訳までを一本の流れで試せる。",
    capabilities: [
      "任意の動画/音声をアップロードして実行（サーバーに保存しない）",
      "音声抽出はブラウザ内で完結し、抽出音声だけをバックエンドへ送信",
      "ElevenLabs で認識 → 話速に追従した字幕分割（タイムコード付き）",
      "行番号・タイムコードを保持したまま Claude で多言語翻訳",
    ],
    tech: [
      "ElevenLabs Scribe",
      "Claude",
      "MediaRecorder（ブラウザ内音声抽出）",
      "Cloudflare Workers",
    ],
    apps: ["reomni"],
    demo: {
      type: "live",
      widget: "pipeline",
      note: "アップロードした動画はサーバーに保存しません（ブラウザ内で音声のみ抽出し送信）。未接続時はサンプルで確認できます。",
    },
  },
  {
    slug: "llm-generation",
    no: "02",
    title: "LLM生成：自然言語 → UI",
    en: "LLM Generation",
    tagline: "自然な言葉を、そのまま構造化データと UI へ変換する。",
    accent: "accent",
    status: "live",
    summary:
      "自然言語の指示を DSL に変換し、Fluent 風の UI としてレンダリングする実験的アプリ。LLM を「文章を作る」だけでなく「構造を作る」道具として使い、フロント（Next.js App Router）と Python バックエンドを分離した構成で組んでいる。",
    capabilities: [
      "自然言語 → DSL → UI レンダリングのパイプライン（Claude）",
      "プロンプト／出力スキーマを分離した差し替え可能な設計",
      "Clerk 認証とフロント／バックエンド分離構成",
    ],
    tech: ["Claude", "Next.js", "Clerk", "Fluent UI", "Python"],
    apps: ["brownies"],
    demo: {
      type: "widget",
      widget: "nl2ui",
      note: "API接続時は実際に Claude が UI 仕様を生成します（未接続時はローカル簡易解析）。",
    },
  },
  {
    slug: "link-hub",
    no: "03",
    title: "リンク集約 & 計測",
    en: "Link Hub & Analytics",
    tagline: "散らばった配信リンクを、1ページに集めて共有する。",
    accent: "steel",
    status: "sample",
    summary:
      "複数ストリーミングサービスのリンクを1ページに集約して共有できる音楽リンクプラットフォーム。Gemini による AI 機能、GA4 クロスドメイン計測、Chrome 拡張まで含む多面的なプロダクト。",
    capabilities: [
      "複数サービスのリンクを1ページに集約・共有",
      "Gemini によるAI補助機能",
      "GA4 クロスドメイン計測",
      "Chrome 拡張によるリンク収集",
    ],
    tech: ["FastAPI", "React 19", "MySQL", "Gemini", "MUI", "GA4"],
    apps: ["links"],
    demo: { type: "widget", widget: "linkhub" },
  },
  {
    slug: "music-social",
    no: "04",
    title: "音楽サービス連携",
    en: "Music / Spotify",
    tagline: "私がいま聴いている曲を、そのまま表示する。",
    accent: "teal",
    status: "live",
    summary:
      "Spotify と連携した音楽アプリ。ここでは中核の連携を公開デモにしている——オーナー（私）が一度だけ認可すれば、以降は訪問者のログイン不要で「いま聴いている曲」をリアルタイム表示する。トークンはサーバー側で安全に更新し、読み取り専用スコープのみを使う。",
    capabilities: [
      "訪問者の認証なしで、オーナーの再生中トラックを公開表示",
      "サーバー側（Cloudflare Worker）でトークンを自動更新・短時間キャッシュ",
      "曲名・アーティスト・アートワーク・再生位置（読み取り専用）",
    ],
    tech: [
      "Spotify Web API",
      "OAuth 2.0 (Refresh Token)",
      "Cloudflare Workers",
    ],
    apps: ["spotify"],
    demo: {
      type: "widget",
      widget: "spotify",
      note: "連携画面はありません。オーナーの『今再生中』のみを表示します（読み取り専用）。",
    },
  },
  {
    slug: "episode-gen",
    no: "05",
    title: "エピソード生成（台本→音声）",
    en: "Episode Generation",
    tagline: "トピックを渡すと、台本を書いて、そのまま声にする。",
    accent: "teal",
    status: "live",
    summary:
      "セルフホスト型の音声プラットフォームの中核——番組エピソードの自動生成を実際に試せる。トピックを与えると Claude が短い台本を書き、ElevenLabs が音声化して、その場で再生できる1本のエピソードにする。",
    capabilities: [
      "トピック → Claude で台本生成 → ElevenLabs で音声合成",
      "生成した音声をその場で再生（サーバーに保存しない）",
      "PostgreSQL + SQLAlchemy 2.0 のセルフホスト基盤に組み込み",
    ],
    tech: [
      "Claude",
      "ElevenLabs",
      "Cloudflare Workers",
      "FastAPI",
      "PostgreSQL",
    ],
    apps: ["gentle"],
    demo: {
      type: "live",
      widget: "episode",
      note: "台本と音声はその場で生成し、サーバーには保存しません。未接続時は案内を表示します。",
    },
  },
];

export const FEATURES_BY_SLUG: Record<string, Feature> = Object.fromEntries(
  FEATURES.map((f) => [f.slug, f]),
);

export const ACCENT_TEXT: Record<Accent, string> = {
  accent: "text-accent",
  steel: "text-steel",
  teal: "text-teal",
  rust: "text-rust",
};
export const ACCENT_BG: Record<Accent, string> = {
  accent: "bg-accent",
  steel: "bg-steel",
  teal: "bg-teal",
  rust: "bg-rust",
};

export function statusShort(s: Status): string {
  return s === "live" ? "実デモ" : s === "sample" ? "サンプル" : "準備中";
}
