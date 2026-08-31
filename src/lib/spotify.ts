// Spotify 認可コードフロー（PKCE）— クライアントシークレット不要。
import { SPOTIFY_CLIENT_ID, spotifyRedirectUri } from "../config";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SCOPE = "user-read-currently-playing user-read-playback-state";
const LS_TOKEN = "spotify_token";
const SS_VERIFIER = "spotify_pkce_verifier";

export type Token = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
};

export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artists: string;
  album: string;
  albumArt?: string;
  progressMs: number;
  durationMs: number;
  url?: string;
};

function b64url(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomVerifier(): string {
  const arr = new Uint8Array(64);
  crypto.getRandomValues(arr);
  return b64url(arr.buffer);
}

async function challenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return b64url(digest);
}

export function isConfigured(): boolean {
  return SPOTIFY_CLIENT_ID.length > 0;
}

export function getStoredToken(): Token | null {
  try {
    const raw = localStorage.getItem(LS_TOKEN);
    return raw ? (JSON.parse(raw) as Token) : null;
  } catch {
    return null;
  }
}

function storeToken(t: Token) {
  localStorage.setItem(LS_TOKEN, JSON.stringify(t));
}

export function logout() {
  localStorage.removeItem(LS_TOKEN);
}

export async function beginAuth(): Promise<void> {
  const verifier = randomVerifier();
  sessionStorage.setItem(SS_VERIFIER, verifier);
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: spotifyRedirectUri(),
    code_challenge_method: "S256",
    code_challenge: await challenge(verifier),
    scope: SCOPE,
  });
  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

export async function handleRedirect(): Promise<boolean> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const verifier = sessionStorage.getItem(SS_VERIFIER);
  if (!code || !verifier) return false;

  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: spotifyRedirectUri(),
    code_verifier: verifier,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  sessionStorage.removeItem(SS_VERIFIER);
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  if (!res.ok) return false;
  const j = await res.json();
  storeToken({
    access_token: j.access_token,
    refresh_token: j.refresh_token,
    expires_at: Date.now() + (j.expires_in ?? 3600) * 1000,
  });
  return true;
}

async function refresh(token: Token): Promise<Token | null> {
  if (!token.refresh_token) return null;
  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return null;
  const j = await res.json();
  const next: Token = {
    access_token: j.access_token,
    refresh_token: j.refresh_token ?? token.refresh_token,
    expires_at: Date.now() + (j.expires_in ?? 3600) * 1000,
  };
  storeToken(next);
  return next;
}

async function validAccessToken(): Promise<string | null> {
  let token = getStoredToken();
  if (!token) return null;
  if (Date.now() > token.expires_at - 10_000) {
    token = await refresh(token);
    if (!token) {
      logout();
      return null;
    }
  }
  return token.access_token;
}

export async function fetchNowPlaying(): Promise<NowPlaying | null> {
  const access = await validAccessToken();
  if (!access) throw new Error("not_authenticated");
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers: { Authorization: `Bearer ${access}` } },
  );
  if (res.status === 204) return null;
  if (res.status === 401) {
    logout();
    throw new Error("not_authenticated");
  }
  if (!res.ok) throw new Error(`spotify_error_${res.status}`);
  const j = await res.json();
  const item = j.item;
  if (!item) return null;
  return {
    isPlaying: Boolean(j.is_playing),
    title: item.name,
    artists: (item.artists ?? [])
      .map((a: { name: string }) => a.name)
      .join(", "),
    album: item.album?.name ?? "",
    albumArt: item.album?.images?.[0]?.url,
    progressMs: j.progress_ms ?? 0,
    durationMs: item.duration_ms ?? 0,
    url: item.external_urls?.spotify,
  };
}
