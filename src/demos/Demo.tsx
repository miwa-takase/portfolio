import { useRef, useState } from "react";
import type { Feature } from "../data/features";
import { extractAudio } from "../lib/audio";
import {
  apiEpisode,
  apiNl2ui,
  apiTranscribe,
  apiTranslate,
  hasApi,
  type Seg,
  type UiSpec,
} from "../lib/api";

const btnBase =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm tracking-wide transition-all disabled:cursor-not-allowed";
const btnPrimary = `${btnBase} border-accent bg-transparent font-semibold text-accent hover:border-accent-soft hover:text-accent-soft`;
const btnGhost = `${btnBase} border-line text-paper hover:border-accent hover:text-accent-soft`;
const mini =
  "rounded-lg border border-line bg-ink p-3 text-sm text-paper focus:border-accent focus:outline-none";
const paneCls = "flex items-center rounded-lg border border-line-soft bg-ink";
const labCls = "p-3 text-sm uppercase tracking-widest text-muted";
const contentCls = "overflow-auto p-3 text-sm text-paper";
const ioCls = "grid grid-cols-1 gap-4 md:grid-cols-2";
const actionsCls = "mt-4 flex flex-wrap items-center gap-2";

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// SRT をブラウザからそのままダウンロード
function downloadSrt(name: string, content: string) {
  const blob = new Blob([content], {
    type: "application/x-subrip;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const stepPane = "flex flex-col rounded-lg border border-line-soft bg-ink";
const stepHead =
  "flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-3 py-2";
const dlBtn =
  "inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-paper-dim transition-colors hover:border-accent hover:text-accent-soft disabled:cursor-not-allowed disabled:opacity-40";

/* 01 文字起こし & 翻訳 */
function Pipeline() {
  const [file, setFile] = useState<File | null>(null);
  const [jaSrt, setJaSrt] = useState("");
  const [trSrt, setTrSrt] = useState("");
  const [segs, setSegs] = useState<Seg[]>([]);
  const [lang, setLang] = useState<"en" | "ja">("en");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const done1 = jaSrt.length > 0;
  const baseName = file ? file.name.replace(/\.[^.]+$/, "") : "subtitle";

  async function runTranscribe() {
    if (!file || busy) return;
    setBusy(true);
    setSegs([]);
    setJaSrt("");
    setTrSrt("");
    try {
      setStatus("ブラウザ内で音声を抽出中…（動画は端末外に出ません）");
      const audio = await extractAudio(file, 60, (r) =>
        setStatus(`ブラウザ内で音声を抽出中… ${Math.round(r * 100)}%`),
      );
      setStatus("ElevenLabs で文字起こし中…");
      const res = await apiTranscribe(audio);
      setSegs(res.segments);
      setJaSrt(res.srt);
      setStatus(`✓ 文字起こし完了 · ${res.segments.length} セグメント`);
    } catch (e) {
      setStatus(`失敗: ${msg(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function runTranslate() {
    if (segs.length === 0 || busy) return;
    setBusy(true);
    try {
      setStatus("Claude で翻訳中…（行とタイムコードは保持）");
      const res = await apiTranslate(
        segs,
        lang === "en" ? "English" : "日本語",
      );
      setTrSrt(res.srt);
      setStatus("✓ 翻訳完了");
    } catch (e) {
      setStatus(`失敗: ${msg(e)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      {/* STEP 1 — 入力して文字起こし */}
      <div className={stepPane}>
        <div className={stepHead}>
          <span className="text-sm uppercase tracking-widest text-muted">
            STEP 1 — 動画・音声から文字起こし
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-3">
          <input
            ref={inputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setJaSrt("");
              setTrSrt("");
              setSegs([]);
              setStatus("");
            }}
          />
          <button
            className={btnGhost}
            onClick={() => inputRef.current?.click()}
          >
            ファイルを選択
          </button>
          <span className="min-w-0 flex-1 truncate text-sm text-muted">
            {file ? file.name : "未選択（サーバーには保存しません）"}
          </span>
          <button
            className={btnPrimary}
            disabled={busy || !file}
            onClick={runTranscribe}
          >
            文字起こしを実行 →
          </button>
        </div>
      </div>

      {/* 結果：日本語 SRT / 翻訳 SRT（それぞれダウンロード可） */}
      <div className={ioCls}>
        <div className={stepPane}>
          <div className={stepHead}>
            <span className="text-sm uppercase tracking-widest text-muted">
              日本語 SRT
            </span>
            <button
              className={dlBtn}
              disabled={!jaSrt}
              onClick={() => downloadSrt(`${baseName}.ja.srt`, jaSrt)}
            >
              ↓ SRTを保存
            </button>
          </div>
          <div className={`${contentCls} flex-1`}>
            {jaSrt ? (
              <pre className="srt">{jaSrt}</pre>
            ) : (
              <span className="text-muted">
                STEP 1 を実行すると字幕（SRT）が表示されます
              </span>
            )}
          </div>
        </div>

        <div className={stepPane}>
          <div className={stepHead}>
            <span className="text-sm uppercase tracking-widest text-muted">
              翻訳 SRT（{lang === "en" ? "English" : "日本語"}）
            </span>
            <button
              className={dlBtn}
              disabled={!trSrt}
              onClick={() => downloadSrt(`${baseName}.${lang}.srt`, trSrt)}
            >
              ↓ SRTを保存
            </button>
          </div>
          <div className={`${contentCls} flex-1`}>
            {trSrt ? (
              <pre className="srt">{trSrt}</pre>
            ) : (
              <span className="text-muted">
                STEP 2 で翻訳すると表示されます
              </span>
            )}
          </div>
        </div>
      </div>

      {/* STEP 2 — 翻訳 */}
      <div className={actionsCls}>
        <span className="text-sm uppercase tracking-widest text-muted">
          STEP 2 — 翻訳
        </span>
        <select
          className={mini}
          value={lang}
          disabled={busy || !done1}
          onChange={(e) => setLang(e.target.value as "en" | "ja")}
        >
          <option value="en">English</option>
          <option value="ja">日本語（言い換え）</option>
        </select>
        <button
          className={btnPrimary}
          disabled={busy || !done1}
          onClick={runTranslate}
        >
          翻訳を実行 →
        </button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>
    </div>
  );
}

/* 02 AIモック生成 */
type Field = { label: string; type: string };
const NL_MAP: Array<{ k: string[]; f: Field }> = [
  { k: ["名前", "氏名", "name"], f: { label: "お名前", type: "text" } },
  {
    k: ["メール", "email", "mail"],
    f: { label: "メールアドレス", type: "email" },
  },
  { k: ["電話", "tel", "phone"], f: { label: "電話番号", type: "tel" } },
  {
    k: ["問い合わせ", "内容", "message", "本文"],
    f: { label: "お問い合わせ内容", type: "textarea" },
  },
  { k: ["日付", "date", "予約日"], f: { label: "日付", type: "date" } },
  { k: ["数量", "個数", "qty", "数"], f: { label: "数量", type: "number" } },
];
function localSpec(text: string): UiSpec {
  const fields = NL_MAP.filter((m) => m.k.some((k) => text.includes(k))).map(
    (m) => m.f,
  );
  const submit = /送信|ボタン|submit|登録|申込/.test(text);
  return {
    type: "form",
    fields,
    submit: submit ? { label: "送信" } : undefined,
  };
}
function Nl2Ui() {
  const [text, setText] = useState(
    "名前・メール・お問い合わせ内容を入力する送信ボタン付きフォーム",
  );
  const [spec, setSpec] = useState<UiSpec>(() => localSpec(text));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(
    hasApi() ? "" : "ローカル簡易解析（AIバックエンド未接続）",
  );

  async function gen() {
    if (hasApi()) {
      setBusy(true);
      setNote("Claude で生成中…");
      try {
        const res = await apiNl2ui(text);
        setSpec(res.spec);
        setNote("Claude で生成");
      } catch (e) {
        setSpec(localSpec(text));
        setNote(`AI失敗のためローカル解析: ${msg(e)}`);
      } finally {
        setBusy(false);
      }
    } else {
      setSpec(localSpec(text));
    }
  }

  return (
    <div>
      <div className={`${actionsCls} mb-3 mt-0`}>
        <input
          className={`${mini} min-w-56 flex-1`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className={btnPrimary} disabled={busy} onClick={gen}>
          生成 →
        </button>
        {note && <span className="text-sm text-muted">{note}</span>}
      </div>
      <div className={ioCls}>
        <div className={paneCls}>
          <div className={labCls}>中間表現（DSL / JSON）</div>
          <div className={contentCls}>
            <pre className="code border-none bg-transparent p-0">
              {JSON.stringify(spec, null, 2)}
            </pre>
          </div>
        </div>
        <div className={paneCls}>
          <div className={labCls}>レンダリング結果</div>
          <div className={contentCls}>
            {!spec.fields || spec.fields.length === 0 ? (
              <span className="text-muted">該当フィールドなし</span>
            ) : (
              spec.fields.map((fl, i) => (
                <div key={i} className="mb-2">
                  <div className="mb-1 text-sm text-muted">{fl.label}</div>
                  {fl.type === "textarea" ? (
                    <textarea className={`${mini} h-14 w-full`} />
                  ) : (
                    <input
                      className={`${mini} w-full`}
                      type={fl.type}
                      placeholder={fl.label}
                    />
                  )}
                </div>
              ))
            )}
            {spec.submit && (
              <button className={`${btnPrimary} mt-2`}>送信</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* 03 リンク集約 & 計測 */
const SERVICES = [
  "Spotify",
  "Apple Music",
  "YouTube Music",
  "LINE MUSIC",
  "Amazon Music",
];
function LinkHub() {
  const [title, setTitle] = useState("Sample Track — Artist");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div>
      <div className={`${actionsCls} mb-3 mt-0`}>
        <input
          className={`${mini} min-w-56 flex-1`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mx-auto max-w-md rounded-xl border border-line-soft bg-ink p-5">
        <div className="mb-1 text-sm uppercase tracking-widest text-muted">
          Now sharing
        </div>
        <div className="mb-4 font-serif text-lg text-paper">{title}</div>
        <div className="grid gap-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              onClick={() => setCounts((c) => ({ ...c, [s]: (c[s] ?? 0) + 1 }))}
              className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-2 text-left text-sm text-paper transition-colors hover:border-accent"
            >
              <span>{s} で聴く</span>
              <span className="text-sm text-muted">
                {counts[s] ? `計測 ${counts[s]}` : "→"}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted">
          クリックは GA4 でクロスドメイン計測（合計 {total} 回）
        </div>
      </div>
    </div>
  );
}

/* 05 エピソード生成 */
function Episode() {
  const [topic, setTopic] = useState("最近の生成AIの話題を、3つのトピックで");
  const [script, setScript] = useState("");
  const [audio, setAudio] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function gen() {
    setBusy(true);
    setScript("");
    setAudio("");
    try {
      setStatus("Claude で台本を作成中…");
      const res = await apiEpisode(topic);
      setScript(res.script);
      setStatus("ElevenLabs で音声化しました");
      setAudio(`data:${res.mime};base64,${res.audioBase64}`);
    } catch (e) {
      setStatus(`失敗: ${msg(e)}`);
    } finally {
      setBusy(false);
    }
  }

  if (!hasApi()) {
    return (
      <div className="rounded-xl border border-line-soft bg-ink p-5 text-sm">
        <p className="mb-2 text-paper">
          エピソード生成には API バックエンドが必要です
        </p>
        <p className="text-muted">
          Cloudflare Worker（Claude 台本 + ElevenLabs 音声）をデプロイし{" "}
          <code className="text-accent-soft">VITE_API_BASE</code>{" "}
          を設定すると、トピックから台本と音声を実生成できます
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={`${actionsCls} mb-3 mt-0`}>
        <input
          className={`${mini} min-w-60 flex-1`}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className={btnPrimary} disabled={busy} onClick={gen}>
          台本 → 音声を生成
        </button>
        <span className="text-sm text-muted">{status}</span>
      </div>
      <div className={ioCls}>
        <div className={paneCls}>
          <div className={labCls}>生成された台本</div>
          <div className={`${contentCls} whitespace-pre-wrap leading-7`}>
            {script || (
              <span className="text-muted">
                トピックを入れて生成してください
              </span>
            )}
          </div>
        </div>
        <div className={paneCls}>
          <div className={labCls}>音声（ElevenLabs）</div>
          <div className="flex flex-1 items-center p-3">
            {audio ? (
              <audio controls src={audio} className="w-full" />
            ) : (
              <span className="text-sm text-muted">
                生成すると再生プレイヤーが表示されます
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Recorded({ feature }: { feature: Feature }) {
  return (
    <div className="mt-3 flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-line bg-ink text-muted">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-lg text-accent">
        ▶
      </div>
      <div className="text-sm tracking-wide">
        録画デモを準備中 — {feature.apps.length} アプリで実装済み
      </div>
    </div>
  );
}

export default function Demo({ feature }: { feature: Feature }) {
  const { widget } = feature.demo;
  if (widget === "pipeline") return <Pipeline />;
  if (widget === "nl2ui") return <Nl2Ui />;
  if (widget === "linkhub") return <LinkHub />;
  if (widget === "episode") return <Episode />;
  return <Recorded feature={feature} />;
}
