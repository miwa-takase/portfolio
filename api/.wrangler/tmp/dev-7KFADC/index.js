var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-QCEzjw/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.ts
var MAX_CHARS_PER_LINE = 42;
var PAUSE_SPLIT = 0.7;
var src_default = {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") ?? "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    const url = new URL(req.url);
    if (req.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, headers);
    }
    const ip = req.headers.get("CF-Connecting-IP") ?? "anon";
    const ok = await verifyTurnstile(
      env,
      req.headers.get("X-Turnstile-Token"),
      ip
    );
    if (!ok)
      return json({ error: "turnstile_failed" }, 403, headers);
    const limited = await rateLimit(env, ip);
    if (limited)
      return json({ error: "rate_limited" }, 429, headers);
    try {
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
  }
};
function corsHeaders(origin, allowed) {
  const list = allowed.split(",").map((s) => s.trim());
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const allow = list.includes(origin) || isLocal ? origin : list[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-turnstile-token",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}
__name(corsHeaders, "corsHeaders");
async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET)
    return true;
  if (!token)
    return false;
  const fd = new FormData();
  fd.append("secret", env.TURNSTILE_SECRET);
  fd.append("response", token);
  fd.append("remoteip", ip);
  const r = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: fd }
  );
  const j = await r.json();
  return Boolean(j.success);
}
__name(verifyTurnstile, "verifyTurnstile");
async function rateLimit(env, ip) {
  const cap = parseInt(env.DAILY_LIMIT ?? "40", 10);
  const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const key = `rl:${ip}:${day}`;
  const cur = parseInt(await env.RATE_LIMIT.get(key) ?? "0", 10);
  if (cur >= cap)
    return true;
  await env.RATE_LIMIT.put(key, String(cur + 1), { expirationTtl: 172800 });
  return false;
}
__name(rateLimit, "rateLimit");
async function claude(env, system, user, maxTokens = 1024) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: env.CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }]
    })
  });
  if (!r.ok)
    throw new Error(`claude_${r.status}:${await r.text()}`);
  const j = await r.json();
  return j.content?.[0]?.text ?? "";
}
__name(claude, "claude");
async function elevenScribe(env, audio) {
  const fd = new FormData();
  fd.append("model_id", "scribe_v1");
  fd.append("file", audio, "audio.webm");
  const r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
    body: fd
  });
  if (!r.ok)
    throw new Error(`eleven_stt_${r.status}:${await r.text()}`);
  const j = await r.json();
  return (j.words ?? []).filter((w) => (w.type ?? "word") === "word");
}
__name(elevenScribe, "elevenScribe");
async function elevenTTS(env, text) {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVEN_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "content-type": "application/json",
        accept: "audio/mpeg"
      },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" })
    }
  );
  if (!r.ok)
    throw new Error(`eleven_tts_${r.status}:${await r.text()}`);
  return await r.arrayBuffer();
}
__name(elevenTTS, "elevenTTS");
async function handleTranscribe(req, env, headers) {
  const form = await req.formData();
  const audio = form.get("audio");
  if (!audio) {
    return json({ error: "no_audio" }, 400, headers);
  }
  const maxBytes = parseInt(env.MAX_AUDIO_BYTES ?? "8000000", 10);
  if (audio.size > maxBytes) {
    return json({ error: "audio_too_large", maxBytes }, 413, headers);
  }
  const words = await elevenScribe(env, audio);
  const segments = segment(words);
  return json({ segments, srt: toSrt(segments) }, 200, headers);
}
__name(handleTranscribe, "handleTranscribe");
async function handleTranslate(req, env, headers) {
  const body = await req.json();
  const segments = body.segments ?? [];
  const lang = body.targetLang ?? "English";
  if (segments.length === 0)
    return json({ error: "no_segments" }, 400, headers);
  const lines = segments.map((s, i) => `${i + 1}: ${s.text}`).join("\n");
  const out = await claude(
    env,
    `You are a professional subtitle translator. Translate each numbered line into ${lang}. Return ONLY a JSON array of strings (same length, same order), no keys, no extra text.`,
    lines,
    2048
  );
  let translations;
  try {
    translations = JSON.parse(extractJson(out));
  } catch {
    translations = segments.map((s) => s.text);
  }
  const translated = segments.map((s, i) => ({
    ...s,
    text: translations[i] ?? s.text
  }));
  return json({ segments: translated, srt: toSrt(translated) }, 200, headers);
}
__name(handleTranslate, "handleTranslate");
async function handleNl2Ui(req, env, headers) {
  const body = await req.json();
  const prompt = (body.prompt ?? "").slice(0, 400);
  if (!prompt)
    return json({ error: "no_prompt" }, 400, headers);
  const out = await claude(
    env,
    `\u3042\u306A\u305F\u306FUI\u30B8\u30A7\u30CD\u30EC\u30FC\u30BF\u3067\u3059\u3002\u65E5\u672C\u8A9E\u306E\u6307\u793A\u304B\u3089\u5165\u529B\u30D5\u30A9\u30FC\u30E0\u306E\u69CB\u9020\u3092\u63A8\u5B9A\u3057\u3001\u6B21\u306E\u5F62\u306E JSON \u3060\u3051\u3092\u8FD4\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u8AAC\u660E\u6587\u306A\u3057\uFF09:{"type":"form","fields":[{"label":"\u8868\u793A\u540D","type":"text|email|tel|textarea|date|number"}],"submit":{"label":"\u9001\u4FE1"}}\u3002submit \u306F\u4E0D\u8981\u306A\u3089\u7701\u7565\u3002fields \u306F\u6307\u793A\u306B\u542B\u307E\u308C\u308B\u9805\u76EE\u306E\u307F\u3002`,
    prompt,
    1024
  );
  let spec;
  try {
    spec = JSON.parse(extractJson(out));
  } catch {
    spec = { type: "form", fields: [] };
  }
  return json({ spec }, 200, headers);
}
__name(handleNl2Ui, "handleNl2Ui");
async function handleEpisode(req, env, headers) {
  const body = await req.json();
  const topic = (body.topic ?? "").slice(0, 120) || "\u4ECA\u65E5\u306E\u5C0F\u3055\u306A\u30CB\u30E5\u30FC\u30B9";
  const script = (await claude(
    env,
    `\u3042\u306A\u305F\u306F\u30DD\u30C3\u30C9\u30AD\u30E3\u30B9\u30C8\u306E\u69CB\u6210\u4F5C\u5BB6\u3067\u3059\u3002\u6307\u5B9A\u30C8\u30D4\u30C3\u30AF\u306B\u3064\u3044\u3066\u30011\u4EBA\u306E\u30D1\u30FC\u30BD\u30CA\u30EA\u30C6\u30A3\u304C\u8AAD\u307F\u4E0A\u3052\u308B\u65E5\u672C\u8A9E\u306E\u77ED\u3044\u53F0\u672C\u3092\u66F8\u3044\u3066\u304F\u3060\u3055\u3044\u3002200\u301C300\u6587\u5B57\u3001\u81EA\u7136\u306A\u8A9E\u308A\u53E3\u3001\u8A18\u53F7\u3084\u898B\u51FA\u3057\u306F\u4ED8\u3051\u305A\u672C\u6587\u306E\u307F\u3002`,
    topic,
    512
  )).trim().slice(0, 500);
  const audio = await elevenTTS(env, script);
  return json(
    { topic, script, audioBase64: toBase64(audio), mime: "audio/mpeg" },
    200,
    headers
  );
}
__name(handleEpisode, "handleEpisode");
function segment(words) {
  const segs = [];
  let cur = [];
  const flush = /* @__PURE__ */ __name(() => {
    if (cur.length === 0)
      return;
    segs.push({
      start: cur[0].start,
      end: cur[cur.length - 1].end,
      text: cur.map((w) => w.text).join("").trim()
    });
    cur = [];
  }, "flush");
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const next = words[i + 1];
    const chars = cur.map((w) => w.text).join("").length;
    const gap = next ? next.start - words[i].end : 0;
    if (chars >= MAX_CHARS_PER_LINE || next && gap > PAUSE_SPLIT)
      flush();
  }
  flush();
  return segs;
}
__name(segment, "segment");
function tc(sec) {
  const ms = Math.max(0, Math.round(sec * 1e3));
  const h = Math.floor(ms / 36e5);
  const m = Math.floor(ms % 36e5 / 6e4);
  const s = Math.floor(ms % 6e4 / 1e3);
  const r = ms % 1e3;
  const p = /* @__PURE__ */ __name((n, l = 2) => String(n).padStart(l, "0"), "p");
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
}
__name(tc, "tc");
function toSrt(segs) {
  return segs.map((s, i) => `${i + 1}
${tc(s.start)} --> ${tc(s.end)}
${s.text}
`).join("\n");
}
__name(toSrt, "toSrt");
function extractJson(text) {
  const a = text.indexOf("[");
  const b = text.indexOf("{");
  const start = a === -1 ? b : b === -1 ? a : Math.min(a, b);
  const endArr = text.lastIndexOf("]");
  const endObj = text.lastIndexOf("}");
  const end = Math.max(endArr, endObj);
  return start >= 0 && end >= start ? text.slice(start, end + 1) : text;
}
__name(extractJson, "extractJson");
function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}
__name(toBase64, "toBase64");
function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "content-type": "application/json" }
  });
}
__name(json, "json");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-QCEzjw/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-QCEzjw/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
