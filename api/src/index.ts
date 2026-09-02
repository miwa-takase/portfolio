// works-portfolio-api — Cloudflare Worker（薄いプロキシ）
// /transcribe /translate /nl2ui /episode
// 保護: Turnstile + IP別/日レート制限 + サイズ上限
// 動画は受け取らず「抽出済み音声」のみ
// アップロード/生成物は保存しない

export interface Env {
  RATE_LIMIT: KVNamespace;
  ALLOWED_ORIGINS: string;
  DAILY_LIMIT: string;
  MAX_AUDIO_BYTES: string;
  CLAUDE_MODEL: string;
  ELEVEN_VOICE_ID: string;
  ELEVENLABS_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  TURNSTILE_SECRET: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
}

type Word = { text: string; start: number; end: number; type?: string };
type Segment = { start: number; end: number; text: string };

const MAX_CHARS_PER_LINE = 42;
const PAUSE_SPLIT = 0.7;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get("Origin") ?? "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    const url = new URL(req.url);
    // 公開の「今再生中」（オーナーのトークンで取得・Turnstile/レート制限は不要）
    if (url.pathname === "/now-playing") {
      return await handleNowPlaying(env, headers);
    }
    if (req.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, headers);
    }

    // ここから下は例外を必ず捕捉して CORS 付き JSON で返す
    // （try の外で throw すると Cloudflare の 1101 になり CORS ヘッダが付かず、
    //   ブラウザ側では "failed to fetch / CORS" に見えてしまうため）
    try {
      const ip = req.headers.get("CF-Connecting-IP") ?? "anon";
      const ok = await verifyTurnstile(
        env,
        req.headers.get("X-Turnstile-Token"),
        ip,
      );
      if (!ok) return json({ error: "turnstile_failed" }, 403, headers);

      const limited = await rateLimit(env, ip);
      if (limited) return json({ error: "rate_limited" }, 429, headers);

      switch (url.pathname) {
        case "/transcribe":
          return await handleTranscribe(req, env, headers);
        case "/translate":
          return await handleTranslate(req, env, headers);
        case "/nl2ui":
          return await handleNl2Ui(req, env, headers);
        case "/episode":
          return await handleEpisode(req, env, headers);
        default:
          return json({ error: "not_found" }, 404, headers);
      }
    } catch (e) {
      return json({ error: "server_error", detail: String(e) }, 500, headers);
    }
  },
};

function corsHeaders(origin: string, allowed: string): Record<string, string> {
  const list = allowed.split(",").map((s) => s.trim());
  // 開発時は localhost / 127.0.0.1 の任意ポートを許可（本番は list のみ）
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const allow = list.includes(origin) || isLocal ? origin : (list[0] ?? "");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-turnstile-token",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

async function verifyTurnstile(
  env: Env,
  token: string | null,
  ip: string,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  try {
    const fd = new FormData();
    fd.append("secret", env.TURNSTILE_SECRET);
    fd.append("response", token);
    fd.append("remoteip", ip);
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: fd },
    );
    const j = (await r.json()) as { success?: boolean };
    return Boolean(j.success);
  } catch {
    // 検証サービスに到達できない場合は安全側で拒否
    return false;
  }
}

async function rateLimit(env: Env, ip: string): Promise<boolean> {
  // KV バインディング未設定・障害時はレート制限をスキップ（サービス継続を優先）
  // ここで throw すると try の外なら Cloudflare 1101 になり CORS も付かないため必ず握る
  if (!env.RATE_LIMIT) return false;
  try {
    const cap = parseInt(env.DAILY_LIMIT ?? "40", 10);
    const day = new Date().toISOString().slice(0, 10);
    const key = `rl:${ip}:${day}`;
    const cur = parseInt((await env.RATE_LIMIT.get(key)) ?? "0", 10);
    if (cur >= cap) return true;
    await env.RATE_LIMIT.put(key, String(cur + 1), { expirationTtl: 172800 });
    return false;
  } catch {
    return false;
  }
}

async function claude(
  env: Env,
  system: string,
  user: string,
  maxTokens = 1024,
): Promise<string> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!r.ok) throw new Error(`claude_${r.status}:${await r.text()}`);
  const j = (await r.json()) as { content?: Array<{ text?: string }> };
  return j.content?.[0]?.text ?? "";
}

