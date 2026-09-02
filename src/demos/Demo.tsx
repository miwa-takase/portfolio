import { Fragment, useRef, useState } from "react";
import type { Feature } from "../data/features";
import { sleep } from "../lib/util";
import { SAMPLE_JA, SAMPLE_EN } from "./sampleData";
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
  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-45";
const btnPrimary = `${btnBase} border-accent bg-transparent font-semibold text-accent hover:border-accent-soft hover:text-accent-soft`;
const btnGhost = `${btnBase} border-line text-paper hover:border-accent hover:text-accent-soft`;
const mini =
  "rounded-lg border border-line bg-ink px-2 py-2 tex-sm text-paper focus:border-accent focus:outline-none";
const paneCls =
  "flex min-h-36 flex-col rounded-lg border border-line-soft bg-ink";
const labCls = "px-3 pt-2 text-sm uppercase tracking-widest text-muted";
const contentCls = "overflow-auto px-3 pb-3 pt-2 text-sm text-paper";
const ioCls = "grid grid-cols-1 gap-4 md:grid-cols-2";
const actionsCls = "mt-4 flex flex-wrap items-center gap-2";

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function SampleSrt({ count, texts }: { count: number; texts?: string[] }) {
  return (
    <div className="srt">
      {SAMPLE_JA.slice(0, count).map((r, i) => (
        <Fragment key={i}>
          <span className="tc">{`${i + 1}\n${r[0]}`}</span>
          {`\n${texts ? texts[i] : r[1]}\n\n`}
        </Fragment>
      ))}
    </div>
  );
}

/* 01 文字起こし & 翻訳 */
function Pipeline() {
  const [file, setFile] = useState<File | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [jaCount, setJaCount] = useState(0);
  const [trCount, setTrCount] = useState(0);
  const [jaSrt, setJaSrt] = useState("");
  const [trSrt, setTrSrt] = useState("");
  const [segs, setSegs] = useState<Seg[]>([]);
  const [lang, setLang] = useState<"en" | "ja">("en");
  const [busy, setBusy] = useState(false);
  const [done1, setDone1] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setJaCount(0);
    setTrCount(0);
    setJaSrt("");
    setTrSrt("");
    setSegs([]);
    setDone1(false);
  }

  async function runSample() {
    setBusy(true);
    setUsingSample(true);
    reset();
    for (const s of [
      "ElevenLabs で音声認識中…",
      "Claude で句読点を付与中…",
      "SRTを整形・検証中…",
    ]) {
      setStatus(s);
      await sleep(600);
    }
    setStatus("");
    for (let i = 1; i <= SAMPLE_JA.length; i++) {
      setJaCount(i);
      await sleep(120);
    }
    setStatus("✓ 文字起こし完了（サンプル） · 12セグメント");
    setDone1(true);
    setBusy(false);
  }

  async function runReal() {
    if (!file) return;
    setBusy(true);
    setUsingSample(false);
    reset();
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
      setDone1(true);
    } catch (e) {
      setStatus(`失敗: ${msg(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function runTranslate() {
    setBusy(true);
    if (usingSample) {
      setTrCount(0);
      setStatus("Claude で翻訳中…（サンプル）");
      await sleep(500);
      for (let i = 1; i <= SAMPLE_JA.length; i++) {
        setTrCount(i);
        await sleep(110);
      }
      setStatus("✓ 翻訳完了（サンプル）");
    } else {
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
      }
    }
    setBusy(false);
  }

  return (
    <div>
      <div className={`${paneCls} mb-4 min-h-0`}>
        <div className={labCls}>
          入力 — 任意の動画/音声（サーバーには保存しません）
        </div>
        <div className="flex flex-wrap items-center gap-3 px-3 pb-3 pt-2">
          <input
            ref={inputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            className={btnGhost}
            onClick={() => inputRef.current?.click()}
          >
            ファイルを選択
          </button>
          <span className="tex-sm text-muted">
            {file ? file.name : "未選択（またはサンプルで実行）"}
          </span>
        </div>
      </div>

      <div className={ioCls}>
        <div className={paneCls}>
          <div className={labCls}>① 文字起こし（日本語 SRT）</div>
          <div className={contentCls}>
            {usingSample ? (
              jaCount ? (
                <SampleSrt count={jaCount} />
              ) : (
                <span className="text-muted">実行すると結果が流れます</span>
              )
            ) : jaSrt ? (
              <pre className="srt">{jaSrt}</pre>
            ) : (
              <span className="text-muted">
                動画を選んで「アップロードして実行」を押してください
              </span>
            )}
          </div>
        </div>
        <div className={paneCls}>
          <div className={labCls}>
            ② 翻訳（{lang === "en" ? "English" : "日本語（原文）"}）
          </div>
          <div className={contentCls}>
            {usingSample ? (
              trCount ? (
                <SampleSrt
                  count={trCount}
                  texts={lang === "en" ? SAMPLE_EN : undefined}
                />
              ) : (
                <span className="text-muted">
                  文字起こしのあとに翻訳できます
                </span>
              )
            ) : trSrt ? (
              <pre className="srt">{trSrt}</pre>
            ) : (
              <span className="text-muted">文字起こしのあとに翻訳できます</span>
            )}
          </div>
        </div>
      </div>

      <div className={actionsCls}>
        <button
          className={btnPrimary}
          disabled={busy || !file || !hasApi()}
          onClick={runReal}
          title={!hasApi() ? "バックエンド未接続（VITE_API_BASE 未設定）" : ""}
        >
          ① アップロードして実行
        </button>
        <button className={btnGhost} disabled={busy} onClick={runSample}>
          サンプルで実行
        </button>
        <select
          className={mini}
          value={lang}
          disabled={busy || !done1}
          onChange={(e) => setLang(e.target.value as "en" | "ja")}
        >
          <option value="en">→ English</option>
          <option value="ja">→ 日本語（原文のまま）</option>
        </select>
        <button
          className={btnGhost}
          disabled={busy || !done1}
          onClick={runTranslate}
        >
          ② 翻訳する
        </button>
        <span className="tex-sm text-muted">{status}</span>
      </div>
      {!hasApi() && (
        <p className="tex-sm mt-2 text-muted">
          ※ 実アップロードには API
          バックエンド（VITE_API_BASE）が必要です。未接続時はサンプルで動作を確認できます
        </p>
      )}
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
        {note && <span className="tex-sm text-muted">{note}</span>}
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
                  <div className="tex-sm mb-1 text-muted">{fl.label}</div>
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
        <div className="tex-sm mb-1 uppercase tracking-widest text-muted">
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
              <span className="tex-sm text-muted">
                {counts[s] ? `計測 ${counts[s]}` : "→"}
              </span>
            </button>
          ))}
        </div>
        <div className="tex-sm mt-4 text-muted">
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
          台本 → 音声を生成 →
        </button>
        <span className="tex-sm text-muted">{status}</span>
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
          <div className="flex flex-1 items-center px-3 pb-3 pt-2">
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
      <div className="tex-sm tracking-wide">
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
