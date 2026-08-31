// AI系バックエンド（Cloudflare Worker）クライアント。
import { API_BASE } from "../config";
import { getTurnstileToken } from "./turnstile";

export type Seg = { start: number; end: number; text: string };
export type UiField = { label: string; type: string };
export type UiSpec = {
  type: string;
  fields: UiField[];
  submit?: { label: string };
};

export function hasApi(): boolean {
  return API_BASE.length > 0;
}

async function post<T>(
  path: string,
  body: BodyInit,
  isForm: boolean,
): Promise<T> {
  const token = await getTurnstileToken();
  const headers: Record<string, string> = {};
  if (token) headers["X-Turnstile-Token"] = token;
  if (!isForm) headers["content-type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body,
  });
  if (!res.ok) {
    let msg = `api_${res.status}`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export function apiTranscribe(
  audio: Blob,
): Promise<{ segments: Seg[]; srt: string }> {
  const fd = new FormData();
  fd.append("audio", audio, "audio.webm");
  return post("/transcribe", fd, true);
}

export function apiTranslate(
  segments: Seg[],
  targetLang: string,
): Promise<{ segments: Seg[]; srt: string }> {
  return post("/translate", JSON.stringify({ segments, targetLang }), false);
}

export function apiNl2ui(prompt: string): Promise<{ spec: UiSpec }> {
  return post("/nl2ui", JSON.stringify({ prompt }), false);
}

export function apiEpisode(topic: string): Promise<{
  topic: string;
  script: string;
  audioBase64: string;
  mime: string;
}> {
  return post("/episode", JSON.stringify({ topic }), false);
}
