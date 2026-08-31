import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ACCENT_TEXT, FEATURES, FEATURES_BY_SLUG } from "../data/features";
import type { DemoType } from "../data/features";
import { APPS_BY_ID } from "../data/apps";
import Badge from "../components/Badge";
import Demo from "../demos/Demo";

function demoLabel(t: DemoType): string {
  return t === "live"
    ? "実バックエンド接続 / サンプル"
    : t === "widget"
      ? "ブラウザ内デモ"
      : t === "diagram"
        ? "仕組みの図解"
        : "録画・サンプル";
}

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-[18px] py-2.5 text-[0.82rem] tracking-[0.05em] text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function Feature() {
  const { slug } = useParams();
  const f = slug ? FEATURES_BY_SLUG[slug] : undefined;

  useEffect(() => {
    if (f) document.title = `${f.title} — Judy`;
  }, [f]);

  if (!f) {
    return (
      <section className="wrap py-20">
        <p className="text-paper-dim">機能が見つかりません。</p>
        <Link className={`${btnGhost} mt-4`} to="/works">
          ← 機能一覧へ
        </Link>
      </section>
    );
  }

  const idx = FEATURES.findIndex((x) => x.slug === f.slug);
  const prev = FEATURES[(idx - 1 + FEATURES.length) % FEATURES.length];
  const next = FEATURES[(idx + 1) % FEATURES.length];
  const accentText = ACCENT_TEXT[f.accent];
  const apps = f.apps.map((id) => APPS_BY_ID[id]).filter(Boolean);

  return (
    <section className="wrap">
      <nav className="flex items-center gap-2.5 pt-[30px] text-[0.76rem] tracking-[0.06em] text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <Link to="/works" className="text-paper-dim hover:text-accent-soft">
          Works
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">{f.title}</span>
      </nav>

      <header className="pb-[30px] pt-5">
        <div className="font-serif text-[1rem] tracking-[0.12em] text-muted">
          {f.no}
        </div>
        <div
          className={`mt-3 text-[0.72rem] uppercase tracking-[0.3em] ${accentText}`}
        >
          {f.en}
        </div>
        <h1 className="mt-2.5 font-serif text-[clamp(2.2rem,6vw,3.8rem)] font-medium leading-[1.08]">
          {f.title}
        </h1>
        <p className="mt-4 max-w-[60ch] text-[1.05rem] text-paper-dim">
          {f.tagline}
        </p>
        <div className="mt-5 flex items-center gap-3.5">
          <Badge status={f.status} />
          <span className="text-[0.76rem] text-muted">
            {demoLabel(f.demo.type)}
          </span>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-line bg-ink-2">
        <div className="flex items-center justify-between gap-3 border-b border-line-soft bg-gradient-to-b from-panel-2 to-panel px-[18px] py-3.5">
          <div className="flex items-center gap-2.5 text-[0.78rem] uppercase tracking-[0.14em] text-accent">
            ◍ 試せる場
          </div>
          <div className="text-[0.72rem] tracking-[0.1em] text-muted">
            {demoLabel(f.demo.type)}
          </div>
        </div>
        <div className="px-[18px] py-5">
          <Demo feature={f} />
        </div>
        {f.demo.note && (
          <div className="px-[18px] pb-4 text-[0.74rem] text-muted">
            ※ {f.demo.note}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 py-5 md:grid-cols-[1fr_300px] md:gap-10">
        <div>
          <p className="mb-3.5 text-paper-dim">{f.summary}</p>
          <h3 className="mb-3 mt-6 font-serif text-[1.25rem] font-medium">
            できること
          </h3>
          <ul className="grid gap-2.5">
            {f.capabilities.map((c) => (
              <li
                key={c}
                className="relative pl-[22px] text-[0.94rem] text-paper"
              >
                <span className={`absolute left-0 ${accentText}`}>→</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <aside className="card-surface sticky top-[84px] rounded-[14px] p-5">
          <h4 className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
            使用技術
          </h4>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {f.tech.map((t) => (
              <span
                key={t}
                className="rounded-[5px] border border-line-soft bg-ink-2 px-2 py-[3px] text-[0.72rem] text-paper-dim"
              >
                {t}
              </span>
            ))}
          </div>
          <h4 className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
            この機能を実装したアプリ
          </h4>
          {apps.length ? (
            apps.map((p, i) => (
              <div
                key={p.id}
                className={`py-2.5 ${i === 0 ? "" : "border-t border-line-soft"}`}
              >
                <b className="block font-serif text-[0.98rem] font-medium">
                  {p.title}
                </b>
                <small className="text-[0.74rem] text-muted">
                  {p.tech.slice(0, 3).join(" · ")}
                </small>
              </div>
            ))
          ) : (
            <small className="text-muted">—</small>
          )}
        </aside>
      </div>

      <nav className="flex justify-between gap-3.5 border-t border-line-soft pb-2.5 pt-[26px]">
        <Link className={btnGhost} to={`/works/${prev.slug}`}>
          ← {prev.title}
        </Link>
        <Link className={btnGhost} to="/works">
          機能一覧
        </Link>
        <Link className={btnGhost} to={`/works/${next.slug}`}>
          {next.title} →
        </Link>
      </nav>
      <div className="h-[30px]" />
    </section>
  );
}