async function elevenScribe(env: Env, audio: Blob): Promise<Word[]> {
  const fd = new FormData();
  fd.append("model_id", "scribe_v1");
  fd.append("file", audio, "audio.webm");
  const r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
    body: fd,
  });
  if (!r.ok) throw new Error(`eleven_stt_${r.status}:${await r.text()}`);
  const j = (await r.json()) as { words?: Word[] };
  return (j.words ?? []).filter((w) => (w.type ?? "word") === "word");
}

async function elevenTTS(env: Env, text: string): Promise<ArrayBuffer> {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVEN_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
    },
  );
  if (!r.ok) throw new Error(`eleven_tts_${r.status}:${await r.text()}`);
  return await r.arrayBuffer();
}

async function handleTranscribe(
  req: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  const form = await req.formData();
  const audio = form.get("audio") as File | null;
  if (!audio) {
    return json({ error: "no_audio" }, 400, headers);
  }
  const maxBytes = parseInt(env.MAX_AUDIO_BYTES ?? "8000000", 10);
  if (audio.size > maxBytes) {
    return json({ error: "audio_too_large", maxBytes }, 413, headers);
  }
  const words = await elevenScribe(env, audio as unknown as Blob);
  const segments = segment(words);
  return json({ segments, srt: toSrt(segments) }, 200, headers);
}

async function handleTranslate(
  req: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  const body = (await req.json()) as {
    segments?: Segment[];
    targetLang?: string;
  };
  const segments = body.segments ?? [];
  const lang = body.targetLang ?? "English";
  if (segments.length === 0) return json({ error: "no_segments" }, 400, headers);
  const lines = segments.map((s, i) => `${i + 1}: ${s.text}`).join("\n");
  const out = await claude(
    env,
    `You are a professional subtitle translator. Translate each numbered line into ${lang}. ` +
      `Return ONLY a JSON array of strings (same length, same order), no keys, no extra text.`,
    lines,
    2048,
  );
  let translations: string[];
  try {
    translations = JSON.parse(extractJson(out)) as string[];
  } catch {
    translations = segments.map((s) => s.text);
  }
  const translated: Segment[] = segments.map((s, i) => ({
    ...s,
    text: translations[i] ?? s.text,
  }));
  return json({ segments: translated, srt: toSrt(translated) }, 200, headers);
}

async function handleNl2Ui(
  req: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  const body = (await req.json()) as { prompt?: string };
  const prompt = (body.prompt ?? "").slice(0, 400);
  if (!prompt) return json({ error: "no_prompt" }, 400, headers);
  const out = await claude(
    env,
    `あなたはUIジェネレータです` +
      `日本語の指示から入力フォームの構造を推定し、次の形の JSON だけを返してください（説明文なし）:` +
      `{"type":"form","fields":[{"label":"表示名","type":"text|email|tel|textarea|date|number"}],"submit":{"label":"送信"}}` +
      `submit は不要なら省略、fields は指示に含まれる項目のみ`,
    prompt,
    1024,
  );
  let spec: unknown;
  try {
    spec = JSON.parse(extractJson(out));
  } catch {
    spec = { type: "form", fields: [] };
  }
  return json({ spec }, 200, headers);
}

async function handleEpisode(
  req: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  const body = (await req.json()) as { topic?: string };
  const topic = (body.topic ?? "").slice(0, 120) || "今日の小さなニュース";
  const script = (
    await claude(
      env,
      `あなたはポッドキャストの構成作家です` +
        `指定トピックについて、1人のパーソナリティが読み上げる日本語の短い台本を書いてください` +
        `200〜300文字、自然な語り口、記号や見出しは付けず本文のみ`,
      topic,
      512,
    )
  )
    .trim()
    .slice(0, 500);
  const audio = await elevenTTS(env, script);
  return json(
    { topic, script, audioBase64: toBase64(audio), mime: "audio/mpeg" },
    200,
    headers,
  );
}

