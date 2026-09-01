// 外部連携の設定
// ビルド時に Vite が VITE_ 変数を埋め込みます
const DEFAULT_SPOTIFY_CLIENT_ID = "43414053678e4e02896b3ead081fd1d7";
const DEFAULT_API_BASE = "https://portfolio.judy-and.workers.dev";

export const SPOTIFY_CLIENT_ID: string =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? DEFAULT_SPOTIFY_CLIENT_ID;

export const TURNSTILE_SITEKEY: string =
  import.meta.env.VITE_TURNSTILE_SITEKEY ?? "";

export const API_BASE: string = (
  import.meta.env.VITE_API_BASE ??
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8787"
    : DEFAULT_API_BASE)
).replace(/\/$/, "");

export function spotifyRedirectUri(): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}works/spotify/music-social`;
}
