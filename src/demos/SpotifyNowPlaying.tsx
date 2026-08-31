import { useCallback, useEffect, useRef, useState } from "react";
import {
  beginAuth,
  fetchNowPlaying,
  getStoredToken,
  handleRedirect,
  isConfigured,
  logout,
  type NowPlaying,
} from "../lib/spotify";
import { spotifyRedirectUri } from "../config";

const btnPrimary =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent bg-accent px-[18px] py-2.5 text-[0.82rem] font-semibold tracking-[0.05em] text-[#0b1a26] transition-all hover:bg-accent-soft";

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// このアプリが実際に送る Redirect URI を表示（Spotify に完全一致で登録するため）
function RedirectHint() {
  const uri = spotifyRedirectUri();
  const [copied, setCopied] = useState(false);
  const isLocalhost = uri.startsWith("http://localhost");
  return (
    <div className="mt-4 rounded-lg border border-line-soft bg-ink-2 p-3 text-[0.74rem] text-muted">
      <div className="mb-1">
        Spotify アプリの <b className="text-paper-dim">Redirect URI</b>{" "}
        にこの値を「完全一致」で登録してください：
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <code className="break-all text-accent-soft">{uri}</code>
        <button
          className="rounded border border-line px-2 py-[2px] text-[0.7rem] text-paper-dim hover:border-accent hover:text-accent-soft"
          onClick={() => {
            navigator.clipboard?.writeText(uri).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              },
              () => {},
            );
          }}
        >
          {copied ? "コピー済" : "コピー"}
        </button>
      </div>
      {isLocalhost && (
        <div className="mt-2 text-rust">
          ⚠️ Spotify は http の場合 <b>127.0.0.1</b> のみ許可（
          <b>localhost</b> は不可）。ローカルでは{" "}
          <code className="text-accent-soft">
            http://127.0.0.1:5173/works-portfolio/works/music-social
          </code>{" "}
          を開いて、その URL を登録してください。
        </div>
      )}
    </div>
  );
}

export default function SpotifyNowPlaying() {
  const [authed, setAuthed] = useState(false);
  const [np, setNp] = useState<NowPlaying | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  const poll = useCallback(async () => {
    try {
      const data = await fetchNowPlaying();
      setNp(data);
      setErr("");
    } catch (e) {
      if (e instanceof Error && e.message === "not_authenticated") {
        setAuthed(false);
        setNp(null);
      } else {
        setErr("取得に失敗しました。少し待って再試行します。");
      }
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      await handleRedirect().catch(() => false);
      if (!alive) return;
      const ok = Boolean(getStoredToken());
      setAuthed(ok);
      setLoading(false);
      if (ok) await poll();
    })();
    return () => {
      alive = false;
    };
  }, [poll]);

  useEffect(() => {
    if (!authed) return;
    timer.current = window.setInterval(poll, 5000);
    return () => window.clearInterval(timer.current);
  }, [authed, poll]);

  if (!isConfigured()) {
    return (
      <div className="rounded-xl border border-line-soft bg-ink p-5 text-[0.86rem] text-paper-dim">
        <p className="mb-2 text-paper">Spotify Client ID が未設定です。</p>
        <p className="text-muted">
          Spotify Developer Dashboard でアプリを作成し、
          <code className="text-accent-soft">VITE_SPOTIFY_CLIENT_ID</code>{" "}
          をビルド時に設定すると、ここで「今再生中」を取得できるようになります。
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-[0.82rem] text-muted">読み込み中…</div>;
  }

  if (!authed) {
    return (
      <div className="rounded-xl border border-line-soft bg-ink p-6">
        <p className="mb-1 text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          Spotify
        </p>
        <p className="mb-4 text-[0.9rem] text-paper-dim">
          あなたの Spotify
          に接続して、いま再生中の曲を表示します（読み取り専用）。
        </p>
        <button className={btnPrimary} onClick={() => void beginAuth()}>
          Spotify で接続する →
        </button>
        <RedirectHint />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line-soft bg-ink p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          {np?.isPlaying ? "Now Playing" : "Paused / 停止中"}
        </span>
        <button
          className="text-[0.72rem] text-muted underline-offset-2 hover:text-accent-soft hover:underline"
          onClick={() => {
            logout();
            setAuthed(false);
            setNp(null);
          }}
        >
          切断
        </button>
      </div>

      {np ? (
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
            <div className="truncate font-serif text-[1.15rem] text-paper">
              {np.title}
            </div>
            <div className="truncate text-[0.85rem] text-paper-dim">
              {np.artists}
            </div>
            <div className="truncate text-[0.72rem] text-muted">{np.album}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-9 text-right text-[0.68rem] text-muted">
                {fmt(np.progressMs)}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{
                    width: `${np.durationMs ? (np.progressMs / np.durationMs) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="w-9 text-[0.68rem] text-muted">
                {fmt(np.durationMs)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[0.86rem] text-muted">
          いま再生中の曲はありません。Spotify で何か再生すると表示されます。
        </p>
      )}
      {err && <p className="mt-3 text-[0.74rem] text-rust">{err}</p>}
    </div>
  );
}