/* ---------------- Spotify 今再生中（公開） ---------------- */
async function handleNowPlaying(
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  // 8秒キャッシュ（訪問者が多くても Spotify は最大 ~8秒に1回）
  try {
    const raw = await env.RATE_LIMIT.get("spotify:np");
    if (raw) {
      const c = JSON.parse(raw) as { ts: number; payload: unknown };
      if (Date.now() - c.ts < 8000) return json(c.payload, 200, headers);
    }
  } catch {
    /* ignore */
  }
  const access = await getSpotifyAccess(env);
  if (!access) return json({ configured: false }, 200, headers);

  let payload: Record<string, unknown> = { configured: true, isPlaying: false };
  try {
    const r = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${access}` } },
    );
    if (r.ok && r.status !== 204) {
      const j = (await r.json()) as {
        is_playing?: boolean;
        progress_ms?: number;
        item?: {
          name?: string;
          duration_ms?: number;
          artists?: Array<{ name: string }>;
          album?: { name?: string; images?: Array<{ url: string }> };
          external_urls?: { spotify?: string };
        };
      };
      const it = j.item;
      if (it) {
        payload = {
          configured: true,
          isPlaying: Boolean(j.is_playing),
          title: it.name ?? "",
          artists: (it.artists ?? []).map((a) => a.name).join(", "),
          album: it.album?.name ?? "",
          albumArt: it.album?.images?.[0]?.url,
          progressMs: j.progress_ms ?? 0,
          durationMs: it.duration_ms ?? 0,
          url: it.external_urls?.spotify,
        };
      }
    }
  } catch {
    /* ignore */
  }
  try {
    await env.RATE_LIMIT.put(
      "spotify:np",
      JSON.stringify({ ts: Date.now(), payload }),
      { expirationTtl: 300 },
    );
  } catch {
    /* ignore */
  }
  return json(payload, 200, headers);
}

async function getSpotifyAccess(env: Env): Promise<string | null> {
  const cached = await env.RATE_LIMIT.get("spotify:access");
  if (cached) return cached;
  const refresh =
    (await env.RATE_LIMIT.get("spotify:refresh")) || env.SPOTIFY_REFRESH_TOKEN;
  if (!refresh || !env.SPOTIFY_CLIENT_ID) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh,
  });
  const h: Record<string, string> = {
    "content-type": "application/x-www-form-urlencoded",
  };
  if (env.SPOTIFY_CLIENT_SECRET) {
    h["Authorization"] =
      "Basic " + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
  } else {
    body.append("client_id", env.SPOTIFY_CLIENT_ID);
  }
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: h,
    body,
  });
  if (!r.ok) return null;
  const j = (await r.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (j.refresh_token) {
    try {
      await env.RATE_LIMIT.put("spotify:refresh", j.refresh_token);
    } catch {
      /* ignore */
    }
  }
  try {
    await env.RATE_LIMIT.put("spotify:access", j.access_token, {
      expirationTtl: Math.max(60, (j.expires_in ?? 3600) - 60),
    });
  } catch {
    /* ignore */
  }
  return j.access_token;
}

function segment(words: Word[]): Segment[] {
  const segs: Segment[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length === 0) return;
    segs.push({
      start: cur[0].start,
      end: cur[cur.length - 1].end,
      text: cur
        .map((w) => w.text)
        .join("")
        .trim(),
    });
    cur = [];
  };
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const next = words[i + 1];
    const chars = cur.map((w) => w.text).join("").length;
    const gap = next ? next.start - words[i].end : 0;
    if (chars >= MAX_CHARS_PER_LINE || (next && gap > PAUSE_SPLIT)) flush();
  }
  flush();
  return segs;
}

function tc(sec: number): string {
  const ms = Math.max(0, Math.round(sec * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
}

function toSrt(segs: Segment[]): string {
  return segs
    .map((s, i) => `${i + 1}\n${tc(s.start)} --> ${tc(s.end)}\n${s.text}\n`)
    .join("\n");
}

function extractJson(text: string): string {
  const a = text.indexOf("[");
  const b = text.indexOf("{");
  const start = a === -1 ? b : b === -1 ? a : Math.min(a, b);
  const endArr = text.lastIndexOf("]");
  const endObj = text.lastIndexOf("}");
  const end = Math.max(endArr, endObj);
  return start >= 0 && end >= start ? text.slice(start, end + 1) : text;
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function json(
  data: unknown,
  status: number,
  headers: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "content-type": "application/json" },
  });
}
