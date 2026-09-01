// Cloudflare Turnstile トークン取得（使い捨て実行）
import { TURNSTILE_SITEKEY } from "../config";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      size?: "invisible" | "normal" | "compact";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
    },
  ) => string;
  execute: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptLoading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile_script_failed"));
    document.head.appendChild(s);
  });
  return scriptLoading;
}

export function turnstileEnabled(): boolean {
  return TURNSTILE_SITEKEY.length > 0;
}

export async function getTurnstileToken(): Promise<string> {
  if (!TURNSTILE_SITEKEY) return "";
  try {
    await loadScript();
    const api = window.turnstile;
    if (!api) return "";
    return await new Promise<string>((resolve) => {
      const holder = document.createElement("div");
      holder.style.position = "fixed";
      holder.style.bottom = "8px";
      holder.style.right = "8px";
      holder.style.zIndex = "9999";
      document.body.appendChild(holder);
      const id = api.render(holder, {
        sitekey: TURNSTILE_SITEKEY,
        size: "invisible",
        callback: (token: string) => {
          resolve(token);
          setTimeout(() => {
            api.remove(id);
            holder.remove();
          }, 0);
        },
        "error-callback": () => {
          resolve("");
          api.remove(id);
          holder.remove();
        },
      });
      api.execute(id);
    });
  } catch {
    return "";
  }
}
