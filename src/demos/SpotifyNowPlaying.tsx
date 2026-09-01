import { useEffect, useState } from "react";
import { API_BASE, spotifyRedirectUri } from "../config";
import {
  beginAuth,
  getStoredToken,
  handleRedirect,
  isConfigured,
} from "../lib/spotify";

type NP = {
  configured: boolean;
  isPlaying?: boolean;
  title?: string;
  artists?: string;
  album?: string;
  albumArt?: string;
  progressMs?: number;
  durationMs?: number;
};

const btnPrimary =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent bg-accent px-[18px] py-2 text-sm font-semibold tracking-[0.05em] text-[#0b1a26] transition-all hover:bg-accent-soft";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="rounded border border-line px-2 py-[2px] text-xs text-paper-dim hover:border-accent hover:text-accent-soft"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          },
          () => {},
        )
      }
    >
      {done ? "コピー済" : "コピー"}
    </button>
  );
}

/* ---- 公開表示：オーナーの今再生中（訪問者の認証なし） ---- */
function PublicNowPlaying() {
  const [np, setNp] = useState<NP | null>(null);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const r = await fetch(`${API_BASE}/now-playing`);
        const j = (await r.json()) as NP;
        if (alive) setNp(j);
      } catch {
        /* ignore transient */
      }
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!np) {
    return <div className="p-4 text-sm text-muted">読み込み中…</div>;
  }
  if (!np.configured) {
    return (
      <div className="rounded-xl border border-line-soft bg-ink p-5 text-sm text-muted">
        まだセットアップされていません（オーナーが一度だけ認可すると、ここに「今聴いている曲」が表示されます）。
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-line-soft bg-ink p-5">
      <div className="mb-4 text-xs uppercase tracking-[0.16em] text-muted">
        {np.isPlaying ? "Now Playing — Judy" : "最近聴いた / 停止中"}
      </div>
      {np.title ? (
        <div className="flex items-center gap-4">
          {np.albumArt ? (
            <img
              src={np.albumArt}
              alt=""
              className="h-20 w-20 rounded-md border border-line-soft object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-line-soft text-2xl text-accent">
              ♪
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-serif text-lg text-paper">
              {np.title}
            </div>
            <div className="truncate text-sm text-paper-dim">{np.artists}</div>
            <div className="truncate text-xs text-muted">{np.album}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-9 text-right text-xs text-muted">
                {fmt(np.progressMs ?? 0)}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{
                    width: `${np.durationMs ? ((np.progressMs ?? 0) / np.durationMs) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-9 text-xs text-muted">
                {fmt(np.durationMs ?? 0)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">いま再生中の曲はありません。</p>
      )}
    </div>
  );
}

/* ---- オーナー専用セットアップ（?setup）：一度だけ認可して refresh token を取得 ---- */
function Setup({ refresh }: { refresh: string }) {
  if (refresh) {
    const cmd = `cd works-portfolio/api\necho '${refresh}' | npx wrangler secret put SPOTIFY_REFRESH_TOKEN`;
    return (
      <div className="rounded-xl border border-line-soft bg-ink p-5 text-sm">
        <p className="mb-2 text-paper">✓ 認可できました。</p>
        <p className="mb-3 text-muted">
          この refresh token を Worker
          に設定すると、公開の「今再生中」が有効になります。
        </p>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <code className="break-all text-xs text-accent-soft">{refresh}</code>
          <Copy text={refresh} />
        </div>
        <p className="mb-1 text-muted">ターミナルで実行：</p>
        <pre className="code whitespace-pre-wrap">{cmd}</pre>
        <div className="mt-2">
          <Copy text={cmd} />
        </div>
        <p className="mt-3 text-xs text-muted">
          設定後、通常URL（?setup
          なし）を開くと、訪問者にはあなたの再生中だけが表示されます。
        </p>
      </div>
    );
  }
  if (!isConfigured()) {
    return (
      <div className="rounded-xl border border-line-soft bg-ink p-5 text-sm text-muted">
        Spotify Client ID が未設定です（VITE_SPOTIFY_CLIENT_ID）。
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-line-soft bg-ink p-6 text-sm">
      <p className="mb-1 text-xs uppercase tracking-[0.16em] text-muted">
        Setup（オーナー用・一度だけ）
      </p>
      <p className="mb-4 text-paper-dim">
        あなたの Spotify を一度だけ認可して、公開表示用の refresh token
        を取得します。
      </p>
      <button className={btnPrimary} onClick={() => void beginAuth()}>
        認可する →
      </button>
      <p className="mt-3 text-xs text-muted">
        Redirect URI（Spotify に登録済みのはず）:{" "}
        <code className="text-accent-soft">{spotifyRedirectUri()}</code>
      </p>
    </div>
  );
}

export default function SpotifyNowPlaying() {
  const [mode, setMode] = useState<"loading" | "public" | "setup">("loading");
  const [refresh, setRefresh] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const hadCode = params.has("code");
      const wantSetup = params.has("setup");
      await handleRedirect().catch(() => false);
      if (!alive) return;
      const tok = getStoredToken();
      if ((hadCode || wantSetup) && tok?.refresh_token) {
        setRefresh(tok.refresh_token);
        setMode("setup");
      } else if (wantSetup) {
        setMode("setup");
      } else {
        setMode("public");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (mode === "loading") {
    return <div className="p-4 text-sm text-muted">読み込み中…</div>;
  }
  if (mode === "setup") return <Setup refresh={refresh} />;
  return <PublicNowPlaying />;
}
